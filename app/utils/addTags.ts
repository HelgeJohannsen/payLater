// import { getGraphqlClient } from "./getGraphqlClient";

import { authenticate } from "~/shopify.server";

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
  request: Request,
  orderId: number,
  orderTags: string
) => {
  const { admin, session } = await authenticate.admin(request);

  console.log("request, orderId, orderTags", request, orderId, orderTags);

  const order = new admin.rest.resources.Order({ session: session });

  order.id = orderId;
  order.tags = orderTags;
  await order.save({
    update: true,
  });
};
