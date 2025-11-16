import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth";
import { verifyRole } from "../middleware/verifyRole";

const router = Router();

router.post("/", verifyToken, verifyRole["user"], );

export default router;

