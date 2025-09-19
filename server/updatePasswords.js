import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/Volunteers/User.js"; 

dotenv.config();


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const hashPasswords = async () => {
  try {
    const users = await User.find();

    for (let user of users) {
   
      if (!user.password.startsWith("$2a$")) {
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        console.log(`Password hashed for user: ${user.email}`);
      }
    }

    console.log("All passwords hashed successfully");
  } catch (err) {
    console.error("Error hashing passwords:", err);
  } finally {
    mongoose.disconnect();
  }
};

hashPasswords();
