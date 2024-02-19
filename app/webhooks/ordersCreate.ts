import { z } from "zod";
import { createOrderWithCustomerDetails } from "~/models/order.server";
import { isPayLaterPaymentGateway } from "~/utils/paymentGateway";

const orderCreated = z.object({
  id: z.number(),
  order_number: z.number(),
  name: z.string(),
  payment_gateway_names: z.array(z.string()),
  total_price: z.string(),
  customer: z.object({
    id: z.number(),
    first_name: z.string().nullable(),
    last_name: z.string(),
  }),
  billing_address: z.object({
    zip: z.string(),
    city: z.string(),
    address1: z.string(),
    country_code: z.string(),
  }),
});

export async function webhook_ordersCreate(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  const parseResult = orderCreated.safeParse(data);
  console.log("webbhook_ordersCreate payload:", data);
  if (parseResult.success) {
    const orderData = parseResult.data;
    const paymentMethod = isPayLaterPaymentGateway(
      orderData.payment_gateway_names[0]
    );
    if (paymentMethod && orderData.billing_address.country_code === "DE") {
      const createOrderInfo = {
        orderId: orderData.id.toString(),
        orderNumber: BigInt(orderData.order_number),
        orderName: orderData.name,
        paymentGatewayName: orderData.payment_gateway_names[0],
        paymentMethode: paymentMethod,
        orderAmount: orderData.total_price,
      };
      const createCustomerInfo = {
        customerId: BigInt(orderData.customer.id),
        firstName: orderData.customer.first_name ?? "",
        lastName: orderData.customer.last_name,
        zip: orderData.billing_address.zip,
        city: orderData.billing_address.city,
        street: orderData.billing_address.address1,
        country: orderData.billing_address.country_code,
      };
      createOrderWithCustomerDetails({
        createOrderInfo: createOrderInfo,
        createCustomerInfo: createCustomerInfo,
      });
    }
  } else {
    console.log("Error parsing data", data);
  }
}
