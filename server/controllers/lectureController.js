import Lecture from "../models/Lecture.js";

export const newLecture = async (req, res) => {
  try {
    const { title, description, subject, classLevel, instructor } = req.body;

    const lecture = new Lecture({
      title,
      description,
      subject,
      classLevel,
      instructor,
      videoUrl: req.file.path,  
      thumbnail: req.file?.thumbnail_url || null,
    });

    await lecture.save();
    res.status(201).json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
