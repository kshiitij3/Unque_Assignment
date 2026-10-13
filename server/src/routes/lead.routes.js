import { Router} from "express";
import {
  getLeads,
  createDummyLead,
} from "../controllers/lead.controller.js";

const router = Router();

router.get('/',getLeads);


router.post(
  "/dummy",
  (req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      return res.sendStatus(404);
    }

    next();
  },
  createDummyLead
);

export default router;
