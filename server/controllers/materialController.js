import Material from "../models/Material.js";

export const newMaterial = async (req, res) => {
  try {
    const { title, description, instructor, version, classLevel, subject, topic } = req.body;

    const material = new Material({
      title,
      description,
      instructor,
      version,
      classLevel,
      subject,
      topic,
      fileUrl: req.file.path, 
    });

    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const topics = await Material.distinct("topic", { subject });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
