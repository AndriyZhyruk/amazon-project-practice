export const cart = [];

export function addToCart (productId, button) {
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`).value
  const quantity = Number(quantitySelector);

  const addedToCart = button.parentElement.querySelector('.js-added-to-cart');
  addedToCart.classList.add('visible');
  setTimeout(() => {
    addedToCart.classList.remove('visible');
  }, 1500);

  let matchingItem;

  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  }
  else {
    cart.push({
      productId,
      quantity,
    });
  }
}