import { areProductsValid } from "./validation.js";

export async function loadProducts(){
    const response = await fetch("./products.json");
  if (!response.ok) {
  throw new Error("Не удалось загрузить товары");
}
  const products = await response.json();
  if (!Array.isArray(products)){
   throw new Error("Ожидался массив товаров");
  }
  if (!areProductsValid(products)){
   throw new Error("Некорректные данные товара");
  }
  return products;
}

