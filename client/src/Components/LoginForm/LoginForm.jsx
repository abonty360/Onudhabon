import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import VerificationPopup from '../VerificationPopup/VerificationPopup';
import VerificationPendingPopup from '../VerificationPendingPopup/VerificationPendingPopup';

function LoginForm({ handleLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const [showVerificationPendingPopup, setShowVerificationPendingPopup] = useState(false);
  const [unverifiedUserId, setUnverifiedUserId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await axios.post('/api/user/login', { email, password });
      if (response.status === 200) {
        if (response.data.isVerified === false) {
          setUnverifiedUserId(response.data.user.id);
          if (response.data.user.verificationStatus === "pending") {
            setShowVerificationPendingPopup(true);
          } else {
            setShowVerificationPopup(true);
          }
        } else if (response.data.token) {
          handleLogin(response.data.token); // Save the token only if user is verified
          navigate('/home');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerificationPopup(false);
    // After successful verification submission, show pending message
    setShowVerificationPendingPopup(true);
  };

  const handleRedirectToHome = () => {
    setShowVerificationPendingPopup(false);
    navigate('/home');
  };

  useEffect(() => {
    let timer;
    if (showVerificationPendingPopup) {
      timer = setTimeout(() => {
        handleRedirectToHome();
      }, 3000); // Redirect after 3 seconds
    }
    return () => clearTimeout(timer);
  }, [showVerificationPendingPopup]);

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <h3>Welcome Back</h3>
        <p className="form-subtext">Sign in to continue your volunteer journey</p>

        {error && <p className="error-message">{error}</p>}

        <div className="input-with-icon">
          <FaEnvelope className="icon" />
          <div className="input-inner-box">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-with-icon">
          <FaLock className="icon" />
          <div className="input-inner-box">
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="login-btn">Sign In</button>
        <a href="#" className="forgot-link">Forgot your password?</a>
      </form>

      <VerificationPopup
        show={showVerificationPopup}
        handleClose={() => setShowVerificationPopup(false)}
        userId={unverifiedUserId}
        onVerified={handleVerificationSuccess}
      />

      <VerificationPendingPopup
        show={showVerificationPendingPopup}
        handleClose={() => setShowVerificationPendingPopup(false)}
        onRedirect={handleRedirectToHome}
      />
    </>
  );
}

export default LoginForm;
