import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, User, ShoppingCart } from 'lucide-react';
import ProductListing from './ProductListing';

const ProductSection = ({ farmerData }) => {
  const [products, setProducts] = useState([]);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('myProducts');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('farmerToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await axios.get('/api/farmerProducts', config);
        setProducts(Array.isArray(response.data.data) ? response.data.data : []);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        setIsLoading(false);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem('farmerToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        quantity: newProduct.quantity,
        certification: newProduct.certification,
        description: newProduct.description || 'No description',
        image: newProduct.image || '/default-product-image.jpg'
      };

      const response = await axios.post('/api/farmerProducts', productData, config);
      
      setProducts([...products, response.data.createdProduct]);
      setIsAddProductDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('farmerToken');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const productData = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        quantity: updatedProduct.quantity,
        description: updatedProduct.description || 'No description',
        image: updatedProduct.image || '/default-product-image.jpg'
      };

      const response = await axios.put(`/api/farmerProducts/${updatedProduct._id}`, productData, config);
      
      setProducts(products.map(p => 
        p._id === updatedProduct._id ? response.data.updatedProduct : p
      ));
      setEditingProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('farmerToken');
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.delete(`/api/farmerProducts/${id}`, config);
        
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Farmer Profile and Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <User className="text-green-700" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800">
              {farmerData.name || 'Farmer Profile'}
            </h1>
            <p className="text-green-600">{farmerData.email}</p>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            <ShoppingCart className="mr-2" size={20} /> My Orders
          </button>
        </div>
      </div>

      {/* Product Management Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-800">
            {activeView === 'myProducts' ? 'My Products' : 'All Products'}
          </h2>
          <div className="flex space-x-4">
            {/* View Toggle */}
            <div className="flex bg-green-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('myProducts')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  activeView === 'myProducts' 
                    ? 'bg-green-600 text-white' 
                    : 'text-green-700 hover:bg-green-200'
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveView('allProducts')}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 flex items-center ${
                  activeView === 'allProducts' 
                    ? 'bg-green-600 text-white' 
                    : 'text-green-700 hover:bg-green-200'
                }`}
              >
                <Eye className="mr-2" /> All Products
              </button>
            </div>

            {/* Add Product Button */}
            {activeView === 'myProducts' && (
              <button 
                onClick={() => setIsAddProductDialogOpen(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Plus className="mr-2" /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Conditional Rendering based on View */}
        {activeView === 'myProducts' ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-green-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No products yet. Click "Add Product" to get started!
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-green-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-green-700">Name</th>
                    <th className="p-3 text-left text-green-700">Category</th>
                    <th className="p-3 text-left text-green-700">Price</th>
                    <th className="p-3 text-left text-green-700">Quantity</th>
                    <th className="p-3 text-left text-green-700">Certification</th>
                    <th className="p-3 text-left text-green-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-green-50">
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.category}</td>
                      <td className="p-3">LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-3">{product.quantity} kg</td>
                      <td className="p-3">{product.certification}</td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="flex items-center px-2 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50"
                          >
                            <Edit size={16} className="mr-1" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="flex items-center px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <ProductListing />
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(isAddProductDialogOpen || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button 
                onClick={() => {
                  setIsAddProductDialogOpen(false);
                  setEditingProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProductForm 
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setIsAddProductDialogOpen(false);
                setEditingProduct(null);
              }}
              initialData={editingProduct || {
                name: '',
                category: '',
                price: '',
                quantity: '',
                certification: 'Organic',
                description: '',
                image: ''
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ProductForm component (same as in previous implementation)
const ProductForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Validation and form handling methods (same as previous implementation)
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const validateDescription = (description) => {
    const descriptionRegex = /^[a-zA-Z0-9\s.,!?()-]+$/;
    return descriptionRegex.test(description);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    
    if (validateName(newName) || newName === '') {
      const newErrors = { ...errors };
      delete newErrors.name;
      setErrors(newErrors);
    } else {
      setErrors(prev => ({
        ...prev, 
        name: 'Name can only contain letters and spaces'
      }));
    }

    setFormData({...formData, name: newName});
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    
    if (validateDescription(newDescription) || newDescription === '') {
      const newErrors = { ...errors };
      delete newErrors.description;
      setErrors(newErrors);
    } else {
      setErrors(prev => ({
        ...prev, 
        description: 'Description can only contain letters, numbers, spaces, and basic punctuation'
      }));
    }

    setFormData({...formData, description: newDescription});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = {};

    if (!formData.name) {
      validationErrors.name = 'Product name is required';
    } else if (!validateName(formData.name)) {
      validationErrors.name = 'Name can only contain letters, numbers, spaces, apostrophes, periods, and hyphens';
    }

    if (formData.description && !validateDescription(formData.description)) {
      validationErrors.description = 'Description can only contain letters, numbers, spaces, and basic punctuation';
    }

    if (!formData.category) {
      validationErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      validationErrors.price = 'Price must be greater than zero';
    }

    if (formData.quantity <= 0) {
      validationErrors.quantity = 'Quantity must be greater than zero';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields remain the same as in previous implementation */}
      <div>
        <label className="block text-green-700 mb-2">Product Name</label>
        <input 
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 
            ${errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
          required 
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      {/* Remaining form fields with similar structure */}
      <div>
        <label className="block text-green-700 mb-2">Description</label>
        <textarea 
          value={formData.description || ''}
          onChange={handleDescriptionChange}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 
            ${errors.description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
          rows="3"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Category, Price, Quantity, Certification inputs */}
      <div>
        <label className="block text-green-700 mb-2">Category</label>
        <select 
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Organic">Vegetables</option>
          <option value="GAP">Fruits</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-green-700 mb-2">Price (LKR)</label>
          <input 
            type="number" 
            step="0.01"
            min="0.01"
            value={formData.price}
            onChange={(e) => {
              const newPrice = parseFloat(e.target.value) || 0;
              setFormData({...formData, price: newPrice});
              if (newPrice > 0) {
                const newErrors = { ...errors };
                delete newErrors.price;
                setErrors(newErrors);
              }
            }}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 
              ${errors.price ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
            required 
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-green-700 mb-2">Quantity (kg)</label>
          <input 
            type="number" 
            min="1"
            value={formData.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value) || 0;
              setFormData({...formData, quantity: newQuantity});
              if (newQuantity > 0) {
                const newErrors = { ...errors };
                delete newErrors.quantity;
                setErrors(newErrors);
              }
            }}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 
              ${errors.quantity ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
            required 
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>
      </div>

      <div>
        <label className="block text-green-700 mb-2">Certification</label>
        <select 
          value={formData.certification}
          onChange={(e) => setFormData({...formData, certification: e.target.value})}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="Organic">Organic</option>
          <option value="GAP">GAP</option>
        </select>
      </div>
      
      <div>
        <label className="block text-green-700 mb-2">Image URL (Optional)</label>
        <input 
          type="text"
          value={formData.image || ''}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div className="flex space-x-4">
        <button 
          type="submit" 
          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {initialData._id ? "Update" : "Add"} Product
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductSection;