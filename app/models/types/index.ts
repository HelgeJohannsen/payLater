import type {
  CustomerDetails,
  FulfilledDetails,
  Orders,
  RefundsDetails,
} from "@prisma/client";

export type CreateOrder = Pick<
  Orders,
  | "orderId"
  | "orderNumber"
  | "orderName"
  | "paymentGatewayName"
  | "paymentMethode"
  | "orderAmount"
>;

export type CreateCustomerDetails = Omit<CustomerDetails, "id">;

export type CreateOrderWithCustomerDetails = {
  createOrderData: CreateOrder;
  createCustomerData: CreateCustomerDetails;
};

export type CreateFulfilledDetails = Omit<
  FulfilledDetails,
  "id" | "orderNumberRef"
>;

export type CreateRefundsDetails = Omit<
  RefundsDetails,
  "id" | "orderNumberRef"
>;
