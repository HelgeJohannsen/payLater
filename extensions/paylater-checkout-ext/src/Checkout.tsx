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
  const { countryCode } = shippingAddress?.current
  const checkoutTotalValue = cost.totalAmount.current.amount;
  let errorMsg = "";

  const isProcessBlock = () => {
    if (selectedPaymentMethod[0].type !== "manualPayment") return false;

    if (9.99 < checkoutTotalValue) return false;
    else {
      errorMsg = `Apologies, but a minimum value of 9.99 Euro is required for Consors Finanz payment method.`;
      return true;
    }
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
