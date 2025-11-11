import { Router } from "express";
import { getPendingProperties, approveProperty, rejectProperty } from "../controllers/approval.controller.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();

router.get("/properties/pending", verifyToken, verifyRole(["admin"]), getPendingProperties);
router.post("/properties/:id/approve", verifyToken, verifyRole(["admin"]), approveProperty);
router.post("/properties/:id/reject", verifyToken, verifyRole(["admin"]), rejectProperty);

export default router;
