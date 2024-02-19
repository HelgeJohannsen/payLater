export const createCustomCustomerId = (orderNumber: string, customerId: string) => {
  const lastFiveOrderNumber = orderNumber.slice(-5);
  const lastFiveCustomerId = customerId.slice(-5);

  return `${lastFiveOrderNumber}${lastFiveCustomerId}`
}