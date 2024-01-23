import db from "../db.server";
export async function getOrder(orderId: string) {
  // TODO: check typing
  const order = await db.order.findFirst({ where: { orderId } });
  // console.log("shop", shop);
  if (!order) {

    return null;
  }
  return order;
}
export async function setOrderStatus(orderId: string, status: string) {
  console.log(` --> setOrderId(orderId:${orderId}, status:${status})`);
    /** @type {any} */
    const data = {
      status
    };
    const order2 = await db.order.findFirst({ where: { orderId } });
    const id = order2?.id
  console.log(` --> setOrderId(orderId:${orderId}, status:${status})`);
  const order = await db.order.update({ where: { id },  data });
  return 
}

export async function createOrder(orderId: string, orderName: string, paymentMethode: string,firstName: string,lastName:string,zip: string, city: string,street:string,country: string) {
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
    country
  };
    const order = await db.order.create({ data });
    if (!order) {
      console.log("order not created")
      return null;
    }

    return order;
  }