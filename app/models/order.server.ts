import db from "../db.server";
export async function getOrder(orderId: string) {
  // TODO: check typing
  const order = await db.orders.findFirst({ where: { orderId } });
  // console.log("shop", shop);
  if (!order) {
    return null;
  }
  return order;
}
export async function setOrderStatus(orderId: string, status: string, applicationNumber: string) {
  const data = {
    status,
    applicationNumber
  };
  const order = await db.orders.findFirst({ where: { orderId } });
  const id = order?.id;
  await db.orders.update({ where: { id }, data });
  return;
}

export async function createOrder(
  orderId: string,
  orderName: string,
  paymentMethode: string,
  firstName: string,
  lastName: string,
  zip: string,
  city: string,
  street: string,
  country: string
) {
  /** @type {any} */
  const data = {
    orderId,
    orderName,
    paymentMethode,
    firstName,
    lastName,
    zip,
    city,
    street,
    country,
  };
  const order = await db.orders.create({ data });
  if (!order) {
    // console.log("order not created");
    return null;
  }

  return order;
}
