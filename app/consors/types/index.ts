import type { FulfilledDetails } from "@prisma/client";

export type BillingInfoRequest = Omit<
  FulfilledDetails,
  "id" | "orderNumberRef"
>;

export interface FulfillmentOrderRequest {
  applicationReferenceNumber: string;
  countryCode: string;
  timeStamp: string;
  orderAmount: number;
  customerId: string;
  billingInfo: BillingInfoRequest;
  notifyURL: string;
}

export interface StornoOrderRequest {
  applicationReferenceNumber: string;
  countryCode: string;
  timeStamp: string;
  orderAmount: number;
  notifyURL: string;
}

export interface RefundOrderRequest {
  applicationReferenceNumber: string;
  timeStamp: string;
  customerId: string;
  orderAmount: number;
  countryCode: string;
  notifyURL: string;
  billingInfo: BillingInfoRequest;
}
