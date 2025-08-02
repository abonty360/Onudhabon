import React, { useState } from 'react';
import './RegistrationForm.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock } from 'react-icons/fa';

const rolesList = [
  { label: 'Local Guardian', desc: 'Register and track students in your community' },
  { label: 'Lecturer', desc: 'Create and deliver educational content' },
  { label: 'Material Provider', desc: 'Contribute educational resources and materials' },
  { label: 'Evaluator', desc: 'Assess and evaluate student progress' },
];

const RegisterForm = () => {
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
    setFormData(prev => {
      const roles = prev.roles.includes(label)
        ? prev.roles.filter(r => r !== label)
        : [...prev.roles, label];
      return { ...prev, roles };
    });
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
      password &&
      confirmPassword &&
      password === confirmPassword &&
      terms &&
      roles.length > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isValid()) {
      // Optionally scroll to first invalid input
      const firstErrorField = document.querySelector('.error');
      if (firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    alert('Form submitted successfully!');
    // Submit logic here
  };

  const getInputClass = (field) => {
    const error =
      submitted || touched[field]
        ? !formData[field] || (field === 'confirmPassword' && formData.password !== formData.confirmPassword)
        : false;
    return `input-with-icon ${error ? 'error' : ''}`;
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>Join Onudhabon</h3>
        <p>Create your volunteer account to start making a difference</p>
      </div>

      <div className={getInputClass('name')}>
        <FaUser className="icon" />
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur('name')}
        />
      </div>

      <div className={getInputClass('email')}>
        <FaEnvelope className="icon" />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
        />
      </div>

      <div className={getInputClass('phone')}>
        <FaPhone className="icon" />
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          onBlur={() => handleBlur('phone')}
        />
      </div>

      <div className={getInputClass('location')}>
        <FaMapMarkerAlt className="icon" />
        <input
          type="text"
          name="location"
          placeholder="City, Country"
          value={formData.location}
          onChange={handleChange}
          onBlur={() => handleBlur('location')}
        />
      </div>

      <p>Volunteer Roles (Select all that apply)</p>
      <div className={`volunteer-roles ${submitted && formData.roles.length === 0 ? 'error' : ''}`}>
        {rolesList.map((role, i) => (
          <label className="role-card" key={i}>
            <input
              type="checkbox"
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
        <input
          type="password"
          name="password"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
        />
      </div>

      <div className={getInputClass('confirmPassword')}>
        <FaLock className="icon" />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={() => handleBlur('confirmPassword')}
        />
      </div>

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
