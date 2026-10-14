import axios from "axios";
import { persistMetaLead } from "./metaLead.service.js";

let started = false;

export function startMetaTestLeadPolling() {
  if (process.env.NODE_ENV === "production") {
    console.log("[META POLLER] Disabled in production");
    return;
  }
  if (process.env.META_TEST_LEAD_POLLING_ENABLED !== "true" || started) return;

  const formId = process.env.META_TEST_FORM_ID;
  const pageId = process.env.META_PAGE_ID;
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const version = process.env.META_GRAPH_API_VERSION || "v26.0";
  const intervalMs = Number(process.env.META_TEST_LEAD_POLL_INTERVAL_MS) || 5000;

  if (!formId || !pageId || !accessToken) {
    console.error("[META POLLER] Form ID, Page ID, or Page access token is missing");
    return;
  }

  started = true;
  console.log("[META POLLER] Test-lead polling enabled");

  const poll = async () => {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${version}/${formId}/test_leads`,
        {
          params: { fields: "id,created_time,field_data", limit: 100 },
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: 15000,
        }
      );

      for (const testLead of response.data?.data || []) {
        await persistMetaLead(testLead, {
          pageId,
          formId,
          createdTime: testLead.created_time,
        });
      }
    } catch (error) {
      const message =
        error.response?.data?.error?.message || error.message || "Unknown polling error";
      console.error(`[META POLLER] ${message}`);
    } finally {
      setTimeout(poll, intervalMs);
    }
  };

  poll();
}
