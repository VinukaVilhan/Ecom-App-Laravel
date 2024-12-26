'use client';

import React from 'react';
import AdminNavbar from '@/app/components/admin/topNavigationBar';
import ProductManagement from '@/app/components/admin/dashboard/products';

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <AdminNavbar />
      <div className="p-8">
        <ProductManagement />
      </div>
    </div>
  );
};

export default ProductsPage;