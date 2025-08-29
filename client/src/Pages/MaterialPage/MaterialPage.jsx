import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import "./MaterialPage.css";

function MaterialPage() {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/materials")
      .then((res) => res.json())
      .then((data) => setMaterials(data))
      .catch((err) => console.error(err));
  }, []);

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
          <input type="text" placeholder="Search materials, authors, or topics..." />
          <select>
            <option>All Classes</option>
          </select>
          <select>
            <option>All Subjects</option>
          </select>
          <select>
            <option>All Topics</option>
          </select>
        </div>

        <div className="material-list">
          {materials.map((mat) => (
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
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MaterialPage;
