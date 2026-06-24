/* Slide indicator: one dot glides along four slots, its position driven
   continuously by scroll progress (so it tracks the sticky-scroll snap). */
(function () {
  "use strict";

  var nav = document.querySelector(".dots");
  var slider = document.querySelector(".slider");
  if (!nav || !slider) return;

  var lastIndex = 4; /* count of slides */

  /* --- thumb position from horizontal scroll progress --- */
  var ticking = false;
  function updateThumb() {
    ticking = false;
    var total = slider.scrollWidth - slider.clientWidth;
    var x = slider.scrollLeft;
    var prog = total > 0 ? x / total : 0;
    if (prog < 0) prog = 0;
    else if (prog > 1) prog = 1;
    nav.style.setProperty("--thumb", (prog * (lastIndex - 1)).toFixed(4));
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateThumb);
    }
  }
  slider.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateThumb();

  /* translate vertical mouse-wheel into horizontal scroll (desktop);
     touch/trackpad swipe already scrolls horizontally on its own */
  slider.addEventListener(
    "wheel",
    function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        slider.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    },
    { passive: false }
  );

  /* Per-slide thumb states:
     - hint (nudge right) while on the intro, suggesting a swipe right
     - glow while on Repetition (breathing halo) */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var on = entry.isIntersecting && entry.intersectionRatio >= 0.55;
          if (entry.target.id === "repetition") nav.classList.toggle("glow", on);
          if (entry.target.id === "intro") nav.classList.toggle("hint", on);
        });
      },
      { threshold: 0.55 }
    );
    ["repetition", "intro"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();

/* Fit each part title to exactly span the slide's width. Measures the word's
   natural width at a base size, then scales font-size to fill the available
   width (viewport minus the side gutter). Capped so a short word on a wide
   desktop doesn't grow absurdly tall. */
(function () {
  "use strict";

  var titles = document.querySelectorAll(".part-title");
  if (!titles.length) return;

  function fit() {
    var cap = window.innerHeight * 0.5; /* don't exceed ~half the viewport */
    titles.forEach(function (t) {
      var wrap = t.parentElement;
      var cs = getComputedStyle(wrap);
      var avail =
        wrap.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      if (avail <= 0) return;

      var base = 100;
      t.style.fontSize = base + "px";
      t.style.width = "max-content";
      var natural = t.getBoundingClientRect().width;
      t.style.width = "";
      if (natural <= 0) return;

      var size = base * (avail / natural);
      if (size > cap) size = cap;
      t.style.fontSize = size + "px";
    });
  }

  var ticking = false;
  function onResize() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        fit();
      });
    }
  }

  fit();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });
})();

/* REPETITION bolt: run the light-sweep only while the slide is in view, and
   re-fire it each time you arrive. */
(function () {
  "use strict";

  var repetition = document.getElementById("repetition");
  if (!repetition || !("IntersectionObserver" in window)) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          repetition.classList.remove("lit");
          void repetition.offsetWidth; /* restart the animation cleanly */
          repetition.classList.add("lit");
        } else {
          repetition.classList.remove("lit");
        }
      });
    },
    { threshold: 0.5 }
  );

  io.observe(repetition);
})();
