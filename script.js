// Atelier Mara interactions, vanilla JS only
(function () {
  var nav = document.getElementById("topnav");
  var burger = document.getElementById("burger");
  var navlinks = document.getElementById("navlinks");
  var yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky nav shadow
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  burger.addEventListener("click", function () {
    var open = navlinks.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navlinks.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      navlinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // Active link highlight
  var links = Array.prototype.slice.call(document.querySelectorAll(".navlink"));
  var sections = ["home", "work", "about", "contact"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  function setActive(id) {
    links.forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === "#" + id) a.classList.add("isactive");
      else a.classList.remove("isactive");
    });
  }
  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(en.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          revObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Gallery filtering
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll("#workGrid .card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("ison"); });
      chip.classList.add("ison");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        var cat = card.getAttribute("data-cat");
        var show = f === "all" || cat === f;
        card.classList.toggle("hide", !show);
        if (show) {
          card.style.opacity = "0";
          card.style.transform = "translateY(12px)";
          setTimeout(function () {
            card.style.opacity = "1";
            card.style.transform = "";
          }, 60);
        }
      });
    });
  });

  // Lightbox modal
  var lightbox = document.getElementById("lightbox");
  var boxCat = document.getElementById("boxCat");
  var boxTitle = document.getElementById("boxTitle");
  var boxMeta = document.getElementById("boxMeta");
  var boxDesc = document.getElementById("boxDesc");
  var closeBox = document.getElementById("closeBox");
  var lastFocus = null;

  function openBox(card) {
    boxCat.textContent = card.getAttribute("data-cat") || "Work";
    boxTitle.textContent = card.getAttribute("data-title") || "Project";
    boxMeta.textContent = card.getAttribute("data-meta") || "";
    boxDesc.textContent = card.getAttribute("data-desc") || "";
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBox.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll("[data-open]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".card");
      if (card) openBox(card);
    });
  });
  closeBox.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
  var boxCta = document.getElementById("boxCta");
  if (boxCta) boxCta.addEventListener("click", closeLightbox);

  // Contact form validation
  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");
  function setErr(name, msg) {
    var small = form.querySelector('[data-err="' + name + '"]');
    var input = form.querySelector('[name="' + name + '"]');
    if (small) small.textContent = msg || "";
    if (input) input.closest(".field").classList.toggle("invalid", Boolean(msg));
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var ok = true;
    if (name.length < 2) { setErr("name", "Please add your name."); ok = false; }
    else setErr("name", "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("email", "Please add a valid email."); ok = false; }
    else setErr("email", "");
    if (message.length < 10) { setErr("message", "Please add a few more lines, 10 characters min."); ok = false; }
    else setErr("message", "");
    if (!ok) return;
    success.hidden = false;
    form.reset();
    setTimeout(function () { success.hidden = true; }, 8000);
  });
  ["name", "email", "message"].forEach(function (n) {
    var input = form.querySelector('[name="' + n + '"]');
    if (input) input.addEventListener("input", function () { setErr(n, ""); });
  });
})();
