import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ViewVolunteersPage({ isLoggedIn, user, handleLogout }) {
  const [volunteers, setVolunteers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");

  useEffect(() => {
    fetchVolunteers();
  }, [searchName, searchRole]);

  const fetchVolunteers = async () => {
    const { data } = await axios.get("/api/admin/volunteers", {
      params: { name: searchName, role: searchRole }
    });
    setVolunteers(data);
  };

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
