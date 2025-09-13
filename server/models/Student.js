import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  birthCertificateId: { type: String, required: true, unique: true, trim: true, match: [/^\d{7,13}$/, "Birth Certificate ID must be 7 to 13 digits"], },
  fullName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  fatherName: { type: String, required: true, trim: true }, 
  motherName: { type: String, required: true, trim: true },
  classLevel: { type: Number, required: true, min: 0, max: 12 },
  enrollmentYear: { type: Number, required: true, min: 2025 },
  consentLetterUrl: { type: String, required: true },
  guardianId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guardianName: { type: String, required: true },
  status: { type: String, enum: ["pending", "verified", "declined"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

studentSchema.index({ birthCertificateId: 1, guardianId: 1 }, { unique: true });

export default mongoose.model("Student", studentSchema);
