import Lecture from "../models/Lecture.js";

export const newLecture = async (req, res) => {
  try {
    const { title, description, instructor, version, classLevel, subject, topic} = req.body;

    const lecture = new Lecture({
      title,
      description,
      instructor,
      version,
      classLevel,
      subject,
      topic,
      videoUrl: req.file.path,  
      thumbnail: req.file?.thumbnail_url || null,
      status: "pending"
    });

    await lecture.save();
    res.status(201).json({ message: "Lecture uploaded and pending admin approval", lecture });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(lectures);
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

    const topics = await Lecture.distinct("topic", { subject });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
