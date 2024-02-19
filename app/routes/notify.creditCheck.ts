import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { setCreditCheck } from "../models/order.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const requestedURL = new URL(request.url);
  console.log("requestedURL -- ", requestedURL);
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
  setCreditCheck(orderId, status, applicationNumber);

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
