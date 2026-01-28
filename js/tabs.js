/* Tabs behaviour module
 *
 * Features:
 * - Accessible ARIA roles and attributes (role="tablist", role="tab", role="tabpanel")
 * - Click to activate tab
 * - Keyboard navigation: ArrowLeft, ArrowRight, Home, End
 * - Skips disabled tabs (aria-disabled="true" or disabled attribute)
 * - Updates URL hash using history.pushState (no page scroll)
 * - Deep-linking: on load activates tab matching location.hash
 * - Focus management: moves focus into panel (panel receives tabindex="-1" momentarily)
 *
 * Small map refresh workaround:
 * - When a panel becomes visible we attempt to call Leaflet's invalidateSize()
 *   on any known map instances whose containers are inside the panel.
 * - This is minimal, defensive and a no-op on pages without maps.
 */

(function () {
  'use strict';

  var SELECTOR = '.js-tabs';
  // Delay (ms) after making a panel visible before refreshing maps.
  // Gives the browser time to finish layout changes for the panel.
  var MAP_REFRESH_DELAY = 200;

  // List of map globals used by our map includes. Keep this small and explicit
  // so the code is fast and safe on pages without maps.
  var KNOWN_MAP_GLOBALS = ['nearhomeMap', 'pavementMap', 'leviMap'];

  function isDisabled(tab) {
    return tab.getAttribute('aria-disabled') === 'true' || tab.disabled;
  }

  // Refresh known maps if their container element is inside the given panel.
  // Safe no-op if maps aren't present or Leaflet isn't loaded.
  function refreshMapsInPanel(panel) {
    if (!panel) return;
    try {
      // Run after a short delay to allow layout/transitions to settle
      window.setTimeout(function () {
        KNOWN_MAP_GLOBALS.forEach(function (mapName) {
          try {
            var map = window[mapName];
            if (!map || typeof map.invalidateSize !== 'function') return;

            // Prefer the public getContainer() method, fall back to _container.
            var container = (typeof map.getContainer === 'function') ? map.getContainer() : (map._container || null);
            if (!container) return;

            // Only refresh maps that are actually within this panel
            if (panel.contains(container)) {
              try { map.invalidateSize(true); } catch (e) { try { map.invalidateSize(); } catch (ignore) {} }
            }
          } catch (e) {
            // Non-fatal for a single map
            /* eslint-disable no-console */
            console.error('Tabs: failed to refresh map', mapName, e);
            /* eslint-enable no-console */
          }
        });
      }, MAP_REFRESH_DELAY);
    } catch (e) {
      // overall non-fatal
      /* eslint-disable no-console */
      console.error('Tabs: refreshMapsInPanel failed', e);
      /* eslint-enable no-console */
    }
  }

  function activateTab(container, tab, updateHash) {
    var tabs = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(container.querySelectorAll('[role="tabpanel"]'));

    // Deactivate all
    tabs.forEach(function (t) {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      t.classList.remove('tabs__tab--active');
    });

    panels.forEach(function (p) {
      p.setAttribute('hidden', '');
      p.classList.add('tabs__panel--hidden');
    });

    // Activate selected
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.classList.add('tabs__tab--active');

    var panelId = tab.getAttribute('aria-controls');
    var panel = container.querySelector('#' + CSS.escape(panelId));
    if (panel) {
      panel.removeAttribute('hidden');
      panel.classList.remove('tabs__panel--hidden');

      // Move focus into panel for screen reader users / visibility
      // Give the panel a temporary tabindex to focus if it cannot be focused
      var hadTabindex = panel.hasAttribute('tabindex');
      if (!hadTabindex) {
        panel.setAttribute('tabindex', '-1');
      }
      panel.focus({ preventScroll: true });
      if (!hadTabindex) {
        panel.removeAttribute('tabindex');
      }

      // Minimal map fix: refresh known maps inside this panel (safe no-op on pages without maps)
      refreshMapsInPanel(panel);
    }

    if (updateHash && panelId) {
      try {
        // pushState changes URL hash without scrolling
        history.pushState(null, '', '#' + panelId);
      } catch (e) {
        // Fallback: set location.hash (may scroll)
        location.hash = '#' + panelId;
      }
    }
  }

  function findNextTab(tabs, startIndex, direction) {
    // direction: 1 -> forward, -1 -> backward
    var count = tabs.length;
    var i = startIndex;
    do {
      i = (i + direction + count) % count;
      var t = tabs[i];
      if (!isDisabled(t)) return { tab: t, index: i };
    } while (i !== startIndex);
    return { tab: null, index: -1 };
  }

  function onKeyDown(container, event) {
    var target = event.target;
    if (target.getAttribute('role') !== 'tab') return;

    var tabs = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
    var index = tabs.indexOf(target);
    if (index === -1) return;

    var handled = false;

    switch (event.key) {
      case 'ArrowRight':
      case 'Right':
        var next = findNextTab(tabs, index, 1);
        if (next.tab) {
          activateTab(container, next.tab, true);
          next.tab.focus();
          handled = true;
        }
        break;

      case 'ArrowLeft':
      case 'Left':
        var prev = findNextTab(tabs, index, -1);
        if (prev.tab) {
          activateTab(container, prev.tab, true);
          prev.tab.focus();
          handled = true;
        }
        break;

      case 'Home':
        var first = tabs.find(function (t) { return !isDisabled(t); });
        if (first) {
          activateTab(container, first, true);
          first.focus();
          handled = true;
        }
        break;

      case 'End':
        for (var j = tabs.length - 1; j >= 0; j--) {
          if (!isDisabled(tabs[j])) {
            activateTab(container, tabs[j], true);
            tabs[j].focus();
            handled = true;
            break;
          }
        }
        break;

      case 'Enter':
      case ' ':
        // Space/Enter should activate the focused tab (if not already active)
        if (!isDisabled(target)) {
          activateTab(container, target, true);
          handled = true;
        }
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function onClick(container, event) {
    var target = event.target;
    // If user clicks on nested elements inside the tab, find the nearest tab role ancestor
    var tab = target.closest('[role="tab"]');
    if (!tab || !container.contains(tab)) return;
    if (isDisabled(tab)) return;

    activateTab(container, tab, true);
  }

  function initTabs(container) {
    var tabs = container.querySelectorAll('[role="tab"]');
    var panels = container.querySelectorAll('[role="tabpanel"]');

    // Basic initialization: ensure attributes are present
    Array.prototype.forEach.call(tabs, function (tab, i) {
      if (!tab.hasAttribute('id')) {
        tab.id = 'tab-' + Math.random().toString(36).substr(2, 9);
      }
      if (!tab.hasAttribute('aria-controls')) {
        var panel = panels[i];
        if (panel) {
          if (!panel.id) panel.id = 'panel-' + Math.random().toString(36).substr(2, 9);
          tab.setAttribute('aria-controls', panel.id);
          panel.setAttribute('aria-labelledby', tab.id);
        }
      }
      if (!tab.hasAttribute('role')) tab.setAttribute('role', 'tab');
      if (!tab.hasAttribute('tabindex')) tab.setAttribute('tabindex', '-1');
      if (!tab.hasAttribute('aria-selected')) tab.setAttribute('aria-selected', 'false');
    });

    Array.prototype.forEach.call(panels, function (panel) {
      panel.setAttribute('role', 'tabpanel');
      if (!panel.hasAttribute('tabindex')) {
        // allow panel to receive focus programmatically
        // don't leave it focusable by keyboard normally
        panel.setAttribute('tabindex', '-1');
      }
    });

    // Determine initial active tab:
    var activeTab = container.querySelector('[role="tab"][aria-selected="true"]');
    if (!activeTab) {
      // If deep link exists, attempt to activate the matching panel
      var hash = (location.hash || '').replace('#', '');
      if (hash) {
        var tabForHash = container.querySelector('[aria-controls="' + CSS.escape(hash) + '"]');
        if (tabForHash && !isDisabled(tabForHash)) {
          activeTab = tabForHash;
        }
      }
    }
    // fallback to first non-disabled tab
    if (!activeTab) {
      var tabsArray = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
      activeTab = tabsArray.find(function (t) { return !isDisabled(t); });
    }

    if (activeTab) {
      activateTab(container, activeTab, false);
    }

    // Event delegation for clicks
    container.addEventListener('click', function (e) { onClick(container, e); }, false);
    // Key navigation
    container.addEventListener('keydown', function (e) { onKeyDown(container, e); }, false);
  }

  function onLoad() {
    var containers = document.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(containers, function (c) {
      initTabs(c);
    });

    // If page loads with a hash that points to a panel inside a tabs component,
    // make sure the appropriate tab is active and the panel is visible.
    if (location.hash) {
      var id = location.hash.slice(1);
      // Find any tab that controls this id
      var tab = document.querySelector('[role="tab"][aria-controls="' + CSS.escape(id) + '"]');
      if (tab) {
        // Find containing tabs container
        var container = tab.closest(SELECTOR);
        if (container) {
          activateTab(container, tab, false);
          // Ensure the panel is in view without scrolling the page suddenly.
          var panel = document.getElementById(id);
          if (panel) {
            panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
            // Attempt to refresh maps within the panel (minimal, safe)
            refreshMapsInPanel(panel);
          }
        }
      }
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onLoad);
  } else {
    onLoad();
  }

  // Expose a minimal API for other scripts if desired
  window.Tabs = {
    init: initTabs,
    activate: activateTab,
    refreshMapsInPanel: refreshMapsInPanel
  };
})();