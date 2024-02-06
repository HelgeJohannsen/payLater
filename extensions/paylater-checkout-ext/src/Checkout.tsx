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

  console.log("selectedPaymentMethod", selectedPaymentMethod);
  console.log("shippingAddress, billingAddress", shippingAddress.current, billingAddress.current);

  const isProcessAllow = () => {
    if (selectedPaymentMethod[0].type !== "manualPayment") return true;

    if (9.99 < checkoutTotalValue) return true;
    else {
      errorMsg = `Apologies, but a minimum value of 9.99 Euro is required for Consors Finanz payment method.`;
      return false;
    }
  };

  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    const isPayLaterPossible =
      countryCode === "DE" &&
      !isProcessAllow() &&
      isAddressEqual(shippingAddress.current, billingAddress.current);

    return countryCode === "DE" && isProcessAllow() ? {
      behavior: "allow",
      }
    : isAddressEqual(shippingAddress.current, billingAddress.current) ?
    {
      behavior: "block",
      reason: "Minimum value",
      errors: [
        {
          message: errorMsg
            ? errorMsg
            : `Apologies, but the shipping address and billing address need to match when using a Consors Finanz payment method.`,
        },
      ],
    }: {
      behavior: "allow",
      }
  });

  return <></>;
}
