import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getOrderWithDetails } from "~/models/order.server";

export const loader: LoaderFunction = async ({ request }) => {
  const requestedURL = new URL(request.url);
  const orderId = requestedURL.searchParams.get("orderId");
  if (orderId === null) {
    throw new Response("Bad Request", {
      status: 400,
    });
  }
  const order = await getOrderWithDetails(orderId);
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
