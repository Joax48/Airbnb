import express from "express";
import { getResourcesByUser } from "../controllers/resources.js";
import { verifyRole } from "../middleware/verifyRole.js";
import { verifyToken } from "../middleware/jwt.auth.js";
const router = express.Router();

router.get("/by-user/:id_user",verifyToken, verifyRole(["user", "admin"]), getResourcesByUser);

export default router;
