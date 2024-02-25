import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const addTags = async (
  shopifyAdmin: AdminApiContext<RestResources>,
  orderId: number,
  orderNotes: string,
  session: Session
) => {
  const order = new shopifyAdmin.rest.resources.Order({
    session: session,
  });
  order.id = orderId;
  order.note = orderNotes;
  try {
    await order.save({
      update: true,
    });
  } catch (error) {
    console.log("error", error);
  }
};
