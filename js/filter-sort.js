document.addEventListener("DOMContentLoaded", function () {
  const sortSelect = document.querySelector(".sort-select");

  if (!sortSelect) return;

  // Обработчик изменения сортировки
  sortSelect.addEventListener("change", function () {
    const sortValue = this.value;

    // Отправляем событие в менеджер фильтров
    document.dispatchEvent(
      new CustomEvent("sortFilterChanged", {
        detail: sortValue,
      })
    );
  });
});
