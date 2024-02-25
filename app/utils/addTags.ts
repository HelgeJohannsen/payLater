import { getGraphqlClient } from "./getGraphqlClient";

export async function addTags(
  shop: string,
  admin_graphql_api_id: string,
  orderTags: string[],
  newTag: string
) {
  const newTagArray = orderTags.concat([newTag]);
  await getGraphqlClient(shop)
    .then((client) =>
      client.query({
        data: {
          query: `mutation orderUpdate($input: OrderInput!) {
        orderUpdate(input: $input) {
          order {
            id
            tags
            unpaid
          }
          userErrors {
            field
            message
          }
        }
      }`,
          variables: {
            input: {
              id: admin_graphql_api_id,
              tags: newTagArray,
            },
          },
        },
      })
    )
    .then((response) => {
      // TODO: may need error handeling ?
      // console.log("tags query headers: ", response.headers);
      // console.log("tags query body: ", response.body);
    });
}
