import db from "../db.server";

export async function handleOrderPartiallyFulfilled(
  orderId: string,
  status: string
) {
  try {
    const updatedOrder = await db.orders.update({
      where: { orderId },
      data: { partiallyFF: status },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Order update failed", error);
  }
}
