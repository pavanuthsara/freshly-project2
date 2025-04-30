import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

// Base URL for backend with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const FarmerProductPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { search = '', category = '' } = location.state || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching product with ID:', id);
        console.log('API URL:', `${BACKEND_URL}/api/products/${id}`);
        const { data } = await axios.get(`/api/products/${id}`);
        console.log('API response:', data);
        if (!data) {
          throw new Error('No product data received');
        }
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch product'
        );
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getImageUrl = (image) => {
    if (!image) {
      console.log('No image provided, using default');
      return '/default-product-image.jpg';
    }
    const url = image.startsWith('http') ? image : `${BACKEND_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    console.log('Image URL:', url);
    return url;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-green-600">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-4xl mx-auto mt-8">
        {error || 'Product not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-8 font-sans bg-green-50">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard', { state: { search, category } })}
        className="flex items-center text-green-700 mb-6 hover:text-green-800"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Products
      </button>

      {/* Product Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
        {/* Image Section */}
        <div>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-64 object-contain rounded-lg"
            loading="lazy"
            onError={(e) => {
              console.log('Image failed to load:', product.image);
              e.target.src = '/default-product-image.jpg';
            }}
          />
        </div>

        {/* Details Section */}
        <div>
          <h1 className="text-2xl font-bold text-green-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-green-700 font-bold text-xl mb-4">
            LKR {product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-green-600">
              <span className="font-semibold">Category:</span> {product.category}
            </span>
            <span className="text-green-600">{product.quantity} kg available</span>
          </div>
          <div className="mb-4">
            <span className="text-green-600">
              <span className="font-semibold">Certification:</span> {product.certification}
            </span>
          </div>
          {/* Add to Cart Button (Non-functional) */}
          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300 flex items-center justify-center"
            disabled
          >
            <ShoppingCart className="mr-2" size={20} />
            Add to Cart
          </button>
          <p className="text-gray-500 text-sm mt-2">
            This is a preview of how the product appears to consumers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerProductPreview;