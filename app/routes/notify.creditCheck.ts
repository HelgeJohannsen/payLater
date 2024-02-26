import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
// import { authenticate } from "~/shopify.server";
// import { addNotes } from "~/utils/addNotes";
// import { crateNoteMessage } from "~/utils/dataMutation";
import { setCreditCheck } from "../models/order.server";

export const action: ActionFunction = async ({ request }) => {
  console.log("Request - Action credit check", request);
  // const { admin, session } = await authenticate.admin(request);
  // const { shop } = session;
  // const body = await request.formData();
  // await addNotes(
  //   admin,
  //   session,
  //   "Credit Check",
  //   Number(orderId),
  //   crateNoteMessage("Credit Check", status)
  // );
  // return config;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  // const { admin, session } = await authenticate.admin(request);
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

  // await addNotes(
  //   admin,
  //   session,
  //   "Credit Check",
  //   Number(orderId),
  //   crateNoteMessage("Credit Check", status)
  // );

  const response = json("order");
  response.headers.append("Access-Control-Allow-Origin", "*");
  return response;
};
