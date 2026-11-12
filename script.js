const products = [
  { id: 1, name: "Клавиатура", price: 2500, inStock: true },
  { id: 2, name: "Мышь", price: 1200, inStock: true },
  { id: 3, name: "Монитор", price: 15000, inStock: false },
  { id: 4, name: "Коврик", price: 700, inStock: true },
  { id: 5, name: "Наушники", price: 3000, inStock: false }
];

// Элементы страницы
const searchInput = document.querySelector("#search-query");
const priceInput = document.querySelector("#max-price");
const stockCheckbox = document.querySelector("#only-in-stock");
const discountCheckBox = document.querySelector("#apply-discount");
const filterForm = document.querySelector("#filter-form");
const allButton = document.querySelector("#all-button");
const sortSelect = document.querySelector("#sort-order");

function filterProducts(products, maxPrice, onlyInStock = true) {
  return products.filter((product) =>
    (!onlyInStock || product.inStock) && product.price <= maxPrice
  );
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const normalizedName = product.name.toLowerCase();
    return normalizedName.includes(normalizedQuery);
  });
}

function sortProducts(products, order) {
  const sortedProducts = [...products];

  if (order === "asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (order === "desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return sortedProducts;
}

function applyDiscount(product, discountPercent) {
  const discountProduct = { ...product };
  discountProduct.price -= discountProduct.price * discountPercent / 100;

  return discountProduct;
}

function applyDiscountToProducts(products, discountPercent) {
  return products.map((product) =>
    applyDiscount(product, discountPercent)
  );
}

function renderProducts(products) {
  const statusElement = document.querySelector("#catalog-status");
  const listElement = document.querySelector("#product-list");

  if (products.length > 0) {
    statusElement.textContent = `Найдено товаров: ${products.length}`;
  } else {
    statusElement.textContent = "Нет товаров для отображения";
  }

  listElement.textContent = "";

  for (const product of products) {
    const itemElement = document.createElement("li");
    itemElement.classList.add("product-card");

    const nameElement = document.createElement("h2");
    nameElement.textContent = `Название: ${product.name}`;

    const priceElement = document.createElement("p");
    priceElement.textContent = `Цена: ${product.price} ₽`;

    const availabilityElement = document.createElement("p");

    if (product.inStock) {
      availabilityElement.classList.add("in-stock");
      availabilityElement.textContent = "В наличии";
    } else {
      availabilityElement.classList.add("out-of-stock");
      availabilityElement.textContent = "Нет в наличии";
    }

    itemElement.append(nameElement);
    itemElement.append(priceElement);
    itemElement.append(availabilityElement);
    listElement.append(itemElement);
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
applyFilters();