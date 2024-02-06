import {
  reactExtension,
  useApi,
  useBuyerJourneyIntercept,
  useSelectedPaymentOptions,
} from "@shopify/ui-extensions-react/checkout";
import { isAddressEqual } from "./utils";

export default reactExtension(
  "purchase.checkout.payment-method-list.render-before",
  () => <Extension />
);

function Extension() {
  const { billingAddress, shippingAddress } = useApi();
  const selectedPaymentMethod = useSelectedPaymentOptions();
  const { countryCode } = shippingAddress?.current;
  let errorMsg = "";

  const isProcessAllow = () => {
    if (selectedPaymentMethod[0].type !== "manualPayment") return true;
    else {
      errorMsg = `Apologies, but a minimum value of 9.99 Euro is required for Consors Finanz payment method.`;
      return false;
    }
  };

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    return canBlockProgress && countryCode === "DE" && isProcessAllow()
      ? {
          behavior: "allow",
        }
      : isAddressEqual(shippingAddress.current, billingAddress.current)
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
