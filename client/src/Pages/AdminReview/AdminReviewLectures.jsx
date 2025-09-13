import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import "./AdminReview.css";

function AdminReviewLectures({ isLoggedIn, handleLogout }) {
  const [lectures, setLectures] = useState([]);
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
      fetch("http://localhost:5000/api/lectures/review", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => setLectures(data))
        .catch(err => console.error("Error fetching pending lectures:", err));
    }
  }, [user]);

  const handleAction = (id, action) => {
    fetch(`http://localhost:5000/api/lectures/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(() => {
        setLectures(prev => prev.filter(l => l._id !== id));
      })
      .catch(err => console.error(`Error ${action} lecture:`, err));
  };

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <div className="admin-review-container">
        <h1>Review Pending Lectures</h1>
        {lectures.length > 0 ? (
          lectures.map(lec => (
            <div key={lec._id} className="review-card">
              <video width="300" controls poster={lec.thumbnail}>
                <source src={lec.videoUrl} type="video/mp4" />
              </video>
              <div>
                <h3>{lec.title}</h3>
                <p>{lec.description}</p>
                <p><strong>Instructor:</strong> {lec.instructor}</p>
                <p><strong>Grade:</strong> {lec.classLevel} | <strong>Subject:</strong> {lec.subject}</p>
                <button onClick={() => handleAction(lec._id, "approve")} className="approve-btn">Approve</button>
                <button onClick={() => handleAction(lec._id, "decline")} className="decline-btn">Decline</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending lectures.</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default AdminReviewLectures;
