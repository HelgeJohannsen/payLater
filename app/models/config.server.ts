import { mockMerchantCredentials } from "~/mockData";
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
    shop: shop,
    ...mockMerchantCredentials,
  };

  const Settings = await db.config.create({ data });

  if (!Settings) {
    return null;
  }
  return Settings;
}
