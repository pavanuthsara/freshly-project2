import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api';
import './BuyerRegister.css';

const BuyerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const validateName = (name) => /^[^@!]+$/.test(name.trim()) && name.trim().length >= 3;

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(formData.name)) {
      setErrorMsg('Name must be at least 3 characters and cannot contain @ or ! signs.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrorMsg(
        'Password must be at least 8 characters, including an uppercase letter, a number, and a special character (!@#$%^&*).'
      );
      return;
    }

    try {
      const response = await register(formData.name, formData.email, formData.password);
      setSuccessMsg(response.data.message);
      navigate('/buyer/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.';
      setErrorMsg(message);
    }
  };

  return (
    <div className="buyer-register-container">
      <h2>Buyer Registration</h2>
      <form className="buyer-register-form" onSubmit={handleSubmit}>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button className="register-button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default BuyerRegister;
