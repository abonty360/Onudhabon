import express from "express";
import { auth } from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/upload.js";
import Student from "../models/Student.js";
import User from "../models/Volunteers/User.js"; // Import User model
import ClassPlan from "../models/ClassPlan.js";

const router = express.Router();
import { getProgress, updateProgress, updateStudent } from '../controllers/studentController.js';

router.post("/", auth, checkRole("Local Guardian"), upload.single("consentLetter"), async (req, res) => {
    try {
        // Check if the guardian is restricted
        const guardian = await User.findById(req.user._id);
        if (guardian && guardian.isRestricted) {
            return res.status(403).json({ error: "You are restricted and cannot enroll new students." });
        }

        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file);

        const {
            birthCertificateId,
            fullName,
            address,
            fatherName,
            motherName,
            classLevel,
            enrollmentYear
        } = req.body;

        let subjectsInput = req.body.subjects;
        if (typeof subjectsInput === "string") {
            try {
                // Try parsing JSON string
                const parsed = JSON.parse(subjectsInput);
                if (Array.isArray(parsed)) {
                    subjectsInput = parsed;
                } else {
                    // Single subject string, wrap in array
                    subjectsInput = [subjectsInput];
                }
            } catch {
                // Not JSON, treat as comma-separated or single value
                subjectsInput = subjectsInput.includes(",")
                    ? subjectsInput.split(",").map(s => s.trim())
                    : [subjectsInput.trim()];
            }
        } else if (!Array.isArray(subjectsInput)) {
            subjectsInput = [];
        }
        if (!/^\d{7,13}$/.test(birthCertificateId)) {
            return res.status(400).json({
                error: "Birth Certificate ID must be 7 to 13 digits"
            });
        }
        if (Number(enrollmentYear) < 2025) {
            return res.status(400).json({
                error: "Enrollment year cannot be earlier than 2025"
            });
        }
        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: "Consent letter upload failed" });
        }
        const plan = await ClassPlan.findOne({ classLevel: Number(classLevel) });
        if (!plan) {
            return res.status(400).json({ error: "Class plan not found for this class level" });
        }
        const subjects = plan.subjects
            .filter(s => subjectsInput.length === 0 || subjectsInput.includes(s.name))
            .map(s => ({
                name: s.name,
                totalLectures: s.totalLectures,
                lecturesSupplied: 0,
                lecturesCompleted: 0,
                gradeSum: 0,
                gradeCount: 0
            }));
        const student = new Student({
            birthCertificateId,
            fullName,
            address,
            fatherName,
            motherName,
            classLevel,
            enrollmentYear,
            consentLetterUrl: req.file.secure_url || req.file.path,
            guardianId: req.user._id,
            guardianName: req.user.name,
            subjects,
            status: "pending"
        });

        await student.save();
        res.status(201).json({ message: "Student enrollment submitted for review", student });
    } catch (err) {
        console.error("Error enrolling student:", err);
        if (err.code === 11000) {
            return res.status(400).json({
                error: "This student is already enrolled under your guardianship"
            });
        }
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
});

router.get("/mine", auth, checkRole("Local Guardian"), async (req, res) => {
    try {
        const students = await Student.find({ guardianId: req.user._id }).sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/review", auth, checkRole("Admin"), async (req, res) => {
    try {
        const pending = await Student.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:id/approve", auth, checkRole("Admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, { status: "verified" }, { new: true });
        res.json({ message: "Student verified", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.patch("/:id/decline", auth, checkRole("Admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, { status: "declined" }, { new: true });
        res.json({ message: "Student declined", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/progress', getProgress);
router.patch('/:id/progress', updateProgress);
router.patch('/:id', updateStudent);

export default router;
