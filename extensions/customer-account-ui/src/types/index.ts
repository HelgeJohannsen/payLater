export interface CustomerDetails {
  id: number;
  orderNumberRef: number;
  customerId: number;
  firstName: string;
  lastName: string;
  zip: string;
  city: string;
  street: string;
  country: string;
}

export interface OrderWithCustomerDetails {
  id: number;
  orderId: string;
  orderNumber: number;
  orderName: string;
  customCustomerId?: string;
  applicationNumber?: string;
  paymentGatewayName: string;
  paymentMethod: string;
  orderAmount: string;
  confirmCreditStatus?: string;
  fulfillStatus?: string;
  cancelStatus?: string;
  partialFFStatus?: boolean;
  partialFFAmount?: number;
  customerDetails?: CustomerDetails;
}