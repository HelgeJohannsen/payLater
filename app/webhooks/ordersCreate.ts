import { z } from "zod";
import { createOrder } from "~/models/order.server";

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
  var paymentMethode = "INVOICE";
  var firstName = "";
  if (parseResult.success) {
    const orderData = parseResult.data;
    // console.log("data", orderData);
    // console.log("shipping_address", orderData?.shipping_address.first_name);
    //if(orderData.payment_gateway_names.includes("Kauf auf Rechnung by Consors Finanz")){spaymentMethode("INVOICE")}
    //if(orderData.payment_gateway_names.includes("Kauf per Lastschrift by Consors Finanz")){spaymentMethode("DIRECT_DEBIT")}
    if (orderData.payment_gateway_names.includes("bogus")) {
      paymentMethode = "INVOICE";
    }
    if (orderData?.shipping_address.first_name) {
      firstName = orderData?.shipping_address.first_name;
    }
    if (
      orderData.payment_gateway_names.includes("bogus") || //Only for test shop
      orderData.payment_gateway_names.includes(
        "Kauf auf Rechnung by Consors Finanz"
      ) ||
      orderData.payment_gateway_names.includes(
        "Kauf per Lastschrift by Consors Finanz"
      ) ||
      orderData.payment_gateway_names.includes(
        "3-Monats-Zahlung by Consors Finanz"
      )
    ) {
      createOrder(
        String(orderData?.id),
        orderData?.name,
        paymentMethode,
        firstName,
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
