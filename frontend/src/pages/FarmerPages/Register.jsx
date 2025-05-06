import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Register = ({ onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    nic: '',
    farmAddress: {
      streetNo: '',
      city: '',
      district: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]+(\.[A-Za-z]+)*$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateNIC = (nic) => {
    const nicRegex = /^(\d{12}|\d{9}[Vv])$/;
    return nicRegex.test(nic);
  };

  const validateStreetNo = (streetNo) => {
    return streetNo.length > 0 && streetNo.length <= 10;
  };

  const sanitizeInput = (value, type) => {
    let sanitized = value;
    
    switch(type) {
      case 'name':
        sanitized = value.replace(/[^A-Za-z.]/g, '');
        break;
      case 'phone':
        sanitized = value.replace(/\D/g, '').substring(0, 10);
        break;
      case 'nic':
        if (value.length > 0 && (value[value.length - 1] === 'V' || value[value.length - 1] === 'v')) {
          const digits = value.slice(0, -1).replace(/\D/g, '').substring(0, 9);
          sanitized = digits + value[value.length - 1];
        } else {
          sanitized = value.replace(/\D/g, '').substring(0, 12);
        }
        break;
      case 'streetNo':
        sanitized = value.replace(/[^A-Za-z0-9\s/]/g, '').substring(0, 10);
        break;
      case 'city':
      case 'district':
        sanitized = value.replace(/[^A-Za-z\s-]/g, '').substring(0, 30);
        break;
      default:
        break;
    }
    
    return sanitized;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name.startsWith('farmAddress.')) {
      const addressField = name.split('.')[1];
      const sanitizedValue = sanitizeInput(value, addressField);
      
      setFormData(prevState => ({
        ...prevState,
        farmAddress: {
          ...prevState.farmAddress,
          [addressField]: sanitizedValue
        }
      }));
      
      setTouched(prev => ({ ...prev, [addressField]: true }));
    } else {
      const sanitizedValue = sanitizeInput(value, name);
      
      setFormData(prevState => ({
        ...prevState,
        [name]: sanitizedValue
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name);
  };
  
  const validateField = (name) => {
    let valid = true;
    let errorMessage = '';
    
    const baseField = name.includes('.') ? name.split('.')[1] : name;
    const value = name.includes('.')
      ? formData.farmAddress[baseField]
      : formData[name];
    
    switch(baseField) {
      case 'name':
        valid = validateName(value);
        errorMessage = 'Name should only contain letters and optional dots';
        break;
      case 'email':
        valid = validateEmail(value);
        errorMessage = 'Please enter a valid email address';
        break;
      case 'password':
        valid = validatePassword(value);
        errorMessage = 'Password must meet all requirements';
        break;
      case 'phone':
        valid = validatePhone(value);
        errorMessage = 'Phone number must be exactly 10 digits';
        break;
      case 'nic':
        valid = validateNIC(value);
        errorMessage = 'NIC must be 12 digits or 9 digits with V/v at end';
        break;
      case 'streetNo':
        valid = validateStreetNo(value);
        errorMessage = 'Street number must be between 1-10 characters';
        break;
      case 'city':
      case 'district':
        valid = value.trim().length > 0;
        errorMessage = `${baseField.charAt(0).toUpperCase() + baseField.slice(1)} is required`;
        break;
      default:
        break;
    }
    
    if (!valid) {
      setErrors(prev => ({ ...prev, [baseField]: errorMessage }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[baseField];
        return newErrors;
      });
    }
    
    return valid;
  };

  const validateForm = () => {
    const fieldsToValidate = [
      'name', 'email', 'password', 'phone', 'nic', 
      'farmAddress.streetNo', 'farmAddress.city', 'farmAddress.district'
    ];
    
    let isValid = true;
    
    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field);
      if (!fieldValid) isValid = false;
    });
    
    return isValid;
  };

  const checkPasswordCriteria = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting.', {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
      return;
    }
    
    // Use raw formData (sanitized by sanitizeInput, validated by validateEmail)
    const submissionData = {
      ...formData,
      // Password is not sanitized/encoded to preserve special characters
      password: formData.password,
    };

    try {
      const response = await fetch('/api/farmers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Registration Successful!', {
          style: {
            background: '#34D399', // Match FarmerDashboard.jsx
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          duration: 3000,
        });
        if (onRegistrationSuccess) {
          setTimeout(() => onRegistrationSuccess(data), 1000); // Delay for toast
        }
      } else {
        toast.error(data.message || 'Registration Failed', {
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(`Registration failed: ${error.message}`, {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    }
  };

  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate('/farmer-login');
  };

  const passwordCriteria = checkPasswordCriteria(formData.password);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <Toaster position="top-right" />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-2 border-green-600">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Farmer Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-green-800 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Enter your full name"
              required
              maxLength="50"
            />
            {touched.name && (
              <p className={`text-sm mt-1 ${errors.name ? 'text-red-500' : 'text-blue-500'}`}>
                {errors.name || "Only letters and dots are allowed"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-green-800 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Enter your email"
              required
              maxLength="100"
            />
            {touched.email && (
              <p className={`text-sm mt-1 ${errors.email ? 'text-red-500' : 'text-blue-500'}`}>
                {errors.email || "Must be a valid email format (example@domain.com)"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-green-800 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Create a strong password"
              required
              maxLength="64"
              aria-describedby="password-requirements"
            />
            
            {touched.password && (
              <ul className="text-sm mt-2 space-y-1">
                <li className={passwordCriteria.length ? "text-blue-500" : "text-red-500"}>
                  • At least 8 characters
                </li>
                <li className={passwordCriteria.uppercase ? "text-blue-500" : "text-red-500"}>
                  • At least one uppercase letter
                </li>
                <li className={passwordCriteria.lowercase ? "text-blue-500" : "text-red-500"}>
                  • At least one lowercase letter
                </li>
                <li className={passwordCriteria.number ? "text-blue-500" : "text-red-500"}>
                  • At least one number
                </li>
                <li className={passwordCriteria.special ? "text-blue-500" : "text-red-500"}>
                  • At least one special character (@, $, !, %, *, ?, &)
                </li>
              </ul>
            )}
          </div>

          <div>
            <label className="block text-green-800 mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Enter your phone number"
              required
              maxLength="10"
            />
            {touched.phone && (
              <p className={`text-sm mt-1 ${errors.phone ? 'text-red-500' : 'text-blue-500'}`}>
                {errors.phone || "Must be exactly 10 digits"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-green-800 mb-2">NIC Number</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                ${errors.nic ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
              placeholder="Enter your National ID number"
              required
              maxLength="12"
            />
            {touched.nic && (
              <p className={`text-sm mt-1 ${errors.nic ? 'text-red-500' : 'text-blue-500'}`}>
                {errors.nic || "Must be 12 digits or 9 digits followed by V/v"}
              </p>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Farm Address</h3>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  name="farmAddress.streetNo"
                  value={formData.farmAddress.streetNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                    ${errors.streetNo ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
                  placeholder="Street Number"
                  required
                  maxLength="10"
                />
                {touched.streetNo && (
                  <p className={`text-sm mt-1 ${errors.streetNo ? 'text-red-500' : 'text-blue-500'}`}>
                    {errors.streetNo || "Up to 10 alphanumeric characters allowed"}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="farmAddress.city"
                  value={formData.farmAddress.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                    ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
                  placeholder="City"
                  required
                  maxLength="30"
                />
                {touched.city && (
                  <p className={`text-sm mt-1 ${errors.city ? 'text-red-500' : 'text-blue-500'}`}>
                    {errors.city || "Only letters, spaces and hyphens allowed"}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="farmAddress.district"
                  value={formData.farmAddress.district}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 
                    ${errors.district ? 'border-red-500 focus:ring-red-500' : 'border-green-300 focus:ring-green-500'}`}
                  placeholder="District"
                  required
                  maxLength="30"
                />
                {touched.district && (
                  <p className={`text-sm mt-1 ${errors.district ? 'text-red-500' : 'text-blue-500'}`}>
                    {errors.district || "Only letters, spaces and hyphens allowed"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Register
          </button>

          <div className="text-center mt-4">
            <p className="text-green-800">
              Already have an account? 
              <button 
                type="button"
                onClick={handleLoginRedirect}
                className="text-green-600 font-bold ml-2 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;