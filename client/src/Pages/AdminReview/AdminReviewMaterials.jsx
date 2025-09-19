import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import MaterialReviewHero from "../../Components/HeroSection/MaterialReviewHero";
import "./AdminReview.css";

function AdminReviewMaterials({ isLoggedIn, handleLogout }) {
  const [materials, setMaterials] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

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
    if (user?.roles === "Admin") {
      fetch("http://localhost:5000/api/materials/review", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => setMaterials(data))
        .catch(err => console.error("Error fetching pending materials:", err));
    }
  }, [user]);

  const handleViewProfile = (instructor) => {
    setSelectedInstructor(instructor);
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedInstructor(null);
  };

  const handleAction = (id, action) => {
    fetch(`http://localhost:5000/api/materials/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(() => {
        setMaterials(prev => prev.filter(m => m._id !== id));
      })
      .catch(err => console.error(`Error ${action} material:`, err));
  };

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <MaterialReviewHero />
      <div className="admin-review-container">
        <h1>Review Pending Materials</h1>
        {materials.length > 0 ? (
          materials.map(mat => (
            <div key={mat._id} className="review-card">
              <div className="material-preview">
                {mat.fileUrl?.toLowerCase().includes(".pdf") ? (
                  <iframe
                    src={`${mat.fileUrl}#toolbar=0`}
                    title={mat.title}
                    width="300"
                    height="200"
                    style={{ border: "none" }}
                  ></iframe>
                ) : (
                  <p>No preview available</p>
                )}
              </div>
              <div>
                <h3>{mat.title}</h3>
                <p>{mat.description}</p>
                <p><strong>Instructor:</strong> {mat.instructor ? mat.instructor.name : "N/A"}</p>
                <p><strong>Grade:</strong> {mat.classLevel} | <strong>Subject:</strong> {mat.subject}</p>
                <button onClick={() => handleViewProfile(mat.instructor)} className="view-profile-btn" disabled={!mat.instructor}>View Profile</button>
                <button onClick={() => handleAction(mat._id, "approve")} className="approve-btn">Approve</button>
                <button onClick={() => handleAction(mat._id, "decline")} className="decline-btn">Decline</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending materials.</p>
        )}
      </div>
      <Footer />

      {showProfileModal && selectedInstructor && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content scrollable-content">
            <h2>Instructor Profile</h2>
            {selectedInstructor.picture && (
              <div className="profile-picture-container">
                <img src={selectedInstructor.picture} alt="Profile" className="profile-picture" />
              </div>
            )}
            <p><strong>Name:</strong> {selectedInstructor.name}</p>
            <p><strong>Email:</strong> {selectedInstructor.email}</p>
            <p><strong>Phone:</strong> {selectedInstructor.phone}</p>
            <p><strong>Location:</strong> {selectedInstructor.location}</p>
            <p><strong>Role:</strong> {selectedInstructor.roles}</p>
            <p><strong>Bio:</strong> {selectedInstructor.bio}</p>
            <button onClick={handleCloseProfileModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminReviewMaterials;
