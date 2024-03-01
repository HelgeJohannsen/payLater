import db from "../db.server";
import type { CreateRefundsDetails } from "./types";

export async function handleRefundsOrder(orderId: string, status: string) {
  try {
    const updatedOrder = await db.orders.update({
      where: { orderId },
      data: { refundStatus: status },
    });
    return updatedOrder;
  } catch (error) {
    console.error("Order update failed", error);
  }
}

export async function createRefundsDetails(
  orderNumber: string,
  refundInfo: CreateRefundsDetails,
) {
  try {
    const refundData = await db.refundsDetails.create({
      data: {
        ...refundInfo,
        order: {
          connect: { orderNumber },
        },
      },
    });
    return refundData;
  } catch (error) {
    console.error("Create RefundsDetails failed", error);
  }
}

export async function getOrderDataToRefund(orderId: string) {
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
        fulfilledDetails: {
          select: {
            billingDate: true,
          },
        },
      },
    });
    return orderData;
  } catch (error) {
    console.error("Unable to get order data", error);
  }
}
