import { Router } from "express";
import { insertUsers } from "../controllers/passwordHash.controller.js";

const router = Router();

router.post("/hash", insertUsers);

export default router;
