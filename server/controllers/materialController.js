import Material from "../models/Material.js";

export const newMaterial = async (req, res) => {
  try {
    const { title, subject, classLevel, instructor } = req.body;

    const material = new Material({
      title,
      subject,
      classLevel,
      instructor,
      fileUrl: req.file.path, 
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
