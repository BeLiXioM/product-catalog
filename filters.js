export function filterProducts(products, maxPrice, onlyInStock = true) {
  return products.filter((product) =>
    (!onlyInStock || product.inStock) && product.price <= maxPrice
  );
}

export function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const normalizedName = product.name.toLowerCase();
    return normalizedName.includes(normalizedQuery);
  });
}

export function getAvailableCount(products){
    const availableProducts = products.filter((product) => product.inStock);
    return availableProducts.length;
}