import { Router } from "express";
import {
  getPublicProperties,
  createAccommodation }
  from "../controllers/property.js"

const router = Router();

router.get("/", getPublicProperties);
router.post("/", createAccommodation);

export default router;
