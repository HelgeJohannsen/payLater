import db from "../db.server";

export async function handleOrderCancel(orderId: string, status: string) {
  try {
    const updatedOrder = await db.orders.update({
      where: { orderId },
      data: { cancelStatus: status },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Order update failed", error);
  }
}

export async function getOrderInfoForCancel(orderId: string) {
  try {
    const orderData = await db.orders.findUnique({
      where: { orderId },
      select: {
        applicationNumber: true,
        orderAmount: true,
        customerDetails: {
          select: {
            country: true,
          },
        },
      },
    });
    return orderData;
  } catch (error) {
    console.error("Unable to get order data", error);
  }
}
