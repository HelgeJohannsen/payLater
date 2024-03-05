import db from "../db.server";
import type { CreateFulfilledDetails } from "./types";

export async function handleOrderFulFilled(orderId: string, status: string) {
  try {
    const updatedOrder = await db.orders.update({
      where: { orderId },
      data: { fulfillStatus: status },
    });
    console.log("handle order fulfillment status: " + updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error("Order update failed", error);
  }
}

export async function createFulfilledDetails(
  orderNumber: string,
  fulfilledDetailsData: CreateFulfilledDetails,
) {
  try {
    const ffData = await db.fulfilledDetails.findFirst({
      where: { orderNumberRef: orderNumber },
    });
    if (!ffData) {
      const newFFData = await db.fulfilledDetails.create({
        data: {
          ...fulfilledDetailsData,
          order: {
            connect: { orderNumber },
          },
        },
      });
      return newFFData;
    }
    return ffData;
  } catch (error) {
    console.error("Create FulfilledDetails failed", error);
  }
}

export async function getOrderInfoForFulFillment(orderId: string) {
  try {
    const orderData = await db.orders.findUnique({
      where: { orderId },
      select: {
        applicationNumber: true,
        paymentMethode: true,
        orderAmount: true,
        orderName: true,
        orderNumber: true,
        customerDetails: {
          select: {
            country: true,
            customCustomerId: true,
          },
        },
      },
    });
    return orderData;
  } catch (error) {
    console.error("Unable to get order data", error);
  }
}
