import { z } from "zod";
import { getConsorsClient } from "~/consors/api";
import {
  createFulfilledDetails,
  getOrderInfoForFulFillment,
} from "~/models/OrderFulfillment.server";
import { getCreditCheckStatus } from "~/models/order.server";
import type { CreateFulfilledDetails } from "~/models/types";
import {
  createNoteMessage,
  getPaymentType,
  transformDateAndAdd30Days,
} from "~/utils/dataMutation";
import { addNoteToOrder } from "../graphql/addNoteToOrder";
import type { ConsorsResponse } from "./types";
import { defaultNote } from "./utils/defaultNote";

const orderFulfilled = z.object({
  id: z.number(),
  updated_at: z.string(),
  note: z.string().nullable(),
});

export async function webhook_ordersPartiallyFulfilled(
  shop: string,
  payload: unknown,
) {
  const data = payload?.valueOf();
  const fulfilledDataObj = orderFulfilled.safeParse(data);
  // console.log("webhook_ordersPartiallyFulfilled", data);
  // console.log("parsed Obj - ", data);

  if (fulfilledDataObj.success) {
    const { updated_at, id: orderId, note } = fulfilledDataObj.data;

    const clientCreditCheckStatus = await getCreditCheckStatus(
      orderId.toString(),
    );
    if (!clientCreditCheckStatus?.confirmCreditStatus?.includes("ACCEPTED")) {
      await defaultNote(shop, orderId);
      return;
    }

    const infoToFulFillOrder = await getOrderInfoForFulFillment(
      orderId.toString(),
    );
    if (infoToFulFillOrder) {
      const {
        applicationNumber,
        customerDetails,
        orderAmount,
        orderName,
        paymentMethode,
        orderNumber,
      } = infoToFulFillOrder;

      const { formattedDate, formattedDatePlus30Days } =
        transformDateAndAdd30Days(updated_at);

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
        timeStamp: new Date(updated_at).toUTCString(),
        billingInfo: fulfilledData,
        notifyURL:
          "https://paylaterplus.cpro-server.de/notify/partiallyFulfilled",
      });
      console.log("Partially Fulfilled bankResponse", bankResponse);
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
    console.log("could not parse partiallyFulfilled date:", data);
  }
}
