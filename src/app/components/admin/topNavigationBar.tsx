import React, { useState } from 'react';
import { 
  Menu,
  X,
  Users,
  Package,
  Settings,
  Bell,
  Handshake,
  Search,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

const AdminNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notification, setNotification] = useState<{
      message: string;
      type: 'success' | 'error';
    } | null>(null);
  const { adminLogout } = useAuth();

  // Notification Handler
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

   const handleLogout = async () => {
      try {
        await adminLogout();
        // Navigation is now handled in the context
      } catch (error) {
        // Handle any logout errors
        showNotification('Logout failed', 'error');
      }
    };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and hamburger */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md lg:hidden"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
            
            <Link href="/pages/adminDashboard" className="flex items-center ml-4">
              <span className="text-xl font-bold text-gray-800">Admin Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            <Link href="/pages/adminDeals" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
                <Handshake className="h-5 w-5 mr-2" />
              Deals
            </Link>
            <Link href="/pages/adminUsers" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
              <Users className="h-5 w-5 mr-2" />
              Users
            </Link>
            <Link href="/pages/adminProduct" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
              <Package className="h-5 w-5 mr-2" />
              Products
            </Link>
          </div>

          {/* Right section - Search, notifications, and profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none ml-2 w-48"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="View notifications"
              >
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Notifications</div>
                    <div className="text-sm text-gray-500">No new notifications</div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                aria-label="Open user menu"
              >
                <User className="h-6 w-6 text-gray-600" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link href="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile Settings
                    </Link>
                    <button className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
                <Link href="/admin/products" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                    <Package className="h-5 w-5 mr-2" />
                    Products
                </Link>
                <Link href="/admin/deals" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                    <Handshake className="h-5 w-5 mr-2" />
                    Deals
                </Link>
                <Link href="/admin/users" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                    <Users className="h-5 w-5 mr-2" />
                    Users
                </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;