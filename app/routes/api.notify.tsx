import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { setOrderStatus } from "~/models/order.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // console.log("test")
  // console.log("notify Request:", request.url);
};

export const loader: LoaderFunction = async ({ request, params }) => {
  // console.log("notify loader Request:", request.url);
  const requestedURL = new URL(request.url);
  console.log("requestedURL -- ", requestedURL);
  console.log("params -- ", params);
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
  setOrderStatus(orderId, status, applicationNumber);

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
