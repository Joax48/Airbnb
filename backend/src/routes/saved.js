import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { toggleSaved, getSavedItems } from "../controllers/saved.js";

const router = Router();

router.post("/toggle", verifyToken, verifyRole(["user", "admin"]), toggleSaved);
router.get("/", verifyToken, verifyRole(["user", "admin"]), getSavedItems);

export default router;
