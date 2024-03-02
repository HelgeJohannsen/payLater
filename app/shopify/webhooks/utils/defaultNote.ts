import { addNoteToOrder } from "~/shopify/graphql/addNoteToOrder";

export const defaultNote = async (shop: string, orderId: number) => {
  await addNoteToOrder(
    shop,
    orderId.toString(),
    `Further order updates are sent to the bank only if the client's credit check status is ACCEPTED.`,
  );
};
