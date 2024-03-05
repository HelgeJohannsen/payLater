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

  if (!fulfilledDataObj.success)
    return console.error("Error parsing schema data");

  const { created_at, id: orderId, note } = fulfilledDataObj.data;

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

  if (!infoToFulFillOrder)
    return console.error("OrderData to fulfillment not found");

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

  const test = {
    applicationReferenceNumber: applicationNumber ?? "",
    countryCode: customerDetails?.country ?? "",
    customerId: customerDetails?.customCustomerId ?? "",
    orderAmount,
    timeStamp: new Date(created_at).toUTCString(),
    billingInfo: fulfilledData,
    notifyURL: "https://paylater.cpro-server.de/notify/fulfilledOrder",
  };

  console.log("fulfilledData - ", test);

  await createFulfilledDetails(orderNumber, fulfilledData);
  const consorsClient = await getConsorsClient(shop);
  const bankResponse = await consorsClient?.fulfillmentOrder({
    applicationReferenceNumber: applicationNumber ?? "",
    countryCode: customerDetails?.country ?? "",
    customerId: customerDetails?.customCustomerId ?? "",
    orderAmount,
    timeStamp: new Date(created_at).toUTCString(),
    billingInfo: fulfilledData,
    notifyURL: "https://paylater.cpro-server.de/notify/fulfilledOrder",
  });

  console.log("Fulfilled bankResponse", await bankResponse?.json());

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
