import express from "express";
import { auth } from "../middleware/auth.js";
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/upload.js";
import Student from "../models/Student.js";

const router = express.Router();

// Local Guardian — add new student
router.post("/", auth, checkRole("Local Guardian"), upload.single("consentLetter"), async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
      console.log("Incoming file:", req.file);
        const { birthCertificateId, fullName, address, fatherName, motherName, classLevel, enrollmentYear } = req.body;
 if (!/^\d{7,13}$/.test(birthCertificateId)) {
        return res.status(400).json({
          error: "Birth Certificate ID must be 7 to 13 digits"
        });
      }
      if (Number(enrollmentYear) < 2007) {
        return res.status(400).json({
          error: "Enrollment year cannot be earlier than 2007"
        });
      }
        if (!req.file || !req.file.path) {
            return res.status(400).json({ error: "Consent letter upload failed" });
        }
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

      // ✅ Handle Mongoose validation errors
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
        res.status(500).json({ error: err.message });
    }
});

// Local Guardian — view own students
router.get("/mine", auth, checkRole("Local Guardian"), async (req, res) => {
    try {
        const students = await Student.find({ guardianId: req.user._id }).sort({ createdAt: -1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin — view pending students
router.get("/review", auth, checkRole("Admin"), async (req, res) => {
    try {
        const pending = await Student.find({ status: "pending" }).sort({ createdAt: -1 });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin — approve student
router.patch("/:id/approve", auth, checkRole("Admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, { status: "verified" }, { new: true });
        res.json({ message: "Student verified", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin — decline student
router.patch("/:id/decline", auth, checkRole("Admin"), async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, { status: "declined" }, { new: true });
        res.json({ message: "Student declined", student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
