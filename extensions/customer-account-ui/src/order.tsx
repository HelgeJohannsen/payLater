//https://bezahlen.consorsfinanz.de/web/connector/#/home?vendorID=8403&orderID=Test987654321&customerAccountNumber=Test123456789&paymentMethode=INVOICE&order_amount=100.00&gender=FEMALE&firstName=Test&lastName=Approval&birthdate=01-01-1990&mobile=0175123456789&email=Your.Domain@Domain.de&returntocheckoutURL=https:%2F%2Fen68cljscjs8m66.m.pipedream.net%2F&zip=45143&city=Essen&street=Konitzer%20Weg%2020&country=DE&notifyURL=https:%2F%2Fen68cljscjs8m66.m.pipedream.net%2F&failureURL=https:%2F%2Fwww.facebook.com

import {
  Banner,
  Button,
  Image,
  InlineLayout,
  reactExtension,
  useApi,
  useOrder,
  useShop,
  useTotalAmount,
} from "@shopify/ui-extensions-react/customer-account";
import { useEffect, useState } from "react";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <Extension />
);

interface fetchedOrderI {
  id: number
  orderId: string
  orderName: string
  paymentMethode: string
  status: string
  firstName: string
  lastName: string
  zip: string
  city: string
  street: string
  country: string
}

function Extension() {
  const order = useOrder();
  if(order === undefined) {
    return <></>
  }
  const cost = useTotalAmount();
  const textAmount = `${cost.amount}`;
  const order_id = order?.id.split("Order/")[1];
  const [showExt, setShowExt] = useState(true);
  const shop = useShop();
  const [buttonText, setButtonText] = useState("Jetzt Bezahlen mit Consors Finanz")
  const  [status, setStatus] = useState("");
  const  [fetchedOrder, setfetchedOrder] = useState<fetchedOrderI>();
  const  [parametersLink, setParametersLink] = useState<URLSearchParams | undefined>();
  const application_url = "https://paylater.cpro-server.de"
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
        const data: fetchedOrderI = await response.json();
        console.log("data -",data)
        setfetchedOrder(data);
        setStatus(data.status)
        if(data.status == "ACCEPTED"){
          setButtonText("Bezahlt")
        }
        const parameters2 = new URLSearchParams({
          vendorID: "8403",
          orderID: order_id,
          customerAccountNumber: "Test123456789",
          paymentMethode: data.paymentMethode,
          order_amount: textAmount,
          gender: "FEMALE",
         // firstName: firstName,
          //lastName: fetchedOrder["lastName"],
          firstName: "Test",
          lastName: "Approval",
          zip: data.zip,
          city: data.city,
          street: data.street,
          country: "DE",
          birthdate: "01-01-1990",
          returntocheckoutURL: `${shop.storefrontUrl}/account/orders`,
          notifyURL: `https://paylater.cpro-server.de/api/notify`,
          failureURL: `${shop.storefrontUrl}/account/orders`,
        });
        setParametersLink(parameters2)
      } catch (error) {
        console.error("Error fetching AppConfig:", error);
      }
    };
    getAppConfig();
  }, []);

  //return `https://finanzieren.consorsfinanz.de/web/ecommerce/gewuenschte-rate?${parameters}`
  const link = `https://bezahlen.consorsfinanz.de/web/connector/#/home?${parametersLink}`;
  if (order && showExt) {
    return (
      <InlineLayout
        columns={["45%", "50%"]}
        spacing={"base"}
        blockAlignment={"center"}
        inlineAlignment={"center"}
      >
        <Image source="https://cdn.shopify.com/s/files/1/0758/3137/8199/files/ConsorsFinanzLogo.png?v=1701077799" />
        <Button to={link}>Jetzt Bezahlen mit Consors Finanz</Button>
        {buttonText}
      </InlineLayout>
    );
  }

  return null;
}

