import express from "express";
import { login, register, getProfile, updateProfile, updateProfilePicture, getAllUsers } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllUsers);

router.post("/login", login);

router.post("/register", register);

router.get("/profile", auth, getProfile);

router.put("/profile", auth, updateProfile);

router.post("/profile/picture", auth, upload.single("picture"), updateProfilePicture);

export default router;