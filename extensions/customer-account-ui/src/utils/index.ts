import type { LinkConfigData, LinkOrderData } from "../types";

enum PayLaterPaymentMethodOptions {
  "Kauf auf Rechnung by Consors Finanz",
  "Kauf per Lastschrift by Consors Finanz",
  "3-Monats-Zahlung by Consors Finanz",
}

export const isPayLaterPaymentGateway = (
  paymentGateway: string,
): string | false => {
  const paymentKey = Object.keys(PayLaterPaymentMethodOptions).find(
    (key) => key === paymentGateway,
  );

  return paymentKey ?? false;
};

export const getConsorsLink = (
  orderData: LinkOrderData,
  appSettings: LinkConfigData,
  storefrontUrl: string,
): URLSearchParams => {
  const { customerDetails, orderAmount, orderId, paymentMethode } = orderData;
  const { vendorId } = appSettings;
  const { city, country, street, zip } = customerDetails;

  const consorsLink = new URLSearchParams({
    vendorID: vendorId,
    orderID: orderId,
    order_amount: orderAmount.toString(),
    paymentMethode,
    firstName: "Test",
    lastName: "Approval",
    zip,
    city,
    street,
    country,
    returntocheckoutURL: `${storefrontUrl}/account/orders`,
    notifyURL: `https://paylater.cpro-server.de/notify/creditCheck`,
    failureURL: `${storefrontUrl}/account/orders`,
  });

  return consorsLink;
};
