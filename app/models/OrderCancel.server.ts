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
export async function getOrderCancelInfo(orderId: string){
  try {
    const orderCancelInfo = await db.orders.findUnique({
      where: { orderId },
      select: {
        applicationNumber: true,
        orderAmount: true,
        customerDetails: {
          select: {
            country: true,
          }
        },
      },
    });
    return orderCancelInfo;
  } catch (error) {
    console.error("Unable to get Application Reference Number", error);
  }
}
