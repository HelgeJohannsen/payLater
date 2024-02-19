export interface CustomerDetails {
  id: string;
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
  id: string;
  orderId: string;
  orderNumber: string;
  orderName: string;
  customCustomerId?: string;
  applicationNumber?: string;
  paymentGatewayName: string;
  paymentMethod: string;
  orderAmount: string;
  confirmCreditStatus?: string;
  fulfillStatus?: string;
  cancelStatus?: string;
  partialFFStatus?: string;
  partialFFAmount?: number;
  customerDetails?: CustomerDetails;
}
