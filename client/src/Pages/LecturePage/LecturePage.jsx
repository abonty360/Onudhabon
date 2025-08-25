import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import "./LecturePage.css";

function LecturePage() {
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/lectures")
      .then((res) => res.json())
      .then((data) => setLectures(data))
      .catch((err) => console.error("GET lectures error:", err));
  }, []);

  return (
    <>
      <NavbarComponent />
      <div className="lecture-container">
        <h1>Video Lectures</h1>
        <p>
          Access high-quality educational videos created by our volunteer
          educators. All content is free and available for everyone.
        </p>

        <div className="upload-btn-box">
          <Link to="/lecture/upload" className="btn btn-primary">
            <i className="bi bi-upload"></i> Upload New Lecture
          </Link>
        </div>

        <div className="filter-box">
          <input type="text" placeholder="Search lectures, instructors, or topics..." />
          <select>
            <option>All Classes</option>
            <option>Grade 8</option>
            <option>Grade 9</option>
            <option>Grade 10</option>
          </select>
          <select>
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Biology</option>
            <option>History</option>
          </select>
          <select>
            <option>All Topics</option>
            <option>Algebra</option>
            <option>Photosynthesis</option>
          </select>
        </div>

        <div className="lecture-grid">
          {lectures.map((lec) => (
            <div key={lec._id} className="lecture-card">
              <div className="lecture-video">
                <video width="100%" height="200" controls poster={lec.thumbnail}>
                  <source src={lec.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <span className="duration">{lec.duration} min</span>
              </div>
              <div className="lecture-content">
                <div className="tags">
                  <span className="grade">Grade {lec.classLevel}</span>
                  <span className="subject">{lec.subject}</span>
                </div>
                <h3>{lec.title}</h3>
                <p>{lec.description}</p>
                <div className="meta">
                  <span>{lec.instructor}</span>
                  <span>{lec.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LecturePage;
