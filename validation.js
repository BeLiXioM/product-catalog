function isValidPrice(price) {
  if (typeof price === "number" &&  price >= 0){
    return true;
  }
  else {
    return false;
  }
}

function isValidProduct(product){
  if (product === null) {
    return false;
  }
  if (typeof product.name === "string" && isValidPrice(product.price) &&  typeof product.inStock === "boolean"){
    return true;
  }
  else {
    return false;
  }
}

export function areProductsValid(products){
  for (const product of products){
    if (!isValidProduct(product)){
      return false;
    }
  }
  return true;
}

const testProducts = [
  { name: "Мышь", price: 1200, inStock: true },
  { name: "Коврик", price: 700, inStock: true }
];

console.log(areProductsValid([]));