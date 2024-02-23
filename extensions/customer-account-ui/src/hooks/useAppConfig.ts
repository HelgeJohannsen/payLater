import type { Config } from "@prisma/client";
import { useEffect, useState } from "react";

export function useAppConfig(myShopifyDomain: string): Config | null {
  const [appSettings, setAppSettings] = useState<Config | null>(null);

  useEffect(() => {
    const getAppConfig = async () => {
      try {
        const parameters = new URLSearchParams({ shop: myShopifyDomain });
        const requestUrl = `https://cons-f-dev.cpro-server.de/api/getAppConfig?${parameters}`;

        const response = await fetch(requestUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAppSettings(data);
      } catch (error) {
        console.error("Error fetching AppConfig:", error);
      }
    };
    getAppConfig();
  }, [myShopifyDomain]);

  return appSettings;
}
