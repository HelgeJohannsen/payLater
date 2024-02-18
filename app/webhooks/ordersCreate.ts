import { z } from "zod";
import { createOrder } from "~/models/order.server";
import { isPayLaterPaymentGateway } from "~/utils/paymentGateway";

const orderCreated = z.object({
  id: z.number(),
  name: z.string(),
  payment_gateway_names: z.string().array(),
  shipping_address: z.object({
    first_name: z.string().nullish(),
    last_name: z.string(),
    zip: z.string(),
    city: z.string(),
    address1: z.string(),
  }),
});

export async function webbhook_oredersCreate(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  const parseResult = orderCreated.safeParse(data);
  console.log("webbhook_oredersCreate payload:", data);
  if (parseResult.success) {
    const orderData = parseResult.data;
    const paymentMethod = isPayLaterPaymentGateway(
      orderData.payment_gateway_names[0]
    );
    if (paymentMethod) {
      createOrder(
        String(orderData?.id),
        orderData?.name,
        paymentMethod,
        orderData?.shipping_address?.first_name ?? "",
        orderData?.shipping_address.last_name,
        orderData?.shipping_address.zip,
        orderData?.shipping_address.city,
        orderData?.shipping_address.address1,
        "DE"
      );
    }
  } else {
    console.log("Error parsing data", data);
  }
}
