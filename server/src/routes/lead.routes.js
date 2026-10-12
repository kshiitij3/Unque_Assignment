import { Router} from "express";
import {
  getLeads,
  createDummyLead,
} from "../controllers/lead.controller.js";

const router = Router();

router.get('/',getLeads);


// Development/testing only. Disable before public deployment.
if (process.env.NODE_ENV !== "production") {
  router.post("/dummy", createDummyLead);
}

export default router;