import { Router } from "express";
import { VerifyJWTValid } from "../controllers/jwtAuth.controller.js";

const router = Router();

router.post("/Verify", VerifyJWTValid);

export default router;
