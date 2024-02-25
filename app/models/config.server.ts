import db from "../db.server";

export async function getOrCreateConfig(shop: string) {
  const config = await db.config.findUnique({ where: { shop } });
  if (!config) {
    const entry = await createConfig(shop);
    return entry;
  }
  return config;
}
export async function createConfig(shop: string) {
  const data = {
    customerAccountNumber: "Test123456789",
    vendorId: "8403",
    shop: shop,
    apiKey: "6f600501-6bca-47b7-a2b9-9314e75f626e",
    username: "1pstest",
    password: "ecec8403",
  };

  const Settings = await db.config.create({ data });

  if (!Settings) {
    return null;
  }
  return Settings;
}
