import { Router } from "express";
import { getPublicActivities } from "../controllers/activity.controller.js";

const router = Router();
router.get("/", getPublicActivities);

export default router;
