import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth.js";
import { LogIn, getCurrentUser, logoutUser  } from "../controllers/userLogin.controller.js";

const router = Router();

router.post("/Login", LogIn);

router.get("/me", verifyToken, getCurrentUser);

router.post("/logout", verifyToken, logoutUser);

export default router;
