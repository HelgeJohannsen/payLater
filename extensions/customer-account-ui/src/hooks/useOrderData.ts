import { useEffect, useState } from "react";
import type { LinkOrderData } from "../types";

export const useOrderData = (orderId: string): LinkOrderData | null => {
  const [orderData, setOrderData] = useState<LinkOrderData | null>(null);
  useEffect(() => {
    const getOrderData = async () => {
      try {
        const apiEndpoint = "api/getOrder";
        const parameters = new URLSearchParams({ orderId: orderId });
        const requestUrl = `https://paylater.cpro-server.de/${apiEndpoint}?${parameters}`;

        const response = await fetch(requestUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orderInfo: LinkOrderData = await response.json();
        setOrderData(orderInfo);
      } catch (error) {
        console.error("Error fetching AppConfig:", error);
      }
    };
    getOrderData();
  }, [orderId]);

  return orderData;
};
