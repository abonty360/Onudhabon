import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import RegistrationPage from './Pages/RegistrationPage/RegistrationPage';
import HomePage from './Pages/HomePage/HomePage';
import AboutPage from './Pages/AboutPage/AboutPage';
import LecturePage from './Pages/LecturePage/LecturePage';
import MaterialPage from './Pages/MaterialPage/MaterialPage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import UploadLecture from './Upload/UploadLecture';
import UploadMaterial from './Upload/UploadMaterial';

import ForumList from './Pages/ForumPage/ForumList.jsx';
import ForumDetail from './Pages/ForumPage/ForumDetail.jsx';
import NewPostForm from './Pages/ForumPage/NewPostForm.jsx';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/home" element={<HomePage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/lecture" element={<LecturePage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/lecture/upload" element={<UploadLecture />} />
      <Route path="/material" element={<MaterialPage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/material/upload" element={<UploadMaterial />} />
      <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/about" element={<AboutPage isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/forum" element={<ForumList isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />} />
      <Route path="/forum/new" element={<NewPostForm />} />
      <Route path="/forum/:id" element={<ForumDetail />} />
    </Routes>
  );
}

export default App;
