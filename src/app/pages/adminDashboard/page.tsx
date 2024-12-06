'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
}

const AdminDashboard: React.FC = () => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    stock: ''
  });
  const { adminLogout } = useAuth();

  // Notification Handler
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data.products);
    } catch (error) {
      showNotification('Failed to fetch products', 'error');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, []);

  // Add Product Handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageInput = document.getElementById('image-upload') as HTMLInputElement;
    
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', String(Number(newProduct.price)));
      formData.append('stock', newProduct.stock);
      
      if (imageInput?.files?.[0]) {
        formData.append('image', imageInput.files[0]);
      }

      const response = await axios.post('http://127.0.0.1:8000/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Add new product to list
      setProducts([...products, response.data.product]);
      
      // Reset form and close modal
      setNewProduct({ name: '', description: '', image: '', price: '', stock: '' });
      
      // Clear file input
      if (imageInput) {
        imageInput.value = '';
      }
        
      setIsAddModalOpen(false);
        
      showNotification('Product added successfully', 'success');
    } catch (error) {
      showNotification('Failed to add product', 'error');
    }
  };

  // Update Product Handler
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/productupdate/${selectedProduct.id}`, {
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock
      });

      // Update product in list
      setProducts(products.map(p => p.id === selectedProduct.id ? response.data.product : p));
      
      setIsModalOpen(false);
      showNotification('Product updated successfully', 'success');
    } catch (error) {
      showNotification('Failed to update product', 'error');
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/productdelete/${id}`);
      
      // Remove product from list
      setProducts(products.filter(p => p.id !== id));
      
      showNotification('Product deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete product', 'error');
    }
  };

  // Notification Component
  const NotificationComponent = () => {
    if (!notification) return null;

    const bgColor = notification.type === 'success' 
      ? 'bg-green-500' 
      : 'bg-red-500';

    return (
      <div 
        className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-2 rounded shadow-lg transition-all duration-300`}
      >
        {notification.message}
      </div>
    );
  };

  

  // Render Product Table
  const renderProductTable = () => (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                
                <Image 
                src={`http://127.0.0.1:8000/storage/${product.image}`} 
                alt={product.name} 
                width={384} 
                height={384} 
                className="object-cover"/>
              </td>
              <td>{product.description}</td>
              <td>${product.price !== undefined ? Number(product.price).toFixed(2) : 'N/A'}</td>
              <td>{product.stock}</td>
              <td>
                <div className="flex space-x-2">
                  <button 
                    className="btn btn-xs btn-info"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-xs btn-error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Edit Modal (previous implementation remains the same)
  const renderEditModal = () => (
    <dialog 
      className={`modal ${isModalOpen ? 'modal-open' : ''}`} 
      open={isModalOpen}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Edit Product</h3>
        {selectedProduct && (
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div className="form-control">
              <label className="label">Name</label>
              <input
                type="text"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({
                  ...selectedProduct, 
                  name: e.target.value
                })}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">Description</label>
              <textarea
                value={selectedProduct.description}
                onChange={(e) => setSelectedProduct({
                  ...selectedProduct, 
                  description: e.target.value
                })}
                className="textarea textarea-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">Price</label>
              <input
                type="number"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({
                  ...selectedProduct, 
                  price: parseFloat(e.target.value)
                })}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">Stock</label>
              <input
                type="number"
                value={selectedProduct.stock}
                onChange={(e) => setSelectedProduct({
                  ...selectedProduct, 
                  stock: parseInt(e.target.value)
                })}
                className="input input-bordered"
                required
              />
            </div>
            <div className="modal-action">
              <button 
                type="button" 
                className="btn" 
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Update Product
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );

  // Add Product Modal (previous implementation remains the same)
  const renderAddModal = () => (
    <dialog 
      className={`modal ${isAddModalOpen ? 'modal-open' : ''}`} 
      open={isAddModalOpen}
    >
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New Product</h3>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="form-control">
            <label className="label">Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({
                ...newProduct, 
                name: e.target.value
              })}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Description</label>
            <textarea
              value={newProduct.description}
              onChange={(e) => setNewProduct({
                ...newProduct, 
                description: e.target.value
              })}
              className="textarea textarea-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Price</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({
                ...newProduct, 
                price: e.target.value
              })}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Stock</label>
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({
                ...newProduct, 
                stock: e.target.value
              })}
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">Image</label>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="file-input file-input-bordered"
            />
          </div>
          <div className="modal-action">
            <button 
              type="button" 
              className="btn" 
              onClick={() => setIsAddModalOpen(false)}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );

  const handleLogout = async () => {
    try {
      await adminLogout();
      // Navigation is now handled in the context
    } catch (error) {
      // Handle any logout errors
      showNotification('Logout failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      {/* Notification Component */}
      <NotificationComponent />
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Product
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
        </div>

        {renderProductTable()}
      </div>

      {renderEditModal()}
      {renderAddModal()}
    </div>
  );
};

export default AdminDashboard;