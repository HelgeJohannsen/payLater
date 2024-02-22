import type { FulfilledDetails, RefundsDetails } from "@prisma/client";

export type FulfilledBillingInfoRequest = Omit<
  FulfilledDetails,
  "id" | "orderNumberRef"
>;

export type RefundBillingInfoRequest = Omit<
  RefundsDetails,
  "id" | "orderNumberRef"
>;
export interface FulfillmentOrderRequest {
  applicationReferenceNumber: string;
  countryCode: string;
  timeStamp: string;
  orderAmount: number;
  customerId: string;
  billingInfo: FulfilledBillingInfoRequest;
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
  billingInfo: RefundBillingInfoRequest;
}
