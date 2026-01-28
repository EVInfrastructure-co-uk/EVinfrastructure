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
 * Additional behaviour:
 * - After a tab panel becomes visible we attempt to refresh any Leaflet maps inside
 *   the panel so maps initialised while hidden don't render with the wrong size.
 * - The refresh is non-invasive and safe to run on pages without maps.
 *
 * Usage:
 * - Give container class "js-tabs" (or change selector below)
 * - Tabs: elements with role="tab" and aria-controls pointing to the panel id
 * - Panels: elements with role="tabpanel" and id referenced by the tab's aria-controls
 */

(function () {
  'use strict';

  var SELECTOR = '.js-tabs';
  // How long to wait after showing the panel before refreshing maps (ms).
  // Allows layout/CSS transitions to settle. Adjust if needed.
  var MAP_REFRESH_DELAY = 200;

  function isDisabled(tab) {
    return tab.getAttribute('aria-disabled') === 'true' || tab.disabled;
  }

  // Try to find a Leaflet map instance whose container is the given element.
  // Returns map instance or null. This is defensive and will not throw if Leaflet isn't present.
  function findMapForContainer(containerEl) {
    if (!containerEl) return null;
    try {
      // Common pattern: map instance exposes getContainer() or has _container property.
      // Iterate window properties to find a matching object with an invalidateSize function.
      for (var k in window) {
        if (!Object.prototype.hasOwnProperty.call(window, k)) continue;
        try {
          var cand = window[k];
          if (!cand || typeof cand !== 'object') continue;
          if (typeof cand.invalidateSize !== 'function') continue;
          // Many Leaflet builds expose getContainer()
          if (typeof cand.getContainer === 'function' && cand.getContainer() === containerEl) return cand;
          // Fallback: internal property
          if (cand._container === containerEl) return cand;
        } catch (e) {
          // ignore properties that throw on access
          continue;
        }
      }
    } catch (e) {
      // defensive: something went wrong enumerating window - just return null
      return null;
    }
    return null;
  }

  // Given a panel element, locate map container elements inside it and refresh each map found.
  // Safe no-op if there are no maps or Leaflet isn't loaded.
  function refreshMapsInPanel(panel) {
    if (!panel) return;
    try {
      // Find candidate map containers inside the panel:
      // - elements with class 'leaflet-container' (typical after map initialisation)
      // - elements with id starting with 'map-' (our convention)
      var candidates = Array.prototype.slice.call(panel.querySelectorAll('.leaflet-container, [id^="map-"]'));
      // Deduplicate container elements
      var seen = new Set();
      var containers = [];
      candidates.forEach(function (el) {
        if (!el || seen.has(el)) return;
        seen.add(el);
        containers.push(el);
      });

      // For each container, attempt to locate an associated map instance and call invalidateSize.
      containers.forEach(function (containerEl) {
        try {
          var map = findMapForContainer(containerEl);
          if (!map) {
            // As a last resort, if the container is itself not the Leaflet map container yet
            // (e.g. our placeholder div before map initialises), try to find any map whose
            // getContainer() is a child of this containerEl.
            for (var k in window) {
              if (!Object.prototype.hasOwnProperty.call(window, k)) continue;
              try {
                var cand = window[k];
                if (!cand || typeof cand !== 'object') continue;
                if (typeof cand.invalidateSize !== 'function' || typeof cand.getContainer !== 'function') continue;
                var cont = cand.getContainer();
                if (!cont) continue;
                if (panel.contains(cont)) {
                  map = cand;
                  break;
                }
              } catch (e) { continue; }
            }
          }

          if (map && typeof map.invalidateSize === 'function') {
            // Try to trigger a redraw/measure. Pass true to animate resizing where supported.
            try { map.invalidateSize(true); } catch (e) { try { map.invalidateSize(); } catch (ignore) {} }
          }
        } catch (e) {
          // Non-fatal: continue with other containers
          console.error('Tabs: failed to refresh a map in panel', e);
        }
      });
    } catch (e) {
      // Non-fatal overall
      console.error('Tabs: failed to refresh maps in panel', e);
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

      // Attempt to refresh Leaflet maps inside this now-visible panel.
      // Delay slightly to allow layout/CSS to settle (and to avoid jank during tab transition).
      try {
        window.setTimeout(function () {
          refreshMapsInPanel(panel);
        }, MAP_REFRESH_DELAY);
      } catch (e) {
        // ignore
      }
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
            // Also attempt to refresh any maps now the panel is visible.
            try {
              window.setTimeout(function () {
                refreshMapsInPanel(panel);
              }, MAP_REFRESH_DELAY);
            } catch (e) { /* ignore */ }
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
    // Expose helper for manually refreshing maps in a panel (safe no-op if none)
    refreshMapsInPanel: refreshMapsInPanel
  };
})();