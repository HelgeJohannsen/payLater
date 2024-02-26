import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const addNotes = async (
  shopifyAdmin: AdminApiContext<RestResources>,
  session: Session,
  action: string,
  orderId: number,
  newNote: string
) => {
  const currentOrder = await shopifyAdmin.rest.resources.Order.find({
    session: session,
    id: orderId,
    fields: "id,name,total_price,tags,note,note_attributes",
  });
  console.log("ACtion - currentOrder - ", action, currentOrder);
  if (!currentOrder) return;

  if (!currentOrder.note_attributes) {
    currentOrder.note_attributes = [
      {
        name: action ?? "default",
        value: newNote,
      },
    ];
  } else {
    currentOrder.note_attributes?.push({
      name: action ?? "test",
      value: newNote,
    });
  }

  try {
    await currentOrder.save({
      update: true,
    });
  } catch (error) {
    console.log("error", error);
  }
};
