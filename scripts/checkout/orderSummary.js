import {cart, removeFromCart, saveToStorage, updateDeliveryOption} from '../../data/cart.js';
import {getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import {calculateDeliveryDate, deliveryOptions, getDeliveryOptions} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from "./paymentSummary.js";

export function renderOrderSummary () {
  let cartSummaryHTML = '';

  cart.forEach(cartItem => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOptions(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML +=
      `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}" alt="">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options js-delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  function deliveryOptionsHTML (matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach(deliveryOption => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      html += `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;

      renderOrderSummary();
      renderPaymentSummary();
      saveToStorage();
      removeFromCart(productId);
      updateCartQuantity();

      document.querySelector(`.js-cart-item-container-${productId}`).remove();
    });
  });

  function updateCartQuantity () {
    let cartQuantity = 0;

    cart.forEach(cartItem => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
  }

  updateCartQuantity();

  document.querySelectorAll('.js-update-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      let matchingItem;

      cart.forEach(cartItem => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.quantity ++;
      }

      saveToStorage();
      renderOrderSummary();
      renderPaymentSummary();
      updateCartQuantity();

      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = matchingItem.quantity;
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach(element => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  })
}