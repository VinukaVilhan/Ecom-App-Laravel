'use client';

import React from 'react';
import AdminNavbar from '@/app/components/admin/topNavigationBar';
import DealManagement from '@/app/components/admin/dashboard/deals';
import ProtectedRoute from '@/app/middleware/ProtectedRoutes';

const ProductsPage = () => {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-base-200">
      <AdminNavbar />
      <div className="p-8">
        <DealManagement />
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default ProductsPage;