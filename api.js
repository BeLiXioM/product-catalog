
export async function loadProducts(){
    const response = await fetch("./products.json");
  if (!response.ok) {
  throw new Error("Не удалось загрузить товары");
}
  const products = await response.json();
  if (!Array.isArray(products)){
   throw new Error("Ожидался массив товаров");
  }
  return products;
}

