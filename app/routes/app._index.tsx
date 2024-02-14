/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import {
  Card,
  Checkbox,
  ChoiceList,
  EmptyState,
  Icon,
  IndexTable,
  Layout,
  Page,
  Select,
  Tabs,
  Text,
  TextField,
  Thumbnail,
  Tooltip,
} from "@shopify/polaris";
import db from "../db.server";
import { authenticate } from "../shopify.server";

import { useState } from "react";
import { demoMockApi } from "~/consors/api";
import { createConfig, getOrCreateConfig } from "../models/config.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const Settings = await getOrCreateConfig(session.shop);

  const consorsMockClient = demoMockApi;
  const clientAuth = await consorsMockClient.jwt();
  console.log("clientAuth", clientAuth);

  return {
    ...Settings,
    clientDataOk: !!clientAuth,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const body = await request.formData();

  console.log(
    "body: -> ",
    body,
    body.get("customerAccountNumber"),
    body.get("vendorId")
  );
  // console.log("session: ", session);
  // console.log("request: ", request);
  // console.log(" minBestellWert:" + body.get("minBestellWert"));
  // console.log(" id:" + body.get("vendorId"));
  const Config = await db.config.update({
    where: { shop },
    data: {
      customerAccountNumber: String(body.get("customerAccountNumber")),
      vendorId: String(body.get("vendorId")),
      shop: shop,
    },
  });
  return Config;
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
  const laoderData = useLoaderData<typeof loader>();

  const submit = useSubmit();
  console.log("laoderData", laoderData);
  const { id, customerAccountNumber, vendorId, shop } = laoderData!; // TODO: might be undefined if server not reachable ?

  const [appConfig, setAppConfig] = useState<AppConfig>({
    vendorId: "",
    username: "",
    password: "",
    apiKey: "",
    customerAccountNumber: "",
  }); // TODO - start the useState with the values that comes from loaderData

  function handleSave() {
    if (id === undefined) {
      console.error("could not load ID from server, cant submit without ID"); // TODO: better handeling
    } else {
      submit({ id, ...appConfig }, { method: "post" });
    }
  }

  return (
    <Page>
      <ui-title-bar title="Einstellungen"> </ui-title-bar>

      <Card>
        <Text as="h2" variant="headingMd">
          Consors EFI
        </Text>
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
      </Card>
    </Page>
  );
}
