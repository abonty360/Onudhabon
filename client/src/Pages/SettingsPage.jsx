import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
        });
      } catch {
        setMessage("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "http://localhost:5000/api/user/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setMessage("Profile updated!");
    } catch {
      setMessage("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:5000/api/user/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password updated!");
      setOldPassword("");
      setNewPassword("");
    } catch {
      setMessage("Failed to update password");
    }
  };

  if (!user) return <p className="loading-text">Loading...</p>;

  return (
    <div className="settings-container">
      <h2 className="page-title">Account Settings</h2>
      {message && <p className="message">{message}</p>}

      <div className="section-card">
        <h3>Profile Info</h3>
        <form onSubmit={handleProfileUpdate} className="settings-form">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />

          <label>Email</label>
          <input name="email" type="email" value={formData.email} disabled />

          <label>Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />

          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <button type="submit" className="btn-primary">
            Save Profile
          </button>
        </form>
      </div>

      <div className="section-card">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordUpdate} className="settings-form">
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Change Password
          </button>
        </form>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
};

export default SettingsPage;
