import { appendUniqueNote } from "~/utils/dataMutation";
import { getGraphqlClient } from "./getGraphqlClient";

type OrderData = {
  data: {
    order: {
      id: string;
      note?: string | null;
    };
  };
};

export async function addNoteToOrder(
  shop: string,
  orderId: string,
  newNote: string,
) {
  console.log("shop, orderId, newNote", shop, orderId, newNote);
  const graphQlClient = await getGraphqlClient(shop);

  const fetchResult = await graphQlClient.request(
    `query getOrder($id: ID!) {
    order(id: $id) {
      id
      note
    }
  }`,
    {
      variables: {
        id: `gid://shopify/Order/${orderId}`,
      },
    },
  );

  const {
    data: { order },
  } = fetchResult as unknown as OrderData;

  console.log("fetchResult", fetchResult);
  console.log("order ", order);

  await graphQlClient.request(
    `mutation orderUpdate($input: OrderInput!) {
    orderUpdate(input: $input) {
      order {
        id
        note
      }
      userErrors {
        field
        message
      }
    }
  }`,
    {
      variables: {
        input: {
          id: `gid://shopify/Order/${orderId}`,
          note: appendUniqueNote(order.note ?? "", newNote),
        },
      },
    },
  );
}
