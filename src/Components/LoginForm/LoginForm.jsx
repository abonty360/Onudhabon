import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function LoginForm() {

   const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Replace with actual auth logic
    const isAuthenticated = true;

    if (isAuthenticated) {
      navigate('/home');
    }
  };
  return (
     <form className="login-form" onSubmit={handleLogin}>
      <h3>Welcome Back</h3>
      <p className="form-subtext">Sign in to continue your volunteer journey</p>

      <div className="input-with-icon">
        <FaEnvelope className="icon" />
        <div className="input-inner-box">
          <input type="email" placeholder="Enter your email" />
        </div>
      </div>

      <div className="input-with-icon">
        <FaLock className="icon" />
        <div className="input-inner-box">
          <input type="password" placeholder="Enter your password" />
        </div>
      </div>

      <button className="login-btn">Sign In</button>
      <a href="#" className="forgot-link">Forgot your password?</a>
    </form>
  );
}

export default LoginForm;