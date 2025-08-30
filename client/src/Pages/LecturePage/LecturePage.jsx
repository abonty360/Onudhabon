import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import "./LecturePage.css";
import UploadLecture from "../../Upload/UploadLecture";

function LecturePage({ isLoggedIn, handleLogout }) {
  const [lectures, setLectures] = useState([]);
  const [filteredLectures, setFilteredLectures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedVersion, setSelectedVersion] = useState("Both Versions");
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/lectures")
      .then((res) => res.json())
      .then((data) => {
        setLectures(data);
        setFilteredLectures(data);
      })
      .catch((err) => console.error("GET lectures error:", err));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token); 
        setUser(decoded);
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    let filtered = lectures;

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lec) =>
          (lec.title || "").toLowerCase().includes(lowerSearch) ||
          (lec.description || "").toLowerCase().includes(lowerSearch) ||
          (lec.instructor || "").toLowerCase().includes(lowerSearch) ||
          (lec.version || "").toLowerCase().includes(lowerSearch) ||
          (lec.subject || "").toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedClass !== "All Classes") {
      filtered = filtered.filter(
        (lec) => `Grade ${lec.classLevel}` === selectedClass
      );
    }

    if (selectedSubject !== "All Subjects") {
      filtered = filtered.filter((lec) => lec.subject === selectedSubject);
    }

    if (selectedTopic !== "All Topics" && selectedTopic !== "Select subject") {
      filtered = filtered.filter((lec) => lec.topic === selectedTopic);
    }

    if (selectedVersion !== "Both Versions") {
      filtered = filtered.filter((lec) => lec.version === selectedVersion);
    }

    setFilteredLectures(filtered);
  }, [searchTerm, selectedClass, selectedSubject, selectedTopic, selectedVersion, lectures]);

  useEffect(() => {
    if (selectedSubject !== "All Subjects") {
      fetch(`http://localhost:5000/api/lectures/topics/${selectedSubject}`)
        .then(res => res.json())
        .then(data => {
          setTopics(data);
          setSelectedTopic("All Topics");
        })
        .catch(err => console.error(err));
    } else {
      setTopics([]);
      setSelectedTopic("Select subject");
    }
  }, [selectedSubject]);

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <div className="lecture-container">
        <h1>Video Lectures</h1>
        <p>
          Access high-quality educational videos created by our volunteer
          educators. All content is free and available for everyone.
        </p>

        {isLoggedIn && user?.roles === "Educator" ? (
          <UploadLecture />
        ) : (
          <p>Only educators can upload lectures.</p>
        )}

        <div className="filter-box">
          <input type="text"
            placeholder="Search lectures, instructors, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}>
            <option>All Classes</option>
            <option>Grade 1</option>
            <option>Grade 2</option>
            <option>Grade 3</option>
            <option>Grade 4</option>
            <option>Grade 5</option>
            <option>Grade 6</option>
            <option>Grade 7</option>
            <option>Grade 8</option>
            <option>Grade 9</option>
            <option>Grade 10</option>
            <option>Grade 11</option>
            <option>Grade 12</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}>
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Biology</option>
            <option>History</option>
            <option>Statistics</option>
            <option>English</option>
            <option>Bangla</option>
          </select>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            disabled={selectedSubject === "All Subjects"}>
            {selectedSubject === "All Subjects" ? (
              <option>Select subject</option>
            ) : (
              <>
                <option>All Topics</option>
                {topics.map((topic, idx) => (
                  <option key={idx}>{topic}</option>
                ))}
              </>
            )}
          </select>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}>
            <option>Both Versions</option>
            <option>Bangla</option>
            <option>English</option>
          </select>
        </div>

        <div className="lecture-grid">
          {filteredLectures.length > 0 ? (
            filteredLectures.map((lec) => (
              <div key={lec._id} className="lecture-card">
                <div className="lecture-video">
                  <video width="100%" height="200" controls poster={lec.thumbnail}>
                    <source src={lec.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
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
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No lectures found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LecturePage;
