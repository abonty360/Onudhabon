import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UploadLecture.css"

function UploadLecture() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    topic: "",
    classLevel: "",
    version: "",
  });
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        if (res.data.isRestricted) {
          alert("You are restricted from uploading any contents.");
          navigate("/home");
        } else {
          setUser(res.data);
        }
      } else {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Token verification failed:", err.response?.data || err.message);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  verifyToken();
}, [navigate]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user.isRestricted) {
      return alert("You are restricted from uploading any contents.");
    }
    if (!video) return alert("Please select a video!");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });
    data.append("video", video);
    data.append("instructor", user._id);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/lectures", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      alert("Lecture uploaded successfully!");
      navigate("/lecture");
      console.log("Upload response:", res.data);
      setFormData({
        title: "",
        description: "",
        subject: "",
        topic: "",
        classLevel: "",
        version: "",
      });
      setVideo(null);
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Error uploading lecture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2>Upload Lecture (Video)</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="input-card">
            <label>Title</label>
            <input name="title" placeholder="Enter title" onChange={handleChange} required />
          </div>
          <div className="input-card">
            <label>Description</label>
            <input name="description" placeholder="Enter description" onChange={handleChange} required />
          </div>
          <div className="input-card">
            <label>Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="History">History</option>
              <option value="Statistics">Statistics</option>
              <option value="English">English</option>
              <option value="Bangla">Bangla</option>
            </select>
          </div>
          <div className="input-card">
            <label>Topic</label>
            <input name="topic" placeholder="Enter topic" onChange={handleChange} />
          </div>
          <div className="input-card">
            <label>Class Level</label>
            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleChange}
            >
              <option value="">Select Class</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  Grade {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="input-card">
            <label>Instructor</label>
            <input
              type="text"
              value={user ? user.name : "Loading..."}
              readOnly
              className="readonly-input"
            />
          </div>
          <div className="input-card">
            <label>Version</label>
            <select
              name="version"
              value={formData.version}
              onChange={handleChange}
            >
              <option value="">Select Version</option>
              <option value="Bangla">Bangla</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="input-card">
            <label>Video File</label>

            <label htmlFor="video-upload" className="custom-file-btn">
              {video ? video.name : "Select Video"}
            </label>

            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              required
            />
          </div>

          <button type="submit" className="upload-btn" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Lecture"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadLecture;
