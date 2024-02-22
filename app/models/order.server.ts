import db from "../db.server";
import type { CreateOrderWithCustomerDetails } from "./types";

export async function getOrderWithDetails(orderId: string) {
  const orderWithDetails = await db.orders.findFirst({
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
    const {
      orderId,
      orderNumber,
      orderName,
      paymentGatewayName,
      paymentMethode,
      orderAmount,
    } = createOrderData;

    const order = await prisma.orders.create({
      data: {
        orderId,
        orderNumber,
        orderName,
        paymentGatewayName,
        paymentMethode,
        orderAmount,
      },
    });

    if (!order) {
      throw new Error("Order not created");
    }

    const {
      customerId,
      email,
      customCustomerId,
      firstName,
      lastName,
      city,
      street,
      zip,
      country,
    } = createCustomerData;

    const customerDetails = await prisma.customerDetails.create({
      data: {
        orderNumberRef: order.orderNumber,
        customerId,
        email,
        customCustomerId,
        firstName,
        lastName,
        zip,
        city,
        street,
        country,
      },
    });
    if (!customerDetails) {
      throw new Error("Customer details not created");
    }

    return { order, customerDetails };
  });

  return result;
}
