
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
 console.log("Session totals now:", req.session.totalBytes, req.session.totalEmissions);

  res.json({
    dataTransferred: req.session.totalBytes || 0,
    emission: req.session.totalEmissions || 0,
    unit: "grams CO₂",
  });
});

router.post("/reset", (req, res) => {
  console.log("Resetting emissions for session:", req.sessionID);
  if (req.session) {
    req.session.totalBytes = 0;
    req.session.totalEmissions = 0;
  }
  res.json({ message: "Emission totals reset." });
});

export default router;
