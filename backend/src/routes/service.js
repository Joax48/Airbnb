import { Router } from "express";
import {
  createService
} from "../controllers/service.js";

const router = Router();

router.post("/", createService);

export default router;
