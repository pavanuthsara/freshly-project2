import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    axios.get(`/api/reviews/order/${id}`).then(res => {
      if (res.data) {
        setExistingReview(res.data);
        setReview({ rating: res.data.rating, comment: res.data.comment });
      }
    }).catch(() => {});
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingReview) {
      await axios.put(`/api/reviews/${existingReview._id}`, review);
    } else {
      await axios.post(`/api/reviews`, { ...review, order: id });
    }
    navigate('/buyer/orders');
  };

  const handleDelete = async () => {
    await axios.delete(`/api/reviews/${existingReview._id}`);
    setExistingReview(null);
    setReview({ rating: 0, comment: '' });
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Review for Order #{id.slice(-6)}</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Rating (1-5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={review.rating}
          onChange={e => setReview({ ...review, rating: e.target.value })}
          className="border rounded px-2 py-1 mb-4 w-full"
          required
        />
        <label className="block mb-2">Comment:</label>
        <textarea
          value={review.comment}
          onChange={e => setReview({ ...review, comment: e.target.value })}
          className="border rounded px-2 py-1 mb-4 w-full"
          required
        />
        <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded mr-2">
          {existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {existingReview && (
          <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete Review
          </button>
        )}
      </form>
    </div>
  );
};

export default OrderReviewPage; 