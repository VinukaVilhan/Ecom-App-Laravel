import Link from "next/link";
import { ShoppingCart, User, Search, Menu, LogIn } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="navbar bg-base-100 px-4 lg:px-8">
        {/* Navbar Start */}
        <div className="navbar-start">
          {/* Dropdown for Mobile */}
          <div className="dropdown">
            <button
              tabIndex={0}
              role="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-ghost lg:hidden"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {isMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a href="#categories">Categories</a>
                </li>
                <li>
                  <a href="#deals">Deals</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
              </ul>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            E-Shop
          </Link>
        </div>

        {/* Navbar Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-4">
            <li>
              <a href="#categories">Categories</a>
            </li>
            <li>
              <a href="#deals">Deals</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end space-x-2 flex items-center">
          {/* Search Bar */}
          
          {/* Cart Dropdown */}
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Your cart is empty</a>
              </li>
            </ul>
          </div>

          {/* Authentication Links */}
          <div className="flex space-x-2">
            <Link href="/pages/login">
              <button className="btn btn-ghost">
                <LogIn className="mr-1" />
                Login
              </button>
            </Link>
            <Link href="/pages/register">
              <button className="btn btn-primary">
                <User className="mr-1" />
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
