import express from "express";
import { login, register } from "../controllers/localGuardianController.js";

const router = express.Router();

// Route: POST /api/localguardian/login
router.post("/login", login);

// Route: POST /api/localguardian/register
router.post("/register", register);

export default router;