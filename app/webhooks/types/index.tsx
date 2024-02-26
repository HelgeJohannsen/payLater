export type BankResponseStatus = "SUCCESS" | "ERROR" | "REFUSED";

export interface ConsorsResponse {
  status: BankResponseStatus;
  timestamp?: string;
  errorCode?: string;
  errorMessage?: string;
}
