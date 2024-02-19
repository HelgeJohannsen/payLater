// import {
//   Banner,
//   BlockLayout,
//   Button,
//   Image,
//   InlineLayout,
//   reactExtension,
//   useOrder,
//   useShop,
//   useTotalAmount,
// } from "@shopify/ui-extensions-react/customer-account";
import {
  reactExtension,
  useOrder,
} from "@shopify/ui-extensions-react/customer-account";
import { useEffect } from "react";
import type { OrderWithCustomerDetails } from "./types";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <Extension />
);

function Extension() {
  const order = useOrder();
  console.log("useOrder", order);

  // const cost = useTotalAmount();
  // const orderAmountAsString = `${cost.amount}`;
  const order_id = order?.id.split("Order/")[1];
  // const shop = useShop();
  // const [orderData, setOrderData] = useState<OrderWithCustomerDetails>();
  // const [parametersLink, setParametersLink] = useState<
  //   URLSearchParams | undefined
  // >();
  const application_url = "https://paylater.cpro-server.de";
  useEffect(() => {
    const setConsorsUrl = async () => {
      try {
        const apiEndpoint = "app/getOrder";
        const parameters = new URLSearchParams({ orderId: order_id });
        const requestUrl = `${application_url}/${apiEndpoint}?${parameters}`;

        const response = await fetch(requestUrl, { method: "GET" });
        console.log("response getOrder - ", response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const orderInfo: OrderWithCustomerDetails = await response.json();
        console.log("orderInfo -", orderInfo);
        // setOrderData(orderInfo);

        // const parameters2 = new URLSearchParams({
        //   vendorID: "8403",
        //   orderID: order_id,
        //   customerAccountNumber: "Test123456789",
        //   paymentMethode: orderInfo.paymentMethode,
        //   order_amount: orderAmountAsString,
        //   gender: "FEMALE",
        //   // firstName: orderInfo.firstName ?? "",
        //   // lastName: orderInfo.lastName,
        //   firstName: "Test",
        //   lastName: "Approval",
        //   zip: orderInfo.zip,
        //   city: orderInfo.city,
        //   street: orderInfo.street,
        //   country: orderInfo.country,
        //   returntocheckoutURL: `${shop.storefrontUrl}/account/orders`,
        //   notifyURL: `https://paylater.cpro-server.de/notifications/creditCheck`,
        //   failureURL: `${shop.storefrontUrl}/account/orders`,
        // });
        // setParametersLink(parameters2);
      } catch (error) {
        console.error("Error fetching AppConfig:", error);
      }
    };
    setConsorsUrl();
  }, []);

  // const link = `https://bezahlen.consorsfinanz.de/web/connector/#/home?${parametersLink}`;

  // console.log("link", link);

  return <></>;

  // return order ? (
  //   <InlineLayout
  //     columns={["45%", "50%"]}
  //     spacing={"base"}
  //     blockAlignment={"center"}
  //     inlineAlignment={"center"}
  //   >
  //     <Image source="https://cdn.shopify.com/s/files/1/0758/3137/8199/files/ConsorsFinanzLogo.png?v=1701077799" />
  //     {fetchedOrder?.status === "ACCEPTED" && (
  //       <Banner status="success" title="Bezahlt" />
  //     )}

  //     {fetchedOrder?.status === "ERROR" && (
  //       <BlockLayout spacing={"base"}>
  //         <Banner
  //           status="warning"
  //           title="Es ist ein Fehler aufgetreten, bitte starten sie den Bezahlprozess erneut"
  //         />
  //         <Button to={link} inlineAlignment="center">
  //           Jetzt Bezahlen mit Consors Finanz
  //         </Button>
  //       </BlockLayout>
  //     )}

  //     {fetchedOrder?.status !== "ERROR" &&
  //       fetchedOrder?.status !== "ACCEPTED" && (
  //         <Button to={link} inlineAlignment="center">
  //           Jetzt Bezahlen mit Consors Finanz
  //         </Button>
  //       )}
  //   </InlineLayout>
  // ) : (
  //   <></>
  // );
}
