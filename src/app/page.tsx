"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  ShoppingCart, 
  Search, 
  Star, 
  Truck, 
  Shield, 
  CreditCard,
  User,
  LogIn
} from "lucide-react";
import Link from "next/link";
import Navbar from "./components/navbar";

// Enhanced Product Interface: Defines the structure of a product
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  category: string;
}

// Category Interface: Defines the structure of product categories
interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
}

export default function Home() {
  // State management for products and UI interactions
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined categories with custom SVG icons
  const categories: Category[] = [
    { 
      id: 1, 
      name: "Electronics", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    },
    { 
      id: 2, 
      name: "Fashion", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    },
    { 
      id: 3, 
      name: "Home & Kitchen", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    },
    { 
      id: 4, 
      name: "Beauty", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    }
  ];

  // Fetch products from API with error handling and loading state
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/api/products');
      setProducts(response.data.products);
      setFilteredProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch products when component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

  // Handle product selection for modal
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Placeholder for add to cart functionality
  const handleAddToCart = (product: Product) => {
    console.log(`Added ${product.name} to cart`);
  };

  // Loading state component
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navbar */}
      <Navbar/>

      {/* Hero Section */}
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img 
            src="/api/placeholder/600/400" 
            alt="Hero Product" 
            className="max-w-sm rounded-lg shadow-2xl" 
          />
          <div>
            <h1 className="text-5xl font-bold">Summer Sale!</h1>
            <p className="py-6 text-xl">
              Discover amazing deals on top brands. 
              Get up to 50% off on selected items and transform your shopping experience.
            </p>
            <div className="flex space-x-4">
              <button className="btn btn-primary">Shop Now</button>
              <button className="btn btn-ghost">Learn More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <div className="card-body items-center text-center">
                  <div className="text-primary mb-4">
                    {category.icon}
                  </div>
                  <h3 className="card-title">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <div className="form-control">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input input-bordered w-full" 
                />
                <button className="btn btn-square" aria-label="s">
                  <Search />
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <figure 
                    className="cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <img 
                      src={`http://127.0.0.1:8000/storage/${product.image}`}
                      alt={product.name} 
                      className="w-full h-48 object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 mr-1" />
                        <span>{product.rating}/5</span>
                      </div>
                      <div className="font-bold text-xl">${product.price.toFixed(2)}</div>
                    </div>
                    <div className="card-actions justify-end mt-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary w-full"
                      >
                        <ShoppingCart className="mr-2" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4">
              <Truck className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-bold">Free Shipping</h3>
                <p className="text-base-content/70">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-bold">Secure Payment</h3>
                <p className="text-base-content/70">100% secure payment</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <CreditCard className="w-12 h-12 text-primary" />
              <div>
                <h3 className="text-xl font-bold">Easy Returns</h3>
                <p className="text-base-content/70">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>)}