import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  instructor: { type: String, required: true, trim: true },
  version: { type: String, required: true, enum: ["Bangla", "English"] },
  classLevel: { type: Number, required: true }, 
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  thumbnail: { type: String },
  videoUrl: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Lecture", lectureSchema);
