export const createCustomCustomerId = (orderNumber: number, customerId: number) => {
  const orderNumberStr = orderNumber.toString();
  const customerIdStr = customerId.toString();

  const lastFiveOrderNumber = orderNumberStr.slice(-5);
  const lastFiveCustomerId = customerIdStr.slice(-5);

  return `${lastFiveOrderNumber}${lastFiveCustomerId}`
}