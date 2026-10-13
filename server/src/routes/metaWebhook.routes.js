
import express from "express";
import { verifyMetaWebhook,receiveMetaWebhook,
} from "../controllers/metaWebhook.controller.js";

const router = express.Router();
router.get("/", verifyMetaWebhook);

router.post(
  "/",
  express.raw({
    type: "application/json",
    limit: "1mb",
  }),
  receiveMetaWebhook
);

export default router;
