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
 * - If a map shows an extremely small zoom (e.g. world/globe), we restore the
 *   map's saved initial view (center/zoom) captured at initialisation.
 * - Behaviour is minimal and safe on pages without maps.
 */

(function () {
  'use strict';

  var SELECTOR = '.js-tabs';
  // Delay (ms) after making a panel visible before refreshing maps.
  var MAP_REFRESH_DELAY = 200;

  // Known global map variable names used by the includes.
  var KNOWN_MAP_GLOBALS = ['nearhomeMap', 'pavementMap', 'leviMap'];

  function isDisabled(tab) {
    return tab.getAttribute('aria-disabled') === 'true' || tab.disabled;
  }

  // Refresh known maps if their container element is inside the given panel.
  function refreshMapsInPanel(panel) {
    if (!panel) return;
    try {
      // Delay slightly for layout/transition to settle.
      window.setTimeout(function () {
        KNOWN_MAP_GLOBALS.forEach(function (mapName) {
          try {
            var map = window[mapName];
            if (!map || typeof map.invalidateSize !== 'function') return;

            // Prefer public getContainer(), fallback to internal _container.
            var container = (typeof map.getContainer === 'function') ? map.getContainer() : (map._container || null);
            if (!container) return;

            if (panel.contains(container)) {
              try {
                // Recalculate layout
                try { map.invalidateSize(true); } catch (e) { map.invalidateSize(); }

                // If map has been zoomed out to show the whole globe (zoom very small)
                // restore the saved initial view (if available). This is conservative:
                // only restore when zoom is extremely small (e.g. < 2) to avoid
                // overwriting user interactions.
                try {
                  if (typeof map.getZoom === 'function') {
                    var currentZoom = map.getZoom();
                    if (typeof currentZoom === 'number' && currentZoom < 2) {
                      var initial = window[mapName + 'InitialView'];
                      if (initial && typeof initial.lat === 'number' && typeof initial.lng === 'number' && typeof initial.zoom === 'number') {
                        // restore without animation so it's instant and doesn't shift the page
                        try { map.setView([initial.lat, initial.lng], initial.zoom, { animate: false }); } catch (e) { /* ignore */ }
                      }
                    }
                  }
                } catch (e) { /* ignore view restore errors */ }
              } catch (e) {
                console.error('Tabs: failed to invalidateSize for map', mapName, e);
              }
            }
          } catch (e) {
            console.error('Tabs: failed to process map', mapName, e);
          }
        });
      }, MAP_REFRESH_DELAY);
    } catch (e) {
      console.error('Tabs: refreshMapsInPanel failed', e);
    }
    try {
      var initialSlug = window.initialAuthoritySlug;
      if (initialSlug && map && mapName) {
        // We expect the map include to expose the geojson layer group on window, e.g. nearhomeLayer/pavementLayer/leviLayer.
        var layerGroup = window[mapName.replace('Map', 'Layer')]; // e.g. nearhomeMap -> nearhomeLayer
        if (layerGroup && typeof layerGroup.eachLayer === 'function') {
          layerGroup.eachLayer(function (lyr) {
            try {
              if (lyr.options && lyr.options.govukslug && lyr.options.govukslug === initialSlug) {
                // Open popup which we bound in the map include
                if (typeof lyr.openPopup === 'function') {
                  lyr.openPopup();
                } else if (lyr.getPopup && lyr.getPopup()) {
                  map.openPopup(lyr.getPopup());
                }
                // Try to fit bounds (if layer has bounds)
                try { if (lyr.getBounds) map.fitBounds(lyr.getBounds(), { maxZoom: 12 }); } catch (e) {}
              }
            } catch (e) { /* ignore layer-level errors */ }
          });
        }
      }
    } catch (e) { /* ignore overall */ }
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
        history.pushState(null, '', '#' + panelId);
      } catch (e) {
        location.hash = '#' + panelId;
      }
    }
  }

  function findNextTab(tabs, startIndex, direction) {
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
    var tab = target.closest('[role="tab"]');
    if (!tab || !container.contains(tab)) return;
    if (isDisabled(tab)) return;

    activateTab(container, tab, true);
  }

  function initTabs(container) {
    var tabs = container.querySelectorAll('[role="tab"]');
    var panels = container.querySelectorAll('[role="tabpanel"]');

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
        panel.setAttribute('tabindex', '-1');
      }
    });

    var activeTab = container.querySelector('[role="tab"][aria-selected="true"]');
    if (!activeTab) {
      var hash = (location.hash || '').replace('#', '');
      if (hash) {
        var tabForHash = container.querySelector('[aria-controls="' + CSS.escape(hash) + '"]');
        if (tabForHash && !isDisabled(tabForHash)) {
          activeTab = tabForHash;
        }
      }
    }
    if (!activeTab) {
      var tabsArray = Array.prototype.slice.call(container.querySelectorAll('[role="tab"]'));
      activeTab = tabsArray.find(function (t) { return !isDisabled(t); });
    }

    if (activeTab) {
      activateTab(container, activeTab, false);
    }

    container.addEventListener('click', function (e) { onClick(container, e); }, false);
    container.addEventListener('keydown', function (e) { onKeyDown(container, e); }, false);
  }

  function onLoad() {
    var containers = document.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(containers, function (c) {
      initTabs(c);
    });

    if (location.hash) {
      var id = location.hash.slice(1);
      var tab = document.querySelector('[role="tab"][aria-controls="' + CSS.escape(id) + '"]');
      if (tab) {
        var container = tab.closest(SELECTOR);
        if (container) {
          activateTab(container, tab, false);
          var panel = document.getElementById(id);
          if (panel) {
            panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
            refreshMapsInPanel(panel);
          }
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onLoad);
  } else {
    onLoad();
  }

  window.Tabs = {
    init: initTabs,
    activate: activateTab,
    refreshMapsInPanel: refreshMapsInPanel
  };
})();