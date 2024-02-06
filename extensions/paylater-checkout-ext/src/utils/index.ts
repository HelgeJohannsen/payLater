import type { MailingAddress } from "@shopify/ui-extensions/checkout";
import type { Address } from "../types";

function isAddressEqual(obj1: MailingAddress, obj2: MailingAddress) {
  const getAddress = (obj: MailingAddress): Address => {
    console.log("obj", obj)
    return {
      address1: obj.address1,
      address2: obj?.address2,
      countryCode: obj.countryCode,
      city: obj.city,
      zip: obj.zip,
    };
  };
  const shippingAddress = getAddress(obj1);
  const billingAddress = getAddress(obj2);

  if (
    Object.keys(shippingAddress).length !== Object.keys(billingAddress).length
  ) {
    return false;
  }
  for (let key of Object.keys(shippingAddress)) {
    if (shippingAddress[key] !== billingAddress[key]) {
      return false;
    }
  }
  return true;
}

export { isAddressEqual };
