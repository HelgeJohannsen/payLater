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
import { useAppConfig } from "./hooks/useAppConfig";
import type { LinkOrderInfo } from "./types";
import { isPayLaterPaymentGateway } from "./utils";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <Extension />
);

function Extension() {
  const order = useOrder();

  const orderId = order?.id.split("Order/")[1];
  const shop = useShop();
  const appSettings = useAppConfig(shop.myshopifyDomain);
  const [orderData, setOrderData] = useState<LinkOrderInfo>();
  const [parametersLink, setParametersLink] = useState<
    URLSearchParams | undefined
  >();
  
  useEffect(() => {
    const setConsorsUrl = async () => {
      try {
        const apiEndpoint = "api/getOrder";
        const parameters = new URLSearchParams({ orderId: orderId });
        const requestUrl = `https://paylater.cpro-server.de/${apiEndpoint}?${parameters}`;

        const response = await fetch(requestUrl, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orderInfo: LinkOrderInfo = await response.json();
        setOrderData(orderInfo);

        const { vendorId, customerAccountNumber } = appSettings;
        const { customerDetails, orderAmount, paymentMethode } = orderInfo;
        const { city, country, firstName, lastName, street, zip } =
          customerDetails;

        const parameters2 = new URLSearchParams({
          vendorID: vendorId,
          orderID: orderId,
          customerAccountNumber,
          paymentMethode,
          order_amount: orderAmount.toString(),
          firstName: firstName ?? "",
          lastName,
          // gender: "FEMALE",
          // firstName: "Test",
          // lastName: "Approval",
          zip,
          city,
          street,
          country,
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
  }, [orderId, shop.storefrontUrl, appSettings]);

  const link = `https://bezahlen.consorsfinanz.de/web/connector/#/home?${parametersLink}`;

  return appSettings &&
    isPayLaterPaymentGateway(orderData?.paymentGatewayName) ? (
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
