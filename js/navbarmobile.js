// Mobile navbar toggle + dropdown-first-tap behaviour

(function () {
  // Toggle the responsive class on the topnav (menu icon).
  window.navbarmobile = function navbarmobile() {
    var x = document.getElementById("topnav");
    if (!x) return;
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
      // close any open dropdowns when collapsing mobile nav
      x.querySelectorAll('.dropdown.open').forEach(function (d) {
        d.classList.remove('open');
        var btn = d.querySelector('.dropbtn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  };

  // Setup dropdown behavior: on small screens, first tap on a dropbtn opens the submenu.
  function setupDropdownToggles() {
    var topnav = document.getElementById('topnav');
    if (!topnav) return;

    var dropbtns = topnav.querySelectorAll('.dropbtn');

    // Helper: close other open dropdowns
    function closeOtherDropdowns(exceptDropdown) {
      topnav.querySelectorAll('.dropdown.open').forEach(function (d) {
        if (d !== exceptDropdown) {
          d.classList.remove('open');
          var b = d.querySelector('.dropbtn');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
    }

    dropbtns.forEach(function (btn) {
      // Avoid attaching multiple listeners
      if (btn._navbarmobile_bound) return;
      btn._navbarmobile_bound = true;

      btn.addEventListener('click', function (e) {
        var isMobile = topnav.classList.contains('responsive') || window.matchMedia('(max-width: 600px)').matches;

        if (!isMobile) {
          // Desktop behaviour: no interception; hover/focus handles dropdowns.
          return;
        }

        var dropdown = btn.closest('.dropdown');
        if (!dropdown) return;

        var isOpen = dropdown.classList.contains('open');

        if (!isOpen) {
          // First tap on mobile: open dropdown and prevent navigation
          e.preventDefault();
          closeOtherDropdowns(dropdown);
          dropdown.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        } else {
          // Second tap: allow default link navigation (do not preventDefault)
          // Optionally, if you prefer second tap to simply close without navigating, uncomment:
          // e.preventDefault(); dropdown.classList.remove('open'); btn.setAttribute('aria-expanded','false');
        }
      });
    });

    // Close open dropdowns when clicking outside the nav
    document.addEventListener('click', function (ev) {
      var target = ev.target;
      if (!topnav.contains(target)) {
        topnav.querySelectorAll('.dropdown.open').forEach(function (d) {
          d.classList.remove('open');
          var b = d.querySelector('.dropbtn');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      }
    }, true);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDropdownToggles);
  } else {
    setupDropdownToggles();
  }

})();