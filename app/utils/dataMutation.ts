enum PayLaterPaymentMethodOptions {
  "Kauf auf Rechnung by Consors Finanz" = "INVOICE",
  "Kauf per Lastschrift by Consors Finanz" = "DIRECT_DEBIT",
  "3-Monats-Zahlung by Consors Finanz" = "3_MONTH_PAYMENT",
}

const isPayLaterPaymentGateway = (paymentGateway: string): string | false => {
  const paymentKey = Object.keys(PayLaterPaymentMethodOptions).find(
    (key) => key === paymentGateway,
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
    (key) => key === paymentMethod,
  );

  return PaymentTypeOptions[paymentKey as keyof typeof PaymentTypeOptions];
};

const createCustomCustomerId = (customerId: string) => customerId.slice(-10);

function transformDateAndAdd30Days(dateStr: string) {
  const dateObj = new Date(dateStr);

  const formattedDate = dateObj.toISOString().split("T")[0];

  dateObj.setDate(dateObj.getDate() + 30);
  const formattedDatePlus30Days = dateObj.toISOString().split("T")[0];

  return { formattedDate, formattedDatePlus30Days };
}

function createNoteMessage(
  action: string,
  status: string,
  errorMessage?: string,
  errorCode?: string,
): string {
  return `Bank has been notified of the ${action} request, current status: ${status}. `
    .concat(
      status !== "SUCCESS" && status !== "ACCEPTED"
        ? `Error message: ${errorMessage ?? errorCode ?? ""}.`
        : "",
    )
    .trim();
}

function appendUniqueNote(existingNotes: string, newNote: string): string {
  if (!existingNotes) return newNote;
  if (!existingNotes.includes(newNote)) {
    return `${existingNotes}\n${newNote}`;
  }
  return existingNotes;
}

export {
  appendUniqueNote,
  createCustomCustomerId,
  createNoteMessage,
  getPaymentType,
  isPayLaterPaymentGateway,
  transformDateAndAdd30Days,
};
