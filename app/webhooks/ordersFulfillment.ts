import { z } from "zod";

import { getConsorsClient } from "~/consors/api";
import {
  createFulfilledDetails,
  getOrderInfoForFulFillment,
} from "~/models/OrderFulfillment.server";
import type { CreateFulfilledDetails } from "~/models/types";
import {
  getPaymentType,
  transformDateAndAdd30Days,
} from "~/utils/dataMutation";

const orderFulfilled = z.object({
  id: z.number().transform((num) => num.toString()),
  closed_at: z.string(),
  note: z.string().nullable(),
});

export async function webhook_ordersFulfillment(
  shop: string,
  payload: unknown
) {
  const data = payload?.valueOf();
  const fulfilledDataObj = orderFulfilled.safeParse(data);
  // console.log("webhook_ordersFulfillment", data);
  // console.log("fulfilledDataObj parsed - ", data);

  if (fulfilledDataObj.success) {
    const { closed_at, id: orderId, note } = fulfilledDataObj.data;
    const infoToFulFillOrder = await getOrderInfoForFulFillment(orderId);
    if (infoToFulFillOrder) {
      const {
        applicationNumber,
        orderAmount,
        orderName,
        paymentMethode,
        orderNumber,
        customerDetails,
      } = infoToFulFillOrder;

      const { formattedDate, formattedDatePlus30Days } =
        transformDateAndAdd30Days(closed_at);

      const fulfilledData: CreateFulfilledDetails = {
        billingType: "INVOICE",
        billingNumber: orderName,
        billingDate: formattedDate,
        billingReferenceNumber: "",
        dueDate: formattedDatePlus30Days,
        billingAmount: orderAmount,
        billingNetAmount: orderAmount,
        paymentType: getPaymentType(paymentMethode),
        receiptNote: note ?? `Billing note for OrderNumber ${orderNumber}`,
      };

      await createFulfilledDetails(orderNumber, fulfilledData);
      const consorsClient = await getConsorsClient(shop);
      await consorsClient?.fulfillmentOrder({
        applicationReferenceNumber: applicationNumber ?? "",
        countryCode: customerDetails?.country ?? "",
        customerId: customerDetails?.customCustomerId ?? "",
        orderAmount,
        timeStamp: new Date(closed_at).toUTCString(),
        billingInfo: fulfilledData,
        notifyURL: "https://paylater.cpro-server.de/notify/fulfilledOrder",
      });
    }
  } else {
    console.log("could not parse fullfilment date:", data);
  }
}
