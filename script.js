import { loadProducts } from "./api.js";

import { filterProducts, searchProducts, getAvailableCount } from "./filters.js";

import { sortProducts } from "./sort.js";


import { applyDiscountToProducts } from "./discount.js";

import { renderProducts } from "./render.js";

let products = [];

const searchInput = document.querySelector("#search-query");
const priceInput = document.querySelector("#max-price");
const stockCheckbox = document.querySelector("#only-in-stock");
const discountCheckBox = document.querySelector("#apply-discount");
const filterForm = document.querySelector("#filter-form");
const allButton = document.querySelector("#all-button");
const sortSelect = document.querySelector("#sort-order");
const filterButton = document.querySelector("#show-affordable");
const retryButton = document.querySelector("#retry-button");
retryButton.addEventListener("click", initCatalog);

async function initCatalog() {
 
  const statusElement = document.querySelector("#catalog-status");
  statusElement.textContent ="Загрузка товаров...";
  filterButton.disabled = true;
  allButton.disabled = true;
  retryButton.hidden = true
  try{
  products = await loadProducts();
  applyFilters(); 
  filterButton.disabled = false;
  allButton.disabled = false;
  }
  catch (error){
    statusElement.textContent = error.message;
    retryButton.hidden = false;
  }
  
}

function restoreSettings() {
  const savedSettingsJSON = localStorage.getItem("catalogSettings");

  if (savedSettingsJSON !== null) {
    try {
      const savedSettings = JSON.parse(savedSettingsJSON);

      if (
        typeof savedSettings.maxPrice === "number" &&
        savedSettings.maxPrice >= 0
      ) {
        priceInput.value = savedSettings.maxPrice;
      }

      if (typeof savedSettings.query === "string") {
        searchInput.value = savedSettings.query;
      }

      if (typeof savedSettings.onlyInStock === "boolean") {
        stockCheckbox.checked = savedSettings.onlyInStock;
      }

      if (
        savedSettings.sortOrder === "default" ||
        savedSettings.sortOrder === "asc" ||
        savedSettings.sortOrder === "desc"
      ) {
        sortSelect.value = savedSettings.sortOrder;
      }

      if (typeof savedSettings.applyDiscount === "boolean") {
        discountCheckBox.checked = savedSettings.applyDiscount;
      }
    } catch {
      console.log("Не удалось восстановить настройки");
    }
  }
}

function applyFilters() {
  const statusElement = document.querySelector("#catalog-status");
  const applyDiscountEnabled = discountCheckBox.checked;
  const onlyInStock = stockCheckbox.checked;

  if (priceInput.value === "") {
    statusElement.textContent = "Введите максимальную цену";
    return;
  }

  const maxPrice = Number(priceInput.value);

  if (maxPrice < 0) {
    statusElement.textContent = "Цена не может быть отрицательной";
    return;
  }

  const settings = {
    maxPrice: maxPrice,
    query: searchInput.value,
    onlyInStock: stockCheckbox.checked,
    sortOrder: sortSelect.value,
    applyDiscount: discountCheckBox.checked
  };

  const settingsJSON = JSON.stringify(settings);
  localStorage.setItem("catalogSettings", settingsJSON);

  let productsForFilter = products;

  if (applyDiscountEnabled) {
    productsForFilter = applyDiscountToProducts(products, 10);
  }

  const result = filterProducts(
    productsForFilter,
    maxPrice,
    onlyInStock
  );

  const searchResult = searchProducts(result, searchInput.value);
  const sortedResult = sortProducts(searchResult, sortSelect.value);

  renderProducts(sortedResult);
}

function handleFilterSubmit(event) {
  event.preventDefault();
  applyFilters();
}

function showAllItems() {
  localStorage.removeItem("catalogSettings");

  priceInput.value = "";
  searchInput.value = "";
  stockCheckbox.checked = false;
  discountCheckBox.checked = false;
  sortSelect.value = "default";

  renderProducts(products);
}

filterForm.addEventListener("submit", handleFilterSubmit);
allButton.addEventListener("click", showAllItems);

restoreSettings();
initCatalog();
