import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { setCreditCheck } from "../models/order.server";

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
  await setCreditCheck(orderId, status, applicationNumber);

  const { admin, session } = await authenticate.admin(request);
  const order = new admin.rest.resources.Order({ session: session });
  order.id = Number(orderId);
  order.note = `${order.note} Customer Credit Check staus ${status}`;
  await order.save({
    update: true,
  });

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
