import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import "./MaterialPage.css";

function MaterialPage() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedVersion, setSelectedVersion] = useState("Both Versions");
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/materials")
      .then((res) => res.json())
      .then((data) => {
        setMaterials(data);
        setFilteredMaterials(data);
      })
      .catch((err) => console.error("GET materials error:", err));
  }, []);

  useEffect(() => {
    let filtered = materials;

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (mat) =>
          (mat.title || "").toLowerCase().includes(lowerSearch) ||
          (mat.description || "").toLowerCase().includes(lowerSearch) ||
          (mat.instructor || "").toLowerCase().includes(lowerSearch) ||
          (mat.version || "").toLowerCase().includes(lowerSearch) ||
          (mat.subject || "").toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedClass !== "All Classes") {
      filtered = filtered.filter(
        (mat) => `Grade ${mat.classLevel}` === selectedClass
      );
    }

    if (selectedSubject !== "All Subjects") {
      filtered = filtered.filter((mat) => mat.subject === selectedSubject);
    }

    if (selectedTopic !== "All Topics" && selectedTopic !== "Select subject") {
      filtered = filtered.filter((mat) => mat.topic === selectedTopic);
    }

    if (selectedVersion !== "Both Versions") {
      filtered = filtered.filter((mat) => mat.version === selectedVersion);
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, selectedClass, selectedSubject, selectedTopic, selectedVersion, materials]);

  useEffect(() => {
    if (selectedSubject !== "All Subjects") {
      fetch(`http://localhost:5000/api/materials/topics/${selectedSubject}`)
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
      <NavbarComponent />
      <div className="material-container">
        <h1>Study Materials</h1>
        <p>
          Download free educational materials including worksheets, study guides,
          and reference documents created by our volunteer educators.
        </p>

        <div className="upload-btn-box">
          <Link to="/material/upload" className="btn btn-success">
            <i className="bi bi-upload"></i> Upload New Material
          </Link>
        </div>

        <div className="filter-box">
          <input type="text" placeholder="Search materials, authors, or topics..."
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

        <div className="material-list">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((mat) => (
              <div key={mat._id} className="material-card">
                <div className="material-info">
                  <h3>{mat.title}</h3>
                  <p>{mat.description}</p>
                  <div className="tags">
                    <span>Grade {mat.classLevel}</span>
                    <span>{mat.subject}</span>
                    <span>{mat.topic}</span>
                  </div>
                  <div className="meta">
                    <span>{mat.author}</span>
                    <span>{new Date(mat.date).toLocaleDateString()}</span>
                    <span>{mat.downloads} downloads</span>
                  </div>
                </div>
                <div className="material-actions">
                  <span>{mat.size} MB</span>
                  <a
                    href={mat.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="preview-btn"
                  >
                    Preview
                  </a>
                  <a
                    href={mat.fileUrl}
                    download
                    className="download-btn"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No materials found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MaterialPage;
