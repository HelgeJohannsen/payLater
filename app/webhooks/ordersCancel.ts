import { z } from "zod";
import { getConsorsClient } from "~/consors/api";
import { getOrderCancelInfo } from "~/models/OrderCancel.server";

const orderCancel = z.object({
  id: z.number().transform((num) => num.toString()),
  cancelled_at: z.string().transform((str) => new Date(str).toUTCString()),
});

export async function webhook_ordersCancel(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  // console.log("webhook_ordersCancel - ", data);
  const cancellationData = orderCancel.parse(data);
  // console.log("cancellationData parsed - ", cancellationData);

  const { cancelled_at, id: orderId } = cancellationData;

  const orderCancelInfo = await getOrderCancelInfo(orderId);
  if (orderCancelInfo) {
    const { applicationNumber, customerDetails } = orderCancelInfo;
    if (applicationNumber && customerDetails?.country) {
      const consorsClient = await getConsorsClient(shop);
      const response = await consorsClient?.stornoOrder({
        applicationReferenceNumber: applicationNumber,
        countryCode: customerDetails?.country,
        orderAmount: "0.0",
        timeStamp: cancelled_at,
      });
      console.log("bank response", response);
    }
  }
}
