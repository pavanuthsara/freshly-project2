import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Star, Image, AlertCircle, CheckCircle, X } from 'lucide-react';

const ReviewEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const review = location.state?.review;
  const order = location.state?.order; // Assuming order details are passed in state

  const [formData, setFormData] = useState({
    description: review?.description || '',
    rating: review?.rating || 0,
    pictures: [],
  });
  const [imagePreviews, setImagePreviews] = useState(review?.pictures || []);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!review) {
      setErrorMsg('No review data provided.');
      setTimeout(() => navigate('/buyer/reviewlist'), 1500);
    }
  }, [review, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pictures') {
      const newFiles = Array.from(files);
      if (formData.pictures.length + newFiles.length + imagePreviews.length > 3) {
        setErrorMsg('You can upload a maximum of 3 pictures.');
        return;
      }
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        pictures: [...prev.pictures, ...newFiles],
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      pictures: prev.pictures.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const validateForm = () => {
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
    formDataToSend.append('description', formData.description);
    formDataToSend.append('rating', formData.rating);
    formData.pictures.forEach((file) => {
      formDataToSend.append('pictures', file);
    });

    try {
      const response = await axios.put(`/api/reviews/edit/${review._id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setSuccessMsg(response.data.message || 'Review updated successfully!');
      setTimeout(() => navigate('/buyer/reviewlist'), 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update review.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency for LKR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('si-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Review</h2>

        {/* Order Details Section */}
        {order && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Details</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Order ID:</span> {order._id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Placed on:</span> {formatDate(order.createdAt)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Total:</span> {formatCurrency(order.totalPrice)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Items:</span>{' '}
              {order.orderItems.map((item) => item.name).join(', ')}
            </p>
          </div>
        )}

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
              {formData.description.split(' ').filter((word) => word).length}/50 words
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
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formData.pictures.length + imagePreviews.length > 0 && (
              <p className="text-sm text-gray-600">
                {formData.pictures.length + imagePreviews.length} image(s) selected
              </p>
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
            {isLoading ? 'Updating...' : 'Update Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewEditPage;