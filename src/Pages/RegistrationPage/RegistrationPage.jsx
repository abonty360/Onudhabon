import React from 'react';
import RegisterForm from '../../Components/RegistrationForm/RegistrationForm';
import { Link } from 'react-router-dom';
import './RegistrationPage.css';

function RegistrationPage() {
  return (
    <div className="registration-page-container">
      <div className="registration-card">
        <div className="logo-section">
          <img src="/images/lightmode_logo.png" alt="Logo" className="logo-icon" />
          <h2 className="app-title">Onudhabon</h2>
          <p className="subtitle">Exploring Education</p>
          <p className="mission-text">Join our mission to explore education</p>
        </div>

        <div className="tabs">
          <Link to="/login" className="tab">Login</Link>
          <Link to="/register" className="tab active">Register</Link>
        </div>

        <RegisterForm />

        <Link to="/" className="guest-link">Continue as Guest</Link>
      </div>
    </div>
  );
}

export default RegistrationPage;
