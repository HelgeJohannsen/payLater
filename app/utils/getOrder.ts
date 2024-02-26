import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const getOrder = async (
  shopifyAdmin: AdminApiContext<RestResources>,
  session: Session,
  orderId: number
) => {
  const order = await shopifyAdmin.rest.resources.Order.find({
    session: session,
    id: orderId,
    fields: "id,line_items,name,total_price",
  });
  console.log("order getOrder", order);

  return order;
};
