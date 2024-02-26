import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";
import { z } from "zod";

import { getConsorsClient } from "~/consors/api";
import {
  createFulfilledDetails,
  getOrderInfoForFulFillment,
} from "~/models/OrderFulfillment.server";
import type { CreateFulfilledDetails } from "~/models/types";
import { addNotes } from "~/utils/addNotes";
import {
  crateNoteMessage,
  getPaymentType,
  transformDateAndAdd30Days,
} from "~/utils/dataMutation";
import type { ConsorsResponse } from "./types";

const orderFulfilled = z.object({
  id: z.number(),
  closed_at: z.string(),
  note: z.string().nullable(),
});

export async function webhook_ordersFulfillment(
  shop: string,
  payload: unknown,
  shopifyAdmin: AdminApiContext<RestResources>,
  session: Session
) {
  const data = payload?.valueOf();
  const fulfilledDataObj = orderFulfilled.safeParse(data);
  // console.log("webhook_ordersFulfillment", data);
  // console.log("fulfilledDataObj parsed - ", data);

  if (fulfilledDataObj.success) {
    const { closed_at, id: orderId, note } = fulfilledDataObj.data;
    const infoToFulFillOrder = await getOrderInfoForFulFillment(
      orderId.toString()
    );
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
      const bankResponse = await consorsClient?.fulfillmentOrder({
        applicationReferenceNumber: applicationNumber ?? "",
        countryCode: customerDetails?.country ?? "",
        customerId: customerDetails?.customCustomerId ?? "",
        orderAmount,
        timeStamp: new Date(closed_at).toUTCString(),
        billingInfo: fulfilledData,
        notifyURL: "https://paylater.cpro-server.de/notify/fulfilledOrder",
      });

      if (bankResponse) {
        const responseData: ConsorsResponse = await bankResponse?.json();

        await addNotes(
          shopifyAdmin,
          session,
          orderId,
          crateNoteMessage(
            "Fulfillment",
            responseData.status,
            responseData.errorMessage
          )
        );
      }
    }
  } else {
    console.log("could not parse fullfilment date:", data);
  }
}
