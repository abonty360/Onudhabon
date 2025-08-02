import React from 'react';
import './HomePage.css';
import NavbarComponent from '../../Components/NavbarComp/Navbarcomp';

function HomePage() {
  return (
    <div className="home-page">
      <NavbarComponent />
      <div>
        <h1>Welcome to Onudhabon!</h1>
        <p>Your journey to explore education starts here.</p>
        <p>This is the home page content.</p>
      </div>

    </div>
  );
}
export default HomePage;
