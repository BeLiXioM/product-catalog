import { products } from "./products.js";

export function loadProducts(shouldFail = false){
    return new Promise((resolve, reject) => {
    setTimeout(() => {
    if (shouldFail){
    reject(new Error("Не удалось загрузить товары"));
   }
   else{
      resolve(products);
      }
   }, 1000);
});
}