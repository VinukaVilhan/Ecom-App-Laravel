"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  CreditCard
} from 'lucide-react';
import ProtectedRoute from "@/app/middleware/ProtectedRoutes";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';
import TopNavigation from '@/app/components/customer/topNavigationBar';
import type { CartItem } from '@/app/components/customer/dashboard/cartSection';
import CartSection from '@/app/components/customer/dashboard/cartSection';

// User Interface
interface User {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  metadata?: {
    creationTime?: string;
  };
}

// Profile Card Component
const ProfileCard: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <div className="flex items-center space-x-4 mb-6">
      <div className="avatar">
        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img 
            src={user?.photoURL || '/default-avatar.png'} 
            alt="User Profile" 
            className="object-cover"
          />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{user?.displayName || 'User'}</h2>
        <p className="text-gray-500">{user?.email}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase">Phone</h3>
        <p className="text-gray-700">{user?.phoneNumber || 'Not provided'}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 uppercase">Member Since</h3>
        <p className="text-gray-700">
          {user?.metadata?.creationTime 
            ? new Date(user.metadata.creationTime).toLocaleDateString() 
            : 'Unknown'}
        </p>
      </div>
    </div>
  </div>
);

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'profile' | 'cart' | 'orders' | 'wishlist'>('profile');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/cart-items', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveCartItem = async (productId: number): Promise<void> => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart-items/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/pages/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <TopNavigation 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
        />

        <div className="flex-1 p-6 mt-16 md:mt-0">
          {activeSection === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              <ProfileCard user={user} />
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button 
                    className="btn btn-outline w-full"
                    onClick={() => router.push('/pages/editProfile')}
                  >
                    <Settings className="mr-2" /> Edit Profile
                  </button>
                  <button className="btn btn-outline w-full">
                    <CreditCard className="mr-2" /> Payment Methods
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cart' && (
            <CartSection 
              items={cartItems}
              onRemoveItem={handleRemoveCartItem}
            />
          )}

          {activeSection === 'orders' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Orders</h2>
              <div className="text-center text-gray-500">
                <p>No orders found.</p>
                <button className="btn btn-primary mt-4">Continue Shopping</button>
              </div>
            </div>
          )}

          {activeSection === 'wishlist' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
              <div className="text-center text-gray-500">
                <p>Your wishlist is empty.</p>
                <button className="btn btn-primary mt-4">Explore Products</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}