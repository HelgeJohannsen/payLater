import type { Config, CustomerDetails, Orders } from "@prisma/client";

export type LinkConfigData = Pick<Config, "vendorId">;

type LinkCustomerDetails = Omit<
  CustomerDetails,
  "id" | "customerId" | "customCustomerId" | "email" | "orderNumberRef"
>;
type LinkOrderDetails = Pick<
  Orders,
  | "orderId"
  | "paymentGatewayName"
  | "paymentMethode"
  | "orderAmount"
  | "confirmCreditStatus"
>;

export type LinkOrderData = LinkOrderDetails & {
  customerDetails: LinkCustomerDetails;
};
