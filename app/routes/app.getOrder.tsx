import { LoaderFunction, json } from "@remix-run/node";
import { getOrder } from "~/models/order.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log("test")
  const requestedURL = new URL(request.url);
  const orderid = requestedURL.searchParams.get("orderId");
  if (orderid == null) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      }
    );
  }
      const order = await getOrder(orderid)
      if (order == null) {
        throw new Response("shop not found", {
          status: 404,
        });
      }
      const response = json(order);
      response.headers.append("Access-Control-Allow-Origin", "*");
      return response;
  };