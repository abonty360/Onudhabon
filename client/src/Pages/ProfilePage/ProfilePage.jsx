import React, { useState, useEffect } from 'react';
import Footer from "../../Components/Footer";
import ProfileNavbar from "../../Components/NavbarComp/ProfileNavbar";
import { jwtDecode } from "jwt-decode";
const  ProfilePage = ({ isLoggedIn, handleLogout }) => {

    const [user, setUser] = useState(null);
  
      useEffect(() => {
        if (isLoggedIn) {
          const token = localStorage.getItem("token");
          if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
          }
        }
      }, [isLoggedIn]);
  return (
    <>
    <ProfileNavbar isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />
    <Footer/>
    </>
  );

}
export default ProfilePage;