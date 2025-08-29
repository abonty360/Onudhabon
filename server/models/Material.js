import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  topic: String,
  classLevel: String,
  author: String,
  fileUrl: String,
  size: Number,
  downloads: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Material", materialSchema);
