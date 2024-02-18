enum PayLaterPaymentMethodOptions {
  "Kauf auf Rechnung by Consors Finanz" = "INVOICE",
  "Kauf per Lastschrift by Consors Finanz" = "DIRECT_DEBIT",
  "3-Monats-Zahlung by Consors Finanz" = "THREE_MONTH_PAYMENT",
  "bogus" = "INVOICE",
}

const isPayLaterPaymentGateway = (paymentGateway: string): string | false => {
  const paymentKey = Object.keys(PayLaterPaymentMethodOptions).find(
    (key) => key === paymentGateway
  );

  return paymentKey
    ? PayLaterPaymentMethodOptions[
        paymentKey as keyof typeof PayLaterPaymentMethodOptions
      ]
    : false;
};

export { isPayLaterPaymentGateway };
