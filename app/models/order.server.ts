import db from "../db.server";
import type { CreateOrderWithCustomerDetails } from "./types";

export async function getOrderWithDetails(orderId: string) {
  const orderWithDetails = await db.orders.findUnique({
    where: { orderId },
    include: {
      customerDetails: true,
    },
  });
  if (!orderWithDetails) {
    return null;
  }
  return orderWithDetails;
}

export async function setCreditCheck(
  orderId: string,
  confirmCreditStatus: string,
  applicationNumber: string
) {
  const data = {
    confirmCreditStatus,
    applicationNumber,
  };
  const order = await db.orders.findFirst({ where: { orderId } });
  const id = order?.id;
  await db.orders.update({ where: { id }, data });
  return;
}

export async function createOrderWithCustomerDetails({
  createCustomerData,
  createOrderData,
}: CreateOrderWithCustomerDetails) {
  // A transaction ensure both records are created together
  const result = await db.$transaction(async (prisma) => {
    const order = await prisma.orders.create({
      data: { ...createOrderData },
    });

    if (!order) {
      throw new Error("Order not created");
    }

    const customerDetails = await prisma.customerDetails.create({
      data: {
        ...createCustomerData,
        orderNumberRef: order.orderNumber,
      },
    });
    if (!customerDetails) {
      throw new Error("Customer details not created");
    }

    return { order, customerDetails };
  });

  return result;
}
