import { Router } from "express";
import { getPublicActivities,
  createActivity, getActivityById
 } from "../controllers/activity.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();
router.get("/", getPublicActivities);
router.post("/", verifyToken, verifyRole(["user", "admin"]), createActivity);
router.get("/:id", getActivityById);

export default router;
