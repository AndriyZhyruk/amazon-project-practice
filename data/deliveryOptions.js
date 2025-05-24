import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js"

export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

export function getDeliveryOptions(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach(option => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate (deliveryOption) {
  const today = dayjs();
  let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  if (deliveryDate.day() === 6) {
    deliveryDate = deliveryDate.add(2, 'days');
  }
  else if (deliveryDate.day() === 0) {
    deliveryDate = deliveryDate.add(1, 'day');
  }
  return deliveryDate.format('dddd, MMMM D');
}