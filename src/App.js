import React, { useState } from 'react';
import LoginForm from './Components/LoginForm/LoginForm';
import RegisterForm from './Components/RegistrationForm/RegistrationForm';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="app-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="logo-icon" />
          <h2 className="app-title">Onudhabon</h2>
          <p className="subtitle">Exploring Education</p>
          <p className="mission-text">Join our mission to explore education</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}

        <p className="guest-link">Continue as Guest</p>
      </div>
    </div>
  );
}

export default App;
