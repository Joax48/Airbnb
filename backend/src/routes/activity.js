import { Router } from "express";
import { getPublicActivities,
  createActivity
 } from "../controllers/activity.js";


const router = Router();
router.get("/", getPublicActivities);
router.post("/", createActivity);

export default router;
