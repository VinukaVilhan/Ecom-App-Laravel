'use client';

import React from 'react';
import AdminNavbar from '@/app/components/admin/topNavigationBar';
import UserManagement from '@/app/components/admin/dashboard/users';

const UsersPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <AdminNavbar />
      <div className="p-8">
        <UserManagement />
      </div>
    </div>
  );
};

export default UsersPage;