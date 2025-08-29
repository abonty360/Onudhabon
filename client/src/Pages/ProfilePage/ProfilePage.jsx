import React from "react";
import NavbarComponent from '../../Components/NavbarComp/Navbarcomp';
import Footer from "../../Components/Footer";
function ProfilePage({ isLoggedIn, handleLogout }) {
  return (
    <>
    <NavbarComponent isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
    <Footer/>
    </>
  );

}
export default ProfilePage;