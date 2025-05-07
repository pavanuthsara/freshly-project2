import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Star, Image, AlertCircle, CheckCircle } from 'lucide-react';

const ReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId; // Assuming orderId is passed via navigation state

  const [formData, setFormData] = useState({
    orderId: orderId || '',
    description: '',
    rating: 0,
    pictures: [],
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pictures') {
      if (files.length > 3) {
        setErrorMsg('You can upload a maximum of 3 pictures.');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        pictures: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
    if (!formData.orderId) {
      setErrorMsg('Order ID is required.');
      return false;
    }
    if (formData.description.split(' ').length > 50) {
      setErrorMsg('Review description must not exceed 50 words.');
      return false;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      setErrorMsg('Please select a rating between 1 and 5 stars.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('orderId', formData.orderId);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('rating', formData.rating);
    formData.pictures.forEach((file) => {
      formDataToSend.append('pictures', file);
    });

    try {
      const response = await axios.post('/api/reviews', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setSuccessMsg(response.data.message || 'Review submitted successfully!');
      setTimeout(() => navigate('/buyer/reviews'), 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Review</h2>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-600 flex items-center space-x-3 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg border-l-4 border-green-600 flex items-center space-x-3 mb-6">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Order ID</label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              required
              disabled
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Review Description (max 50 words)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your review..."
              required
              maxLength={300}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">
              {formData.description.split(' ').length}/50 words
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => handleStarClick(star)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Pictures (max 3)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload images</p>
                  <p className="text-xs text-gray-400">Up to 3 images</p>
                </div>
                <input
                  type="file"
                  name="pictures"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
            {formData.pictures.length > 0 && (
              <p className="text-sm text-gray-600">{formData.pictures.length} image(s) selected</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-green-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;