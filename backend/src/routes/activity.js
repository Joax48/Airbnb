import { Router } from "express";
import { getPublicActivities,
  createActivity
 } from "../controllers/activity.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();
router.get("/", getPublicActivities);
router.post("/", verifyToken, verifyRole(["user", "admin"]), createActivity);

export default router;
