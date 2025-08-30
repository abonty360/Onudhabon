import express from "express"
import { getUser, newUser } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get('/', getUser);

userRoutes.post('/', newUser);

export default userRoutes;