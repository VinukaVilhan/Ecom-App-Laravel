"use client";

import React, { useState } from 'react';
import { 
  User, 
  ShoppingCart, 
  Heart, 
  Package, 
  CreditCard, 
  Settings, 
  Trash2,
  LogOut 
} from 'lucide-react';
import ProtectedRoute from "@/app/middleware/ProtectedRoutes";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from 'next/navigation';

// Interfaces for Type Safety
interface User {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  metadata?: {
    creationTime?: string;
  };
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartItemProps {
  product: Product;
  onRemove: (productId: number) => void;
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

// Cart Item Component with Explicit Types
const CartItem: React.FC<CartItemProps> = ({ product, onRemove }) => (
  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
    <div className="flex items-center space-x-4">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-16 h-16 object-cover rounded-md"
      />
      <div>
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500">${product.price.toFixed(2)}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <div className="badge badge-primary">Qty: {product.quantity}</div>
      <button 
        aria-label="Remove item from cart"
        onClick={() => onRemove(product.id)} 
        className="btn btn-ghost btn-square btn-sm"
      >
        <Trash2 className="text-red-500" size={20} />
      </button>
    </div>
  </div>
);

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'profile' | 'cart' | 'orders' | 'wishlist'>('profile');
  const [cartItems, setCartItems] = useState<Product[]>([
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 129.99, 
      quantity: 1, 
      image: '/headphones.jpg' 
    },
    { 
      id: 2, 
      name: 'Smart Watch', 
      price: 199.99, 
      quantity: 1, 
      image: '/smartwatch.jpg' 
    }
  ]);

  const handleRemoveCartItem = (productId: number): void => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      router.push('/pages/login');
    } catch (error) {
      console.error("Logout failed", error);
      // Optionally show an error toast or message
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile Navigation */}
        <div className="md:hidden w-full fixed top-0 left-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Customer Portal</h1>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {[
                { section: 'profile' as const, label: 'My Profile' },
                { section: 'cart' as const, label: 'My Cart' },
                { section: 'orders' as const, label: 'My Orders' },
                { section: 'wishlist' as const, label: 'Wishlist' }
              ].map(({ section, label }) => (
                <li key={section} onClick={() => setActiveSection(section)}>
                  <a>{label}</a>
                </li>
              ))}
              <li onClick={handleLogout}>
                <a className="text-red-600">Logout</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="hidden md:block w-64 bg-white shadow-md p-6 border-r mt-16 md:mt-0">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-primary">Customer Portal</h1>
          </div>
          <ul className="space-y-2">
            {[
              { 
                section: 'profile' as const, 
                icon: User, 
                label: 'My Profile' 
              },
              { 
                section: 'cart' as const, 
                icon: ShoppingCart, 
                label: 'My Cart' 
              },
              { 
                section: 'orders' as const, 
                icon: Package, 
                label: 'My Orders' 
              },
              { 
                section: 'wishlist' as const, 
                icon: Heart, 
                label: 'Wishlist' 
              }
            ].map(({ section, icon: Icon, label }) => (
              <li 
                key={section}
                className={`py-2 px-4 rounded-lg cursor-pointer flex items-center space-x-3 ${
                  activeSection === section 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setActiveSection(section)}
              >
                <Icon className={activeSection === section ? 'text-white' : 'text-gray-500'} />
                <span>{label}</span>
              </li>
            ))}
            
            {/* Logout option in sidebar */}
            <li 
              className="py-2 px-4 rounded-lg cursor-pointer flex items-center space-x-3 hover:bg-red-50 text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="text-red-500" />
              <span>Logout</span>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 mt-16 md:mt-0">
          {/* Top Navigation with User Dropdown */}
          <div className="w-full flex justify-end mb-4">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img 
                    src={user?.photoURL || '/default-avatar.png'} 
                    alt="User avatar" 
                    className="object-cover"
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li onClick={() => setActiveSection('profile')}>
                  <a>Profile</a>
                </li>
                <li onClick={() => setActiveSection('cart')}>
                  <a>My Cart</a>
                </li>
                <li onClick={handleLogout}>
                  <a className="text-red-600">Logout</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              <ProfileCard user={user} />
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button className="btn btn-outline w-full">
                    <Settings className="mr-2" /> Edit Profile
                  </button>
                  <button className="btn btn-outline w-full">
                    <CreditCard className="mr-2" /> Payment Methods
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cart Section */}
          {activeSection === 'cart' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Cart</h2>
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map(item => (
                    <CartItem 
                      key={item.id} 
                      product={item} 
                      onRemove={handleRemoveCartItem} 
                    />
                  ))}
                  <div className="mt-6 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Total:</h3>
                    <p className="text-2xl font-bold text-primary">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                  <button className="btn btn-primary w-full mt-4">
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          )}

          {/* Orders Section */}
          {activeSection === 'orders' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Orders</h2>
              <div className="text-center text-gray-500">
                <p>No orders found.</p>
                <button className="btn btn-primary mt-4">Continue Shopping</button>
              </div>
            </div>
          )}

          {/* Wishlist Section */}
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