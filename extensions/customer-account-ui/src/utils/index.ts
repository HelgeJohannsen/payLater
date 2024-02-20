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
