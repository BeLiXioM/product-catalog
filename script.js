const products = [
  { id: 1, name: "Клавиатура", price: 2500, inStock: true },
  { id: 2, name: "Мышь", price: 1200, inStock: true },
  { id: 3, name: "Монитор", price: 15000, inStock: false },
  { id: 4, name: "Коврик", price: 700, inStock: true },
  { id: 5, name: "Наушники", price: 3000, inStock: false }
];

function filterProducts(products, maxPrice, onlyInStock = true) {
  return products.filter((product) =>
    (!onlyInStock || product.inStock) && product.price <= maxPrice
  );
}

function searchProducts(products, query) {
  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  return products.filter((product) => {
    const normalizedName = product.name.toLowerCase();
    return normalizedName.includes(normalizedQuery);
  });
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

const searchInput = document.querySelector("#search-query");
const priceInput = document.querySelector("#max-price");
const stockCheckbox = document.querySelector("#only-in-stock");
const filterForm = document.querySelector("#filter-form");
const allButton = document.querySelector("#all-button");

function handleFilterSubmit(event) {
  event.preventDefault();

  const onlyInStock = stockCheckbox.checked;

  if (priceInput.value === "") {
    const statusElement = document.querySelector("#catalog-status");
    statusElement.textContent = "Введите максимальную цену";
    return;
  }

  const maxPrice = Number(priceInput.value);

  if (maxPrice < 0) {
    const statusElement = document.querySelector("#catalog-status");
    statusElement.textContent = "Цена не может быть отрицательной";
    return;
  }

  const result = filterProducts(products, maxPrice, onlyInStock);

  const searchResult = searchProducts(result, searchInput.value);
  renderProducts(searchResult);
}

function showAllItems() {
  priceInput.value = "";
  searchInput.value = "";
  stockCheckbox.checked = false;
  renderProducts(products);
}

filterForm.addEventListener("submit", handleFilterSubmit);
allButton.addEventListener("click", showAllItems);

renderProducts(filterProducts(products, 1500));