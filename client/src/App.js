import { useState } from 'react';
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
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/home" element={<HomePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
      <Route path="/lecture" element={<LecturePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
      <Route path="/lecture/upload" element={<UploadLecture />} />
      <Route path="/material" element={<MaterialPage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
      <Route path="/material/upload" element={<UploadMaterial />} />
      <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}

export default App;
