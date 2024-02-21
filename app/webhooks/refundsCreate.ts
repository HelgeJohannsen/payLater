export async function webhook_refundsCreate(shop: string, payload: unknown) {
  const data = payload?.valueOf();
  console.log("webhook_refundsCreate - ", data);
}
