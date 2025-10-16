// Видоизменение шапки в зависимости от положения пользователя на странице
document.addEventListener("DOMContentLoaded", function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const body = document.body;

  function setScrolled(on) {
    if (on) body.classList.add("body--scrolled");
    else body.classList.remove("body--scrolled");
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio === 0) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
        });
      },
      {
        root: null,
        threshold: [0],
      }
    );

    observer.observe(hero);
  } else {
    let ticking = false;
    function checkHero() {
      const rect = hero.getBoundingClientRect();
      const fullyOut = rect.bottom <= 0 || rect.top >= window.innerHeight;
      setScrolled(fullyOut);
      ticking = false;
    }

    function onScrollOrResize() {
      if (!ticking) {
        window.requestAnimationFrame(checkHero);
        ticking = true;
      }
    }

    checkHero();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
  }
});
