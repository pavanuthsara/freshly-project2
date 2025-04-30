import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // State to track touched fields for showing conditions
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateName = (name) => {
    // Only allow letters and dot, no consecutive dots or dots at start/end
    const nameRegex = /^[A-Za-z]+(\.[A-Za-z]+)*$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    // Standard email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters with at least one uppercase, one lowercase, one number and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhone = (phone) => {
    // Exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateNIC = (nic) => {
    // Either 12 digits or 9 digits followed by V/v
    const nicRegex = /^(\d{12}|\d{9}[Vv])$/;
    return nicRegex.test(nic);
  };

  const validateStreetNo = (streetNo) => {
    // Allow alphanumeric values but limit to 10 characters
    return streetNo.length > 0 && streetNo.length <= 10;
  };

  const sanitizeInput = (value, type) => {
    let sanitized = value;
    
    switch(type) {
      case 'name':
        // Remove any characters that aren't letters or dots
        sanitized = value.replace(/[^A-Za-z.]/g, '');
        break;
      case 'phone':
        // Keep only digits and limit to 10
        sanitized = value.replace(/\D/g, '').substring(0, 10);
        break;
      case 'nic':
        // For NIC, allow digits and 'V'/'v' at the end, limit to 12 chars max
        if (value.length > 0 && (value[value.length - 1] === 'V' || value[value.length - 1] === 'v')) {
          // If last char is V/v, keep it and sanitize the rest to digits only
          const digits = value.slice(0, -1).replace(/\D/g, '').substring(0, 9);
          sanitized = digits + value[value.length - 1];
        } else {
          // Otherwise keep only digits and limit to 12
          sanitized = value.replace(/\D/g, '').substring(0, 12);
        }
        break;
      case 'streetNo':
        // Allow alphanumeric but limit to 10 chars
        sanitized = value.replace(/[^A-Za-z0-9\s/]/g, '').substring(0, 10);
        break;
      case 'city':
      case 'district':
        // Allow only letters, spaces, and hyphens for city and district
        sanitized = value.replace(/[^A-Za-z\s-]/g, '').substring(0, 30);
        break;
      default:
        // Default case - no sanitization
        break;
    }
    
    return sanitized;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle nested farm address fields
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
      
      // Mark nested field as touched
      setTouched(prev => ({ ...prev, [addressField]: true }));
    } else {
      // Sanitize input based on field type
      const sanitizedValue = sanitizeInput(value, name);
      
      setFormData(prevState => ({
        ...prevState,
        [name]: sanitizedValue
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Validate the field on blur and update errors
    validateField(name);
  };
  
  const validateField = (name) => {
    let valid = true;
    let errorMessage = '';
    
    // Extract the base field name for nested objects
    const baseField = name.includes('.') ? name.split('.')[1] : name;
    
    // Get the field value (handle nested objects)
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
    
    // Update errors state if invalid
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
    
    // Validate each field and collect errors
    fieldsToValidate.forEach(field => {
      const fieldValid = validateField(field);
      if (!fieldValid) isValid = false;
    });
    
    return isValid;
  };

  // Check specific password criteria for visual feedback
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
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    // Create a sanitized copy of the data for submission
    const sanitizedData = {
      ...formData,
      // Encode HTML special characters to prevent XSS
      name: encodeURIComponent(formData.name),
      email: encodeURIComponent(formData.email),
      phone: encodeURIComponent(formData.phone),
      nic: encodeURIComponent(formData.nic),
      farmAddress: {
        streetNo: encodeURIComponent(formData.farmAddress.streetNo),
        city: encodeURIComponent(formData.farmAddress.city),
        district: encodeURIComponent(formData.farmAddress.district)
      }
    };

    try {
      const response = await fetch('/api/farmers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error');
      }

      const data = await response.json();

      if (data.success) {
        alert('Registration Successful!');
        // Call the prop function to handle navigation or state update
        if (onRegistrationSuccess) {
          onRegistrationSuccess(data);
        }
      } else {
        alert(data.message || 'Registration Failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  // Calculate password strength criteria
  const passwordCriteria = checkPasswordCriteria(formData.password);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
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
            
            {/* Password requirements list with dynamic coloring */}
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