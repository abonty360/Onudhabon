import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  title: String,
  description: String,
  subject: String,
  topic: String,
  classLevel: String,
  instructor: String,
  thumbnail: String,
  videoUrl: String,
  duration: Number,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Lecture", lectureSchema);
