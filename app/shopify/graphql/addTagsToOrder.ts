import { getGraphqlClient } from "./getGraphqlClient";

export async function addTagsToOrder(
  shop: string,
  orderId: string,
  newTag: string,
) {
  const graphQlClient = await getGraphqlClient(shop);

  await graphQlClient.request(
    `mutation tagsAdd($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) {
      node {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
    {
      variables: {
        id: `gid://shopify/Order/${orderId}`,
        tags: newTag,
      },
    },
  );
}
