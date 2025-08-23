import express from "express"
import { getLocalGuardian, newLocalGuardian } from "../controllers/localGuardianController.js";

const localGuardianRoutes = express.Router();

localGuardianRoutes.get('/', getLocalGuardian);

localGuardianRoutes.post('/', newLocalGuardian);

export default localGuardianRoutes;