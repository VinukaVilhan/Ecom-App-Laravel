import React, { useState } from 'react';
import { 
  User, 
  ShoppingCart, 
  Heart, 
  Package, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';


interface TopNavigationProps {
  activeSection: 'profile' | 'cart' | 'orders' | 'wishlist';
  onSectionChange: (section: 'profile' | 'cart' | 'orders' | 'wishlist') => void;
  onLogout: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ 
  activeSection, 
  onSectionChange, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { 
      section: 'profile' as const, 
      icon: User, 
      label: 'My Profile',
      href: '/profile'
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
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
            <div className="flex items-center">
            <Link href="/pages/customerDashboard" legacyBehavior>
              <a className="text-xl font-bold text-primary">Customer Portal</a>
            </Link>
            </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map(({ section, icon: Icon, label }) => (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                  ${activeSection === section 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon size={18} className={activeSection === section ? 'text-white' : 'text-gray-500'} />
                <span>{label}</span>
              </button>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} className="text-red-500" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          {navigationItems.map(({ section, icon: Icon, label }) => (
            <button
              key={section}
              onClick={() => {
                onSectionChange(section);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                ${activeSection === section 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon size={18} className={activeSection === section ? 'text-white' : 'text-gray-500'} />
              <span>{label}</span>
            </button>
          ))}
          <button
            onClick={() => {
              onLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} className="text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavigation;