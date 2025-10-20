document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("product-search");
  const searchClear = document.querySelector(".search-clear");

  if (!searchInput) return;

  // Обработчик ввода в поле поиска
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.trim();

    // Отправляем событие в менеджер фильтров
    document.dispatchEvent(
      new CustomEvent("searchFilterChanged", {
        detail: searchTerm,
      })
    );
  });

  // Обработчик кнопки очистки поиска
  if (searchClear) {
    searchClear.addEventListener("click", function () {
      searchInput.value = "";

      // Отправляем событие в менеджер фильтров
      document.dispatchEvent(
        new CustomEvent("searchFilterChanged", {
          detail: "",
        })
      );
    });
  }
});
