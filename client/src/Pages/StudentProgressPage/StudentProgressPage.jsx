import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import CombinedProgressChart from '../Chart/CombinedProgressChart.js';
import NavbarComponent from "../../Components/NavbarComp/Navbarcomp";
import Footer from "../../Components/Footer";
import StudentProgressHero from "../../Components/HeroSection/StudentProgressHero.jsx";
import "./StudentprogressPage.css";

const StudentProgress = ({ isLoggedIn, handleLogout }) => {
    const [user, setUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [progressData, setProgressData] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [updateForm, setUpdateForm] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            if (!token) {
                handleLogout(); 
                return;
            }

            try {
                const res = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data) {
                    setUser(res.data);
                } else {
                    console.warn("Profile not found, logging out");
                    localStorage.removeItem("token");
                    handleLogout();
                }
            } catch (err) {
                console.error("Failed to fetch profile:", err.response?.data || err.message);
                localStorage.removeItem("token");
                handleLogout();
            }
        };

        if (isLoggedIn) {
            fetchProfile();
        }
    }, [isLoggedIn, handleLogout]);

    useEffect(() => {
        if (user?.roles === "Local Guardian") {
            axios.get("http://localhost:5000/api/students/mine", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
                .then(res => {
                    setStudents(res.data);
                    res.data.forEach(stu => fetchProgress(stu._id));
                })
                .catch(err => console.error("Error fetching students:", err));
        }
    }, [user]);

    useEffect(() => {
        if (user?.roles === "Local Guardian") {
            const socket = io("http://localhost:5000");
            socket.emit("joinGuardian", { guardianId: user._id });
            socket.on("progressUpdated", (data) => {
                setProgressData(prev => ({ ...prev, [data.studentId]: data }));
            });
            return () => socket.disconnect();
        }
    }, [user]);

    const fetchProgress = async (studentId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/students/${studentId}/progress`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setProgressData(prev => ({ ...prev, [studentId]: res.data }));
        } catch (err) {
            console.error("Error fetching progress:", err);
        }
    };

    const handleUpdateChange = (studentId, field, value) => {
        setUpdateForm(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: value }
        }));
    };

    const handleUpdateSubmit = async (studentId) => {
        try {
            await axios.patch(`http://localhost:5000/api/students/${studentId}/progress`, updateForm[studentId], {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            fetchProgress(studentId);
            alert("Student updated successfully");
        } catch (err) {
            console.error("Error updating student:", err);
            alert(err.response?.data || err.message);
        }
    };

    const promoteStudent = async stu => {
        try {
            await axios.patch(
                `http://localhost:5000/api/students/${stu._id}`,
                { classLevel: stu.classLevel + 1 },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            // Update local state
            setStudents(prev =>
                prev.map(s =>
                    s._id === stu._id ? { ...s, classLevel: s.classLevel + 1 } : s
                )
            );
            fetchProgress(stu._id);
            alert("Promoted successfully");
            setShowForm(null);
        } catch (err) {
            console.error("Error promoting:", err);
            alert(err.response?.data || err.message);
        }
    };

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
        setIsSubmitting(true);
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
            .catch(err => {
                if (err.response && err.response.status === 403) {
                    alert(err.response.data.error);
                } else if (err.response && err.response.data && err.response.data.error) {
                    alert(err.response.data.error);
                } else {
                    alert("Error enrolling student. Please try again.");
                }
                console.error("Error enrolling student:", err);

            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };
    return (
        <>
            <NavbarComponent isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
            <StudentProgressHero />
            {user?.roles === "Local Guardian" && (
                <div className="student-progress-container">
                    <button
                        className={`toggle-form-btn ${showForm ? "open" : ""}`}
                        onClick={() => {
                            if (user?.isRestricted) {
                                alert("You are restricted from enrolling new students.");
                            } else {
                                setShowForm(prev => !prev);
                            }
                        }}
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
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Enrollment"}
                            </button>
                        </form>
                    )}
                    <h2>My Students</h2>
                    <div className="student-list">
                        {students.map(stu => {
                            const prog = progressData[stu._id];
                            const canPromote =
                                prog?.subjects?.length > 0 &&
                                prog.subjects.every(s => s.lecturesCompleted >= s.lecturesSupplied);
                            return (
                                <div key={stu._id} className="student-card">
                                    <h4>{stu.fullName}</h4>
                                    <p>Birth Cert ID: {stu.birthCertificateId}</p>
                                    <p>Current Class: {progressData[stu._id]?.classLevel ?? stu.classLevel}</p>
                                    {prog?.completedClasses?.length > 0 && (
                                        <div className="completed-classes">
                                            <h5>Classes Completed: {prog.completedClasses.length}</h5>
                                            <ul>
                                                {prog.completedClasses.map(c => (
                                                    <li key={c.classLevel}>
                                                        Class {c.classLevel} – {c.overallProgress.toFixed(1)}%
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <p>Enrollment Year: {stu.enrollmentYear}</p>
                                    {prog && (
                                        <CombinedProgressChart
                                            overallProgress={prog.overallProgress}
                                            subjects={prog.subjects}
                                        />
                                    )}
                                    <button
                                        className="update-btn"
                                        onClick={() => {
                                            if (user?.isRestricted) {
                                                alert("You are restricted from updating student progress.");
                                            } else {
                                                setShowForm(showForm === stu._id ? null : stu._id);
                                            }
                                        }}
                                    >
                                        {showForm === stu._id ? "Cancel Update" : "Update Progress"}
                                    </button>
                                    {showForm === stu._id && stu.status !== "pending" && stu.status !== "declined" && (
                                        <div className="update-form">
                                            <div className="form-group">
                                                <label htmlFor={`subject-${stu._id}`}>Subject</label>
                                                <select
                                                    id={`subject-${stu._id}`}
                                                    value={updateForm[stu._id]?.subjectName || ""}
                                                    onChange={e =>
                                                        handleUpdateChange(
                                                            stu._id,
                                                            "subjectName",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="" disabled>
                                                        Select a subject
                                                    </option>
                                                    {Array.isArray(prog?.subjects) &&
                                                        prog.subjects.map(s => (
                                                            <option key={s.name} value={s.name}>
                                                                {s.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                            {updateForm[stu._id]?.subjectName && (
                                                <>
                                                    <div className="form-group">
                                                        <label>Lectures Supplied</label>
                                                        <select
                                                            value={updateForm[stu._id]?.lecturesSupplied || ""}
                                                            onChange={e =>
                                                                handleUpdateChange(stu._id, "lecturesSupplied", Number(e.target.value))
                                                            }
                                                        >
                                                            <option value="" disabled>Select lectures supplied</option>
                                                            {(() => {
                                                                const subject = prog.subjects.find(
                                                                    s => s.name === updateForm[stu._id]?.subjectName
                                                                );
                                                                const total = subject?.totalLectures || 0;
                                                                return Array.from({ length: total + 1 }, (_, i) => (
                                                                    <option key={i} value={i}>{i}</option>
                                                                ));
                                                            })()}
                                                        </select>
                                                    </div>

                                                    {/* Lectures Completed Delta (max = remaining) */}
                                                    <div className="form-group">
                                                        <label>Lectures Completed</label>
                                                        <select
                                                            value={updateForm[stu._id]?.lecturesCompletedDelta || ""}
                                                            onChange={e =>
                                                                handleUpdateChange(stu._id, "lecturesCompletedDelta", Number(e.target.value))
                                                            }
                                                        >
                                                            <option value="" disabled>Select lectures completed</option>
                                                            {(() => {
                                                                const subject = Array.isArray(prog?.subjects) &&
                                                                    prog.subjects.find(s => s.name === updateForm[stu._id]?.subjectName);

                                                                const alreadyCompleted = subject?.lecturesCompleted || 0;
                                                                const total = subject?.totalLectures || 0;

                                                                return Array.from(
                                                                    { length: total - alreadyCompleted + 1 },
                                                                    (_, i) => {
                                                                        const value = alreadyCompleted + i;
                                                                        return (
                                                                            <option key={value} value={value}>
                                                                                {value}
                                                                            </option>
                                                                        );
                                                                    }
                                                                );
                                                            })()}
                                                        </select>
                                                    </div>

                                                    {/* Grade Received */}
                                                    <div className="form-group">
                                                        <label>Grade Received</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={updateForm[stu._id]?.gradeReceived || ""}
                                                            onChange={e =>
                                                                handleUpdateChange(
                                                                    stu._id,
                                                                    "gradeReceived",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <button
                                                        className="save-btn"
                                                        onClick={() => handleUpdateSubmit(stu._id)}
                                                    >
                                                        Save Progress
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    {showForm === stu._id && (stu.status === "pending" || stu.status === "declined") && (
                                        <div className="status-message">
                                            Progress updates are unavailable until this student is verified.
                                        </div>
                                    )}
                                    <button
                                        className="promote-btn"
                                        disabled={!canPromote}
                                        onClick={() => promoteStudent(stu)}
                                    >
                                        {canPromote
                                            ? `Promote to Class ${stu.classLevel + 1}`
                                            : "Complete all lectures to unlock promotion"}
                                    </button>
                                    <p>Status: <span className={`status-${stu.status}`}>{stu.status}</span></p>
                                    <p>Father: {stu.fatherName}</p>
                                    <p>Mother: {stu.motherName}</p>
                                    <a href={stu.consentLetterUrl} target="_blank" rel="noreferrer">View Consent Letter</a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default StudentProgress;
