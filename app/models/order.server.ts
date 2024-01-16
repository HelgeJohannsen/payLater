import db from "../db.server";

export async function createOrder(shop: String, orderId: Number) {
    /** @type {any} */
    const data = {
      shop,
      orderId,
    };
    const order = await db.order.create({ data });
    if (!order) {
      return null;
    }
    return order;
  }