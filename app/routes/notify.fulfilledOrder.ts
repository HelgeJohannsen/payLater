import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { handleOrderFulFilled } from "~/models/OrderFulfillment.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestedURL = new URL(request.url);
  const orderId = requestedURL.searchParams.get("orderId");
  const status = requestedURL.searchParams.get("status");
  const applicationNumber = requestedURL.searchParams.get("applicationNum");
  // const hash = requestedURL.searchParams.get("hash");
  if (orderId === null || status === null || applicationNumber === null) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      }
    );
  }
  await handleOrderFulFilled(orderId, status);

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
