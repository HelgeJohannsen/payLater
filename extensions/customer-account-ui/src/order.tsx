import {
  Banner,
  BlockLayout,
  Button,
  Image,
  InlineLayout,
  reactExtension,
  useOrder,
  useShop,
} from "@shopify/ui-extensions-react/customer-account";
import { useEffect, useState } from "react";
import type { OrderWithCustomerDetails } from "./types";
import { isPayLaterPaymentGateway } from "./utils";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <Extension />
);

function Extension() {
  const order = useOrder();

  const order_id = order?.id.split("Order/")[1];
  const shop = useShop();
  const [orderData, setOrderData] = useState<OrderWithCustomerDetails>();
  const [parametersLink, setParametersLink] = useState<
    URLSearchParams | undefined
  >();
  const application_url = "https://paylater.cpro-server.de";
  useEffect(() => {
    const setConsorsUrl = async () => {
      try {
        const apiEndpoint = "app/getOrder";
        const parameters = new URLSearchParams({ orderId: order_id });
        const requestUrl = `${application_url}/${apiEndpoint}?${parameters}`;

        const response = await fetch(requestUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orderInfo: OrderWithCustomerDetails = await response.json();
        console.log("response get/Order", orderInfo);
        setOrderData(orderInfo);

        const { customerDetails } = orderInfo;

        const parameters2 = new URLSearchParams({
          vendorID: "8403",
          orderID: order_id,
          customerAccountNumber: "Test123456789",
          paymentMethode: orderInfo.paymentMethode,
          order_amount: orderInfo.orderAmount.toString(),
          gender: "FEMALE",
          // firstName: orderInfo.firstName ?? "",
          // lastName: orderInfo.lastName,
          firstName: "Test",
          lastName: "Approval",
          zip: customerDetails.zip,
          city: customerDetails.city,
          street: customerDetails.street,
          country: customerDetails.country,
          returntocheckoutURL: `${shop.storefrontUrl}/account/orders`,
          notifyURL: `https://paylater.cpro-server.de/notify/creditCheck`,
          failureURL: `${shop.storefrontUrl}/account/orders`,
        });
        setParametersLink(parameters2);
      } catch (error) {
        console.error("Error fetching AppConfig:", error);
      }
    };
    setConsorsUrl();
  }, []);

  const link = `https://bezahlen.consorsfinanz.de/web/connector/#/home?${parametersLink}`;

  return isPayLaterPaymentGateway(orderData?.paymentGatewayName) ? (
    <InlineLayout
      columns={["45%", "50%"]}
      spacing={"base"}
      blockAlignment={"center"}
      inlineAlignment={"center"}
    >
      <Image source="https://cdn.shopify.com/s/files/1/0758/3137/8199/files/ConsorsFinanzLogo.png?v=1701077799" />
      {orderData?.confirmCreditStatus === "ACCEPTED" && (
        <Banner status="success" title="Bezahlt" />
      )}

      {orderData?.confirmCreditStatus === "ERROR" && (
        <BlockLayout spacing={"base"}>
          <Banner
            status="warning"
            title="Es ist ein Fehler aufgetreten, bitte starten sie den Bezahlprozess erneut"
          />
          <Button to={link} inlineAlignment="center">
            Jetzt Bezahlen mit Consors Finanz
          </Button>
        </BlockLayout>
      )}

      {orderData?.confirmCreditStatus !== "ERROR" &&
        orderData?.confirmCreditStatus !== "ACCEPTED" && (
          <Button to={link} inlineAlignment="center">
            Jetzt Bezahlen mit Consors Finanz
          </Button>
        )}
    </InlineLayout>
  ) : (
    <></>
  );
}
