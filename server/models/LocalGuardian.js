import mongoose from "mongoose";

const localGuardianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  Address: { type: String, required: true }
});

const LocalGuardian = mongoose.model("localguardians", localGuardianSchema);

export default LocalGuardian;