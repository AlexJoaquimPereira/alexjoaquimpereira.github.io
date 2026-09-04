/* Alex Joaquim Pereira — site enhancements.
   Everything here is progressive: the site works fully without it. */
(function () {
  "use strict";

  /* ----- Theme toggle ----- */
  var toggle = document.querySelector("[data-theme-toggle]");
  var root = document.documentElement;

  function labelButton() {
    var dark = root.dataset.theme === "dark";
    if (toggle) {
      toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
  }
  labelButton();

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) { /* private mode: ignore */ }
      labelButton();
    });
  }

  /* ----- Footer year ----- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ----- Scrollspy: highlight the section currently in view ----- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );

  if ("IntersectionObserver" in window && navLinks.length) {
    var sections = navLinks
      .map(function (a) { return document.querySelector(a.hash); })
      .filter(Boolean);

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            if (a.hash === "#" + entry.target.id) {
              a.setAttribute("aria-current", "true");
            } else {
              a.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ----- Contact form: AJAX submit with inline status (falls back to normal POST) ----- */
  var form = document.querySelector("[data-contact-form]");
  var status = document.querySelector("[data-form-status]");

  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var button = form.querySelector('button[type="submit"]');
      var busy = button ? button.hasAttribute("aria-busy") : false;
      if (busy) return;

      if (button) {
        button.setAttribute("aria-busy", "true");
        button.disabled = true;
      }
      status.removeAttribute("data-status");
      status.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          status.setAttribute("data-status", "success");
          status.textContent = "Thanks — your message has been sent.";
          form.reset();
        })
        .catch(function () {
          status.setAttribute("data-status", "error");
          status.textContent =
            "Something went wrong. Please try again, or reach me on any of the linked platforms.";
        })
        .finally(function () {
          if (button) {
            button.removeAttribute("aria-busy");
            button.disabled = false;
          }
        });
    });
  }
})();
