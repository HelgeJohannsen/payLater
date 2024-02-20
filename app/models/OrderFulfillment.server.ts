import type { FulFillmentBillingInfo } from "~/consors/api";
import db from "../db.server";

export async function handleOrderFulFilled(orderId: string, status: string) {
  try {

    const updatedOrder = await db.orders.update({
      where: { orderId },
      data: { fulfillStatus: status },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Order update failed", error);
  }
}

export async function updateBillingWithFulFillData(orderNumber: string, billingInfo: FulFillmentBillingInfo) {
  try {
    const updatedOrder = await db.billingInfo.update({
      where: { orderNumberRef: orderNumber },
      data: { ...billingInfo },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Order update failed", error);
  }
}

export async function getOrderInfoForFulFillment(orderId: string){
  try {
    const orderFulFillmentInfo = await db.orders.findUnique({
      where: { orderId },
      select: {
        applicationNumber: true,
        paymentMethode: true,
        orderAmount: true,
        orderName: true,
        customCustomerId: true,
        customerDetails: {
          select: {
            country: true,
          }
        },
      },
    });
    return orderFulFillmentInfo;
  } catch (error) {
    console.error("Unable to get Application Reference Number", error);
  }
}
