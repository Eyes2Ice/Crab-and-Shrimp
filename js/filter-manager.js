// Глобальный менеджер фильтров
class FilterManager {
  constructor() {
    this.filters = {
      price: { min: null, max: null },
      category: [],
      search: "",
      sort: "",
    };

    this.products = [];
    this.originalOrder = []; // Массив для хранения исходного порядка
    this.init();
  }

  init() {
    // Получаем все товары
    this.products = Array.from(
      document.querySelectorAll(".catalog-list__item")
    );

    // Сохраняем исходный порядок товаров
    this.originalOrder = [...this.products];

    // Инициализируем все товары как видимые
    this.products.forEach((product) => {
      product.classList.add("catalog-list__item--visible");
    });

    // Подписываемся на события фильтров
    this.subscribeToFilterEvents();

    // Применяем начальное состояние
    this.applyAllFilters();
  }

  subscribeToFilterEvents() {
    // Подписка на изменения фильтра цены
    document.addEventListener("priceFilterChanged", (e) => {
      this.filters.price = e.detail;
      this.applyAllFilters();
    });

    // Подписка на изменения фильтра категорий
    document.addEventListener("categoryFilterChanged", (e) => {
      this.filters.category = e.detail;
      this.applyAllFilters();
    });

    // Подписка на изменения поиска
    document.addEventListener("searchFilterChanged", (e) => {
      this.filters.search = e.detail;
      this.applyAllFilters();
    });

    // Подписка на изменения сортировки
    document.addEventListener("sortFilterChanged", (e) => {
      this.filters.sort = e.detail;
      this.applyAllFilters();
    });
  }

  applyAllFilters() {
    const container = document.querySelector(".catalog-list");
    const noResultsElement = document.getElementById("no-results");
    // Единые параметры анимации
    const ANIM_MS = 220; // должен совпадать с CSS transition-duration
    const SHOW_DELAY_MS = 16; // ~1 кадр для применения классов

    // Подготовка к анимации: фиксируем высоту, чтобы сетка не дёргалась
    container.style.minHeight = `${container.offsetHeight}px`;
    let visibleCount = 0;

    // Применяем все фильтры к каждому товару
    this.products.forEach((product) => {
      const shouldShow = this.checkProductVisibility(product);

      if (shouldShow) {
        visibleCount++;
        product.classList.remove(
          "catalog-list__item--hiding",
          "catalog-list__item--hidden"
        );
        product.classList.add("catalog-list__item--showing");
      } else {
        product.classList.add("catalog-list__item--hiding");
        product.classList.remove("catalog-list__item--visible");
      }
    });

    // Запуск анимации скрытия: после окончания transition скрываем из потока
    setTimeout(() => {
      this.products.forEach((product) => {
        if (product.classList.contains("catalog-list__item--hiding")) {
          product.classList.add("catalog-list__item--hidden");
        }
      });
    }, ANIM_MS);

    // Анимация появления подходящих товаров
    setTimeout(() => {
      this.products.forEach((product) => {
        if (product.classList.contains("catalog-list__item--showing")) {
          product.classList.remove("catalog-list__item--showing");
          product.classList.add("catalog-list__item--visible");
        }
      });

      // Обновление высоты контейнера после завершения всех переходов
      setTimeout(() => {
        container.style.minHeight = "";
      }, ANIM_MS);

      // Показ/скрытие сообщения "Ничего не найдено"
      if (noResultsElement) {
        noResultsElement.style.display = visibleCount > 0 ? "none" : "block";
      }

      // Применяем сортировку к видимым товарам
      if (this.filters.sort) {
        this.applySorting();
      } else {
        // Если сортировка сброшена, восстанавливаем исходный порядок для видимых товаров
        this.restoreOriginalOrderForVisible();
      }
    }, SHOW_DELAY_MS);
  }

  checkProductVisibility(product) {
    // Проверка фильтра по цене
    if (this.filters.price.min !== null || this.filters.price.max !== null) {
      const price = parseFloat(product.dataset.price);
      if (this.filters.price.min !== null && price < this.filters.price.min)
        return false;
      if (this.filters.price.max !== null && price > this.filters.price.max)
        return false;
    }

    // Проверка фильтра по категориям
    if (this.filters.category.length > 0) {
      const productCategory = product.dataset.category;
      if (!this.filters.category.includes(productCategory)) return false;
    }

    // Проверка поискового фильтра
    if (this.filters.search.trim() !== "") {
      const productName = product.dataset.name.toLowerCase();
      const searchTerm = this.filters.search.toLowerCase();
      if (!productName.includes(searchTerm)) return false;
    }

    return true;
  }

  applySorting() {
    if (!this.filters.sort) return;

    const container = document.querySelector(".catalog-list");
    const visibleProducts = Array.from(this.products).filter(
      (product) => !product.classList.contains("catalog-list__item--hidden")
    );

    // Сортируем видимые товары
    visibleProducts.sort((a, b) => {
      switch (this.filters.sort) {
        case "price:asc":
          return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        case "price:desc":
          return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        case "title:asc":
          return a.dataset.name.localeCompare(b.dataset.name);
        case "title:desc":
          return b.dataset.name.localeCompare(a.dataset.name);
        default:
          return 0;
      }
    });

    // Переставляем элементы в DOM
    visibleProducts.forEach((product) => {
      container.appendChild(product);
    });
  }

  // Метод для сброса всех фильтров
  resetAllFilters() {
    this.filters = {
      price: { min: null, max: null },
      category: [],
      search: "",
      sort: "",
    };

    // Сбрасываем UI фильтров
    this.resetFilterUI();

    // Восстанавливаем исходный порядок товаров
    this.restoreOriginalOrder();

    // Применяем сброс (это покажет все товары в исходном порядке)
    this.applyAllFilters();
  }

  resetFilterUI() {
    // Сброс фильтра цены
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";

    // Сброс фильтра категорий
    const categoryCheckboxes = document.querySelectorAll(
      'input[name="category"]'
    );
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Сброс поиска
    const searchInput = document.getElementById("product-search");
    if (searchInput) searchInput.value = "";

    // Сброс сортировки
    const sortSelect = document.querySelector(".sort-select");
    if (sortSelect) sortSelect.value = "";

    // Очистка выбранных категорий
    const selectedCategoriesList = document.querySelector(
      ".selected-categories-list"
    );
    if (selectedCategoriesList) selectedCategoriesList.innerHTML = "";

    const selectedCategoriesContainer = document.querySelector(
      ".selected-categories"
    );
    if (selectedCategoriesContainer)
      selectedCategoriesContainer.classList.remove("visible");
  }

  // Метод для восстановления исходного порядка товаров
  restoreOriginalOrder() {
    const container = document.querySelector(".catalog-list");

    // Удаляем все товары из контейнера
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Добавляем товары в исходном порядке
    this.originalOrder.forEach((product) => {
      container.appendChild(product);
    });

    // Обновляем массив товаров
    this.products = [...this.originalOrder];
  }

  // Метод для восстановления исходного порядка только для видимых товаров
  restoreOriginalOrderForVisible() {
    const container = document.querySelector(".catalog-list");

    // Получаем видимые товары в исходном порядке
    const visibleInOriginalOrder = this.originalOrder.filter(
      (product) => !product.classList.contains("catalog-list__item--hidden")
    );

    // Переставляем только видимые товары в исходном порядке
    visibleInOriginalOrder.forEach((product) => {
      container.appendChild(product);
    });
  }
}

// Инициализация менеджера фильтров при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  window.filterManager = new FilterManager();
});
