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
}

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

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, roles: user.roles, name: user.name },
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
}

export const updateProfile = async (req, res) => {
    try {
        const { bio } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.bio = bio;
        await user.save();

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

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
