import React, { useState } from "react";
import axios from "axios";

function UploadLecture() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    classLevel: "",
    instructor: "",
  });
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!video) return alert("Please select a video!");

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("video", video);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/lectures", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Lecture uploaded successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error uploading lecture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Upload Lecture (Video)</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <input name="description" placeholder="Description" onChange={handleChange} required />
        <input name="subject" placeholder="Subject" onChange={handleChange} />
        <input name="classLevel" placeholder="Class Level" onChange={handleChange} />
        <input name="instructor" placeholder="Instructor" onChange={handleChange} />
        <br /><br />
        <input type="file" accept="video/*" onChange={handleFileChange} required />
        <br /><br />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Lecture"}
        </button>
      </form>
    </div>
  );
}

export default UploadLecture;
