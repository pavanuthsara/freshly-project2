import React, { useState } from 'react';
import axios from 'axios';

const FarmerPlanForm = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    location: '',
    landSize: '',
    soilType: '',
    waterAvailability: '',
    budgetRange: ''
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate cropName and location to allow only letters
    if (name === 'cropName' || name === 'location') {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'landSize') {
      // Allow only positive numbers for landSize
      if (/^\d*\.?\d*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await axios.post('http://localhost:5000/api/bot/farmerbot', formData);
      setResponse(res.data.response);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Farmer Plan Generator</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Crop Name</label>
          <input
            type="text"
            name="cropName"
            value={formData.cropName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white p-3 placeholder-gray-300"
            placeholder="e.g., Rice"
            pattern="[a-zA-Z\s]+"
            title="Only letters and spaces are allowed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white p-3 placeholder-gray-300"
            placeholder="e.g., Colombo"
            pattern="[a-zA-Z\s]+"
            title="Only letters and spaces are allowed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Land Size (Perch)</label>
          <input
            type="text"
            name="landSize"
            value={formData.landSize}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white p-3 placeholder-gray-300"
            placeholder="e.g., 10"
            pattern="\d*\.?\d*"
            title="Enter a valid number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Soil Type</label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white p-3"
            required
          >
            <option value="">Select Soil Type</option>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="dont-know">Don't Know</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Water Availability</label>
          <select
            name="waterAvailability"
            value={formData.waterAvailability}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white p-3"
            required
          >
            <option value="">Select Water Availability</option>
            <option value="irrigation">Irrigation</option>
            <option value="rain-fed">Rain-fed</option>
            <option value="limited-access">Limited Access</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Budget Range</label>
          <select
            name="budgetRange"
            value={formData.budgetRange}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white p-3"
            required
          >
            <option value="">Select Budget Range</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
        >
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-yellow-100  rounded-md whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
};

export default FarmerPlanForm;