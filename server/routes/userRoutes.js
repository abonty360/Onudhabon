import express from "express";
import { login, register, getProfile, updateProfile, updateProfilePicture, updatePassword, getAllUsers, createAdmin, toggleRestrictUser, getUserById, verifyAccount, getUnverifiedUsers, updateUserVerificationStatus } from "../controllers/userController.js";
import { auth, verifyAdmin } from "../middleware/auth.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/login", login);
router.post("/register", register);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

router.post("/profile/picture", auth, upload.single("picture"), updateProfilePicture);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/password", auth, updatePassword);
router.post(
  "/profile/picture",
  auth,
  upload.single("picture"),
  updateProfilePicture
);
router.post("/create-admin", auth, verifyAdmin, createAdmin);
router.post("/verify-account", upload.single("certificate"), verifyAccount);

// Admin routes for verification
router.get("/unverified-users", auth, verifyAdmin, getUnverifiedUsers);
router.patch("/verify-status/:userId", auth, verifyAdmin, updateUserVerificationStatus);

router.patch("/:id/restrict", auth, verifyAdmin, toggleRestrictUser);
router.get("/:id", auth, verifyAdmin, getUserById);

export default router;
