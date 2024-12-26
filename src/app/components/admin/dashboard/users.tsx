'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Mail, Phone, Calendar } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept': 'application/json'
        }
      });
      setUsers(response.data.users);
    } catch (error) {
      showNotification('Failed to fetch users', 'error');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept': 'application/json'
        }
      });
      
      setUsers(users.filter(user => user.id !== id));
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete user', 'error');
    }
  };

  // Notification Component
  const NotificationComponent = () => {
    if (!notification) return null;

    return (
      <div 
        className={`fixed top-4 right-4 z-50 ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-4 py-2 rounded shadow-lg transition-all duration-300`}
      >
        {notification.message}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <NotificationComponent />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="text-sm text-gray-500">
          Total Users: {users.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className="font-medium">{user.name}</td>
                <td className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone_number || 'N/A'}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <button 
                    className="btn btn-error btn-sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;