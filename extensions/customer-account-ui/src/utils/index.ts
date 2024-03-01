import type { LinkConfigData, LinkOrderData } from "../types";

enum PayLaterPaymentMethodOptions {
  "Kauf auf Rechnung by Consors Finanz",
  "Kauf per Lastschrift by Consors Finanz",
  "3-Monats-Zahlung by Consors Finanz",
}

export const isPayLaterPaymentGateway = (
  paymentGateway: string
): string | false => {
  const paymentKey = Object.keys(PayLaterPaymentMethodOptions).find(
    (key) => key === paymentGateway
  );

  return paymentKey ?? false;
};

export const getConsorsLink = (
  orderData: LinkOrderData,
  appSettings: LinkConfigData,
  storefrontUrl: string
): URLSearchParams => {
  const { customerDetails, orderAmount, orderId, paymentMethode } = orderData;
  const { customerAccountNumber, vendorId } = appSettings;

  const consorsLink = new URLSearchParams({
    vendorID: vendorId,
    orderID: orderId,
    customerAccountNumber,
    paymentMethode,
    order_amount: orderAmount.toString(),
    ...customerDetails,
    returntocheckoutURL: `${storefrontUrl}/account/orders`,
    notifyURL: `https://paylater.cpro-server.de/notify/creditCheck`,
    failureURL: `${storefrontUrl}/account/orders`,
  });

  return consorsLink;
};
