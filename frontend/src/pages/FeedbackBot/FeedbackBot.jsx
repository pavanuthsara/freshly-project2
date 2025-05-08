import React, { useState } from 'react';
import axios from 'axios';

const FeedbackBot = () => {
  const [feedback, setFeedback] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await axios.post('http://localhost:5000/api/bot/feedbackbot', {
        description: feedback,
      });
      setResponse(res.data.response);
    } catch (err) {
      setError('Failed to get response. Please try again. 😔');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Feedback Bot 🥕</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
              Share your feedback about our fruits & veggies! 🍎
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              placeholder="Tell us what you think..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            } transition-colors`}
          >
            {loading ? 'Processing... ⏳' : 'Submit Feedback 🚀'}
          </button>
        </form>

        {response && (
          <div className="mt-4 p-4 bg-green-100 rounded-md">
            <p className="text-green-800">{response}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-100 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackBot;