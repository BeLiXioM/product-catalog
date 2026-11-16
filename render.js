export function renderProducts(products, onAddToCart) {
  const statusElement = document.querySelector("#catalog-status");
  const listElement = document.querySelector("#product-list");

  if (products.length > 0) {
    statusElement.textContent = `Найдено товаров: ${products.length}`;
  } else {
    statusElement.textContent = "Нет товаров для отображения";
  }

  listElement.textContent = "";

  for (const product of products) {
    const addButton = document.createElement("button");
    addButton.addEventListener("click", () => {
    onAddToCart(product);
  });
    addButton.setAttribute("type", "button");
    addButton.textContent = "В корзину";

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
      addButton.disabled = true;
      availabilityElement.classList.add("out-of-stock");
      availabilityElement.textContent = "Нет в наличии";
    }

    itemElement.append(nameElement);
    itemElement.append(priceElement);
    itemElement.append(availabilityElement);
    itemElement.append(addButton);
    listElement.append(itemElement);
  }
}