import axios from "axios";
import Lead from "../models/Lead.js";
import {getIO} from  "../config/socket.js";


function readField(fieldData, ...names) {
  const acceptedNames = names.map((name) => name.toLowerCase());
  const field = (fieldData || []).find((item) =>
    acceptedNames.includes(String(item.name).toLowerCase())
  );
  const value = field?.values?.[0];
  return value == null ? "" : String(value).trim();
}
  function toValidDate(value) {
  if (value == null || value === "") {
    return new Date();
  }
   const date =
    typeof value === "number"
      ? new Date(value * 1000)
      : new Date(value);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}
export async function processMetaLeadNotification(notification) {
  const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
  const version = process.env.META_GRAPH_API_VERSION || "v26.0";
  if (!accessToken) {
    throw new Error("META_PAGE_ACCESS_TOKEN is not configured");
  }
  if (!notification.leadId) {
    throw new Error("Meta notification does not contain a lead ID");
  }
  let metaLead;
  try {
    const response = await axios.get(
      `https://graph.facebook.com/${version}/${encodeURIComponent(
        notification.leadId
      )}`,
      {
        params: {
          fields: "id,created_time,ad_id,form_id,field_data",
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 15000,
      }
    );
    metaLead = response.data;
  } catch (error) {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "Unknown error";
    console.error(
      `[META] Unable to retrieve lead ${notification.leadId}: ${message}`
    );

    throw new Error("Failed to retrieve lead from Meta Graph API");
  }
  if (!metaLead?.id) {
    throw new Error("Meta Graph API returned no lead ID");
  }

  const fieldData = metaLead.field_data || [];
  const firstName = readField(fieldData, "first_name");
  const lastName = readField(fieldData, "last_name");

  const name =
    readField(fieldData, "full_name", "name") ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    "Meta Lead";

  const email = readField(fieldData, "email");
  const phone = readField(
    fieldData,
    "phone_number",
    "phone",
    "mobile_phone"
  );

  const metaLeadId = String(metaLead.id);

  const leadData = {
    name,
    email,
    phone,
    source: "meta",
    metaLeadId,
    metaPageId: String(notification.pageId || ""),
    metaFormId: String(metaLead.form_id || notification.formId || ""),
    metaAdId: String(metaLead.ad_id || notification.adId || ""),
    leadCreatedAt: toValidDate(
      metaLead.created_time ?? notification.createdTime
    ),
  };

  let lead = await Lead.findOne({ metaLeadId });

  if (!lead) {
    try {
      lead = await Lead.create(leadData);
      console.log(`[META] Saved lead ${metaLeadId}`);
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }

      lead = await Lead.findOne({ metaLeadId });

      if (!lead) {
        throw error;
      }
    }
  }
  getIO().emit("lead:new", lead.toObject());

  return lead;
}