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

  const consorsLink = new URLSearchParams({
    vendorID: vendorId,
    orderID: orderId,
    paymentMethode,
    order_amount: orderAmount.toString(),
    // firstName: customerDetails.firstName,
    // lastName: customerDetails.lastName,
    zip: customerDetails.zip,
    city: customerDetails.city,
    street: customerDetails.street,
    country: customerDetails.country,
    firstName: "Test",
    lastName: "Approval",
    returntocheckoutURL: `${storefrontUrl}/account/orders`,
    notifyURL: `https://paylater.cpro-server.de/notify/creditCheck`,
    failureURL: `${storefrontUrl}/account/orders`,
  });

  return consorsLink;
};
