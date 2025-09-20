import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ViewVolunteersPage({ isLoggedIn, user, handleLogout }) {
  const [volunteers, setVolunteers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVolunteers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/api/admin/volunteers", {
          headers: { Authorization: `Bearer ${token}` },
          params: { name: searchName, role: searchRole }
        });
        setVolunteers(data);
      } catch (err) {
        console.error("Error fetching volunteers:", err.response?.data || err.message);
        // Invalid/expired token → logout
        localStorage.removeItem("token");
        handleLogout();
        navigate("/login");
      }
    };

    if (isLoggedIn) {
      fetchVolunteers();
    }
  }, [isLoggedIn, searchName, searchRole, handleLogout, navigate]);

  if (user && user.roles !== "Admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>All Volunteers</h2>
      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search by name"
          className="form-control me-2"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select
          className="form-select"
          value={searchRole}
          onChange={(e) => setSearchRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="Local Guardian">Local Guardian</option>
          <option value="Educator">Educator</option>
        </select>
      </div>

      <ul className="list-group">
        {volunteers.map((v) => (
          <li key={v._id} className="list-group-item">
            <Link to={`/admin/volunteers/${v._id}`}>{v.name}</Link> — {v.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
