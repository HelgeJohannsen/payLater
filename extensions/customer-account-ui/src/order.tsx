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

  const parameters = new URLSearchParams({
    vendorid: "8403",
    order_id: order_id,
    paymentMethode: "INVOICE",
    returntocheckoutURL: "",
    failureURL: "",
    order_amount: textAmount,
    notifyURL: `https://cons-f-dev.cpro-server.de/api/public/notify/${order_id}`,
    firstName: "",
    lastName: "",
    zip: "",
    city: "",
    street: "",
    country: "de",
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

/*
  [ ] Check the if the payment method is form Consors
  [ ] Get the vendorId from the backend and use a manual value as a backup
  [ ] Remember to change the manual vendorID on this file
*/


/*
  [ ] Check the if the payment method is form Consors
  [ ] Get the vendorId from the backend and use a manual value as a backup
  [ ] Remember to change the manual vendorID on this file
*/