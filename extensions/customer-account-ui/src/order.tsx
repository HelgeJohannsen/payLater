//https://bezahlen.consorsfinanz.de/web/connector/#/home?vendorID=8403&orderID=Test987654321&customerAccountNumber=Test123456789&paymentMethode=INVOICE&order_amount=100.00&gender=FEMALE&firstName=Test&lastName=Approval&birthdate=01-01-1990&mobile=0175123456789&email=Your.Domain@Domain.de&returntocheckoutURL=https:%2F%2Fen68cljscjs8m66.m.pipedream.net%2F&zip=45143&city=Essen&street=Konitzer%20Weg%2020&country=DE&notifyURL=https:%2F%2Fen68cljscjs8m66.m.pipedream.net%2F&failureURL=https:%2F%2Fwww.facebook.com

import {
  Banner,
  Button,
  Image,
  InlineLayout,
  reactExtension,
  useApi,
  useOrder,
  useTotalAmount,
} from "@shopify/ui-extensions-react/customer-account";
import { useEffect, useState } from "react";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <Extension />
);

function Extension() {
  const order = useOrder();
  const cost = useTotalAmount();
  const textAmount = `${cost.amount}`;
  const order_id = order.id.split("Order/")[1];
  const [showExt, setShowExt] = useState(true);
  const  [fetchedOrder, setfetchedOrder] = useState({});
  const  [firstName, setfirstName] = useState("");
  const application_url = "https://paylater.cpro-server.de"
  console.log("test")
  useEffect(() => {
    const getAppConfig = async () => {
      try {
        const apiEndpoint = "app/getOrder";
        const parameters = new URLSearchParams({ orderId: order_id });
        const requestUrl = `${application_url}/${apiEndpoint}?${parameters}`;

        const response = await fetch(requestUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setfetchedOrder(data);
        console.log("fetchedOrder",data)
        console.log("fetchedOrder",data["firstName"])
        setfirstName(data["firstName"])
      } catch (error) {
        console.error("Error fetching AppConfig:", error);
      }
    };
    getAppConfig();
  }, []);

  const parameters = new URLSearchParams({
    vendorID: "8403",
    orderID: order_id,
    customerAccountNumber: "Test123456789",
    paymentMethode: fetchedOrder["paymentMethode"],
    order_amount: textAmount,
    gender: "FEMALE",
   // firstName: firstName,
    //lastName: fetchedOrder["lastName"],
    firstName: "Test",
    lastName: "Approval",
    zip: fetchedOrder["zip"],
    city: fetchedOrder["city"],
    street: fetchedOrder["street"],
    country: "DE",
    birthdate: "01-01-1990",
    returntocheckoutURL: `https://cons-f-dev.cpro-server.de/api/notify`,
    notifyURL: `https://cons-f-dev.cpro-server.de/api/notify`,
    failureURL: `https://www.facebook.com`,




  });

  //return `https://finanzieren.consorsfinanz.de/web/ecommerce/gewuenschte-rate?${parameters}`
  const link = `https://bezahlen.consorsfinanz.de/web/connector/#/home?${parameters}`;
  if (order && showExt) {
    return (
      <InlineLayout
        columns={["45%", "50%"]}
        spacing={"base"}
        blockAlignment={"center"}
        inlineAlignment={"center"}
      >
        <Image source="https://cdn.shopify.com/s/files/1/0758/3137/8199/files/ConsorsFinanzLogo.png?v=1701077799" />
        <Button to={link}>Jetzt Finanzieren mit Consors Finanz</Button>
      </InlineLayout>
    );
  }

  return null;
}

