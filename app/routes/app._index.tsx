/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
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

import { createConfig, getOrCreateConfig } from "../models/config.server";
import { useState } from "react";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const {session} = await authenticate.admin(request);
  const Settings = await getOrCreateConfig(session.shop);
  return {
    ...Settings
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const body = await request.formData();
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
}

export default function Index() {
  const laoderData = useLoaderData<typeof loader>();
  const {
    id,
    customerAccountNumber,
    vendorId,
    shop,
  } = laoderData!; // TODO: might be undefined if server not reachable ?


  const [customerAccountNumberTextfield, setcustomerAccountNumberTextfield] = useState(customerAccountNumber);
  const [vendorIdTextfield, setVendorIdTextfield] = useState(vendorId);


  const submit = useSubmit();

  function handleSave() {
    if (id === undefined) {
      console.error("could not load ID from server, cant submit without ID"); // TODO: better handeling
    } else {
      const data = {
        id: id,
        customerAccountNumber: customerAccountNumberTextfield ?? null,
        vendorId: vendorIdTextfield ?? null,
        shop: shop ?? null,

      };

      submit(data, { method: "post" });
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
            id="title"
            label="customerAccountNumber"
            autoComplete="off"
            value={customerAccountNumberTextfield}
            onChange={(value) => setcustomerAccountNumberTextfield(value)}
            onBlur={() => handleSave()}
          />
          <TextField
            id="title"
            label="VendorID"
            autoComplete="off"
            value={vendorIdTextfield}
            onChange={(value) => setVendorIdTextfield(value)}
            onBlur={() => handleSave()}
          />
        </Card>
    </Page>
  );
}
