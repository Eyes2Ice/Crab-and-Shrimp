document.addEventListener("DOMContentLoaded", function () {
  // Элементы фильтра
  const categoryCheckboxes = document.querySelectorAll(
    'input[name="category"]'
  );
  const selectedCategoriesList = document.querySelector(
    ".selected-categories-list"
  );
  const selectedCategoriesContainer = document.querySelector(
    ".selected-categories"
  );

  // Массив для хранения выбранных категорий
  let selectedCategories = [];

  // Инициализация
  initCategoryFilter();

  // Функция инициализации фильтра
  function initCategoryFilter() {
    // Обработчики для чекбоксов
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", handleCategoryChange);
    });

    // Применяем начальное состояние
    updateSelectedCategoriesUI();
  }

  // Обработчик изменения состояния чекбокса
  function handleCategoryChange(e) {
    const checkbox = e.target;
    const categoryValue = checkbox.value;

    if (checkbox.checked) {
      // Добавляем категорию, если её ещё нет в списке
      if (!selectedCategories.includes(categoryValue)) {
        selectedCategories.push(categoryValue);
      }
    } else {
      // Удаляем категорию из списка
      selectedCategories = selectedCategories.filter(
        (cat) => cat !== categoryValue
      );
    }

    // Обновляем UI и применяем фильтр
    updateSelectedCategoriesUI();
    applyCategoryFilter();
  }

  // Функция применения фильтра по категориям
  function applyCategoryFilter() {
    // Отправляем событие в менеджер фильтров
    document.dispatchEvent(
      new CustomEvent("categoryFilterChanged", {
        detail: [...selectedCategories],
      })
    );

    // Обновляем UI выбранных категорий
    updateSelectedCategoriesUI();
  }

  // Обновление UI выбранных категорий
  function updateSelectedCategoriesUI() {
    if (!selectedCategoriesList || !selectedCategoriesContainer) return;

    // Очищаем список
    selectedCategoriesList.innerHTML = "";

    // Показываем/скрываем контейнер
    if (selectedCategories.length > 0) {
      selectedCategoriesContainer.classList.add("visible");
    } else {
      selectedCategoriesContainer.classList.remove("visible");
      return;
    }

    // Добавляем чипсы для каждой выбранной категории
    selectedCategories.forEach((categoryValue) => {
      const checkbox = document.querySelector(
        `input[name="category"][value="${categoryValue}"]`
      );
      const categoryLabel = checkbox
        ? checkbox.nextElementSibling.nextElementSibling.textContent
        : categoryValue;

      const chip = document.createElement("div");
      chip.className = "category-chip";
      chip.dataset.value = categoryValue;
      chip.innerHTML = `
        <span class="category-chip-text">${categoryLabel}</span>
        <span class="category-chip-remove">×</span>
      `;

      // Обработчик клика на чипс
      chip.addEventListener("click", function () {
        removeCategory(categoryValue);
      });

      selectedCategoriesList.appendChild(chip);
    });
  }

  // Удаление категории по клику на чипс
  function removeCategory(categoryValue) {
    // Снимаем выделение с соответствующего чекбокса
    const checkbox = document.querySelector(
      `input[name="category"][value="${categoryValue}"]`
    );
    if (checkbox) {
      checkbox.checked = false;
    }

    // Удаляем категорию из массива
    selectedCategories = selectedCategories.filter(
      (cat) => cat !== categoryValue
    );

    // Обновляем UI и применяем фильтр
    updateSelectedCategoriesUI();
    applyCategoryFilter();
  }
});
