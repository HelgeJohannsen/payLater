import { z } from "zod";
import { getConsorsClient } from "~/consors/api";
import type { BillingInfoRequest } from "~/consors/types";
import {
  createRefundsDetails,
  getOrderDataToRefund,
} from "~/models/OrderRefund.server";
import type { CreateRefundsDetails } from "~/models/types";
import {
  getPaymentType,
  transformDateAndAdd30Days,
} from "~/utils/dataMutation";

const refundsSchema = z.object({
  order_id: z.number().transform((num) => num.toString()),
  created_at: z.string(),
  note: z.string(),
  transactions: z.array(
    z.object({
      gateway: z.string(),
      amount: z.string().transform((num) => Number(num)),
    })
  ),
});

export async function webhook_refundsCreate(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  const refundsDataParsed = refundsSchema.safeParse(data);
  console.log("webhook_refundsCreate - ", data);
  console.log("refundsData parsed - ", refundsDataParsed);

  if (!refundsDataParsed.success) return console.error("Error parsing data");

  const { created_at, note, order_id, transactions } = refundsDataParsed.data;
  const orderData = await getOrderDataToRefund(order_id);

  if (!orderData) return console.error("Order not found!");

  const {
    applicationNumber,
    orderAmount,
    orderName,
    paymentMethode,
    orderNumber,
    customerDetails,
    fulfilledDetails,
  } = orderData;

  if (!customerDetails || !fulfilledDetails)
    return console.log("Error parsing data");

  const { billingDate } = fulfilledDetails;
  const { formattedDate } = transformDateAndAdd30Days(created_at);

  const refundsData: CreateRefundsDetails = {
    billingType: "CREDIT_NOTE",
    billingReferenceNumber: orderName,
    dueDate: formattedDate,
    billingAmount: transactions[0].amount,
    billingNetAmount: transactions[0].amount,
    paymentType: getPaymentType(paymentMethode),
    receiptNote:
      note ??
      `Default message: refund note for OrderNumber ${orderNumber}, amount ${transactions[0].amount}`,
  };

  const refundDataRequest: BillingInfoRequest = {
    ...refundsData,
    billingNumber: orderName,
    billingDate,
  };

  await createRefundsDetails(orderNumber, refundsData);
  const consorsClient = await getConsorsClient(shop);
  await consorsClient?.refundOrder({
    applicationReferenceNumber: applicationNumber ?? "",
    countryCode: customerDetails?.country ?? "",
    customerId: customerDetails?.customCustomerId ?? "",
    orderAmount,
    timeStamp: new Date(created_at).toUTCString(),
    billingInfo: refundDataRequest,
    notifyURL: "https://paylater.cpro-server.de/notify/refunds",
  });
}
