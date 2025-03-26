import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const ProductSection = ({ farmerData }) => {
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch farmer's products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get the JWT token from localStorage or your auth context
        const token = localStorage.getItem('farmerToken'); // Adjust this based on your auth mechanism

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const response = await axios.get('/api/farmer/products', config);
        // Ensure response.data.data is an array, fallback to empty array
        setProducts(Array.isArray(response.data.data) ? response.data.data : []);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        setIsLoading(false);
        // Set products to an empty array in case of error
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

      // Prepare product data for backend
      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        quantity: newProduct.quantity,
        certification: newProduct.certification,
        description: newProduct.description || 'No description',
        image: newProduct.image || '/default-product-image.jpg' // Add a default image path
      };

      const response = await axios.post('/api/products', productData, config);
      
      // Add the newly created product to the state
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

      // Prepare updated product data for backend
      const productData = {
        name: updatedProduct.name,
        category: updatedProduct.category,
        price: updatedProduct.price,
        quantity: updatedProduct.quantity,
        description: updatedProduct.description || 'No description',
        image: updatedProduct.image || '/default-product-image.jpg'
      };

      const response = await axios.put(`/api/products/${updatedProduct._id}`, productData, config);
      
      // Update the product in the state
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

        await axios.delete(`/api/products/${id}`, config);
        
        // Remove the product from the state
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-green-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">My Products</h1>
        <button 
          onClick={() => setIsAddProductDialogOpen(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus className="mr-2" /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {!products || products.length === 0 ? (
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
            {(products || []).map((product) => (
                <tr key={product._id} className="border-b hover:bg-green-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">LKR{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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

const ProductForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateName = (name) => {
    // Allow only letters, numbers, spaces, and specific allowed characters
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const validateDescription = (description) => {
    // Allow letters, numbers, spaces, and limited punctuation
    const descriptionRegex = /^[a-zA-Z0-9\s.,!?()-]+$/;
    return descriptionRegex.test(description);
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    
    // Clear previous name error if validation passes
    if (validateName(newName) || newName === '') {
      const newErrors = { ...errors };
      delete newErrors.name;
      setErrors(newErrors);
    } else {
      // Set error for invalid characters
      setErrors(prev => ({
        ...prev, 
        name: 'Name can only contain letters and spaces'
      }));
    }

    // Update form data
    setFormData({...formData, name: newName});
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    
    // Clear previous description error if validation passes
    if (validateDescription(newDescription) || newDescription === '') {
      const newErrors = { ...errors };
      delete newErrors.description;
      setErrors(newErrors);
    } else {
      // Set error for invalid characters
      setErrors(prev => ({
        ...prev, 
        description: 'Description can only contain letters, numbers, spaces, and basic punctuation'
      }));
    }

    // Update form data
    setFormData({...formData, description: newDescription});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const validationErrors = {};

    // Name validation
    if (!formData.name) {
      validationErrors.name = 'Product name is required';
    } else if (!validateName(formData.name)) {
      validationErrors.name = 'Name can only contain letters, numbers, spaces, apostrophes, periods, and hyphens';
    }

    // Description validation (if provided)
    if (formData.description && !validateDescription(formData.description)) {
      validationErrors.description = 'Description can only contain letters, numbers, spaces, and basic punctuation';
    }

    // Price and quantity validations
    if (!formData.category) {
      validationErrors.category = 'Category is required';
    }

    if (formData.price <= 0) {
      validationErrors.price = 'Price must be greater than zero';
    }

    if (formData.quantity <= 0) {
      validationErrors.quantity = 'Quantity must be greater than zero';
    }

    // If there are validation errors, set them and prevent submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any previous errors and submit
    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Rest of the form remains the same, with added error handling for other fields */}
      <div>
        <label className="block text-green-700 mb-2">Category</label>
        <input 
          type="text"
          value={formData.category}
          onChange={(e) => {
            setFormData({...formData, category: e.target.value});
            // Clear category error if a value is entered
            if (e.target.value) {
              const newErrors = { ...errors };
              delete newErrors.category;
              setErrors(newErrors);
            }
          }}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 
            ${errors.category ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'}`}
          required 
        />
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
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
              // Clear price error if valid
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
              // Clear quantity error if valid
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