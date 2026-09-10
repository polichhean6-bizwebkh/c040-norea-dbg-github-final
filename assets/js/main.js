/* C040 — Norea Square + Diamond Bay Garden — site scripts */
(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".burger");
  var mobileNav = document.querySelector(".mobile-nav");
  function closeMobileNav() {
    burger.classList.remove("open");
    mobileNav.classList.remove("open");
    document.body.style.overflow = "";
  }
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMobileNav);
    });
  }

  /* ---------- Smooth-scroll safety for anchor links (handles fixed header offset) ---------- */
  var headerOffset = 84;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: "smooth" });
      closeMobileNav();
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }
  // Re-observe any element that becomes visible later (e.g. inside expand panels)
  function refreshReveal(scope) {
    var els = scope.querySelectorAll(".reveal:not(.in-view)");
    els.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Generic tab groups (residence categories, plan selectors) ---------- */
  document.querySelectorAll("[data-tabgroup]").forEach(function (group) {
    var buttons = group.querySelectorAll(":scope > .cat-tabs > button, :scope > .plan-selector-tabs > button");
    var panels = group.querySelectorAll(":scope > .cat-panel");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-tab");
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        panels.forEach(function (p) {
          var match = p.getAttribute("data-tab") === key;
          p.classList.toggle("active", match);
          if (match) refreshReveal(p);
        });
      });
    });
  });

  /* ---------- View More / expand panels ---------- */
  document.querySelectorAll(".btn-toggle[data-target]").forEach(function (btn) {
    var target = document.querySelector(btn.getAttribute("data-target"));
    if (!target) return;
    var labelSpan = btn.querySelector("span:first-child");
    var originalLabel = labelSpan ? labelSpan.textContent : "";
    btn.addEventListener("click", function () {
      var isOpen = target.classList.toggle("open");
      btn.classList.toggle("open", isOpen);
      if (labelSpan) {
        labelSpan.textContent = isOpen ? "Show Less" : originalLabel;
      }
      if (isOpen) {
        refreshReveal(target);
        setTimeout(function () {
          target.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);
      }
    });
  });

  /* ---------- Interior gallery filter (DBG residence interiors) ---------- */
  var interiorFilter = document.getElementById("interior-filter");
  if (interiorFilter) {
    var interiorButtons = interiorFilter.querySelectorAll("button");
    var interiorItems = document.querySelectorAll("#interior-grid .gallery-item");
    interiorButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        interiorButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        interiorItems.forEach(function (item) {
          var cat = item.getAttribute("data-category");
          var show = filter === "all" || filter === cat;
          item.classList.toggle("hide", !show);
        });
      });
    });
  }

  /* ---------- Main gallery: project tabs + DBG sub-filters ---------- */
  var mainTabs = document.getElementById("main-gallery-tabs");
  var dbgSubfilter = document.getElementById("dbg-subfilter");
  var mainGrid = document.getElementById("main-gallery-grid");
  if (mainTabs && mainGrid) {
    var mainTabButtons = mainTabs.querySelectorAll("button");
    var mainItems = mainGrid.querySelectorAll(".gallery-item");
    var subButtons = dbgSubfilter ? dbgSubfilter.querySelectorAll("button") : [];

    function applyMainFilter() {
      var activeTabBtn = mainTabs.querySelector("button.active");
      var project = activeTabBtn ? activeTabBtn.getAttribute("data-filter") : "norea";
      var activeSubBtn = dbgSubfilter ? dbgSubfilter.querySelector("button.active") : null;
      var sub = activeSubBtn ? activeSubBtn.getAttribute("data-subfilter") : "all";

      if (dbgSubfilter) dbgSubfilter.classList.toggle("show", project === "dbg");

      mainItems.forEach(function (item) {
        var cat = item.getAttribute("data-category");
        var itemSub = item.getAttribute("data-sub");
        var show = cat === project && (project !== "dbg" || sub === "all" || sub === itemSub);
        item.classList.toggle("hide", !show);
      });
    }

    mainTabButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        mainTabButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        if (dbgSubfilter) {
          subButtons.forEach(function (b) {
            b.classList.remove("active");
          });
          var allBtn = dbgSubfilter.querySelector('button[data-subfilter="all"]');
          if (allBtn) allBtn.classList.add("active");
        }
        applyMainFilter();
      });
    });

    subButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        subButtons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        applyMainFilter();
      });
    });

    applyMainFilter();

    /* Jump-to-gallery links from each project chapter (sets the correct tab) */
    document.querySelectorAll(".js-open-gallery").forEach(function (link) {
      link.addEventListener("click", function () {
        var project = link.getAttribute("data-project");
        mainTabButtons.forEach(function (b) {
          b.classList.toggle("active", b.getAttribute("data-filter") === project);
        });
        if (dbgSubfilter) {
          subButtons.forEach(function (b) {
            b.classList.remove("active");
          });
          var allBtn = dbgSubfilter.querySelector('button[data-subfilter="all"]');
          if (allBtn) allBtn.classList.add("active");
        }
        applyMainFilter();
      });
    });
  }

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var currentGroup = [];
  var currentIndex = 0;

  function getGroup(el) {
    var container = el.closest(".gallery-grid, .plan-thumb-grid");
    var items;
    if (container) {
      items = Array.prototype.slice.call(container.querySelectorAll(".js-lightbox"));
      items = items.filter(function (it) {
        return !it.classList.contains("hide") && it.offsetParent !== null;
      });
      if (items.indexOf(el) === -1) items = [el];
    } else {
      items = [el];
    }
    return items;
  }

  function openLightboxAt(index) {
    if (!currentGroup.length) return;
    currentIndex = (index + currentGroup.length) % currentGroup.length;
    var el = currentGroup[currentIndex];
    var full = el.getAttribute("data-full");
    var caption = el.getAttribute("data-caption") || "";
    lightboxImg.setAttribute("src", full);
    lightboxImg.setAttribute("alt", caption);
    lightboxCaption.textContent = caption;
    var multi = currentGroup.length > 1;
    lightboxPrev.style.display = multi ? "block" : "none";
    lightboxNext.style.display = multi ? "block" : "none";
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".js-lightbox");
    if (!trigger) return;
    e.preventDefault();
    currentGroup = getGroup(trigger);
    var idx = currentGroup.indexOf(trigger);
    openLightboxAt(idx === -1 ? 0 : idx);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxPrev.addEventListener("click", function () {
    openLightboxAt(currentIndex - 1);
  });
  lightboxNext.addEventListener("click", function () {
    openLightboxAt(currentIndex + 1);
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightboxAt(currentIndex - 1);
    if (e.key === "ArrowRight") openLightboxAt(currentIndex + 1);
  });

  /* ---------- Project choice cards (visual selected state + unit-type options) ---------- */
  var choiceInputs = document.querySelectorAll('.project-choice input[name="project_choice"]');
  var unitSelect = document.getElementById("funit");
  var unitOptions = {
    norea: [
      ["1br", "1 Bedroom"],
      ["2br", "2 Bedroom"],
      ["3br", "3 Bedroom"],
      ["undecided", "Not Sure Yet"]
    ],
    dbg: [
      ["studio", "Studio"],
      ["1br", "1 Bedroom"],
      ["2br", "2 Bedroom"],
      ["3br", "3 Bedroom"],
      ["undecided", "Not Sure Yet"]
    ],
    both: [
      ["studio", "Studio"],
      ["1br", "1 Bedroom"],
      ["2br", "2 Bedroom"],
      ["3br", "3 Bedroom"],
      ["undecided", "Not Sure Yet"]
    ]
  };
  function updateUnitOptions(project) {
    if (!unitSelect || !unitOptions[project]) return;
    var current = unitSelect.value;
    unitSelect.innerHTML = "";
    unitOptions[project].forEach(function (pair) {
      var opt = document.createElement("option");
      opt.value = pair[0];
      opt.textContent = pair[1];
      unitSelect.appendChild(opt);
    });
    var stillExists = unitOptions[project].some(function (pair) {
      return pair[0] === current;
    });
    unitSelect.value = stillExists ? current : "undecided";
  }
  choiceInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      choiceInputs.forEach(function (i) {
        i.closest("label").classList.toggle("selected", i.checked);
      });
      document.getElementById("project-error").classList.remove("show");
      updateUnitOptions(input.value);
    });
  });

  /* ---------- Contact form (static / demo only — no backend) ---------- */
  var form = document.getElementById("enquiry-form");
  var successMsg = document.getElementById("form-success");
  var projectError = document.getElementById("project-error");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var chosen = form.querySelector('input[name="project_choice"]:checked');
      if (!chosen) {
        projectError.classList.add("show");
        projectError.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      projectError.classList.remove("show");
      successMsg.classList.add("show");
      form.reset();
      choiceInputs.forEach(function (i) {
        i.closest("label").classList.remove("selected");
      });
      successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ---------- Price & availability: project tabs + DBG filters ---------- */
  var priceTabs = document.querySelectorAll("[data-price-project]");
  var pricePanels = document.querySelectorAll("[data-price-panel]");
  priceTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var project = tab.getAttribute("data-price-project");
      priceTabs.forEach(function (item) {
        var active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", active ? "true" : "false");
      });
      pricePanels.forEach(function (panel) {
        var active = panel.getAttribute("data-price-panel") === project;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });
    });
  });

  var typeFilter = document.getElementById("dbg-type-filter");
  var floorFilter = document.getElementById("dbg-floor-filter");
  var statusFilter = document.getElementById("dbg-status-filter");
  var unitSearch = document.getElementById("dbg-unit-search");
  var priceRows = document.querySelectorAll("#dbg-price-table tbody tr");
  function filterDbgPrices() {
    if (!priceRows.length) return;
    var type = typeFilter ? typeFilter.value : "all";
    var floor = floorFilter ? floorFilter.value : "all";
    var status = statusFilter ? statusFilter.value : "all";
    var query = unitSearch ? unitSearch.value.trim().toLowerCase() : "";
    priceRows.forEach(function (row) {
      var matches = (type === "all" || row.getAttribute("data-type") === type) &&
        (floor === "all" || row.getAttribute("data-floor") === floor) &&
        (status === "all" || row.getAttribute("data-status") === status) &&
        (!query || row.cells[0].textContent.toLowerCase().indexOf(query) !== -1);
      row.hidden = !matches;
    });
  }
  [typeFilter, floorFilter, statusFilter, unitSearch].forEach(function (control) {
    if (control) control.addEventListener(control === unitSearch ? "input" : "change", filterDbgPrices);
  });

  /* ---------- DBG payment term tabs ---------- */
  var paymentTabs = document.querySelectorAll("[data-payment-kind]");
  var paymentPanels = document.querySelectorAll("[data-payment-panel]");
  paymentTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var kind = tab.getAttribute("data-payment-kind");
      paymentTabs.forEach(function (item) {
        item.classList.toggle("active", item === tab);
      });
      paymentPanels.forEach(function (panel) {
        var active = panel.getAttribute("data-payment-panel") === kind;
        panel.classList.toggle("active", active);
        panel.hidden = !active;
      });
    });
  });

  /* ---------- Year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
