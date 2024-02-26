import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";
import { z } from "zod";
import { getConsorsClient } from "~/consors/api";
import {
  createRefundsDetails,
  getOrderDataToRefund,
} from "~/models/OrderRefund.server";
import type { CreateRefundsDetails } from "~/models/types";
import { addNotes } from "~/utils/addNotes";
import {
  crateNoteMessage,
  getPaymentType,
  transformDateAndAdd30Days,
} from "~/utils/dataMutation";
import type { ConsorsResponse } from "./types";

const refundsSchema = z.object({
  order_id: z.number(),
  created_at: z.string(),
  note: z.string().nullable(),
  transactions: z.array(
    z.object({
      gateway: z.string(),
      amount: z.string(),
    })
  ),
});

export async function webhook_refundsCreate(
  shop: string,
  payload: unknown,
  shopifyAdmin: AdminApiContext<RestResources>,
  session: Session
) {
  const data = payload?.valueOf();
  const refundsDataParsed = refundsSchema.safeParse(data);
  console.log("webhook_refundsCreate - ", data);
  console.log("refundsData parsed - ", refundsDataParsed);

  if (!refundsDataParsed.success)
    return console.error("Error parsing schema data");

  const { created_at, note, order_id, transactions } = refundsDataParsed.data;
  const orderData = await getOrderDataToRefund(order_id.toString());

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

  if (!customerDetails || !fulfilledDetails) {
    await addNotes(
      shopifyAdmin,
      session,
      order_id,
      crateNoteMessage(
        "Refund",
        "ERROR",
        "The order must be fulfilled prior to issuing a refund."
      )
    );
    return console.error("Customer or fulfilled details not found");
  }

  const { billingDate } = fulfilledDetails;
  const { formattedDate } = transformDateAndAdd30Days(created_at);

  const refundsData: CreateRefundsDetails = {
    billingType: "CREDIT_NOTE",
    billingReferenceNumber: orderName,
    dueDate: formattedDate,
    billingDate,
    billingNumber: orderName,
    billingAmount: `-${transactions[0].amount}`,
    billingNetAmount: `-${transactions[0].amount}`,
    paymentType: getPaymentType(paymentMethode),
    receiptNote: note
      ? note
      : `Default message: refund note for OrderNumber ${orderNumber}, amount -${transactions[0].amount}`,
  };

  await createRefundsDetails(orderNumber, refundsData);
  const consorsClient = await getConsorsClient(shop);
  const bankResponse = await consorsClient?.refundOrder({
    applicationReferenceNumber: applicationNumber ?? "",
    countryCode: customerDetails?.country ?? "",
    customerId: customerDetails?.customCustomerId ?? "",
    orderAmount,
    timeStamp: new Date(created_at).toUTCString(),
    billingInfo: refundsData,
    notifyURL: "https://paylater.cpro-server.de/notify/refunds",
  });

  if (bankResponse) {
    const responseData: ConsorsResponse = await bankResponse?.json();

    await addNotes(
      shopifyAdmin,
      session,
      order_id,
      "Refund",
      crateNoteMessage("Refund", responseData.status, responseData.errorMessage)
    );
  }
}
