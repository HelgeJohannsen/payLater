import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Spinner,
  TextField,
} from "@shopify/polaris";
import db from "../db.server";
import { authenticate } from "../shopify.server";

import { useState } from "react";
import { getConsorsClient } from "~/consors/api";
import { getOrCreateConfig } from "../models/config.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const settings = await getOrCreateConfig(session.shop);

  const consorsClient = await getConsorsClient(session.shop);
  const clientAuth = await consorsClient?.jwt();

  return {
    ...settings,
    clientDataOk: !!clientAuth,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const body = await request.formData();

  const config = await db.config.update({
    where: { shop },
    data: {
      shop: shop,
      vendorId: String(body.get("vendorId")),
      username: String(body.get("username")),
      apiKey: String(body.get("apiKey")),
      password: String(body.get("password")),
      notificationHashKey: String(body.get("notificationHashKey")),
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
};

export default function Index() {
  const [savingConfig, setSavingCofig] = useState(false);
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const {
    id,
    vendorId,
    apiKey,
    password,
    username,
    shop,
    notificationHashKey,
    clientDataOk,
  } = loaderData!;

  const [appConfig, setAppConfig] = useState<AppConfig>({
    vendorId: vendorId ?? "",
    username: username ?? "",
    password: password ?? "",
    apiKey: apiKey ?? "",
    notificationHashKey: notificationHashKey ?? "",
  });

  function handleSave() {
    setSavingCofig(true);
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
    setSavingCofig(false);
  }

  return (
    <div
      style={{
        padding: "32px",
      }}
    >
      <Box
        background="bg-fill"
        padding={{ md: "600" }}
        width="400px"
        borderRadius="300"
      >
        <ui-title-bar title="Einstellungen"> </ui-title-bar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <h2 style={{ fontWeight: "bold", fontSize: "18px" }}>Consors BNPL</h2>
          <img
            src="https://cdn.shopify.com/s/files/1/0758/3137/8199/files/ConsorsFinanzLogo.png?v=1701077799"
            alt="consors banner"
            style={{ maxHeight: "80px", maxWidth: "160px" }}
          />
        </div>

        <BlockStack gap={"300"}>
          <TextField
            id="vendor-id"
            label="VendorID"
            autoComplete="off"
            value={appConfig.vendorId}
            onChange={(value) =>
              setAppConfig((prev) => ({ ...prev, vendorId: value }))
            }
            onBlur={handleSave}
            requiredIndicator
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
            requiredIndicator
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
            requiredIndicator
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
          <TextField
            id="notification-hash-key"
            label="Notification Hash Key"
            autoComplete="off"
            value={appConfig.notificationHashKey}
            onChange={(value) =>
              setAppConfig((prev) => ({
                ...prev,
                notificationHashKey: value,
              }))
            }
            onBlur={handleSave}
            requiredIndicator
          />
        </BlockStack>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          {!clientDataOk && (
            <Badge size="medium" tone="attention">
              Credentials Error
            </Badge>
          )}
          {savingConfig ? (
            <div
              style={{
                marginRight: "25px",
              }}
            >
              <Spinner size="small" accessibilityLabel="Loading Saving data" />
            </div>
          ) : (
            <Button onClick={handleSave}>Save</Button>
          )}
        </div>
      </Box>
    </div>
  );
}
