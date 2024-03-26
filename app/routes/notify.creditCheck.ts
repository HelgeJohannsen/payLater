import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { addNoteToOrder } from "~/shopify/graphql/addNoteToOrder";
import { orderMarkAsPaid } from "~/shopify/graphql/orderMarkAsPaid";
import { setCreditCheck } from "../models/order.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestedURL = new URL(request.url);
  const orderName = requestedURL.searchParams.get("orderId");
  const status = requestedURL.searchParams.get("status");
  const applicationNumber = requestedURL.searchParams.get("applicationNum");
  // const hash = requestedURL.searchParams.get("hash");

  if (orderName === null || status === null || applicationNumber === null) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      },
    );
  }
  await setCreditCheck(orderName, status, applicationNumber);

  const shop = process.env.SHOPIFY_SHOP;
  if (shop) {
    await orderMarkAsPaid(shop, orderName);
    await addNoteToOrder(
      shop,
      orderName,
      `Client credit check current status: ${status}.`,
    );
  }

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
