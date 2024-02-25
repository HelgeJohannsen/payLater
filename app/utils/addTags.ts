// import { getGraphqlClient } from "./getGraphqlClient";

import type { Session } from "@shopify/shopify-api";
import type { RestResources } from "@shopify/shopify-api/rest/admin/2024-01";
import type { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/build/ts/server/clients";

// export async function addTags(
//   shop: string,
//   admin_graphql_api_id: string,
//   orderTags: string[]
// ) {
//   console.log(
//     "shop, graphql_api_id, orderTags",
//     shop,
//     admin_graphql_api_id,
//     orderTags
//   );
//   await getGraphqlClient(shop)
//     .then((client) =>
//       client.query({
//         data: {
//           query: `mutation orderUpdate($input: OrderInput!) {
//         orderUpdate(input: $input) {
//           order {
//             id
//             tags
//             unpaid
//           }
//           userErrors {
//             field
//             message
//           }
//         }
//       }`,
//           variables: {
//             input: {
//               id: admin_graphql_api_id,
//               tags: orderTags,
//             },
//           },
//         },
//       })
//     )
//     .then((response) => {
//       // TODO: may need error handeling ?
//       // console.log("tags query headers: ", response.headers);
//       // console.log("tags query body: ", response.body);
//     });
// }

export const addTags = async (
  shopifyAdmin: AdminApiContext<RestResources>,
  orderId: number,
  orderTags: string,
  session: Session
) => {
  const order = new shopifyAdmin.rest.resources.Order({
    session: session,
  });
  console.log("order", order);

  order.id = orderId;
  order.tags = orderTags;
  try {
    await order.save({
      update: true,
    });
  } catch (error) {
    console.log("error", error);
  }
};
