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
import { useOrderData } from "./hooks/useOrderData";
import { getConsorsLink, isPayLaterPaymentGateway } from "./utils";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <Extension />
);

function Extension() {
  const order = useOrder();
  const orderId = order?.id.split("Order/")[1];
  const shop = useShop();
  const appSettings = useAppConfig(shop.myshopifyDomain);
  const orderData = useOrderData(orderId);
  const [parametersLink, setParametersLink] = useState<
    URLSearchParams | undefined
  >(undefined);

  useEffect(() => {
    if (
      !orderData ||
      !appSettings ||
      !isPayLaterPaymentGateway(orderData?.paymentGatewayName)
    ) {
      return;
    }

    const consorsParametersLink = getConsorsLink(
      orderData,
      appSettings,
      shop.storefrontUrl
    );
    setParametersLink(consorsParametersLink);
  }, [appSettings, orderData, shop.storefrontUrl]);

  const link = `https://bezahlen.consorsfinanz.de/web/connector/#/home?${parametersLink}`;

  return (
    parametersLink && (
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
    )
  );
}
