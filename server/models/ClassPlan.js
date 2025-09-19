import mongoose from "mongoose";

const PlanSubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  totalLectures: { type: Number, required: true, min: 1 }
}, { _id: false });

const classPlanSchema = new mongoose.Schema({
  classLevel: { type: Number, unique: true, required: true, index: true },
  subjects: { type: [PlanSubjectSchema], required: true }
});

export default mongoose.model("ClassPlan", classPlanSchema);
