import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { addNoteToOrder } from "~/shopify/graphql/addNoteToOrder";
import { orderMarkAsPaid } from "~/shopify/graphql/orderMarkAsPaid";
import { setCreditCheck } from "../models/order.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestedURL = new URL(request.url);

  console.log("requestedURL", requestedURL);
  const orderId = requestedURL.searchParams.get("orderId");
  const status = requestedURL.searchParams.get("status");
  const applicationNumber = requestedURL.searchParams.get("applicationNum");

  if (orderId === null || status === null || applicationNumber === null) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      },
    );
  }
  await setCreditCheck(orderId, status, applicationNumber);

  const shop = process.env.SHOPIFY_SHOP;
  if (shop) {
    await orderMarkAsPaid(shop, orderId);
    await addNoteToOrder(
      shop,
      orderId,
      `Client credit check current status: ${status}.`,
    );
  }

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
