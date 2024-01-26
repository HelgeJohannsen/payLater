import {
  reactExtension,
  useApi,
  useBuyerJourneyIntercept,
  useSelectedPaymentOptions,
  useShippingAddress,
} from "@shopify/ui-extensions-react/checkout";
import { isAddressEqual } from "./utils";

export default reactExtension(
  "purchase.checkout.payment-method-list.render-before",
  () => <Extension />
);

function Extension() {
  const { cost, billingAddress, shippingAddress } = useApi();
  const selectedPaymentMethod = useSelectedPaymentOptions();
  const { countryCode } = useShippingAddress();
  const checkoutTotalValue = cost.totalAmount.current.amount;
  const currentPaymentHandle = selectedPaymentMethod[0].handle;
  let errorMsg = "";

  //console.log("selectedPaymentMethod", selectedPaymentMethod)

  const paymentMethodsMap = {
    "Kauf auf Rechnung by Consors Finanz": {
      handle: "custom-manual-payment-62fc1293cd0487b5051a0b563353e222",
      minimumValue: 9.99,
    },
    "Kauf per Lastschrift by Consors Finanz": {
      handle: "custom-manual-payment-966e6977353fea0d0827e9331dd5f139",
      minimumValue: 9.99,
    },
    "3-Monats-Zahling by Consors Finanz": {
      handle: "custom-manual-payment-890d1d258371367a5139991406a10a6e",
      minimumValue: 26.99,
    },
  };

  const isProcessBlock = () => {
    if (selectedPaymentMethod[0].type !== "manualPayment") return false;

    return Object.entries(paymentMethodsMap).some((pm) => {
      const key = pm[0];
      const { handle, minimumValue } = pm[1];
      if (handle !== currentPaymentHandle) return false;
      if (minimumValue < checkoutTotalValue) return false;
      else {
        errorMsg = `Apologies, but a minimum value of ${minimumValue} Euro is required for ${key}
        payment method.`;

        return true;
      }
    });
  };

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    const isPayLaterPossible =
      countryCode === "DE" &&
      !isProcessBlock() &&
      isAddressEqual(shippingAddress.current, billingAddress.current);

    return canBlockProgress && !isPayLaterPossible
      ? {
          behavior: "block",
          reason: "Minimum value",
          errors: [
            {
              message: errorMsg
                ? errorMsg
                : `Apologies, but the shipping address and billing address need to match when using a Consors Finanz payment method.`,
            },
          ],
        }
      : {
          behavior: "allow",
        };
  });

  return <></>;
}
