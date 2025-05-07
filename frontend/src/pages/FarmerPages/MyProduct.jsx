import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, User, ShoppingCart, Search, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import ProductListing from '../FarmerPages/ProductListing.jsx';
import ProductReportGenerator from '../FarmerPages/ProductReportGenerator.jsx';

const ProductSection = ({ farmerData }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('myProducts');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('farmerToken');
        const response = await fetch('/api/farmerProducts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch products');
        }
        const data = await response.json();
        setProducts(Array.isArray(data.data) ? data.data : []);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setIsLoading(false);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, category, products]);

  const applyFilters = () => {
    let result = products;

    if (category) {
      result = result.filter((product) =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  };

  const sanitizeProductData = (productData) => {
    return {
      name: (productData.name || '').trim().slice(0, 100),
      category: (productData.category || '').trim(),
      price: Math.min(Math.max(parseFloat(productData.price) || 0, 0), 99999.99),
      countInStock: Math.min(Math.max(parseInt(productData.countInStock) || 0, 0), 9999),
      certification: (productData.certification || '').trim(),
      description: (productData.description || '').trim().slice(0, 500),
      image: (productData.image || '').trim(),
    };
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem('farmerToken');
      const sanitizedProduct = sanitizeProductData(newProduct);
      
      const productData = {
        name: sanitizedProduct.name,
        category: sanitizedProduct.category,
        price: sanitizedProduct.price,
        countInStock: sanitizedProduct.countInStock,
        certification: sanitizedProduct.certification,
        description: sanitizedProduct.description || 'No description',
        image: sanitizedProduct.image || '/default-product-image.jpg',
      };

      const response = await fetch('/api/farmerProducts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      const data = await response.json();
      
      setProducts([...products, data.createdProduct]);
      setIsAddProductDialogOpen(false);
      toast.success('Product added successfully!', {
        style: {
          background: '#34D399',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to add product', {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('farmerToken');
      const sanitizedProduct = sanitizeProductData(updatedProduct);
      
      const productData = {
        name: sanitizedProduct.name,
        category: sanitizedProduct.category,
        price: sanitizedProduct.price,
        countInStock: sanitizedProduct.countInStock,
        description: sanitizedProduct.description || 'No description',
        image: sanitizedProduct.image || '/default-product-image.jpg',
      };

      const response = await fetch(`/api/farmerProducts/${updatedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      const data = await response.json();
      
      setProducts(products.map(p => 
        p._id === updatedProduct._id ? data.updatedProduct : p
      ));
      setEditingProduct(null);
      toast.success('Product updated successfully!', {
        style: {
          background: '#34D399',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    } catch (err) {
      toast.error(err.message || 'Failed to update product', {
        style: {
          background: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
        duration: 3000,
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('farmerToken');
        const response = await fetch(`/api/farmerProducts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete product');
        }
        
        setProducts(products.filter(product => product._id !== id));
        toast.success('Product deleted successfully!', {
          style: {
            background: '#34D399',
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          duration: 3000,
        });
      } catch (err) {
        toast.error(err.message || 'Failed to delete product', {
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
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
        
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            <ShoppingCart className="mr-2" size={20} /> My Orders
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-800">
          {activeView === 'myProducts' && 'My Products'}          </h2>
          <div className="flex space-x-4">
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

            {activeView === 'myProducts' && (
              <>
                <button 
                  onClick={() => setIsAddProductDialogOpen(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Plus className="mr-2" /> Add Product
                </button>
                <ProductReportGenerator />
              </>
            )}
          </div>
        </div>

        {activeView === 'myProducts' && (
          <div className="flex justify-center gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="appearance-none w-full px-4 py-2 pl-3 pr-10 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={20} />
            </div>
          </div>
        )}

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
            ) : filteredProducts.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {search || category
                  ? 'No products found! Try adjusting your search or category filter.'
                  : 'No products yet. Click "Add Product" to get started!'}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-green-100 border-b">
                  <tr>
                    <th className="p-3 text-left text-green-700">Name</th>
                    <th className="p-3 text-left text-green-700">Category</th>
                    <th className="p-3 text-left text-green-700">Price</th>
                    <th className="p-3 text-left text-green-700">Stock (kg)</th>
                    <th className="p-3 text-left text-green-700">Certification</th>
                    <th className="p-3 text-left text-green-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="border-b hover:bg-green-50">
                      <td className="p-3">{product.name}</td>
                      <td className="p-3">{product.category}</td>
                      <td className="p-3">LKR {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-3">{product.countInStock} kg</td>
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

      {(isAddProductDialogOpen || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
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
            <div className="overflow-y-auto p-6 flex-grow">
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
                  countInStock: '',
                  certification: 'Organic',
                  description: '',
                  image: '',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
    if (initialData.image) {
      const imageUrl = initialData.image.startsWith('http')
        ? initialData.image
        : `${BACKEND_URL}${initialData.image}`;
      setImagePreview(imageUrl);
    } else {
      setImagePreview('');
    }
  }, [initialData.image]);

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z0-9\s.,'-]+$/;
    return nameRegex.test(name);
  };

  const validateDescription = (description) => {
    const descriptionRegex = /^[a-zA-Z0-9\s.,!?;:()'"_\-+%&$#@]+$/;
    return descriptionRegex.test(description);
  };

  const validateImageUrl = (url) => {
    if (!url) return true;
    const urlRegex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/[^\s]*)?$/i;
    return urlRegex.test(url);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          imageFile: 'Only PNG, JPG, or JPEG images are allowed',
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imageFile: 'Image size must be less than 5MB',
        }));
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, imageFile: undefined }));
      setFormData({ ...formData, image: '' });
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value.slice(0, 100);
    if (validateName(newName) || newName === '') {
      setErrors((prev) => ({ ...prev, name: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: 'Name can only contain letters, numbers, spaces and basic punctuation',
      }));
    }
    setFormData({ ...formData, name: newName });
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value.slice(0, 500);
    if (validateDescription(newDescription) || newDescription === '') {
      setErrors((prev) => ({ ...prev, description: undefined }));
    } else {
      setErrors((prev) => ({
        ...prev,
        description: 'Description contains invalid characters',
      }));
    }
    setFormData({ ...formData, description: newDescription });
  };

  const handleImageUrlChange = (e) => {
    const newUrl = e.target.value;
    if (validateImageUrl(newUrl)) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, image: 'Please enter a valid URL' }));
    }
    setFormData({ ...formData, image: newUrl });
    setImagePreview(newUrl || '');
    setImageFile(null);
  };

  const handlePriceChange = (e) => {
    let value = e.target.value;
    if (value.includes('.')) {
      const [intPart, decPart] = value.split('.');
      if (intPart.length > 5) {
        value = intPart.slice(0, 5) + '.' + decPart;
      }
    } else if (value.length > 5) {
      value = value.slice(0, 5);
    }
    const newPrice = parseFloat(value) || 0;
    setFormData({ ...formData, price: value === '' ? '' : newPrice });
    if (newPrice > 0) {
      setErrors((prev) => ({ ...prev, price: undefined }));
    } else if (value !== '') {
      setErrors((prev) => ({ ...prev, price: 'Price must be greater than zero' }));
    }
  };

  const handleCountInStockChange = (e) => {
    let value = e.target.value;
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
    const newCountInStock = parseInt(value) || 0;
    setFormData({ ...formData, countInStock: value === '' ? '' : newCountInStock });
    if (newCountInStock > 0) {
      setErrors((prev) => ({ ...prev, countInStock: undefined }));
    } else if (value !== '') {
      setErrors((prev) => ({
        ...prev,
        countInStock: 'Stock must be greater than zero',
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.name) {
      validationErrors.name = 'Product name is required';
    } else if (!validateName(formData.name)) {
      validationErrors.name = 'Name contains invalid characters';
    }

    if (formData.description && !validateDescription(formData.description)) {
      validationErrors.description = 'Description contains invalid characters';
    }

    if (!formData.category) {
      validationErrors.category = 'Category is required';
    }

    if (!formData.price || formData.price <= 0) {
      validationErrors.price = 'Price must be greater than zero';
    }

    if (!formData.countInStock || formData.countInStock <= 0) {
      validationErrors.countInStock = 'Stock must be greater than zero';
    }

    if (!imageFile && !formData.image) {
      validationErrors.image = 'An image file or URL is required';
    } else if (formData.image && !validateImageUrl(formData.image)) {
      validationErrors.image = 'Please enter a valid URL';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        setIsUploading(true);
        const token = localStorage.getItem('farmerToken');
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataUpload,
        });
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Image upload failed');
        }
        const uploadData = await uploadResponse.json();
        if (uploadData.imageUrl) {
          imageUrl = uploadData.imageUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }

      const productData = {
        ...formData,
        image: imageUrl || '/default-product-image.jpg',
      };

      await onSubmit(productData);
      setErrors({});
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to upload image or save product' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-green-700 mb-2">Product Name</label>
        <input 
          type="text"
          value={formData.name}
          onChange={handleNameChange}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('name')(errors, focusedField)}`}
          maxLength={100}
          required 
        />
        {focusedField === 'name' && !errors.name && (
          <p className="text-blue-600 text-sm mt-1">Enter product name (max 100 characters)</p>
        )}
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <label className="block text-green-700 mb-2">Description</label>
        <textarea 
          value={formData.description || ''}
          onChange={handleDescriptionChange}
          onFocus={() => handleFocus('description')}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('description')(errors, focusedField)}`}
          rows="3"
          maxLength={500}
        />
        {focusedField === 'description' && !errors.description && (
          <p className="text-blue-600 text-sm mt-1">Enter product description (max 500 characters)</p>
        )}
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-green-700 mb-2">Category</label>
        <select 
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          onFocus={() => handleFocus('category')}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('category')(errors, focusedField)}`}
          required
        >
          <option value="">Select a category</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
        </select>
        {focusedField === 'category' && !errors.category && (
          <p className="text-blue-600 text-sm mt-1">Select product category</p>
        )}
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-green-700 mb-2">Price (LKR)</label>
          <input 
            type="number" 
            step="0.01"
            min="0.01"
            max="99999.99"
            value={formData.price}
            onChange={handlePriceChange}
            onFocus={() => handleFocus('price')}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('price')(errors, focusedField)}`}
            required 
          />
          {focusedField === 'price' && !errors.price && (
            <p className="text-blue-600 text-sm mt-1">Max 99,999.99 LKR</p>
          )}
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-green-700 mb-2">Stock (kg)</label>
          <input 
            type="number" 
            min="1"
            max="9999"
            value={formData.countInStock}
            onChange={handleCountInStockChange}
            onFocus={() => handleFocus('countInStock')}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('countInStock')(errors, focusedField)}`}
            required 
          />
          {focusedField === 'countInStock' && !errors.countInStock && (
            <p className="text-blue-600 text-sm mt-1">Max 9,999 kg</p>
          )}
          {errors.countInStock && <p className="text-red-500 text-sm mt-1">{errors.countInStock}</p>}
        </div>
      </div>

      <div>
        <label className="block text-green-700 mb-2">Certification</label>
        <select 
          value={formData.certification}
          onChange={(e) => setFormData({...formData, certification: e.target.value})}
          onFocus={() => handleFocus('certification')}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('certification')(errors, focusedField)}`}
        >
          <option value="Organic">Organic</option>
          <option value="GAP">GAP</option>
        </select>
        {focusedField === 'certification' && (
          <p className="text-blue-600 text-sm mt-1">Select product certification</p>
        )}
      </div>

      <div>
        <label className="block text-green-700 mb-2">Upload Product Image</label>
        <input
          type="file"
          accept="image/png,image/jpg,image/jpeg"
          onChange={handleImageFileChange}
          onFocus={() => handleFocus('imageFile')}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('imageFile')(errors, focusedField)}`}
          disabled={isUploading}
        />
        {focusedField === 'imageFile' && !errors.imageFile && (
          <p className="text-blue-600 text-sm mt-1">Upload PNG, JPG, or JPEG (max 5MB)</p>
        )}
        {errors.imageFile && <p className="text-red-500 text-sm mt-1">{errors.imageFile}</p>}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Product Preview"
            className="mt-2 w-full h-32 object-cover rounded"
            onError={(e) => {
              e.target.src = '/default-product-image.jpg';
              setErrors((prev) => ({
                ...prev,
                imagePreview: 'Failed to load image preview',
              }));
            }}
          />
        )}
        {errors.imagePreview && <p className="text-red-500 text-sm mt-1">{errors.imagePreview}</p>}
      </div>

      <div>
        <label className="block text-green-700 mb-2">Image URL (Optional)</label>
        <input 
          type="text"
          value={formData.image || ''}
          onChange={handleImageUrlChange}
          onFocus={() => handleFocus('image')}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded focus:outline-none transition-all duration-200 ${getInputStyles('image')(errors, focusedField)}`}
          disabled={isUploading}
        />
        {focusedField === 'image' && !errors.image && (
          <p className="text-blue-600 text-sm mt-1">Enter a valid image URL (optional if file uploaded)</p>
        )}
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
      </div>

      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
      
      <div className="flex space-x-4 pt-2">
        <button 
          type="submit" 
          className={`flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : initialData._id ? 'Update' : 'Add'} Product
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition duration-200"
          disabled={isUploading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const getInputStyles = (fieldName) => (errors, focusedField) => {
  if (errors[fieldName]) {
    return "border-red-500 focus:ring-red-500 focus:border-red-500";
  }
  if (focusedField === fieldName) {
    return "border-blue-500 ring-2 ring-blue-200 focus:border-blue-500";
  }
  return "border-gray-300 focus:ring-green-500 focus:border-green-500";
};

export default ProductSection;