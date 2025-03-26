import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import productService from '../../services/productService';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import Loader from '../Shared/Loader';
import ErrorMessage from '../Shared/ErrorMessage';

const ProductList = () => {
  const { farmer } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getFarmerProducts(farmer._id);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [farmer]);

  const handleCreate = async (productData) => {
    try {
      const newProduct = await productService.createProduct({
        ...productData,
        farmer: { id: farmer._id, name: farmer.name }
      });
      setProducts([...products, newProduct]);
      setIsFormOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(products.map(p => p._id === id ? updatedProduct : p));
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Products</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary"
        >
          Add Product
        </button>
      </div>

      {isFormOpen && (
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={(data) => handleUpdate(editingProduct._id, data)}
          onCancel={() => setEditingProduct(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={() => setEditingProduct(product)}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;