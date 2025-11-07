import { Router } from "express";
import { LogIn } from "../controllers/userLogin.controller.js";

const router = Router();

router.post("/Login", LogIn);

export default router;
