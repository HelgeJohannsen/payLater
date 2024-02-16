import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Badge,
  BlockStack,
  Button,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import db from "../db.server";
import { authenticate } from "../shopify.server";

import { useState } from "react";
// import { demoMockApi } from "~/consors/api";
import { getConsorsClient } from "~/consors/api";
import { getOrCreateConfig } from "../models/config.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getOrCreateConfig(session.shop);

  const consorsClient = await getConsorsClient(session.shop);
  const clientAuth = await consorsClient?.jwt();
  console.log("clientAuth", clientAuth);

  return {
    ...settings,
    clientDataOk: !!clientAuth,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const body = await request.formData();

  console.log("action body: -> ", body);

  const config = await db.config.update({
    where: { shop },
    data: {
      shop: shop,
      customerAccountNumber: String(body.get("customerAccountNumber")),
      vendorId: String(body.get("vendorId")),
      username: String(body.get("username")),
      apiKey: String(body.get("apiKey")),
      password: String(body.get("password")),
    },
  });
  return config;
};

type AppConfig = {
  vendorId: string;
  username: string;
  password: string;
  apiKey: string;
  notificationHashKey?: string;
  customerAccountNumber: string;
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const {
    id,
    customerAccountNumber,
    vendorId,
    apiKey,
    password,
    username,
    shop,
    clientDataOk,
  } = loaderData!;

  const [appConfig, setAppConfig] = useState<AppConfig>({
    vendorId: vendorId ?? "",
    username: username ?? "",
    password: password ?? "",
    apiKey: apiKey ?? "",
    customerAccountNumber: customerAccountNumber ?? "",
  });

  function handleSave() {
    if (id === undefined) {
      console.error("could not load ID from server, cant submit without ID");
    } else {
      const data = {
        id,
        shop: shop ?? "",
        ...appConfig,
      };
      submit(data, { method: "post" });
    }
  }

  return (
    <Page>
      <ui-title-bar title="Einstellungen"> </ui-title-bar>
      <BlockStack gap={"100"} align="center" inlineAlign="start">
        <Text as="h2" variant="headingMd">
          Consors EFI
        </Text>
        <BlockStack gap={"050"}>
          <BlockStack align="center" inlineAlign="start">
            <TextField
              id="customer-account-number"
              label="customerAccountNumber"
              autoComplete="off"
              value={appConfig.customerAccountNumber}
              onChange={(value) =>
                setAppConfig((prev) => ({
                  ...prev,
                  customerAccountNumber: value,
                }))
              }
              onBlur={handleSave}
            />
            <TextField
              id="vendor-id"
              label="VendorID"
              autoComplete="off"
              value={appConfig.vendorId}
              onChange={(value) =>
                setAppConfig((prev) => ({ ...prev, vendorId: value }))
              }
              onBlur={handleSave}
            />
            <TextField
              id="username"
              label="Username"
              autoComplete="off"
              value={appConfig.username}
              onChange={(value) =>
                setAppConfig((prev) => ({ ...prev, username: value }))
              }
              onBlur={handleSave}
            />
            <TextField
              id="password"
              label="Password"
              autoComplete="off"
              value={appConfig.password}
              onChange={(value) =>
                setAppConfig((prev) => ({ ...prev, password: value }))
              }
              onBlur={handleSave}
            />
            <TextField
              id="x-api-key"
              label="Api Key"
              autoComplete="off"
              value={appConfig.apiKey}
              onChange={(value) =>
                setAppConfig((prev) => ({ ...prev, apiKey: value }))
              }
              onBlur={handleSave}
            />
          </BlockStack>
          <BlockStack align="space-between">
            <BlockStack align="center" inlineAlign="end">
              <Button onClick={() => handleSave()}>Save</Button>
            </BlockStack>
            <BlockStack align="center" inlineAlign="start">
              {clientDataOk && <Badge size="medium">Error</Badge>}
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </BlockStack>
    </Page>
  );
}
