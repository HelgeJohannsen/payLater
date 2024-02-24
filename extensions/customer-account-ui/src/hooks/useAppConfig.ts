import { useEffect, useState } from "react";
import type { LinkConfigData } from "../types";

export function useAppConfig(myShopifyDomain: string): LinkConfigData | null {
  const [appSettings, setAppSettings] = useState<LinkConfigData | null>(null);

  useEffect(() => {
    const getAppConfig = async () => {
      try {
        const parameters = new URLSearchParams({ shop: myShopifyDomain });
        const requestUrl = `https://paylater.cpro-server.de/api/getAppConfig?${parameters}`;

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
