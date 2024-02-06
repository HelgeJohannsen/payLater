import db from "../db.server";

export async function getOrCreateConfig(shop: string) {
  // TODO: check typing
  const config = await db.config.findFirst({ where: { shop } });
  // console.log("shop", shop);
  if (!config) {
    const entry = await createConfig(shop);
    return entry;
  }
  return config;
}
export async function createConfig(shop: string) {
    /** @type {any} */
    const data = {
      customerAccountNumber: "Test123456789",
      vendorId: "8403",
      shop: shop
    };
  
    const Settings = await db.config.create({ data });
  
    if (!Settings) {
      return null;
    }
    return Settings;
  }