import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getOrder } from "~/models/order.server";

export const loader: LoaderFunction = async ({ request }) => {
  const requestedURL = new URL(request.url);
  const orderid = requestedURL.searchParams.get("orderId");
  if (orderid == null) {
    throw new Response("Bad Request", {
      status: 400,
    });
  }
  const order = await getOrder(orderid);
  if (order == null) {
    throw new Response("shop not found", {
      status: 404,
    });
  }

  return json(order, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};
