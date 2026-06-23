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

  /* hand the thumb over to the breathing glow while on Repetition */
  if ("IntersectionObserver" in window) {
    var rep = document.getElementById("repetition");
    if (rep) {
      var glowIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            nav.classList.toggle(
              "glow",
              entry.isIntersecting && entry.intersectionRatio >= 0.55
            );
          });
        },
        { threshold: 0.55 }
      );
      glowIo.observe(rep);
    }
  }
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
