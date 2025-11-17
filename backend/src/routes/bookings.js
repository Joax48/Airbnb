import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { getMyBookings  } from "../controllers/bookings.js";

const router = Router();

router.get("/my", verifyToken, verifyRole(["user", "admin"]), getMyBookings);

export default router;