import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth.js";
import { toggleSaved, getSavedItems } from "../controllers/saved.js";

const router = Router();

router.post("/toggle", verifyToken, toggleSaved);
router.get("/", verifyToken, getSavedItems);

export default router;
