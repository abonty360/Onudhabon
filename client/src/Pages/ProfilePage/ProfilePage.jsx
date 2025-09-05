import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/user/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data);
          setBio(res.data.bio || '');
        } catch (err) {
          setError("Failed to fetch profile data.");
          console.error("Failed to fetch profile data:", err);
        }
      } else {
        setError("No token found. Please log in.");
      }
    };

    fetchProfile();
  }, []);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put('http://localhost:5000/api/user/profile', { bio }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update bio.");
      console.error("Failed to update bio:", err);
    }
  };

  if (error) {
    return <div className="profile-page error">{error}</div>;
  }

  if (!user) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img src={user.picture || 'https://via.placeholder.com/150'} alt="Profile" className="profile-picture" />
          <div className="profile-header-content">
            <h1 className="profile-name">{user.name}</h1>
          </div>
        </div>
        <div className="profile-body">
          <div className="profile-info-item">
            <i className="info-icon fas fa-envelope"></i>
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="profile-info-item">
            <i className="info-icon fas fa-user-shield"></i>
            <span className="info-label">Role:</span>
            <span className="info-value">{user.roles}</span>
          </div>
          <div className="profile-info-item">
            <i className="info-icon fas fa-phone"></i>
            <span className="info-label">Phone:</span>
            <span className="info-value">{user.phone}</span>
          </div>
          <div className="profile-info-item">
            <i className="info-icon fas fa-map-marker-alt"></i>
            <span className="info-label">Location:</span>
            <span className="info-value">{user.location}</span>
          </div>
          <div className="profile-info-item">
            <i className="info-icon fas fa-book-open"></i>
            <span className="info-label">Bio:</span>
            {isEditing ? (
              <form onSubmit={handleBioSubmit}>
                <textarea value={bio} onChange={handleBioChange} className="bio-textarea" />
                <button type="submit" className="bio-save-button">Save</button>
                <button onClick={() => setIsEditing(false)} className="bio-cancel-button">Cancel</button>
              </form>
            ) : (
              <div className="bio-display">
                <span className="info-value">{user.bio || 'No bio yet.'}</span>
                <i className="fas fa-pencil-alt bio-edit-icon" onClick={() => setIsEditing(true)}></i>
              </div>
            )}
          </div>
        </div>
        <div className="profile-footer">
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
