import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getOrCreateConfig } from "~/models/config.server";

export const loader: LoaderFunction = async ({ request }) => {
  const requestedURL = new URL(request.url);

  const shop = requestedURL.searchParams.get("shop");
  if (shop === null) {
    throw new Response("Bad Request", {
      status: 400,
    });
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
};
