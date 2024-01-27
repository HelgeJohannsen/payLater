import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { z } from "zod";
import { createOrder } from "~/models/order.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );
    console.log("session:", session)
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }
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
    }
    )
  });
  

  switch (topic) {
    case "ORDERS_CREATE":
      console.log("payload:",payload) 
      const data = payload?.valueOf();
      const parseResult = orderCreated.safeParse(data); 
      console.log(data) 
      var paymentMethode = "INVOICE"
      if (parseResult.success) {
        const orderData = parseResult.data;
        console.log("data", orderData) 
        console.log("shipping_address",orderData?.shipping_address.first_name) 
        //if(orderData.payment_gateway_names.includes("Kauf auf Rechnung by Consors Finanz")){spaymentMethode("INVOICE")}
        //if(orderData.payment_gateway_names.includes("Kauf per Lastschrift by Consors Finanz")){spaymentMethode("DIRECT_DEBIT")}
        if(orderData.payment_gateway_names.includes("bogus")){paymentMethode = "INVOICE"}
        createOrder(
          String(orderData?.id),
          orderData?.name,
          paymentMethode,
          orderData?.shipping_address.first_name,
          orderData?.shipping_address.last_name,
          orderData?.shipping_address.zip,
          orderData?.shipping_address.city,
          orderData?.shipping_address.address1,
          "DE",
        )
      }else{
        console.log("Error parsing data", data) 
      }
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
