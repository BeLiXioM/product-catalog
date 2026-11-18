import { loadProducts } from "./api.js";

import { filterProducts, searchProducts, getAvailableCount } from "./filters.js";

import { sortProducts } from "./sort.js";


import { applyDiscountToProducts } from "./discount.js";

import { renderProducts } from "./render.js";

import { getCartTotal } from "./cart.js";
import { getCartCount } from "./cart.js";
import { saveCart } from "./cart.js";
import { restoreCart } from "./cart.js";

let products = [];
const cart = [];

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
const cartCountElement = document.querySelector("#cart-count");
const cartTotalElement =document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");
const cartListElement = document.querySelector("#cart-list");

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
    statusElement.textContent = "Не удалось загрузить товары. Попробуйте ещё раз.";
    retryButton.hidden = false;
    console.error(error);
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

  renderProducts(sortedResult, addToCart);
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

  renderProducts(products, addToCart);
}

function renderCartItems(){
  cartListElement.textContent = "";
  if (cart.length === 0){
    const li = document.createElement("li");
    li.textContent = "Корзина пуста";
    cartListElement.append(li);
    return;
  }
   for (let i = 0; i < cart.length; i++) {
    const product = cart[i];
    const detailsElement = document.createElement("span");
    const li = document.createElement("li");
    li.classList.add("cart-item");
    const total = product.price * product.quantity;
    detailsElement.textContent = `${product.name} - ${product.price} ₽ × ${product.quantity} = ${total} ₽`;
    li.append(detailsElement);
    const actionsElement = document.createElement("div");
    actionsElement.classList.add("cart-actions");
  const increaseButton = document.createElement("button");
  increaseButton.type = "button";
  increaseButton.textContent = "+";
  actionsElement.append(increaseButton);
  increaseButton.addEventListener("click", () => increaseQuantity(i));
  const decreaseButton = document.createElement("button");
  decreaseButton.type = "button";
  decreaseButton.textContent = "-";
  actionsElement.append(decreaseButton);
  decreaseButton.addEventListener("click", () => decreaseQuantity(i));
    const removeButton = document.createElement("button");
    removeButton.type = 'button';
    removeButton.textContent = 'Удалить';
    actionsElement.append(removeButton);
    li.append(actionsElement);
    cartListElement.append(li);
    removeButton.addEventListener("click", () => removeFromCart(i));
  }

}

function renderCartSummary(){
  clearCartButton.disabled = cart.length === 0;
  const count = getCartCount(cart);
cartCountElement.textContent = `В корзине: ${count}`;
  const total = getCartTotal(cart);
  cartTotalElement.textContent = `Сумма: ${total} ₽`;
  renderCartItems();
}

function removeFromCart(index){
  cart.splice(index, 1);
  saveCart(cart);
  renderCartSummary();
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id && item.price === product.price);
  if (existingItem !==  undefined){
    existingItem.quantity += 1;
  }
  else {
    const result = {...product, quantity: 1};
    cart.push(result);
  }
  saveCart(cart);
  renderCartSummary();
}

function clearCart(){
    cart.length = 0;
    saveCart(cart);
    renderCartSummary();
}

function increaseQuantity(index) {
  const cartItem = cart[index];
  cartItem.quantity += 1;
  saveCart(cart);
  renderCartSummary();
}

function decreaseQuantity(index){
  const cartItem = cart[index];
  if (cartItem.quantity > 1){
    cartItem.quantity -= 1;
  }
  else {
    cart.splice(index, 1);
  }
  saveCart(cart);
  renderCartSummary();
}

clearCartButton.addEventListener("click", clearCart);
filterForm.addEventListener("submit", handleFilterSubmit);
allButton.addEventListener("click", showAllItems);


restoreCart(cart);
renderCartSummary();
restoreSettings();
initCatalog();