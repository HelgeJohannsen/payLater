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

type CreateOrder = Pick<
  Orders,
  | "orderId"
  | "orderNumber"
  | "orderName"
  | "paymentGatewayName"
  | "paymentMethode"
  | "orderAmount"
>;

type createCustomerInfo = Pick<
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
  createCustomerInfo: createCustomerInfo;
};

export async function createOrderWithCustomerDetails({
  createCustomerInfo,
  createOrderInfo,
}: CreateOrderWithCustomerDetails) {
  console.log(
    "createOrderWithCustomerDetails - createCustomerInfo, createOrderInfo",
    createCustomerInfo,
    createOrderInfo
  );
  // A transaction ensure both records are created together
  const result = await db.$transaction(async (prisma) => {
    console.log("createOrderWithCustomerDetails inside");
    const {
      orderId,
      orderNumber,
      orderName,
      paymentGatewayName,
      paymentMethode,
      orderAmount,
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
      },
    });
    console.log("createOrderWithCustomerDetails order", order);

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
    console.log(
      "createOrderWithCustomerDetails customerDetails",
      customerDetails
    );

    if (!customerDetails) {
      throw new Error("Customer details not created");
    }

    return { order, customerDetails };
  });

  return result;
}
