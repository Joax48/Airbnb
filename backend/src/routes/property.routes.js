import { Router } from "express";
import { getPublicProperties } from "../controllers/property.controller.js";

const router = Router();
router.get("/", getPublicProperties);

export default router;
