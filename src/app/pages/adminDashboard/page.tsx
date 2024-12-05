'use client';

import React from 'react';
import { useRouter } from 'next/navigation';


const AdminDashboard: React.FC = () => {
 
 
  const router = useRouter();


  return (
    <>
   
    <div className="min-h-screen flex items-center justify-center bg-base-200">
        <p>admin dashboard</p>
    </div>
    </>
    
  );
};

export default AdminDashboard;