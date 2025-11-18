import { Router } from "express";
import {
  createService, getPublicServices, getServiceById
} from "../controllers/service.js";

import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();
router.get("/", getPublicServices );
router.post("/", verifyToken, verifyRole(["user", "admin"]), createService);
router.get("/:id", getServiceById );

export default router;
