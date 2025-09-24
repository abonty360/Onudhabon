import React, { useEffect, useState } from "react";
import "./CarbonEmission.css";
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import carbonImg from "../../assets/carbon-hero.jpg";
import axios from 'axios';

function CarbonEmission({ isLoggedIn, handleLogout }) {
    const [user, setUser] = useState(null);
    const [emission, setEmission] = useState(null);
    const [bytesTransferred, setBytesTransferred] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/emission", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                const emissionValue = Number(data.emission);
                setEmission(isNaN(emissionValue) ? 0 : emissionValue);

                setBytesTransferred(data.dataTransferred ?? 0);

                if (data.user) {
                    setUser(data.user);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching emission data:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null);
                return;
            }
            try {
                const res = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data && res.data.name) {
                    setUser(res.data);
                } else {
                    console.warn("Profile response invalid, treating as guest");
                    setUser(null);
                }
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem("token");
                    handleLogout();
                } else {
                    setUser(null);
                }
            }
        };
        if (isLoggedIn) {
            fetchProfile();
        }
    }, [isLoggedIn, handleLogout]);

    const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

    return (
        <>
            <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
            <div className="carbon-hero-section">
                <h1 className="carbon-hero-title">Carbon Emission</h1>
            </div>
            <div className="carbon-card-wrapper">
                <div className="carbon-card">

                    <h3>Network Carbon Footprint</h3>

                    {loading ? (
                        <p>Loading emission data...</p>
                    ) : error ? (
                        <p style={{ color: "red" }}>Error: {error}</p>
                    ) : (
                        <>

                            <p>
                                <b>User:</b> {user?.name ?? "Guest"}
                            </p>
                            <p>
                                <b>Bytes Transferred:</b> {formatBytes(bytesTransferred)}
                            </p>
                            <p>
                                <b>CO₂ Emissions:</b>{" "}
                                {emission < 0.001
                                    ? `${(emission * 1000).toFixed(2)} mg CO₂eq`
                                    : `${emission.toExponential(6)} g CO₂eq`}
                            </p>
                            <p className="carbon-note">
                                Carbon impact tracked across your active session (guest or logged‑in)
                            </p>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CarbonEmission;
