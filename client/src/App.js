import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage/RegistrationPage";
import HomePage from "./Pages/HomePage/HomePage";
import AboutPage from "./Pages/AboutPage/AboutPage";
import StudentProgress from "./Pages/StudentProgressPage/StudentProgressPage.jsx";
import LecturePage from "./Pages/LecturePage/LecturePage";
import MaterialPage from "./Pages/MaterialPage/MaterialPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import UploadLecture from "./Upload/UploadLecture";
import UploadMaterial from "./Upload/UploadMaterial";

import ForumList from "./Pages/ForumPage/ForumList.jsx";
import ForumDetail from "./Pages/ForumPage/ForumDetail.jsx";
import NewPostForm from "./Pages/ForumPage/NewPostForm.jsx";
import AdminReviewLectures from "./Pages/AdminReview/AdminReviewLectures.jsx";
import AdminReviewMaterials from "./Pages/AdminReview/AdminReviewMaterials.jsx";
import AdminReviewStudents from "./Pages/AdminReview/AdminReviewStudent.jsx";
import SettingsPage from "./Pages/SettingsPage.jsx";
import Donation from "./Pages/DonationPage/Donation";
import ViewVolunteersPage from "./Pages/VolunteerPage/ViewVolunteerPage.jsx";
import VolunteerProfilePage from "./Pages/VolunteerPage/VolunteerProfilePage.jsx";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token from localStorage:", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsLoggedIn(true);
        console.log("token validated");
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      <Route path="/register" element={<RegistrationPage />} />

      <Route path="/home" element={<HomePage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/lecture" element={<LecturePage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/lecture/upload" element={isLoggedIn && user?.roles === "Educator"
        ? <UploadLecture />
        : <Navigate to="/login" />
      }
      />
      <Route path="/material" element={<MaterialPage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/material/upload" element={isLoggedIn && user?.roles === "Educator"
        ? <UploadMaterial />
        : <Navigate to="/login" />
      }
      />
      <Route path="/profile" element={<ProfilePage key={Date.now()} isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/about" element={<AboutPage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/forum" element={<ForumList isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />

      <Route path="/forum/new" element={<NewPostForm />} />
      <Route path="/forum/:id" element={<ForumDetail />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/donation" element={<Donation />} />

      <Route
        path="/studentprogress"
        element={
          <StudentProgress
            isLoggedIn={isLoggedIn}
            user={user}
            handleLogout={handleLogout}
          />
        }
      />
      <Route
        path="/admin/review-lectures"
        element={
          isLoggedIn && user?.roles === "Admin" ? (
            <AdminReviewLectures
              isLoggedIn={isLoggedIn}
              user={user}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/review-materials"
        element={
          isLoggedIn && user?.roles === "Admin" ? (
            <AdminReviewMaterials
              isLoggedIn={isLoggedIn}
              user={user}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/review-students"
        element={
          isLoggedIn && user?.roles === "Admin" ? (
            <AdminReviewStudents
              isLoggedIn={isLoggedIn}
              user={user}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/admin/volunteers" element={
        isLoggedIn && user?.roles === "Admin" ? (
          <ViewVolunteersPage
            isLoggedIn={isLoggedIn}
            user={user}
            handleLogout={handleLogout}
          />
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/admin/volunteers/:id" element={
        isLoggedIn && user?.roles === "Admin" ? (
          <VolunteerProfilePage
            isLoggedIn={isLoggedIn}
            user={user}
            handleLogout={handleLogout}
          />
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

export default App;
