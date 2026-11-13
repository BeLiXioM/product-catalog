export function sortProducts(products, order) {
  const sortedProducts = [...products];

  if (order === "asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (order === "desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return sortedProducts;
}