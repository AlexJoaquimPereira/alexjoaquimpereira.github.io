/* Alex Joaquim Pereira — site behaviour.
   Progressive enhancements only: every feature here degrades
   gracefully and the site is fully usable without JavaScript. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ----- Theme toggle ----- */
  var toggle = document.querySelector("[data-theme-toggle]");

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
      syncStatTheme();
    });
  }

  /* ----- Footer year ----- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ----- Scrollspy: highlight the section currently in view ----- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href*="#"]')
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
            } else if (a.getAttribute("href").indexOf("#") === 0) {
              a.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ----- Scroll reveals (staggered) -----
     Reduced-motion users and browsers without IO see everything at once. */
  var revealables = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  function revealAll() {
    revealables.forEach(function (el) { el.classList.add("is-revealed"); });
  }

  if (!reduceMotion.matches && "IntersectionObserver" in window && revealables.length) {
    revealables.forEach(function (el) {
      var group = el.closest("[data-reveal-group]");
      if (group) {
        var siblings = Array.prototype.slice.call(group.querySelectorAll("[data-reveal]"));
        el.style.setProperty("--reveal-delay", siblings.indexOf(el) * 70 + "ms");
      }
    });

    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    revealables.forEach(function (el) { revealer.observe(el); });
  } else {
    revealAll();
  }

  /* ----- GitHub stat cards: theme-aware source + failure fallback ----- */
  var statCards = Array.prototype.slice.call(document.querySelectorAll("[data-stat]"));

  function syncStatTheme() {
    if (!statCards.length) return;
    var key = root.dataset.theme === "dark" ? "srcDark" : "srcLight";
    statCards.forEach(function (card) {
      if (card.classList.contains("is-failed")) return;
      var img = card.querySelector("[data-stat-img]");
      var src = card.getAttribute("data-" + key.replace(/[A-Z]/g, function (m) { return "-" + m.toLowerCase(); }));
      if (img && src && img.getAttribute("src") !== src) img.setAttribute("src", src);
    });
  }

  statCards.forEach(function (card) {
    var img = card.querySelector("[data-stat-img]");
    if (!img) return;
    img.addEventListener("error", function () {
      card.classList.add("is-failed");
      var fallback = card.querySelector(".stat-fallback");
      if (fallback) fallback.hidden = false;
    });
  });

  syncStatTheme();

  /* ----- Hero frame parallax (desktop, motion allowed) -----
     rAF-throttled; only touches a CSS variable → transform only. */
  var heroMedia = document.querySelector(".hero-media");
  var ticking = false;

  if (heroMedia && !reduceMotion.matches) {
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (window.innerWidth < 900) return;
        var y = Math.min(window.scrollY, 600);
        heroMedia.style.setProperty("--py", (y * 0.012).toFixed(3) + "rem");
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----- Reading progress (article pages) ----- */
  var progress = document.querySelector("[data-progress]");

  if (progress && !reduceMotion.matches) {
    var progressTick = false;
    var updateProgress = function () {
      progressTick = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var value = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      progress.style.transform = "scaleX(" + value + ")";
    };
    window.addEventListener("scroll", function () {
      if (progressTick) return;
      progressTick = true;
      requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
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
