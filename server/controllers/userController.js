import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Volunteers/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email picture role roles phone location bio');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {

    try {
        const { name, email, phone, location, password, roles } = req.body;
        const trimmedName = name.trimStart();
        const allowedRoles = ["Local Guardian", "Educator"];
        if (!roles || !allowedRoles.includes(roles)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }
        const user = new User({
            name: trimmedName,
            email,
            phone,
            location,
            password,
            roles
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            return res.status(409).json({ message: "This email is already registered." });
        }
        res.status(500).json({ message: error.message });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      location,
      password: hashedPassword,
      roles,
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        console.log("Login attempt with email:", email);

        const user = await User.findOne({ email });
        console.log("User found in database:", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, roles: user.roles, name: user.name, isRestricted: user.isRestricted },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { name: user.name, roles: user.roles, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, roles: user.roles, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, roles: user.roles, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, phone, location, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (email) user.email = email;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res
        .status(409)
        .json({ message: "This email is already registered." });
    }
    res.status(500).json({ message: error.message });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.picture = req.file.path;
    await user.save();

     res.json({ message: "Profile picture updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createAdmin = async (req, res) => {
    try {
        const { name, email, phone, location, password } = req.body;
        if (req.user.roles !== "Admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "This email is already registered." });
        }

        const trimmedName = name.trimStart();

        const admin = new User({
            name: trimmedName,
            email,
            phone,
            location,
            password,
            roles: "Admin"
        });

        await admin.save();
        res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleRestrictUser = async (req, res) => {
    try {
        console.log("Received request to toggle restriction for user ID:", req.params.id);
        const user = await User.findById(req.params.id);
        console.log("User found:", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isRestricted = !user.isRestricted;
        await user.save();

        res.json({ message: "User restriction status updated successfully", user });
    } catch (error) {
        console.error("Error in toggleRestrictUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};
