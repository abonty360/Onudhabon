import React from 'react';
import './LoginForm.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function LoginForm() {
  return (
    <div className="login-form">
      <h3>Welcome Back</h3>
      <p className="form-subtext">Sign in to continue your volunteer journey</p>

      <div className="input-with-icon">
        <FaEnvelope className="icon" />
        <input type="email" placeholder="Enter your email" />
      </div>

      <div className="input-with-icon">
        <FaLock className="icon" />
        <input type="password" placeholder="Enter your password" />
      </div>

      <button className="login-btn">Sign In</button>
      <a href="#" className="forgot-link">Forgot your password?</a>
    </div>
  );
}

export default LoginForm;
