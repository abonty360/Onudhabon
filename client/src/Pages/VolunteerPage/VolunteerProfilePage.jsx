import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
//import CombinedProgressChart from "../Chart/CombinedProgressChart";
import "./VolunteerProfilePage.css"

export default function VolunteerProfilePage({ isLoggedIn, user, handleLogout }) {
    const { id } = useParams();
    const [volunteer, setVolunteer] = useState(null);

    useEffect(() => {
  const fetchVolunteer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/admin/volunteers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setVolunteer(res.data);
      } else {
        console.warn("Volunteer not found, logging out");
        localStorage.removeItem("token");
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching volunteer profile:", err.response?.data || err.message);
      localStorage.removeItem("token");
      handleLogout();
    }
  };

  fetchVolunteer();
}, [id, handleLogout]);

    if (!volunteer) return <p>Loading...</p>;

    return (
        <div className="container mt-4">
            <h2>{volunteer.name}</h2>
            <p>Role: {volunteer.roles}</p>

            {volunteer.roles === "Local Guardian" && (
                <>
                    <h4>Enrolled Students</h4>
                    <div className="student-list">
                        {volunteer.students?.map((stu) => {
                            const prog = volunteer.progressData?.[String(stu._id)];
                            return (
                                <div key={stu._id} className="student-card">
                                    <h4>{stu.fullName}</h4>
                                    <p>Birth Cert ID: {stu.birthCertificateId}</p>
                                    <p>
                                        Current Class:{" "}
                                        {prog?.classLevel ?? stu.classLevel}
                                    </p>

                                    {prog?.completedClasses?.length > 0 && (
                                        <div className="completed-classes">
                                            <h5>
                                                Classes Completed: {prog.completedClasses.length}
                                            </h5>
                                            <ul>
                                                {prog.completedClasses.map((c) => (
                                                    <li key={c.classLevel}>
                                                        Class {c.classLevel} –{" "}
                                                        {c.overallProgress.toFixed(1)}%
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <p>Enrollment Year: {stu.enrollmentYear}</p>

                                    {/*
                                    {prog?.subjects?.length > 0 ? (
                                        <CombinedProgressChart
                                            overallProgress={prog.overallProgress}
                                            subjects={prog.subjects}
                                        />
                                    ) : (
                                        <p>No progress data available yet.</p>
                                    )}
                                    */}

                                    <p>
                                        Status:{" "}
                                        <span className={`status-${stu.status}`}>
                                            {stu.status}
                                        </span>
                                    </p>
                                    <p>Father: {stu.fatherName}</p>
                                    <p>Mother: {stu.motherName}</p>

                                    {stu.consentLetterUrl && (
                                        <a
                                            href={stu.consentLetterUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View Consent Letter
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {volunteer.roles === "Educator" && (
                <div className="page-container">
                    <h3>Uploaded Lectures</h3>
                    {(!volunteer.lectures || volunteer.lectures.length === 0) ? (
                        <p>No lectures uploaded yet.</p>
                    ) : (
                        <div className="student-list">
                            {volunteer.lectures.map((lec) => (
                                <div key={lec._id} className="student-card">
                                    <h4>{lec.title}</h4>
                                    <p>{lec.description}</p>
                                    <p><strong>Subject:</strong> {lec.subject} — <strong>Topic:</strong> {lec.topic}</p>
                                    <video controls src={lec.videoUrl} poster={lec.thumbnail}  style={{ width: "100%", borderRadius: "6px" }} />
                                    <p>Status: {lec.status}</p>
                                    <p>Uploaded: {new Date(lec.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <h3 style={{ marginTop: "1.5rem" }}>Uploaded Materials</h3>
                    {(!volunteer.materials || volunteer.materials.length === 0) ? (
                        <p>No materials uploaded yet.</p>
                    ) : (
                        <div className="student-list">
                            {volunteer.materials.map((mat) => (
                                <div key={mat._id} className="student-card">
                                    <h4>{mat.title}</h4>
                                    <p>{mat.description}</p>
                                    <p><strong>Subject:</strong> {mat.subject} — <strong>Topic:</strong> {mat.topic}</p>
                                    <a href={mat.fileUrl} target="_blank" rel="noreferrer">Open Material</a>
                                    {mat.size && <p>Size: {(mat.size / 1024 / 1024).toFixed(2)} MB</p>}
                                    <p>Downloads: {mat.downloads}</p>
                                    <p>Status: {mat.status}</p>
                                    <p>Uploaded: {new Date(mat.date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
