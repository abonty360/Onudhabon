import jwt from "jsonwebtoken";
import User from "../models/Volunteers/User.js";

export async function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

export const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.roles !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkRestriction = async (req, res, next) => {
  try {
    if (req.user.isRestricted) {
      return res.status(403).json({ message: "Access denied. You are restricted from performing this action." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};