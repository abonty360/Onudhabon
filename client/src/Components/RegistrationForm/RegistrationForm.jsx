import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaChevronDown, FaChevronUp, FaGraduationCap } from 'react-icons/fa';

const rolesList = [
  { label: 'Local Guardian', desc: 'Register and track students in your community' },
  { label: 'Educator', desc: 'Create and deliver educational content' },
];

const generateYears = (startYear) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= startYear; i--) {
    years.push(i.toString());
  }
  return years;
};

const sscYears = generateYears(1980);
const hscYears = generateYears(1980);
const universityYears = generateYears(1980);
const ages = Array.from({ length: 43 }, (_, i) => (i + 18).toString()); // Ages 18-60

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
    age: '',
    sscPassingYear: '',
    sscInstitute: '',
    hscPassingYear: '',
    hscInstitute: '',
    universityName: '',
    universityPassingYear: '',
    currentlyStudying: false,
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showEducationalQualification, setShowEducationalQualification] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: digits
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const toggleEducationalQualification = () => {
    setShowEducationalQualification(prev => !prev);
  };

  const handleRoleChange = (label) => {
    setFormData(prev => ({
      ...prev,
      roles: label,
    }));
  };

  const [emailError, setEmailError] = useState('');

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const { email } = formData;
      const allowedDomains = ['@gmail.com', '@outlook.com', '@yahoo.com', '@hotmail.com', '@aust.edu'];
      const emailDomain = email.substring(email.lastIndexOf('@'));
      if (email && !allowedDomains.includes(emailDomain)) {
        setEmailError('Incorrect Domain');
      } else {
        setEmailError('');
      }
    }
  };

  const isValid = () => {
    const { name, email, phone, location, password, confirmPassword, terms, roles, age, sscPassingYear, sscInstitute, hscPassingYear, hscInstitute, universityName, universityPassingYear, currentlyStudying } = formData;
    const allowedDomains = ['@gmail.com', '@outlook.com', '@yahoo.com', '@hotmail.com', '@aust.edu'];
    const emailDomain = email.substring(email.lastIndexOf('@'));
    const specialCharRegex = /[@#$%]/;
    return (
      name &&
      email && allowedDomains.includes(emailDomain) &&
      phone && phone.length === 10 &&
      location &&
      password && password.length >= 6 && specialCharRegex.test(password) &&
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
      const submissionData = {
        ...formData,
        phone: `+880${formData.phone}`,
        age: formData.age,
        sscPassingYear: formData.sscPassingYear,
        sscInstitute: formData.sscInstitute,
        hscPassingYear: formData.hscPassingYear,
        hscInstitute: formData.hscInstitute,
        universityName: formData.universityName,
        universityPassingYear: formData.universityPassingYear,
        currentlyStudying: formData.currentlyStudying,
      };
      const response = await axios.post('/api/user/register', submissionData);
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
    const { email, password } = formData;
    const allowedDomains = ['@gmail.com', '@outlook.com', '@yahoo.com', '@hotmail.com', '@aust.edu'];
    const emailDomain = email.substring(email.lastIndexOf('@'));
    const specialCharRegex = /[@#$%]/;
    const error =
      (submitted || touched[field]) &&
      (!formData[field] ||
        (field === 'confirmPassword' && formData.password !== formData.confirmPassword) ||
        (field === 'password' && (formData.password.length < 6 || !specialCharRegex.test(password))) ||
        (field === 'phone' && formData.phone.length !== 10) ||
        (field === 'email' && !allowedDomains.includes(emailDomain)));
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
      {emailError && <p className="error-message">{emailError}</p>}

      <div className={getInputClass('phone')}>
        <FaPhone className="icon" />
        <div className="input-inner-box">
          <span className="phone-prefix">+880</span>
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
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            onBlur={() => handleBlur('location')}
            className="location-select"
          >
            <option value="">Select Division</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Barisal">Barisal</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Khulna">Khulna</option>
            <option value="Mymensingh">Mymensingh</option>
          </select>
        </div>
      </div>

      <div className="collapsible-section">
        <div className={`input-with-icon collapsible-header ${showEducationalQualification ? 'expanded' : ''}`} onClick={toggleEducationalQualification}>
          <FaGraduationCap className="icon" />
          <div className="input-inner-box">
            <p>Educational Qualification</p>
          </div>
          {showEducationalQualification ? <FaChevronUp /> : <FaChevronDown />}
        </div>
        {showEducationalQualification && (
          <div className="educational-qualification-content">
            <div className={getInputClass('age')}>
              <div className="input-inner-box">
                <select
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={() => handleBlur('age')}
                  className="age-select"
                >
                  <option value="">Select Age</option>
                  {ages.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SSC */}
            <div className={getInputClass('sscPassingYear')}>
              <div className="input-inner-box">
                <select
                  name="sscPassingYear"
                  value={formData.sscPassingYear}
                  onChange={handleChange}
                  onBlur={() => handleBlur('sscPassingYear')}
                  className="year-select"
                >
                  <option value="">SSC Passing Year</option>
                  {sscYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={getInputClass('sscInstitute')}>
              <div className="input-inner-box">
                <input
                  type="text"
                  name="sscInstitute"
                  placeholder="SSC Institute"
                  value={formData.sscInstitute}
                  onChange={handleChange}
                  onBlur={() => handleBlur('sscInstitute')}
                />
              </div>
            </div>

            {/* HSC */}
            <div className={getInputClass('hscPassingYear')}>
              <div className="input-inner-box">
                <select
                  name="hscPassingYear"
                  value={formData.hscPassingYear}
                  onChange={handleChange}
                  onBlur={() => handleBlur('hscPassingYear')}
                  className="year-select"
                >
                  <option value="">HSC Passing Year</option>
                  {hscYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={getInputClass('hscInstitute')}>
              <div className="input-inner-box">
                <input
                  type="text"
                  name="hscInstitute"
                  placeholder="HSC Institute"
                  value={formData.hscInstitute}
                  onChange={handleChange}
                  onBlur={() => handleBlur('hscInstitute')}
                />
              </div>
            </div>

            {/* University */}
            <div className={getInputClass('universityName')}>
              <div className="input-inner-box">
                <input
                  type="text"
                  name="universityName"
                  placeholder="University Name"
                  value={formData.universityName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('universityName')}
                />
              </div>
            </div>
            <div className={getInputClass('universityPassingYear')}>
              <div className="input-inner-box">
                <select
                  name="universityPassingYear"
                  value={formData.universityPassingYear}
                  onChange={handleChange}
                  onBlur={() => handleBlur('universityPassingYear')}
                  className="year-select"
                  disabled={formData.currentlyStudying}
                >
                  <option value="">University Passing Year</option>
                  {universityYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <label className="checkbox-agreement">
              <input
                type="checkbox"
                name="currentlyStudying"
                checked={formData.currentlyStudying}
                onChange={handleChange}
              />{' '}
              Currently Studying
            </label>
          </div>
        )}
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
      {(submitted || touched.password) && (formData.password.length < 6 || !/[@#$%]/.test(formData.password)) && (
        <p className="error-message">Password must be at least 6 characters long and contain special characters</p>
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
