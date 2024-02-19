import { z } from "zod";
// import { handleOrderCancel } from "~/models/OrderCancel.server";
// import { isPayLaterPaymentGateway } from "~/utils/checkPaymentGateway";
// import {
//   getCheckout,
//   getCheckoutByOrderId,
// } from "../../../models/checkout.server";
// import { getConsorsClient } from "../../consors/api";

// import {
//   createShopifyOrderCancelUnhandled,
//   incrementCounterShopifyOrderCancelUnhandled,
// } from "~/models/ShopifyOrderCancel.server";

const orderCancel = z.object({
  id: z.number().transform((num) => num.toString()),
  cancelled_at: z.string().transform((str) => new Date(str).toUTCString()),
  total_price: z.string(),
  payment_gateway_names: z.array(z.string()),
  billing_address: z.object({
    country_code: z.string()
  })
});

export async function webhook_ordersCancel(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  console.log("webhook_ordersCancel - ", data);
  const cancellationData = orderCancel.parse(data);
  console.log("cancellationData parsed - ", cancellationData);
  // if (isPayLaterPaymentGateway(cancellationData.payment_gateway_names)) {
  //   handleOrderCancel(cancellationData.id);
  // }
  // console.log("parsed oderData", orderData);
  // if (orderData.tags.includes("Consors Finanzierung")) {
  //   console.log("Cancel order because it is Consors Finanzierung:", orderData);
  //   const createdShopifyOrderCancelUnhandled =
  //     await createShopifyOrderCancelUnhandled(
  //       shop,
  //       orderData.id,
  //       orderData.admin_graphql_api_id,
  //       orderData.current_total_price
  //     );
  //   console.log(
  //     "createdShopifyOrderCanceldUnhandled",
  //     createdShopifyOrderCancelUnhandled
  //   );
  // } else {
  //   console.log("keine Consors Finanzierung");
  // }
}