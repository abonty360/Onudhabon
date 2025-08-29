import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage/RegistrationPage";
import HomePage from "./Pages/HomePage/HomePage";
import AboutPage from "./Pages/AboutPage/AboutPage";
import LecturePage from "./Pages/LecturePage/LecturePage";
import MaterialPage from "./Pages/MaterialPage/MaterialPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import UploadLecture from "./Upload/UploadLecture";
import UploadMaterial from "./Upload/UploadMaterial";
import ForumList from "./Pages/ForumList";
import ForumDetail from "./Pages/ForumDetail";
import NewPostForm from "./Pages/NewPostForm";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/lecture" element={<LecturePage />} />
      <Route path="/lecture/upload" element={<UploadLecture />} />
      <Route path="/material" element={<MaterialPage />} />
      <Route path="/material/upload" element={<UploadMaterial />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/forum" element={<ForumList />} />
      <Route path="/forum/new" element={<NewPostForm />} />
      <Route path="/forum/:id" element={<ForumDetail />} />
    </Routes>
  );
}

export default App;
