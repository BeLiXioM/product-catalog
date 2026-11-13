export function applyDiscountToProducts(products, discountPercent) {
  return products.map((product) =>
    applyDiscount(product, discountPercent)
  );
}

function applyDiscount(product, discountPercent) {
  const discountProduct = { ...product };
  discountProduct.price -= discountProduct.price * discountPercent / 100;

  return discountProduct;
}