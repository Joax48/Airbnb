import express from "express";
import { getResourcesByUser } from "../controllers/resources.js";

const router = express.Router();

router.get("/by-user/:id_user", getResourcesByUser);

export default router;
