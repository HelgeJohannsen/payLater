import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";
import { getOrder } from "./getOrder";

export const addNotes = async (
  shopifyAdmin: AdminApiContext<RestResources>,
  session: Session,
  orderId: number,
  newNote: string
) => {
  const order = new shopifyAdmin.rest.resources.Order({
    session: session,
  });

  order.id = orderId;
  order.note = `${order.note} ${newNote}`;

  console.log("order", order);

  order.note_attributes = [
    {
      name: "colour",
      value: "red",
    },
  ];

  const testOrder = await getOrder(shopifyAdmin, session, orderId);

  console.log("test Order", testOrder);
  try {
    await order.save({
      update: true,
    });
  } catch (error) {
    console.log("error", error);
  }
};
