import { z } from "zod";
import { getConsorsClient } from "~/consors/api";
import { getOrderInfoForCancel } from "~/models/OrderCancel.server";
import { createNoteMessage } from "~/utils/dataMutation";
import { addNoteToOrder } from "../graphql/addNoteToOrder";
import type { ConsorsResponse } from "./types";

const orderCancel = z.object({
  id: z.number(),
  cancelled_at: z.string().transform((str) => new Date(str).toUTCString()),
});

export async function webhook_ordersCancel(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  const cancellationData = orderCancel.parse(data);
  // console.log("webhook_ordersCancel - ", data);
  // console.log("parseResult - ", cancellationData);

  const { cancelled_at, id: orderId } = cancellationData;

  const orderCancelInfo = await getOrderInfoForCancel(orderId.toString());
  if (orderCancelInfo) {
    const { applicationNumber, customerDetails } = orderCancelInfo;
    if (applicationNumber && customerDetails?.country) {
      const consorsClient = await getConsorsClient(shop);
      const bankResponse = await consorsClient?.stornoOrder({
        applicationReferenceNumber: applicationNumber,
        countryCode: customerDetails?.country,
        orderAmount: 0.0,
        timeStamp: cancelled_at,
        notifyURL: "https://paylaterplus.cpro-server.de/notify/cancelOrder",
      });
      if (bankResponse) {
        const responseData: ConsorsResponse = await bankResponse?.json();

        await addNoteToOrder(
          shop,
          orderId.toString(),
          createNoteMessage(
            "Cancellation",
            responseData.status,
            responseData.errorMessage,
          ),
        );
      }
    }
  }
}
