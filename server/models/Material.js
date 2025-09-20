import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  version: { type: String, required: true, enum: ["Bangla", "English"] },
  classLevel: { type: Number, required: true }, 
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  fileUrl: { type: String, required: true },
  size: Number,
  downloads: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Material", materialSchema);
