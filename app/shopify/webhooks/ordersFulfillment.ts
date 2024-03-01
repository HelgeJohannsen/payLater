import { z } from "zod";

import { getConsorsClient } from "~/consors/api";
import {
  createFulfilledDetails,
  getOrderInfoForFulFillment,
} from "~/models/OrderFulfillment.server";
import type { CreateFulfilledDetails } from "~/models/types";
import {
  createNoteMessage,
  getPaymentType,
  transformDateAndAdd30Days,
} from "~/utils/dataMutation";
import { addNoteToOrder } from "../graphql/addNoteToOrder";
import type { ConsorsResponse } from "./types";

const orderFulfilled = z.object({
  id: z.number(),
  created_at: z.string(),
  note: z.string().nullable(),
});

export async function webhook_ordersFulfillment(
  shop: string,
  payload: unknown,
) {
  const data = payload?.valueOf();
  const fulfilledDataObj = orderFulfilled.safeParse(data);
  // console.log("webhook_ordersFulfillment", data);
  // console.log("fulfilledDataObj parsed - ", data);

  if (fulfilledDataObj.success) {
    const { created_at, id: orderId, note } = fulfilledDataObj.data;
    const infoToFulFillOrder = await getOrderInfoForFulFillment(
      orderId.toString(),
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
        transformDateAndAdd30Days(created_at);

      const fulfilledData: CreateFulfilledDetails = {
        billingType: "INVOICE",
        billingNumber: orderName,
        billingDate: formattedDate,
        billingReferenceNumber: "",
        dueDate: formattedDatePlus30Days,
        billingAmount: orderAmount,
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
        timeStamp: new Date(created_at).toUTCString(),
        billingInfo: fulfilledData,
        notifyURL: "https://paylaterplus.cpro-server.de/notify/fulfilledOrder",
      });

      if (bankResponse) {
        const responseData: ConsorsResponse = await bankResponse?.json();
        await addNoteToOrder(
          shop,
          orderId.toString(),
          createNoteMessage(
            "Fulfillment",
            responseData.status,
            responseData.errorMessage,
          ),
        );
      }
    }
  } else {
    console.log("could not parse fullfilment date:", data);
  }
}
