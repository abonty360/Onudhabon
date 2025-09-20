import React, { useEffect, useState } from "react";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import LectureReviewHero from "../../Components/HeroSection/LectureReviewHero";
import "./AdminReview.css";
import axios from "axios";

function AdminReviewLectures({ isLoggedIn, handleLogout }) {
  const [lectures, setLectures] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [restrictionMessage, setRestrictionMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          handleLogout();
          return;
        }

        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err.response?.data || err.message);
        localStorage.removeItem("token");
        handleLogout();
      }
    };

    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn, handleLogout]);

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
  if (!user) {
    return <p>Loading...</p>;
  }

  if (user.roles !== "Admin") {
    return <p>Access denied. Admins only.</p>;
  }

  const handleViewProfile = (instructor) => {
    setSelectedInstructor(instructor);
    setRestrictionMessage("");
    setShowProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedInstructor(null);
    setRestrictionMessage("");
  };
  const getValidToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
      await axios.get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return token;
    } catch (err) {
      localStorage.removeItem("token");
      handleLogout();
      throw new Error("Invalid token");
    }
  };
  const handleToggleRestrict = async (id, currentStatus) => {
    try {
      const token = await getValidToken();
      const res = await fetch(`http://localhost:5000/api/user/${id}/restrict`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUser = await res.json();

      setLectures(prevLectures =>
        prevLectures.map(lec =>
          lec.instructor && lec.instructor._id === id ? { ...lec, instructor: updatedUser.user } : lec
        )
      );

      if (selectedInstructor && selectedInstructor._id === id) {
        setSelectedInstructor(updatedUser.user);
        setRestrictionMessage(
          `${updatedUser.user.name} is now ${updatedUser.user.isRestricted ? "restricted" : "unrestricted"}.`
        );
      }
    } catch (err) {
      console.error("Error toggling restriction:", err);
      setRestrictionMessage("Failed to update restriction status.");
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = await getValidToken();
      const res = await fetch(`http://localhost:5000/api/lectures/${id}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      await res.json();
      setLectures(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      console.error(`Error ${action} lecture:`, err);
    }
  };

  return (
    <>
      <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
      <LectureReviewHero />
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
                <p><strong>Instructor:</strong> {lec.instructor ? lec.instructor.name : "N/A"}</p>
                <button onClick={() => handleViewProfile(lec.instructor)} className="view-profile-btn" disabled={!lec.instructor}>View Profile</button>
                <p><strong>Grade:</strong> {lec.classLevel} | <strong>Subject:</strong> {lec.subject}</p>
                <div className="review-actions">
                  <button onClick={() => handleAction(lec._id, "approve")} className="approve-btn">Approve</button>
                  <button onClick={() => handleAction(lec._id, "decline")} className="decline-btn">Decline</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No pending lectures.</p>
        )}
      </div>
      <Footer />

      {showProfileModal && selectedInstructor && (
        <div className="profile-modal-overlay">
          <div className="profile-modal-content scrollable-content">
            <h2>Instructor Profile</h2>
            {restrictionMessage && (
              <p className="restriction-status-message">
                {restrictionMessage}
              </p>
            )}
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
            <p><strong>Status:</strong> {selectedInstructor.isRestricted ? "Restricted" : "Active"}</p>
            <button
              onClick={() => handleToggleRestrict(selectedInstructor._id, selectedInstructor.isRestricted)}
              className={selectedInstructor.isRestricted ? "unrestrict-btn" : "restrict-btn"}
            >
              {selectedInstructor.isRestricted ? "Unrestrict" : "Restrict"}
            </button>
            <button onClick={handleCloseProfileModal} className="close-modal-btn">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminReviewLectures;
