import type { ActionFunctionArgs } from "@remix-run/node";
import { webbhook_oredersCancel } from "~/webhooks/ordersCancel";
import { webbhook_ordersCreate } from "~/webhooks/ordersCreate";
import { webbhook_ordersFulfillment } from "~/webhooks/ordersFulfillment";
import { webbhook_ordersPartiallyFulFilled } from "~/webhooks/ordersPartiallyFulFilled";
import db from "../db.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );
  //const { admin } = await authenticate.admin(request);
  if (session == undefined) {
    console.log("session not registered:", session);
  }
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "ORDERS_CREATE":
      webbhook_ordersCreate(shop, payload);
      return new Response("webhook ORDERS_CREATE", { status: 200 });

    case "ORDERS_FULFILLED":
      webbhook_ordersFulfillment(shop, payload);
      return new Response("webhook ORDERS_FULFILLED", { status: 200 });

    case "ORDERS_PARTIALLY_FULFILLED":
      webbhook_ordersPartiallyFulFilled(shop, payload);
      return new Response("webhook ORDERS_PARTIALLY_FULFILLED", {
        status: 200,
      });

    case "ORDERS_CANCELLED":
      webbhook_oredersCancel(shop, payload);
      return new Response("webhook ORDERS_CANCELLED", { status: 200 });

    case "APP_UNINSTALLED":
      if (session) {
        console.log("delete session");
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
