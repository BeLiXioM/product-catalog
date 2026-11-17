import { areProductsValid } from "./validation.js";

export function getCartTotal(cart){
  let total = 0;
  for (const product of cart){
    total += product.price * product.quantity;
  }
  return total;
}

export function getCartCount(cart){
  let count = 0;
  for (const product of cart){
    count += product.quantity;
  }
  return count;
}

export function saveCart(cart){
  const cartJSON = JSON.stringify(cart);
  localStorage.setItem("catalogCart", cartJSON);
}

export function restoreCart(cart){
  const savedCartJSON = localStorage.getItem("catalogCart");
  if (savedCartJSON === null){
    return
  }
  try {
    const savedCart = JSON.parse(savedCartJSON);
    if (!Array.isArray(savedCart)){
    throw new Error("Ожидался массив корзины");
    }
    const restoredCart = [];
    if (!areProductsValid(savedCart)){
      throw new Error("Некорректные товары в корзине");
    }
    for (const product of savedCart) {
      const restoredProduct = { ...product };
      if (restoredProduct.quantity === undefined){
        restoredProduct.quantity = 1;
      }
      if (!(restoredProduct.quantity > 0 && Number.isInteger(restoredProduct.quantity))) {
        throw new Error("Некорректное количество товара")
      }
      restoredCart.push(restoredProduct);
    }
    cart.length = 0;
    for (const product of restoredCart){
      cart.push(product);
    }
  }

  catch {
    console.log("Не удалось восстановить корзину");
  }


}