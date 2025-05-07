import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Star, Edit, Trash2, AlertCircle, ArrowLeft, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Backend base URL (adjust if necessary, e.g., use environment variable)
const BACKEND_URL = 'http://localhost:5000';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleBackToDashboard = () => {
    navigate('/buyer/dashboard');
  };

  const handleFeedbackBot = () => {
    // Placeholder for Feedback Bot functionality
    console.log('Feedback Bot clicked');
    // TODO: Implement Feedback Bot functionality
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text('Review History Summary', 14, 20);

    // Prepare table data
    const tableData = filteredReviews.map((review, index) => [
      `R${String(index + 1).padStart(3, '0')}`,
      `${review.rating}/5`,
      review.description,
      new Date(review.createdAt).toLocaleDateString()
    ]);

    // Add table using autoTable
    autoTable(doc, {
      startY: 30,
      head: [['Order ID', 'Rating', 'Description', 'Posted Date']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 128, 128],
        textColor: [255, 255, 255]
      },
      styles: {
        cellPadding: 2,
        fontSize: 10,
        overflow: 'linebreak'
      },
      columnStyles: {
        2: { cellWidth: 80 } // Make description column wider
      }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    // Save the PDF
    doc.save('review_history.pdf');
  };

  // Fallback image for broken or missing images
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/80?text=Image+Not+Found'; // Placeholder image
  };

  // Filter reviews by order ID
  const filteredReviews = reviews.filter((review, index) => {
    const orderId = `R${String(index + 1).padStart(3, '0')}`;
    return orderId.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Your Reviews</h2>
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
          >
            Generate PDF
          </button>
          <button
            onClick={handleFeedbackBot}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Feedback Bot
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g., R001)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

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
        ) : filteredReviews.length === 0 ? (
          <p className="text-center text-gray-600">No reviews found.</p>
        ) : (
          <div className="grid gap-6">
            {filteredReviews.map((review, index) => (
              <div key={review._id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order R{String(index + 1).padStart(3, '0')}
                  </h3>
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
                      className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{review.description}</p>
                {review.pictures.length > 0 && (
                  <div className="flex space-x-2">
                    {review.pictures.map((pic, index) => (
                      <img
                        key={index}
                        src={`${BACKEND_URL}${pic}`}
                        alt={`Review ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={handleImageError}
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