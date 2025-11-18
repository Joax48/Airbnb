import { Router } from "express";
import { generateUploadSignature } from "../controllers/upload.js";
import { verifyToken } from "../middleware/jwt.auth.js";

const router = Router();

router.get("/signature", verifyToken, generateUploadSignature);

export default router;
