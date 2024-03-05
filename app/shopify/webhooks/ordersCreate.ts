import { z } from "zod";
import { createOrderWithCustomerDetails } from "~/models/order.server";
import type { CreateCustomerDetails, CreateOrder } from "~/models/types";
import {
  createCustomCustomerId,
  isPayLaterPaymentGateway,
} from "~/utils/dataMutation";
import { addTagsToOrder } from "../graphql/addTagsToOrder";

const orderCreateSchema = z.object({
  id: z.number(),
  admin_graphql_api_id: z.string(),
  tags: z.union([z.string(), z.array(z.string())]).nullable(),
  email: z.string(),
  order_number: z.number().transform((num) => num.toString()),
  name: z.string(),
  payment_gateway_names: z.array(z.string()),
  total_price: z.string().transform((num) => Number(num)),
  customer: z.object({
    id: z.number().transform((num) => num.toString()),
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
  console.log("ordersCreate rended");
  const data = payload?.valueOf();
  const parseResult = orderCreateSchema.safeParse(data);
  // console.log("webhook_ordersCreate", data);
  // console.log("parseResult - ", parseResult);
  if (!parseResult.success)
    return console.error("Error parsing create webhook order");

  const orderData = parseResult.data;
  const paymentMethod = isPayLaterPaymentGateway(
    orderData.payment_gateway_names[0],
  );

  if (!paymentMethod || orderData.billing_address.country_code !== "DE")
    return console.error("PaymentMethod or country code not found");

  const createOrderData: CreateOrder = {
    orderId: orderData.id.toString(),
    orderNumber: orderData.order_number,
    orderName: orderData.name,
    paymentGatewayName: orderData.payment_gateway_names[0],
    paymentMethode: paymentMethod,
    orderAmount: orderData.total_price,
  };
  const createCustomerData: CreateCustomerDetails = {
    orderNumberRef: orderData.order_number,
    customerId: orderData.customer.id,
    email: orderData.email,
    customCustomerId: createCustomCustomerId(orderData.customer.id),
    firstName: orderData.customer.first_name ?? "",
    lastName: orderData.customer.last_name,
    zip: orderData.billing_address.zip,
    city: orderData.billing_address.city,
    street: orderData.billing_address.address1,
    country: orderData.billing_address.country_code,
  };

  await createOrderWithCustomerDetails({
    createCustomerData,
    createOrderData,
  });
  await addTagsToOrder(shop, orderData.id.toString(), "Pay Later");
}
