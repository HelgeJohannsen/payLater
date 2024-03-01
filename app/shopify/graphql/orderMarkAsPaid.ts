import { getGraphqlClient } from "./getGraphqlClient";

export async function orderMarkAsPaid(shop: string, orderId: string) {
  const graphQlClient = await getGraphqlClient(shop);

  await graphQlClient.request(
    `mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
    orderMarkAsPaid(input: $input) {
      order {
        unpaid
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
        },
      },
    },
  );
}
