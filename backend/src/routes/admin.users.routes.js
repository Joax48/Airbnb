import { Router } from "express";
import { verifyToken } from "../middleware/jwt.auth.js";
import { getAllUsers, getUserById } from "../controllers/users.controller.js";

const router = Router();

router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);

export default router;
