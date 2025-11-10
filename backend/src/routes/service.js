import { Router } from "express";
import {
  createService
} from "../controllers/service.js";

import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();

router.post("/", verifyToken, verifyRole(["user", "admin"]), createService);

export default router;
