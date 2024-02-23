import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getOrCreateConfig } from "~/models/config.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestedURL = new URL(request.url);
  const shop = requestedURL.searchParams.get("shop");
  if (shop == null) {
    throw new Response(
      "Bad Request" /*", query parameter shop is mandatory"*/,
      {
        status: 400,
      }
    );
  }
  const config = await getOrCreateConfig(shop);
  if (config == null) {
    throw new Response("shop not found", {
      status: 404,
    });
  }
  const response = json(config);
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
}
