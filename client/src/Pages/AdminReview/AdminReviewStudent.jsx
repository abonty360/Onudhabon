import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import StudentReviewHero from "../../Components/HeroSection/StudentreviewHero";
import "./AdminReview.css";

function AdminReviewStudents({ isLoggedIn, handleLogout }) {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(null);

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
    </>
  );
}

export default AdminReviewStudents;
