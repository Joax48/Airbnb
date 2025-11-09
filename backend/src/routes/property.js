import { Router } from "express";
import {
  getPublicProperties,
  createAccommodation }
  from "../controllers/property.js"
import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";
const router = Router();

router.get("/", getPublicProperties);
router.post("/", verifyToken, verifyRole(["user", "admin"]), createAccommodation);

export default router;
