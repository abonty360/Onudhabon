import express from "express";
import User from "../models/Volunteers/User.js";
import Student from "../models/Student.js";
import Lecture from "../models/Lecture.js";
import Material from "../models/Material.js";
import { ensureSubjectsMatchPlan } from "../services/planService.js";
import { calculateProgress } from "../services/progressService.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const { name, role } = req.query;
        let filter = {};
        if (name) filter.name = { $regex: name, $options: "i" };
        if (role) filter.roles = role;

        const volunteers = await User.find(filter).select("name role");
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const volunteer = await User.findById(req.params.id);
        if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

        let extraData = {};
        if (volunteer.roles === "Local Guardian") {
            const students = await Student.find({ guardianId: volunteer._id })
                .select(
                    "fullName birthCertificateId classLevel enrollmentYear status fatherName motherName consentLetterUrl completedClasses subjects"
                );
            const progressData = {};
            for (const stu of students) {
                try {
                    await ensureSubjectsMatchPlan(stu);
                    await stu.save();
                    const progress = calculateProgress(stu.subjects || []);
                    progressData[stu._id.toString()] = {
                        studentId: stu._id,
                        classLevel: stu.classLevel,
                        completedClasses: stu.completedClasses,
                        ...progress
                    };
                } catch (err) {
                    console.error(`Error calculating progress for ${stu._id}:`, err);
                    progressData[stu._id.toString()] = null;
                }
            }
            extraData.students = students;
            extraData.progressData = progressData;
        } 
        if (volunteer.roles === "Educator") {
            extraData.lectures = await Lecture.find({ instructor: volunteer._id })
            .select("title description version classLevel subject topic thumbnail videoUrl status createdAt");
            extraData.materials = await Material.find({ instructor: volunteer._id })
            .select("title description version classLevel subject topic fileUrl size downloads status date");
        }

        res.json({ ...volunteer.toObject(), ...extraData });
    } catch (err) {
        console.error("Error in GET /api/admin/volunteers/:id", err);
        res.status(500).json({ message: err.message });
    }
});

export default router;