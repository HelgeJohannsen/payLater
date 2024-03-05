import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { handleRefundsOrder } from "~/models/OrderRefund.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestedURL = new URL(request.url);
  const orderId = requestedURL.searchParams.get("orderId");
  const status = requestedURL.searchParams.get("status");
  console.log("requestedURL refund - ", requestedURL);
  if (orderId === null || status === null) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      },
    );
  }
  await handleRefundsOrder(orderId, status);

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
