import { getOrCreateConfig } from "../models/config.server";

function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

function jwtExpiresAt(jwt: string): number {
  const payload = parseJwt(jwt);
  if (payload.exp != payload.data.exp) {
    console.warn("JWT with two different values for .exp and .data.exp", jwt);
  }
  return payload.exp * 1000; // jtw.ext uses seconds, javascript uses milliseconds for timestamps
}

interface ApiAuthData {
  apiKey: string;
  username: string;
  password: string;
  vendorId: string;
}

const jwtMinimalAcceptableLiveTime = 2 * 60 * 1000; // 2min
export class ConsorsAPI {
  private jwtData?: {
    jwt: string;
    jwtValideUntil: number;
  };
  private baseURL = "https://api.consorsfinanz.de";
  
  constructor(public authData: ApiAuthData) {
    this.jwtData = undefined;
  }
  private async getNewJWT(): Promise<string | undefined> {
    const response = await fetch(
      `${this.baseURL}/common-services/cfg/token/${this.authData.vendorId}`,
      {
        method: "POST",
        headers: {
          "x-api-key": this.authData.apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Request-Id": "1",
          "X-Conversation-Id": "111",
        },
        body: new URLSearchParams({
          username: this.authData.username,
          password: this.authData.password,
        }),
      }
    );
    if (response.ok) {
      return response
        .json()
        .then((body) => body["token"].substring("Bearer ".length));
    } else {
      console.error("jwt not OK response", response);
      return undefined;
    }
  }

  async jwt(): Promise<string | undefined> {
    if (
      this.jwtData === undefined ||
      this.jwtData.jwtValideUntil - jwtMinimalAcceptableLiveTime < Date.now()
    ) {
      return this.getNewJWT().then((jwt) => {
        if (jwt === undefined) {
          this.jwtData = undefined;
          return undefined;
        } else {
          this.jwtData = {
            jwt,
            jwtValideUntil: jwtExpiresAt(jwt),
          };
          return jwt;
        }
      });
    } else {
      return this.jwtData.jwt;
    }
  }

  async stornoOrder(applicationReferenceNumber: string, countryCode: string, timeStamp: string, orderAmount: string) {
    console.log("storno applicationReferenceNumber", applicationReferenceNumber);
    const consorsUrl = `${this.baseURL}/psp-web/rest/${this.authData.vendorId}/cancel/credit/${applicationReferenceNumber}?version=2.0`;

    const consorsAuthToken = await this.jwt();
    const res = await fetch(consorsUrl, {
      method: "DELETE",
      headers: {
        "x-api-key": this.authData.apiKey,
        "Content-Type": "application/json",
        "X-Request-Id": "1",
        "X-Conversation-Id": "111",
        "X-TimeStamp": timeStamp,
        "X-CountryCode": countryCode,
        "X-Token": `Bearer ${consorsAuthToken}`,
      },body: JSON.stringify({
        orderAmount,
        notifyURL: "https://paylater.cpro-server.de/notify/cancelOrder"
      })
    });
    return res;
  }

  // async fulfillmentOrder(transactionId: string) {
  //   const clientId = this.authData.vendorId;
  //   // console.log("Fulfillment transactionId", transactionId);
  //   // console.log("Fulfillment clientId", clientId);
  //   const consorsUrl = `https://api.consorsfinanz.de/ratanet-api/cfg/deliverystatus/${clientId}/${transactionId}/partnerdata?version=${CONSORS_API_VERSION}`;

  //   const consorsAuthToken = await this.jwt();
  //   // console.log("Fulfillment with url", consorsUrl);
  //   const res = await fetch(consorsUrl, {
  //     method: "PUT",
  //     headers: {
  //       "x-api-key": this.authData.apiKey,
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${consorsAuthToken}`,
  //     },
  //   });
  //   // TODO: check status code usw.
  //   return res;
  // }
}

const consorsClientCache: { [shop: string]: ConsorsAPI | undefined } = {};

export async function getConsorsClient(shop: string) {
  const chachedClient = consorsClientCache[shop];
  const config = await getOrCreateConfig(shop);

  if (config == undefined) {
    return undefined;
  }
  if (chachedClient !== undefined) {
    if (
      chachedClient.authData.apiKey === config.apiKey &&
      chachedClient.authData.password === config.password &&
      chachedClient.authData.username === config.username &&
      chachedClient.authData.vendorId === config.vendorId
    ) {
      return chachedClient;
    }
  }
  const newClient = new ConsorsAPI({
    apiKey: config.apiKey,
    username: config.username,
    password: config.password,
    vendorId: config.vendorId,
  });

  consorsClientCache[shop] = newClient;
  return newClient;
}

// export const demoMockApi = new ConsorsAPI({
//   apiKey: "6f600501-6bca-47b7-a2b9-9314e75f626e",
//   username: "1pstest",
//   password: "ecec8403",
//   vendorId: "8403",
// });
