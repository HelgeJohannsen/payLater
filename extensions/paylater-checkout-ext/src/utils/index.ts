import type { Address } from "../types";

function isAddressEqual(obj1, obj2) {
  const getAddress = (obj) => {
    return {
      address1: obj.address1,
      address2: obj.address2,
      countryCode: obj.countryCode,
      city: obj.city,
      zip: obj.zip,
    };
  };
  const shippingAddress: Address = getAddress(obj1);
  const billingAddress: Address = getAddress(obj2);

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
