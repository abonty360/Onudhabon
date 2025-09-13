import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import StudentProgressHero from "../../Components/HeroSection/StudentProgressHero.jsx";
import "./StudentprogressPage.css";

const StudentProgress = ({ isLoggedIn, handleLogout }) => {
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        birthCertificateId: "",
        fullName: "",
        address: "",
        fatherName: "",
        motherName: "",
        classLevel: "",
        enrollmentYear: "",
        consentLetter: null
    });

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

    useEffect(() => {
        if (user?.roles === "Local Guardian") {
            axios.get("http://localhost:5000/api/students/mine", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
                .then(res => setStudents(res.data))
                .catch(err => console.error("Error fetching students:", err));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        axios.post("http://localhost:5000/api/students", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data"
            }
        })
            .then(res => {
                alert(res.data.message);
                setStudents(prev => [res.data.student, ...prev]);
                setShowForm(false);
            })
            .catch(err => console.error("Error enrolling student:", err));
    };
    return (
        <>
            <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
            <StudentProgressHero />
            {user?.roles === "Local Guardian" && (
                <div className="student-progress-container">
                    <button
                        className={`toggle-form-btn ${showForm ? "open" : ""}`}
                        onClick={() => setShowForm(prev => !prev)}
                    >
                        <span className="icon">{showForm ? "×" : "+"}</span>
                        {showForm ? "Hide Enrollment Form" : "Enroll New Student"}
                    </button>
                    {showForm && (
                        <form onSubmit={handleSubmit} className="student-form">
                            <input
                                type="text"
                                name="birthCertificateId"
                                placeholder="Birth Certificate ID"
                                pattern="^\d{7,13}$"
                                title="Birth Certificate ID must be 7 to 13 digits"
                                onChange={handleChange}
                                onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                                required
                            />
                            <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
                            <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
                            <input
                                type="text"
                                name="fatherName"
                                placeholder="Father's Name"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="motherName"
                                placeholder="Mother's Name"
                                onChange={handleChange}
                                required
                            />
                            <input type="number" name="classLevel" placeholder="Class Level" min="0" max="12" onChange={handleChange} required />
                            <input type="number" name="enrollmentYear" placeholder="Enrollment Year" min="2025" onChange={handleChange} required />
                            <label>Consent Letter (PDF/Image)</label>
                            <input type="file" name="consentLetter" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} required />
                            <button type="submit">Submit Enrollment</button>
                        </form>
                    )}
                    <h2>My Students</h2>
                    <div className="student-list">
                        {students.map(stu => (
                            <div key={stu._id} className="student-card">
                                <h4>{stu.fullName}</h4>
                                <p>Birth Cert ID: {stu.birthCertificateId}</p>
                                <p>Class: {stu.classLevel} ({stu.enrollmentYear})</p>
                                <p>Status: <span className={`status-${stu.status}`}>{stu.status}</span></p>
                                <p>Father: {stu.fatherName}</p>
                                <p>Mother: {stu.motherName}</p>
                                <a href={stu.consentLetterUrl} target="_blank" rel="noreferrer">View Consent Letter</a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default StudentProgress;
