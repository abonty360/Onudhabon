import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CombinedProgressChart from "../Chart/CombinedProgressChart";
import "./VolunteerProfilePage.css"

export default function VolunteerProfilePage({ isLoggedIn, user, handleLogout }) {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);

   useEffect(() => {
    axios
      .get(`/api/admin/volunteers/${id}`)
      .then((res) => setVolunteer(res.data))
      .catch((err) => {
        console.error("Error fetching volunteer profile:", err);
      });
  }, [id]);

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

                  {prog && (
                    <CombinedProgressChart
                      overallProgress={prog.overallProgress}
                      subjects={prog.subjects}
                    />
                  )}

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
        <>
          <h4>Uploaded Lectures</h4>
          <ul>
            {volunteer.lectures?.map((l) => (
              <li key={l._id}>{l.title}</li>
            ))}
          </ul>

          <h4>Uploaded Materials</h4>
          <ul>
            {volunteer.materials?.map((m) => (
              <li key={m._id}>{m.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
