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
  const { customerDetails, orderAmount, paymentMethode, orderName } = orderData;
  const { vendorId, customerAccountNumber } = appSettings;
  const { city, country, street, zip, firstName, lastName } = customerDetails;

  const consorsLink = new URLSearchParams({
    vendorID: vendorId,
    orderID: orderName,
    order_amount: orderAmount.toString(),
    customerAccountNumber,
    paymentMethode,
    firstName,
    lastName,
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
