import React from 'react';
import LoginForm from '../../Components/LoginForm/LoginForm';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="logo-section">
          <img src="/images/navbar_logo.png" alt="Onudhabon Logo" className="logo-icon" />
          <h2 className="app-title">Onudhabon</h2>
          <p className="subtitle">Exploring Education</p>
          <p className="mission-text">Join our mission to explore education</p>
        </div>

        <div className="tabs">
          <Link to="/login" className="tab active">Login</Link>
          <Link to="/register" className="tab">Register</Link>
        </div>

        <LoginForm />

        <Link to="/" className="guest-link">Continue as Guest</Link>
      </div>
      <div className="fixed-bottom-copyright">© 2025 Onudhabon. All rights reserved.</div>
    </div>
  );
}

export default LoginPage;