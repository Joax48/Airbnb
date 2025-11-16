import { Router } from "express";
import { getAmenities, assignAmenitiesToProperty, getPropertyAmenities } from "../controllers/amenities.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();

router.get("/", getAmenities);

router.get("/property/:id", getPropertyAmenities);

router.post("/property/:id", verifyToken, assignAmenitiesToProperty);

export default router;
