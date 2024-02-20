import { z } from "zod";
import { getConsorsClient } from "~/consors/api";
import { getApplicationReferenceNumber } from "~/models/OrderCancel.server";
import { isPayLaterPaymentGateway } from "~/utils/paymentGateway";

const orderCancel = z.object({
  id: z.number().transform((num) => num.toString()),
  cancelled_at: z.string().transform((str) => new Date(str).toUTCString()),
  total_price: z.string(),
  payment_gateway_names: z.array(z.string()),
  billing_address: z.object({
    country_code: z.string()
  })
});

export async function webhook_ordersCancel(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  console.log("webhook_ordersCancel - ", data);
  const cancellationData = orderCancel.parse(data);
  console.log("cancellationData parsed - ", cancellationData);
  
  if (isPayLaterPaymentGateway(cancellationData.payment_gateway_names[0])) {

    console.log("isPayLaterPaymentGateway")
    const {billing_address: {country_code}, cancelled_at, id: orderId, total_price} = cancellationData

    const dbResponse = await getApplicationReferenceNumber(orderId)
    console.log("dbResponse", dbResponse)
    if(dbResponse?.applicationNumber) {
      const consorsClient = await getConsorsClient(shop)
      const response = await consorsClient?.stornoOrder(dbResponse?.applicationNumber, country_code, cancelled_at, total_price)
      console.log("bank response", response)
    }
  }
}