enum PayLaterPaymentMethodOptions {
  "Kauf auf Rechnung by Consors Finanz" = "INVOICE",
  "Kauf per Lastschrift by Consors Finanz" = "DIRECT_DEBIT",
  "3-Monats-Zahlung by Consors Finanz" = "3_MONTH_PAYMENT",
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
  "3_MONTH_PAYMENT" = "DIRECT_DEBIT",
  "INVOICE" = "BANK_TRANSFER",
}

const getPaymentType = (paymentMethod: string): string => {
  const paymentKey = Object.keys(PaymentTypeOptions).find(
    (key) => key === paymentMethod
  );

  return PaymentTypeOptions[paymentKey as keyof typeof PaymentTypeOptions];
};

const createCustomCustomerId = (orderNumber: string, customerId: string) => {
  const lastFiveOrderNumber = orderNumber.slice(-5);
  const lastFiveCustomerId = customerId.slice(-5);

  return `${lastFiveOrderNumber}${lastFiveCustomerId}`;
};

function transformDateAndAdd30Days(dateStr: string) {
  const dateObj = new Date(dateStr);

  const formattedDate = dateObj.toISOString().split("T")[0];

  dateObj.setDate(dateObj.getDate() + 30);
  const formattedDatePlus30Days = dateObj.toISOString().split("T")[0];

  return { formattedDate, formattedDatePlus30Days };
}

function getOrderTagsAsStr(tags: string | string[] | null) {
  if (!tags) return "Pay Later";
  if (Array.isArray(tags)) return tags.concat("Pay Later").join();
  return `${tags}, Pay Later`;
}

function crateNoteMessage(
  action: string,
  status: string,
  errorMessage?: string,
  errorCode?: string
): string {
  return `Bank has been notified of the ${action} request, current status: ${status}.`.concat(
    status !== "SUCCESS"
      ? `Error message: ${errorMessage ?? errorCode ?? ""}`
      : ""
  );
}

export {
  crateNoteMessage,
  createCustomCustomerId,
  getOrderTagsAsStr,
  getPaymentType,
  isPayLaterPaymentGateway,
  transformDateAndAdd30Days,
};
