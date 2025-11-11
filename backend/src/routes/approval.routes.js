import { Router } from "express";
import { getPendingProperties, 
  approveProperty, 
  rejectProperty,
  getPendingActivities,
  approveActivity,
  rejectActivity,
  getPendingServices,
  approveService,
  rejectService
 } from "../controllers/approval.controller.js";

import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();

router.get("/properties/pending", verifyToken, verifyRole(["admin"]), getPendingProperties);
router.post("/properties/:id/approve", verifyToken, verifyRole(["admin"]), approveProperty);
router.post("/properties/:id/reject", verifyToken, verifyRole(["admin"]), rejectProperty);

router.get("/activities/pending", verifyToken, verifyRole(["admin"]), getPendingActivities);
router.post("/activities/:id/approve", verifyToken, verifyRole(["admin"]), approveActivity);
router.post("/activities/:id/reject", verifyToken, verifyRole(["admin"]), rejectActivity);

router.get("/services/pending", verifyToken, verifyRole(["admin"]), getPendingServices);
router.post("/services/:id/approve", verifyToken, verifyRole(["admin"]), approveService);
router.post("/services/:id/reject", verifyToken, verifyRole(["admin"]), rejectService);

export default router;
