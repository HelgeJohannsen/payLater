import { z } from "zod";
import type { FulFillmentBillingInfo } from "~/consors/api";
import { getConsorsClient } from "~/consors/api";
import {
  getOrderInfoForFulFillment,
  updateBillingWithFulFillData,
} from "~/models/OrderFulfillment.server";
import {
  getPaymentType,
  transformDateAndAdd30Days,
} from "~/utils/dataMutation";

const orderFulfilled = z.object({
  id: z.number().transform((num) => num.toString()),
  updated_at: z.string(),
  note: z.string().nullable(),
});

export async function webhook_ordersPartiallyFulfilled(
  shop: string,
  payload: unknown
) {
  const data = payload?.valueOf();
  console.log("webhook_ordersPartiallyFulfilled", data);
  const fulfilledDataObj = orderFulfilled.safeParse(data);
  console.log("parsed Obj - ", data);

  if (fulfilledDataObj.success) {
    const { updated_at, id: orderId, note } = fulfilledDataObj.data;
    const infoToFulFillOrder = await getOrderInfoForFulFillment(orderId);
    if (infoToFulFillOrder) {
      const {
        applicationNumber,
        customCustomerId,
        customerDetails,
        orderAmount,
        orderName,
        paymentMethode,
        orderNumber,
      } = infoToFulFillOrder;

      const { formattedDate, formattedDatePlus30Days } =
        transformDateAndAdd30Days(updated_at);

      const billingInfo: FulFillmentBillingInfo = {
        billingType: "INVOICE",
        billingNumber: orderName,
        billingDate: formattedDate,
        billingReferenceNumber: "",
        dueDate: formattedDatePlus30Days,
        billingAmount: orderAmount,
        paymentType: getPaymentType(paymentMethode),
        receiptNote: note ?? `Billing note for OrderNumber ${orderNumber}`,
      };

      await updateBillingWithFulFillData(orderNumber, billingInfo);
      const consorsClient = await getConsorsClient(shop);
      await consorsClient?.fulfillmentOrder({
        applicationReferenceNumber: applicationNumber ?? "",
        countryCode: customerDetails?.country ?? "",
        customCustomerId: customCustomerId ?? "",
        orderAmount,
        timeStamp: new Date(updated_at).toUTCString(),
        billingInfo,
        notifyURL: "https://paylater.cpro-server.de/notify/partiallyFulfilled",
      });
    }
  } else {
    console.log("could not parse partiallyFulfilled date:", data);
  }
}
