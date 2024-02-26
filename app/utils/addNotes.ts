import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

export const addNotes = async (
  shopifyAdmin: AdminApiContext<RestResources>,
  session: Session,
  orderId: number,
  newNote: string
) => {
  const currentOrder = await shopifyAdmin.rest.resources.Order.find({
    session: session,
    id: orderId,
    fields: "id,name,total_price,tags,note,note_attributes",
  });
  if (!currentOrder) return;
  console.log("currentOrder Notes - ", currentOrder);

  const orderNotes = currentOrder.note
    ? `${currentOrder.note} ${newNote}`
    : newNote;

  currentOrder.id = orderId;
  currentOrder.note = orderNotes;
  currentOrder.note_attributes = [
    {
      name: newNote,
    },
    {
      name: `newNote 2`,
    },
  ];

  console.log("Orders Notes after changes - ", currentOrder);

  try {
    await currentOrder.save({
      update: true,
    });
  } catch (error) {
    console.log("error", error);
  }
};
