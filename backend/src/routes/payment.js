import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth.js";

import { confirmPayment } from "../controllers/payment.js";

const router = Router();

router.post("/confirm", verifyToken, confirmPayment);

export default router;
