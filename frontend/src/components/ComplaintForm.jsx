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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter your contact number"
          />
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
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Select complaint type</option>
            <option value="product">Product Issue</option>
            <option value="delivery">Delivery Issue</option>
            <option value="payment">Payment Issue</option>
            <option value="other">Other</option>
          </select>
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
            required
            rows="4"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Describe your complaint in detail"
          />
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