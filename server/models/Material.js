import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  instructor: { type: String, required: true, trim: true },
  version: { type: String, required: true, enum: ["Bangla", "English"] },
  classLevel: { type: Number, required: true }, 
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  fileUrl: { type: String, required: true },
  size: Number,
  downloads: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Material", materialSchema);
