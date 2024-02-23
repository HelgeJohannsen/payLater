import type { CustomerDetails, Orders } from "@prisma/client";

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

export type LinkOrderInfo = LinkOrderDetails & {
  customerDetails: LinkCustomerDetails;
};
