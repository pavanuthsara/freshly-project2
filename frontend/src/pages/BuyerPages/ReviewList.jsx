import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Star, Edit, Trash2, AlertCircle } from 'lucide-react';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/reviews', { withCredentials: true });
        setReviews(response.data);
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'Failed to fetch reviews.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleEdit = (review) => {
    navigate('/buyer/review/edit', { state: { review } });
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`/api/reviews/${reviewId}`, { withCredentials: true });
        setReviews(reviews.filter((review) => review._id !== reviewId));
      } catch (error) {
        setErrorMsg(error.response?.data?.message || 'Failed to delete review.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Reviews</h2>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border-l-4 border-red-600 flex items-center space-x-3 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-600">No reviews found.</p>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Order #{review.orderId}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 text-blue-600 hover:text-blue-700 transition"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="p-2 text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.description}</p>
                {review.pictures.length > 0 && (
                  <div className="flex space-x-2">
                    {review.pictures.map((pic, index) => (
                      <img
                        key={index}
                        src={pic}
                        alt={`Review ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-4">
                  Posted on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsList;