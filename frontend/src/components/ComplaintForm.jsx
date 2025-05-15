import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'lucide-react';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    contactNo: '',
    description: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({
    contactNo: '',
    type: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Contact Number Validation
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number cannot be empty';
      isValid = false;
    } else if (!/^0\d{9}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Must be 10 digits starting with 0';
      isValid = false;
    }

    // Complaint Type Validation
    if (!formData.type) {
      newErrors.type = 'Please select a complaint type';
      isValid = false;
    }

    // Description Validation
    const wordCount = formData.description.trim().split(/\s+/).filter(word => word !== '').length;
    if (!formData.description.trim()) {
      newErrors.description = 'Description cannot be empty';
      isValid = false;
    } else if (wordCount > 50) {
      newErrors.description = 'Description cannot exceed 50 words';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/complaints', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Complaint submitted successfully!');
      setFormData({
        contactNo: '',
        description: '',
        type: ''
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      if (error.response?.status === 401) {
        setError('Please log in to submit a complaint');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to submit complaint. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const wordCount = formData.description.trim().split(/\s+/).filter(word => word !== '').length;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit a Complaint</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            type="text"
            id="contactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
            maxLength={10}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter your contact number"
          />
          {errors.contactNo && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNo}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Complaint Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Select complaint type</option>
            <option value="product">Product Issue</option>
            <option value="delivery">Delivery Issue</option>
            <option value="payment">Payment Issue</option>
            <option value="other">Other</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Describe your complaint in detail (max 50 words)"
          />
          <div className="mt-1 text-sm text-gray-500">
            Word count: <span className={wordCount > 50 ? 'text-red-500' : ''}>{wordCount}</span>/50
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;