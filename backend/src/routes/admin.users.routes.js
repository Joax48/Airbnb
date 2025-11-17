import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { getAllUsers, getUserById } from "../controllers/users.controller.js";
import { getAuditLogs } from "../controllers/auditLog.controller.js";

const router = Router();

router.get('/users', verifyToken, verifyRole(["admin"]), getAllUsers);
router.get('/users/:id', verifyToken, verifyRole(["admin"]), getUserById);
router.get("/audit-logs", verifyToken, verifyRole(["admin"]), getAuditLogs);
export default router;
