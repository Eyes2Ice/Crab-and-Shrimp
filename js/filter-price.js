function applyPriceFilter(minPrice, maxPrice) {
  // Отправляем событие в менеджер фильтров
  const priceFilterData = {
    min: isNaN(minPrice) ? null : minPrice,
    max: isNaN(maxPrice) ? null : maxPrice,
  };

  document.dispatchEvent(
    new CustomEvent("priceFilterChanged", {
      detail: priceFilterData,
    })
  );
}

// Обработчик для кнопки "ОК"
// document.querySelector(".apply-filter").addEventListener("click", function (e) {
//   e.stopPropagation();

//   const minPrice = parseFloat(document.getElementById("min-price").value);
//   const maxPrice = parseFloat(document.getElementById("max-price").value);

//   // Валидация
//   if (isNaN(minPrice) && isNaN(maxPrice)) {
//     alert("Введите хотя бы одно значение цены");
//     return;
//   }

//   if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
//     alert("Минимальная цена не может быть больше максимальной");
//     return;
//   }

//   applyPriceFilter(minPrice, maxPrice);
// });
