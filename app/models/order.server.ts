import type { CustomerDetails, Orders } from "@prisma/client";
import db from "../db.server";

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

export type CreateOrder = Pick<
  Orders,
  | "orderId"
  | "orderNumber"
  | "orderName"
  | "paymentGatewayName"
  | "paymentMethode"
  | "orderAmount"
  | "customCustomerId"
  | "note"
>;

export type CreateCustomerInfo = Pick<
  CustomerDetails,
  | "customerId"
  | "firstName"
  | "lastName"
  | "zip"
  | "city"
  | "street"
  | "country"
>;

type CreateOrderWithCustomerDetails = {
  createOrderInfo: CreateOrder;
  createCustomerInfo: CreateCustomerInfo;
};

export async function createOrderWithCustomerDetails({
  createCustomerInfo,
  createOrderInfo,
}: CreateOrderWithCustomerDetails) {
  // A transaction ensure both records are created together
  console.log("createCustomerInfo", createCustomerInfo)
  console.log("createOrderInfo", createOrderInfo)
  const result = await db.$transaction(async (prisma) => {
    const {
      orderId,
      orderNumber,
      orderName,
      paymentGatewayName,
      paymentMethode,
      orderAmount,
      note,
      customCustomerId
    } = createOrderInfo;

    const { customerId, firstName, lastName, city, street, zip, country } =
      createCustomerInfo;

    const order = await prisma.orders.create({
      data: {
        orderId,
        orderNumber,
        orderName,
        paymentGatewayName,
        paymentMethode,
        orderAmount,
        customCustomerId: customCustomerId ?? "",
        note: note ?? "",
      },
    });

    console.log("order - ", order)

    if (!order) {
      throw new Error("Order not created");
    }

    const customerDetails = await prisma.customerDetails.create({
      data: {
        orderNumberRef: order.orderNumber,
        customerId,
        firstName,
        lastName,
        zip,
        city,
        street,
        country,
      },
    });
    console.log("customerDetails - ", customerDetails)
    if (!customerDetails) {
      throw new Error("Customer details not created");
    }

    return { order, customerDetails };
  });

  return result;
}
