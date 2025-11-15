import { Router } from "express";
import {
  getPublicProperties,
  createAccommodation,
  getPropertyById }
  from "../controllers/property.js"
import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";
const router = Router();

router.get("/", getPublicProperties);
router.post("/", verifyToken, verifyRole(["user", "admin"]), createAccommodation);
router.get("/:id", getPropertyById);

export default router;
