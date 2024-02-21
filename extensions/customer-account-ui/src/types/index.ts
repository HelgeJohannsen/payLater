export interface CustomerDetails {
  orderNumberRef: string;
  customerId: string;
  firstName: string;
  lastName: string;
  zip: string;
  city: string;
  street: string;
  country: string;
}

export interface OrderWithCustomerDetails {
  orderId: string;
  orderNumber: string;
  orderName: string;
  customCustomerId?: string;
  applicationNumber?: string;
  paymentGatewayName: string;
  paymentMethode: string;
  orderAmount: number;
  confirmCreditStatus?: string;
  fulfillStatus?: string;
  cancelStatus?: string;
  partiallyFFStatus?: string;
  customerDetails?: CustomerDetails;
}
