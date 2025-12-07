document.addEventListener("DOMContentLoaded", function () {
  // Видоизменение шапки в зависимости от положения пользователя на странице
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

  // Переключения фильтров
  const filterToggles = document.querySelectorAll(".filter-toggle");
  let activeFilter = null;

  // Обработчики для кнопок фильтров
  filterToggles.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const filterType = toggle.dataset.filter;

      // Закрываем предыдущий открытый фильтр
      if (activeFilter && activeFilter !== filterType) {
        closeActiveFilter();
      }

      // Переключаем текущий фильтр
      const dropdown = document.getElementById(`${filterType}-dropdown`);
      const isOpening = !dropdown.classList.contains("active");

      if (isOpening) {
        // Закрываем все фильтры перед открытием нового
        closeAllFilters();
        dropdown.classList.add("active");
        toggle.classList.add("active");
        activeFilter = filterType;

        // Обработчик внутри открытого фильтра
        dropdown.addEventListener("click", dropdownClickHandler);
      } else {
        closeActiveFilter();
      }
    });
  });

  // Обработчик клика внутри выпадающего меню
  function dropdownClickHandler(e) {
    e.stopPropagation(); // Предотвращаем всплытие клика
  }

  // Закрытие при клике вне фильтра
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter-group")) {
      closeAllFilters();
    }
  });

  // Закрытие при нажатии Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllFilters();
    }
  });

  function closeActiveFilter() {
    if (activeFilter) {
      const dropdown = document.getElementById(`${activeFilter}-dropdown`);
      const toggle = document.querySelector(
        `.filter-toggle[data-filter="${activeFilter}"]`
      );

      dropdown.classList.remove("active");
      toggle.classList.remove("active");
      dropdown.removeEventListener("click", dropdownClickHandler);
      activeFilter = null;
    }
  }

  function closeAllFilters() {
    document.querySelectorAll(".filter-dropdown.active").forEach((dropdown) => {
      dropdown.classList.remove("active");
      dropdown.removeEventListener("click", dropdownClickHandler);
    });

    document.querySelectorAll(".filter-toggle.active").forEach((toggle) => {
      toggle.classList.remove("active");
    });

    activeFilter = null;
  }

  // ================FAQ Accordion=====================

  const accordionLists = document.querySelectorAll(".faq__list");

  accordionLists.forEach((el) => {
    el.addEventListener("click", (e) => {
      const accordionList = e.currentTarget;
      const accordionControl = e.target.closest(".faq-item__control");
      if (!accordionControl) return;
      e.preventDefault();
      const accordionItem = accordionControl.parentElement;
      const accordionContent = accordionControl.nextElementSibling;

      accordionItem.classList.toggle("faq__item--opened");

      if (accordionItem.classList.contains("faq__item--opened")) {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      } else {
        accordionContent.style.maxHeight = null;
      }
    });
  });

  // ================Маска для телефона=====================

  const inputsTel = document.querySelectorAll('input[type="tel"]');
  let im = new Inputmask("+7 (999) 999-99-99");
  im.mask(inputsTel);

  // ================Слайдер отзывов=====================
  const swiper = new Swiper(".testimonials__slider", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    centeredSlides: false,
    watchOverflow: true,

    navigation: {
      nextEl: ".testimonials__next",
      prevEl: ".testimonials__prev",
    },
  });
});
