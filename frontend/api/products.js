const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getProducts(limit = 10, skip = 0, search = '') {
  const response = await fetch(
    `${API_URL}/products?limit=${limit}&skip=${skip}&search=${search}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
}

export async function updateProduct(
  id,
  product
) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
  return response.json();
}