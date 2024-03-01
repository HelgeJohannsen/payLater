import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { handleOrderPartiallyFulfilled } from "~/models/OrderPartiallyFulfilled.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestedURL = new URL(request.url);
  const orderId = requestedURL.searchParams.get("orderId");
  const status = requestedURL.searchParams.get("status");

  if (orderId === null || status === null) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      },
    );
  }
  await handleOrderPartiallyFulfilled(orderId, status);

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
