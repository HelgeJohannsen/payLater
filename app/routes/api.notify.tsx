import { LoaderFunction, json, ActionFunctionArgs } from "@remix-run/node";
import { setOrderStatus } from "~/models/order.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("test")
  console.log("notify Request:", request.url);
}

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log("notify loader Request:", request.url);
  const requestedURL = new URL(request.url);
  const orderID = requestedURL.searchParams.get("orderID");
  const status = requestedURL.searchParams.get("status");
  if (orderID == null || status == null ) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      }
    );
  }
  setOrderStatus(orderID,status)
 
  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
  }