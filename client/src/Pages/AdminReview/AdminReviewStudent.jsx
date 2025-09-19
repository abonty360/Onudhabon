import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import StudentReviewHero from "../../Components/HeroSection/StudentreviewHero";
import { Link } from "react-router-dom";
import "./AdminReview.css";

function AdminReviewStudents({ isLoggedIn, handleLogout }) {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [restrictionMessage, setRestrictionMessage] = useState("");

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
      fetch("http://localhost:5000/api/students/review", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => setStudents(data))
        .catch(err => console.error("Error fetching pending students:", err));
    }
  }, [user]);

  const handleAction = (id, action) => {
    fetch(`http://localhost:5000/api/students/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(() => {
        setStudents(prev => prev.filter(s => s._id !== id));
      })
      .catch(err => console.error(`Error ${action} student:`, err));
  };

  const handleViewProfile = async (guardianId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${guardianId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedStudent(data.user); // Renaming selectedStudent to selectedUser for clarity in modal
        setRestrictionMessage("");
        setShowProfileModal(true);
      } else {
        console.error("Error fetching guardian profile:", data.message);
        setRestrictionMessage(data.message || "Failed to fetch guardian profile.");
      }
    } catch (err) {
      console.error("Error fetching guardian profile:", err);
      setRestrictionMessage("Failed to fetch guardian profile.");
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedStudent(null);
    setRestrictionMessage("");
  };

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <StudentReviewHero/>
      <div className="admin-review-container">
        <h1>Review Pending Student Enrollments</h1>
        {students.length > 0 ? (
          students.map(stu => (
            <div key={stu._id} className="review-card">
              <div className="student-info">
                <h3>{stu.fullName}</h3>
                <p><strong>Birth Certificate ID:</strong> {stu.birthCertificateId}</p>
                <p><strong>Address:</strong> {stu.address}</p>
                <p><strong>Father's Name:</strong> {stu.fatherName}</p>
                <p><strong>Mother's Name:</strong> {stu.motherName}</p>
                <p><strong>Class:</strong> {stu.classLevel} ({stu.enrollmentYear})</p>
                <p><strong>Local Guardian:</strong> {stu.guardianName}</p>
                <strong>Local Guardian ID:</strong> {stu.guardianId}
                <p><strong>Status:</strong> {stu.status}</p>
                <a href={stu.consentLetterUrl} target="_blank" rel="noreferrer">View Consent Letter</a>
              </div>
              <div className="review-actions">
                <button onClick={() => handleViewProfile(stu.guardianId)} className="view-profile-btn">View Profile</button>
                <button onClick={() => handleAction(stu._id, "approve")} className="approve-btn">Approve</button>
                <button onClick={() => handleAction(stu._id, "decline")} className="decline-btn">Decline</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending student enrollments.</p>
        )}
      </div>
      <Footer />

      {showProfileModal && selectedStudent && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content scrollable-content">
            <h2>Guardian Profile</h2>
            {restrictionMessage && (
              <p className="restriction-status-message">
                {restrictionMessage}
              </p>
            )}
            {selectedStudent.picture && (
              <div className="profile-picture-container">
                <img src={selectedStudent.picture} alt="Profile" className="profile-picture" />
              </div>
            )}
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Phone:</strong> {selectedStudent.phone}</p>
            <p><strong>Location:</strong> {selectedStudent.location}</p>
            <p><strong>Role:</strong> {selectedStudent.roles}</p>
            <p><strong>Bio:</strong> {selectedStudent.bio}</p>
            <p><strong>Status:</strong> {selectedStudent.isRestricted ? "Restricted" : "Active"}</p>
            {/* Add restrict/unrestrict button if applicable for guardians */}
            <button onClick={handleCloseProfileModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminReviewStudents;
