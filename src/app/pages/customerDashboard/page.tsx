"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProtectedRoute from "@/app/middleware/ProtectedRoutes";
import { useAuth } from "@/app/context/AuthContext";
import TopNavigation from '@/app/components/customer/topNavigationBar';
import type { CartItem } from '@/app/components/customer/dashboard/cartSection';
import CartSection from '@/app/components/customer/dashboard/cartSection';
import OrdersSection from '@/app/components/customer/dashboard/orderSection';
import { ProfileSection } from '@/app/components/customer/dashboard/profileSection';

// User Interface
interface User {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  metadata?: {
    creationTime?: string;
  };
}

export default function CustomerDashboard() {
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'profile' | 'cart' | 'orders' | 'wishlist'>('profile');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Handle activeTab URL parameter
  useEffect(() => {
    const activeTab = searchParams.get('activeTab');
    if (activeTab && (activeTab === 'profile' || activeTab === 'cart' || activeTab === 'orders' || activeTab === 'wishlist')) {
      setActiveSection(activeTab);
    }
  }, [searchParams]);

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

        <div className="flex-1 p-6 mt-16 md:mt-20">
        {activeSection === 'profile' && (
          <div>
            <ProfileSection user={user ? { name: user.name || '', email: user.email || '' } : null} />
          </div>
        )}

          {activeSection === 'cart' && (
            <CartSection 
              items={cartItems}
              onRemoveItem={handleRemoveCartItem}
            />
          )}

          {activeSection === 'orders' && (
            <OrdersSection />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
