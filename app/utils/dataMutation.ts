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

enum PaymentTypeOptions {
  "DIRECT_DEBIT" = "DIRECT_DEBIT",
  "THREE_MONTH_PAYMENT" = "DIRECT_DEBIT",
  "INVOICE" = "BANK_TRANSFER",
}

const getPaymentType = (paymentMethod: string): string => {
  const paymentKey = Object.keys(PaymentTypeOptions).find(
    (key) => key === paymentMethod
  );

  return PayLaterPaymentMethodOptions[
    paymentKey as keyof typeof PayLaterPaymentMethodOptions
  ]
}

const createCustomCustomerId = (orderNumber: string, customerId: string) => {
  const lastFiveOrderNumber = orderNumber.slice(-5);
  const lastFiveCustomerId = customerId.slice(-5);

  return `${lastFiveOrderNumber}${lastFiveCustomerId}`
}

function transformDateAndAdd30Days(dateStr: string) {
  const dateObj = new Date(dateStr);
  
  const formattedDate = dateObj.toISOString().split('T')[0];
  
  dateObj.setDate(dateObj.getDate() + 30);
  const formattedDatePlus30Days = dateObj.toISOString().split('T')[0];
  
  return {formattedDate, formattedDatePlus30Days};
}

export { createCustomCustomerId, getPaymentType, isPayLaterPaymentGateway, transformDateAndAdd30Days };

