import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import LoginForm from '../../Components/LoginForm/LoginForm';
import './LoginPage.css';

function LoginPage({ handleLogin }) {

  const location = useLocation();
  const message = location.state?.message; // Safely get the message, will be 'undefined' if not passed

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

        {message && (
          <Alert variant="warning" className="mx-3 mb-3">
            {message}
          </Alert>
        )}

        <LoginForm handleLogin={handleLogin} />

        <Link to="/" className="guest-link">Continue as Guest</Link>
      </div>
      <div className="fixed-bottom-copyright">© 2025 Onudhabon. All rights reserved.</div>
    </div>
  );
}

export default LoginPage;
