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

  /* ----- Scroll reveals (staggered, replayable) -----
     Elements animate in when they enter the viewport and reset once they
     leave it, so the reveal replays on every re-entry. Two observers keep
     the play/reset boundaries apart: play as soon as the element is 12%
     visible, reset only after it has fully left the viewport (plus a 12%
     buffer) so nothing flickers at the edges.
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

    var revealerIn = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("is-revealed");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    var revealerOut = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) entry.target.classList.remove("is-revealed");
        });
      },
      { threshold: 0, rootMargin: "12% 0px 12% 0px" }
    );

    revealables.forEach(function (el) {
      revealerIn.observe(el);
      revealerOut.observe(el);
    });
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

  /* ----- Open-source contributions: live merged-PR counts -----
     Jekyll renders the build-time counts from _data/contributions.yml.
     They are the permanent fallback: one refresh attempt replaces all of
     them only after a complete, validated GitHub search response; any
     failure leaves every build-time count untouched. */
  var contributionCounts = Array.prototype.slice.call(
    document.querySelectorAll("[data-contribution-repo][data-merged-pr-count]")
  );

  if (contributionCounts.length && window.fetch && window.AbortController) {
    refreshContributionCounts(contributionCounts);
  }

  function refreshContributionCounts(countElements) {
    var LOGIN = "AlexJoaquimPereira";
    var ENDPOINT = "https://api.github.com/search/issues";
    var QUERY = "author:" + LOGIN + " is:pr is:merged";
    var PER_PAGE = 100;
    var MAX_WINDOW = 1000;
    var TIMEOUT = 10000;

    /* Configured repositories come from the rendered markup, so the YAML
       file stays the single source of truth and new entries need no JS. */
    var configured = {};
    countElements.forEach(function (el) {
      var fullName = (el.getAttribute("data-contribution-repo") || "").trim();
      if (!fullName) return;
      configured[fullName.toLowerCase()] = { element: el, fullName: fullName };
    });
    if (!Object.keys(configured).length) return;

    function reportRateLimit(response) {
      if (!response.headers || typeof response.headers.get !== "function") return;
      if (response.headers.get("X-RateLimit-Remaining") === "0") {
        var reset = Number(response.headers.get("X-RateLimit-Reset"));
        console.info(
          "[contributions] GitHub search rate limit exhausted" +
            (reset ? " until " + new Date(reset * 1000).toISOString() : "") +
            "; keeping build-time counts."
        );
      }
      var retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        console.info("[contributions] GitHub asked to retry after " + retryAfter + "s; keeping build-time counts.");
      }
    }

    function requestSearch(query, page, perPage, signal) {
      var url = ENDPOINT + "?q=" + encodeURIComponent(query) + "&per_page=" + perPage;
      if (page > 1) url += "&page=" + page;

      return fetch(url, {
        headers: { Accept: "application/vnd.github+json" },
        credentials: "omit",
        signal: signal
      })
        .then(function (response) {
          reportRateLimit(response);
          if (!response.ok) throw new Error("HTTP " + response.status);
          return response.json();
        })
        .then(function (data) {
          if (
            !data ||
            typeof data !== "object" ||
            !Array.isArray(data.items) ||
            typeof data.total_count !== "number" ||
            !isFinite(data.total_count) ||
            data.total_count < 0 ||
            Math.floor(data.total_count) !== data.total_count ||
            data.incomplete_results !== false
          ) {
            throw new Error("unexpected search response");
          }
          return data;
        });
    }

    function readItem(item) {
      if (!item || typeof item !== "object") throw new Error("unexpected search item");
      if (!item.pull_request) return null;
      if (
        !item.user ||
        typeof item.user.login !== "string" ||
        typeof item.repository_url !== "string" ||
        typeof item.number !== "number"
      ) {
        throw new Error("unexpected pull request item");
      }
      var marker = "/repos/";
      var at = item.repository_url.indexOf(marker);
      if (at === -1) throw new Error("unreadable repository_url");
      var rest = item.repository_url.slice(at + marker.length).split(/[?#]/)[0].replace(/\/+$/, "");
      var parts = rest.split("/");
      if (parts.length !== 2 || !parts[0] || !parts[1]) throw new Error("unreadable repository_url");
      return {
        repo: (decodeURIComponent(parts[0]) + "/" + decodeURIComponent(parts[1])).toLowerCase(),
        author: item.user.login.toLowerCase(),
        number: item.number
      };
    }

    function countItems(items) {
      var counts = {};
      var seen = {};
      Object.keys(configured).forEach(function (key) { counts[key] = 0; });

      items.forEach(function (item) {
        var entry = readItem(item);
        if (!entry || entry.author !== LOGIN.toLowerCase()) return;
        if (!Object.prototype.hasOwnProperty.call(counts, entry.repo)) return;
        var key = entry.repo + "#" + entry.number;
        if (Object.prototype.hasOwnProperty.call(seen, key)) return;
        seen[key] = true;
        counts[entry.repo] += 1;
      });

      return counts;
    }

    async function collectGlobal(signal) {
      var first = await requestSearch(QUERY, 1, PER_PAGE, signal);
      /* Beyond the search window, per-repository totals are the only
         reliable source, so hand over to the fallback collection. */
      if (first.total_count > MAX_WINDOW) return null;

      var total = first.total_count;
      var items = first.items.slice();
      var pages = Math.ceil(total / PER_PAGE);

      for (var page = 2; page <= pages; page++) {
        var next = await requestSearch(QUERY, page, PER_PAGE, signal);
        if (next.total_count !== total) throw new Error("search totals changed during pagination");
        items = items.concat(next.items);
      }

      if (items.length !== total) throw new Error("incomplete search results");
      return countItems(items);
    }

    async function collectPerRepository(signal) {
      var counts = {};
      var keys = Object.keys(configured);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var query = "repo:" + configured[key].fullName + " author:" + LOGIN + " is:pr is:merged";
        var data = await requestSearch(query, 1, 1, signal);
        counts[key] = data.total_count;
      }

      return counts;
    }

    function applyCounts(counts) {
      var updates = [];

      /* Validate every value before touching the DOM, so a bad result can
         never leave the section partially refreshed. */
      Object.keys(configured).forEach(function (key) {
        var value = counts[key];
        if (
          !Object.prototype.hasOwnProperty.call(counts, key) ||
          typeof value !== "number" ||
          !isFinite(value) ||
          value < 0 ||
          Math.floor(value) !== value
        ) {
          throw new Error("unreliable count for " + key);
        }
        updates.push([configured[key], value]);
      });

      updates.forEach(function (update) {
        var element = update[0].element;
        var value = update[1];
        element.textContent = String(value);
        var label = element.parentNode && element.parentNode.querySelector("[data-merged-pr-noun]");
        if (label) {
          label.textContent = value === 1 ? "merged pull request" : "merged pull requests";
        }
      });
    }

    async function refresh() {
      var controller = new AbortController();
      var timer = setTimeout(function () { controller.abort(); }, TIMEOUT);

      try {
        var counts = await collectGlobal(controller.signal);
        if (!counts) counts = await collectPerRepository(controller.signal);
        applyCounts(counts);
      } catch (error) {
        console.info(
          "[contributions] Live merged-PR counts unavailable; keeping build-time counts.",
          error && error.message ? error.message : error
        );
      } finally {
        clearTimeout(timer);
      }
    }

    refresh();
  }

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
