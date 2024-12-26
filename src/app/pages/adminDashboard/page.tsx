'use client';

import React, { useState } from 'react';
import AdminNavbar from '@/app/components/admin/topNavigationBar';
import ProductManagement from '@/app/components/admin/dashboard/products';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'users' | 'orders'>('dashboard');

  return (
    <div className="min-h-screen bg-base-200">
      <AdminNavbar />
      
      <div className="p-8">
        {activeSection === 'dashboard' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            {/* Add dashboard overview content */}
          </div>
        )}

        {activeSection === 'products' && (
          <ProductManagement />
        )}

        {activeSection === 'users' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">User Management</h1>
            {/* Add user management content */}
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">Order Management</h1>
            {/* Add order management content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;