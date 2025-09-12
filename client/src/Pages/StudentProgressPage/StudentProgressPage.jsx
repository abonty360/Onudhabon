import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import StudentProgressHero from "../../Components/HeroSection/StudentProgressHero.jsx";
import "./StudentprogressPage.css";

const StudentProgress = ({ isLoggedIn, handleLogout }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axios.get("http://localhost:5000/api/user/profile", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data); 
                } catch (err) {
                    console.error("Failed to fetch profile:", err);
                }
            }
        };

        if (isLoggedIn) {
            fetchProfile();
        }
    }, [isLoggedIn]);

    return (
        <>
            <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
            <StudentProgressHero />
            <Footer />
        </>
    );
};

export default StudentProgress;
