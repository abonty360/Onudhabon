import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';

const rolesList = [
  { label: 'Local Guardian', desc: 'Register and track students in your community' },
  { label: 'Educator', desc: 'Create and deliver educational content' },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    terms: false,
    roles: [],
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (label) => {
    setFormData(prev => ({
      ...prev,
      roles: label,
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isValid = () => {
    const { name, email, phone, location, password, confirmPassword, terms, roles } = formData;
    return (
      name &&
      email &&
      phone &&
      location &&
      password && password.length >= 6 &&
      confirmPassword &&
      password === confirmPassword &&
      terms &&
      roles.length > 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid()) {
      // Optionally scroll to first invalid input
      const firstErrorField = document.querySelector('.error');
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      const response = await axios.post('/api/user/register', formData);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert(error.response.data.message);
      } else {
        alert('Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
    }
  };

  const getInputClass = (field) => {
    const error =
      submitted || touched[field]
        ? !formData[field] || 
          (field === 'confirmPassword' && formData.password !== formData.confirmPassword) ||
          (field === 'password' && formData.password.length > 0 && formData.password.length < 6)
        : false;
    return `input-with-icon ${error ? 'error' : ''}`;
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>Join Onudhabon</h3>
        <p className="form-mission-text">Create your volunteer account to start making a difference</p>
      </div>

      <div className={getInputClass('name')}>
        <FaUser className="icon" />
        <div className="input-inner-box">
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
          />
        </div>
      </div>

      <div className={getInputClass('email')}>
        <FaEnvelope className="icon" />
        <div className="input-inner-box">
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
          />
        </div>
      </div>

      <div className={getInputClass('phone')}>
        <FaPhone className="icon" />
        <div className="input-inner-box">
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
          />
        </div>
      </div>

      <div className={getInputClass('location')}>
        <FaMapMarkerAlt className="icon" />
        <div className="input-inner-box">
          <input
            type="text"
            name="location"
            placeholder="City, Country"
            value={formData.location}
            onChange={handleChange}
            onBlur={() => handleBlur('location')}
          />
        </div>
      </div>

      <p>Volunteer Roles (Select One)</p>
      <div className={`volunteer-roles ${submitted && formData.roles.length === 0 ? 'error' : ''}`}>
        {rolesList.map((role, i) => (
          <label className="role-card" key={i}>
            <input
              type="radio"
              name="volunteerRole"
              checked={formData.roles.includes(role.label)}
              onChange={() => handleRoleChange(role.label)}
            />
            <div>
              <div className="role-label">{role.label}</div>
              <div className="role-description">{role.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <div className={getInputClass('password')}>
        <FaLock className="icon" />
        <div className="input-inner-box">
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
          />
        </div>
      </div>
      {(submitted || touched.password) && formData.password.length > 0 && formData.password.length < 6 && (
        <p className="error-message">Password must be at least 6 characters long.</p>
      )}

      <div className={getInputClass('confirmPassword')}>
        <FaLock className="icon" />
        <div className="input-inner-box">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
          />
        </div>
      </div>
      {(submitted || touched.confirmPassword) && formData.password !== formData.confirmPassword && (
        <p className="error-message">Passwords do not match.</p>
      )}

      <label className={`checkbox-agreement ${submitted && !formData.terms ? 'error' : ''}`}>
        <input
          type="checkbox"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
        />{' '}
        I agree to the Terms of Service and Privacy Policy
      </label>

      <button
        type="submit"
        className={`create-account-btn ${isValid() ? 'active' : 'disabled'}`}
        disabled={!isValid()}
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
