
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  // Add other product properties as needed
}

interface Deal {
  id: number;
  product_id: number;
  title: string;
  description: string;
  product?: Product;
}

interface NotificationType {
  message: string;
  type: 'success' | 'error';
}

const DealManagement: React.FC = () => {
  // State management
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [newDeal, setNewDeal] = useState({
    product_id: '',
    title: '',
    description: '',
  });

  // Notification Handler
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Fetch deals and products
  const fetchDeals = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/deals', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Accept': 'application/json'
          }
        });

        if (response.status === 200) {
          setDeals(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data.products);
    } catch (error) {
      showNotification('Failed to fetch products', 'error');
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchProducts();
  }, []);

  // Add Deal Handler
  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/deals', {
        product_id: Number(newDeal.product_id),
        title: newDeal.title,
        description: newDeal.description,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept': 'application/json'
        }
      });
      
      setDeals([...deals, response.data]);
      setNewDeal({ product_id: '', title: '', description: '' });
      setIsAddModalOpen(false);
      showNotification('Deal added successfully', 'success');
    } catch (error) {
      showNotification('Failed to add deal', 'error');
    }
  };

  // Update Deal Handler
  const handleUpdateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal) return;

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/deals/${selectedDeal.id}`, {
        product_id: selectedDeal.product_id,
        title: selectedDeal.title,
        description: selectedDeal.description,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept': 'application/json'
        }
      });

      setDeals(deals.map(d => d.id === selectedDeal.id ? response.data : d));
      setIsModalOpen(false);
      showNotification('Deal updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update deal:', (error as any).response.data);
      showNotification('Failed to update deal', 'error');
    }
  };

  // Delete Deal Handler
  const handleDeleteDeal = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/deals/${id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            'Accept': 'application/json'
          }
      });
      setDeals(deals.filter(d => d.id !== id));
      showNotification('Deal deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete deal', 'error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-4 py-2 rounded shadow-lg`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deal Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Deal
        </button>
      </div>

      {/* Deals Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map(deal => (
              <tr key={deal.id}>
                <td>{deal.id}</td>
                <td>{deal.product?.name}</td>
                <td>{deal.title}</td>
                <td>{deal.description}</td>
                <td>
                  <div className="flex space-x-2">
                    <button 
                      className="btn btn-xs btn-info"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-xs btn-error"
                      onClick={() => handleDeleteDeal(deal.id)}
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

      {/* Edit Modal */}
      <dialog 
        className={`modal ${isModalOpen ? 'modal-open' : ''}`} 
        open={isModalOpen}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Deal</h3>
          {selectedDeal && (
            <form onSubmit={handleUpdateDeal} className="space-y-4">
              <div className="form-control">
                <label className="label">Product</label>
                <select
                  value={selectedDeal.product_id}
                  onChange={(e) => setSelectedDeal({
                    ...selectedDeal,
                    product_id: Number(e.target.value)
                  })}
                  className="select select-bordered"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

                <div className="form-control">
                <label className="label">Title</label>
                <input
                  value={selectedDeal.title}
                  onChange={(e) => setSelectedDeal({
                    ...selectedDeal,
                    title: e.target.value
                  })}
                  type="text"
                  className="input input-bordered"
                  required
                />
                </div>

              <div className="form-control">
                <label className="label">Description</label>
                <textarea
                  value={selectedDeal.description}
                  onChange={(e) => setSelectedDeal({
                    ...selectedDeal,
                    description: e.target.value
                  })}
                  className="textarea textarea-bordered"
                  required
                />
              </div>
              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Deal
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>

      {/* Add Deal Modal */}
      <dialog 
        className={`modal ${isAddModalOpen ? 'modal-open' : ''}`} 
        open={isAddModalOpen}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add New Deal</h3>
          <form onSubmit={handleAddDeal} className="space-y-4">
            <div className="form-control">
              <label className="label">Product</label>
              <select
                value={newDeal.product_id}
                onChange={(e) => setNewDeal({
                  ...newDeal,
                  product_id: e.target.value
                })}
                className="select select-bordered"
                required
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">Title</label>
              <input
                value={newDeal.title}
                onChange={(e) => setNewDeal({
                  ...newDeal,
                  title: e.target.value
                })}
                type="text"
                className="input input-bordered"
                required
              />
            <div className="form-control">
              <label className="label">Description</label>
              <textarea
                value={newDeal.description}
                onChange={(e) => setNewDeal({
                  ...newDeal,
                  description: e.target.value
                })}
                className="textarea textarea-bordered"
                required
              />
            </div>
            </div>
            <div className="modal-action">
              <button 
                type="button" 
                className="btn" 
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Deal
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default DealManagement;