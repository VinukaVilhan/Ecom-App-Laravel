import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useState } from "react";
import { LogIn} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  category: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

   // Search and filter products based on name or category
   const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(term) || 
      product.category.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <nav className="bg-white shadow-md">
       <div className="navbar bg-base-100 shadow-md px-4 lg:px-8">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" aria-label="Toggle Menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Categories</a></li>
              <li><a>Deals</a></li>
              <li><a>About</a></li>
            </ul>
          </div>
          <Link href="/">
          E-Shop
          </Link>
          
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><a>Categories</a></li>
            <li><a>Deals</a></li>
            <li><a>About</a></li>
          </ul>
        </div>
        
        <div className="navbar-end space-x-2">
          <div className="form-control relative mr-2">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={handleSearch}
                className="input input-bordered w-full pr-10" 
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </span>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Cart">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Your cart is empty</a></li>
            </ul>
          </div>
          <div className="space-x-2">
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
