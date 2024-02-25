// import type { GraphqlClientParams } from "@shopify/shopify-api";
// import { shopifyApi } from "@shopify/shopify-api";
// import { LATEST_API_VERSION } from "@shopify/shopify-app-remix";
// import "@shopify/shopify-app-remix/adapters/node";

// const appHostName = process.env.SHOPIFY_APP_URL;

// const api = shopifyApi({
//   apiKey: process.env.SHOPIFY_API_KEY,
//   apiSecretKey:
//     process.env.SHOPIFY_API_SECRET || "fe93e07b0e2bf2a7fe45cbacd0d3a907",
//   apiVersion: LATEST_API_VERSION,
//   scopes: process.env.SCOPES?.split(","),
//   hostName: appHostName!,
//   isEmbeddedApp: true,
// });

// export function getGraphqlClient(shop: string) {
//   console.log("shop", shop);
//   // might throw an exception, if no session for the shop exists
//   return prisma.session.findFirst({ where: { shop } }).then((session) => {
//     console.log("session", session);
//     if (session == null) {
//       throw "no session for given shop"; // TODO: handle exception
//     }
//     const graphQlClient = new api.clients.Graphql({
//       session: session as unknown as GraphqlClientParams["session"],
//     }); // TODO: convert types if neccessary
//     console.log("graphQLClient ", graphQlClient);
//     return graphQlClient;
//   });
// }
