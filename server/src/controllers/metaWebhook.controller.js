
import crypto from "node:crypto";
import { processMetaLeadNotification } from "../services/metaLead.service.js";

export function verifyMetaWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const suppliedToken = String(req.query["hub.verify_token"] || "");
  const challenge = req.query["hub.challenge"];
  const expectedToken = process.env.META_VERIFY_TOKEN || "";
  if (!expectedToken) {
    console.error("[META WEBHOOK] META_VERIFY_TOKEN is not configured");
    return res.status(500).send("Webhook verification is not configured");
  }
  const suppliedBuffer = Buffer.from(suppliedToken);
  const expectedBuffer = Buffer.from(expectedToken);
  const tokenMatches =
    suppliedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
  if (mode === "subscribe" && tokenMatches && challenge) {
    return res.status(200).type("text/plain").send(String(challenge));
  }
  return res.status(403).send("Webhook verification failed");
}

function isValidSignature(rawBody, signature, appSecret) {
  if (!Buffer.isBuffer(rawBody) || !signature || !appSecret) {
    return false;
  }
  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(signature);

  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
}

export async function receiveMetaWebhook(req, res) {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    console.error("[META WEBHOOK] META_APP_SECRET is not configured");
    return res.status(500).send("Webhook signature verification is not configured");
  }

  const signature = req.get("x-hub-signature-256");

  if (!isValidSignature(req.body, signature, appSecret)) {
    return res.status(401).send("Invalid webhook signature");
  }

  let payload;

  try {
    payload = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).send("Invalid JSON payload");
  }

  if (payload.object !== "page") {
    return res.status(200).send("EVENT_IGNORED");
  }

  const notifications = [];

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== "leadgen") continue;

      const value = change.value || {};
      if (!value.leadgen_id) continue;

      notifications.push({
        leadId: String(value.leadgen_id),
        pageId: value.page_id || entry.id || "",
        formId: value.form_id || "",
        adId: value.ad_id || "",
        createdTime: value.created_time,
      });
    }
  }

  try {
    for (const notification of notifications) {
      if (notification.leadId === "444444444444") {
        console.log(
          "[META WEBHOOK] Dashboard test received; skipping synthetic lead lookup."
        );
        continue;
      }

      await processMetaLeadNotification(notification);
    }

    return res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("[META WEBHOOK] Processing failed:", error.message);

    return res.status(500).send("Webhook processing failed");
  }
}
