import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Menu,
  X,
  ShoppingCart,
  Search,
  LogIn,
  User,
  Heart,
  Tag,
  Grid,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const categories = [
    { name: 'Electronics', href: '/pages/electronicsPage' },
    { name: 'Fashion', href: '/pages/fashionPage' },
    { name: 'Home & Kitchen', href: '/pages/homeAppliancePage' },
    { name: 'Beauty', href: '/pages/beautyPage' }
  ];

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
            
            <Link href="/" className="flex items-center ml-4">
              <span className="text-xl font-bold text-gray-800">E-Shop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                <Grid className="h-5 w-5 mr-2" />
                Categories
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {isCategoriesOpen && (
                <div className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/pages/dealsPage" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
              <Tag className="h-5 w-5 mr-2" />
              Deals
            </Link>
            <Link href="/pages/productMainPage" className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
              <Tag className="h-5 w-5 mr-2" />
              Products
            </Link>
          </div>

          {/* Right section - Search, cart, and auth */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="search"
                placeholder="Search products..."
                className="bg-transparent border-none focus:outline-none ml-2 w-48"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="View cart"
              >
                <ShoppingCart className="h-6 w-6 text-gray-600" />
              </button>
              
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Shopping Cart</div>
                    <div className="text-sm text-gray-500">Your cart is empty</div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <Link href="/pages/login" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
              <Link href="/pages/register" className="flex items-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                <User className="h-5 w-5 mr-2" />
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <Grid className="h-5 w-5 mr-2" />
                  {category.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 my-2"></div>
              <Link href="/pages/dealsPage" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <Tag className="h-5 w-5 mr-2" />
                Deals
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <Link href="/pages/login" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <LogIn className="h-5 w-5 mr-2" />
                Login
              </Link>
              <Link href="/pages/register" className="flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100">
                <User className="h-5 w-5 mr-2" />
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;