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
  LogIn,
  ArrowRight,
  Heart
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "./components/navbar";
import { Product } from "@/types/Product";
import { CartItem } from "@/types/CartItem";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  link: string;
}

export default function Home() {
  // State management for products and UI interactions
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Predefined categories with custom SVG icons
  const categories: Category[] = [
    { 
      id: 1, 
      name: "Electronics", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      link: "/pages/electronicsPage"
    },
    { 
      id: 2, 
      name: "Fashion", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>,
      link: "/pages/fashionPage"
    },
    { 
      id: 3, 
      name: "Home & Kitchen", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>,
      link: "/pages/homeAppliancePage"
    },
    { 
      id: 4, 
      name: "Beauty", 
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>,
      link: "/pages/beautyPage"
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
  // Replace your existing handleAddToCart function with this:
  const handleAddToCart = async (product: Product) => {
    try {
      setIsAddingToCart(true);
  
      const existingCartItems: CartItem[] = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
  
      const cartItemIndex = existingCartItems.findIndex(
        (item) => item.product_id === product.id
      );
  
      if (cartItemIndex > -1) {
        // Update quantity if product exists
        existingCartItems[cartItemIndex].quantity += 1;
      } else {
        // Add new item
        const cartItem: CartItem = {
          product_id: product.id,
          quantity: 1,
          price: product.price,
          id: Date.now(), // Unique ID for tracking, optional
        };
        existingCartItems.push(cartItem);
      }
  
      // Save updated cart items to localStorage
      localStorage.setItem("cartItems", JSON.stringify(existingCartItems));
  
      // Update local state
      setCartItems(existingCartItems);
  
      toast.success("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Enhanced */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between relative z-10">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Summer Sale 
                <span className="text-yellow-400">!</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100 max-w-lg">
                Discover amazing deals on top brands with up to 50% off. 
                Transform your shopping experience today.
              </p>
              <div className="flex space-x-4">
                <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
                  Shop Now
                </button>
                <button className="px-8 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200">
                  View Deals
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="w-full max-w-md mx-auto"> {/* Added container with fixed width */}
                <Carousel
                  showArrows={true}
                  showThumbs={false}
                  infiniteLoop={true}
                  autoPlay={true}
                  interval={2000}
                  className="rounded-lg shadow-2xl"
                  >
                  <div className="aspect-w-16 aspect-h-9"> {/* Added aspect ratio container */}
                    <img 
                    src="http://127.0.0.1:8000/storage/heroIMG1.png" 
                    alt="Hero Product 1" 
                    className="rounded-lg shadow-2xl w-full h-96 object-cover transform hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                    src="http://127.0.0.1:8000/storage/heroIMG2.jpg" 
                    alt="Hero Product 2" 
                    className="rounded-lg shadow-2xl w-full h-96 object-cover transform hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                    src="http://127.0.0.1:8000/storage/heroIMG3.jpeg" 
                    alt="Hero Product 3" 
                    className="rounded-lg shadow-2xl w-full h-96 object-cover transform hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                </Carousel>
              </div>
              <div className="absolute -bottom-6 right-0 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-gray-800 font-semibold">Limited Time Offer</div>
                <div className="text-blue-600 font-bold">Save up to 50%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section - Enhanced */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
            <Link href="/pages/categoriesPage" className="flex items-center text-blue-600 hover:text-blue-700">
              View All Categories <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="p-8">
                  <div className="text-blue-600 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="mt-2 text-gray-500 text-sm">Explore {category.name}</p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={category.link} key={category.id}>
                    <ArrowRight className="w-6 h-6 text-white" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our handpicked selection of top products</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-72 px-4 py-3 pl-12 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={`http://127.0.0.1:8000/storage/${product.image}`}
                      alt={product.name}
                      className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <button title="Add to Wishlist" className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                    </button>
                    {/* {product.stock < 10 && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-sm">
                        Low Stock
                      </div>
                    )} */}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</div>
                      <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isAddingToCart}
                      >
                      {isAddingToCart ? (
                        <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Adding...
                        </span>
                      ) : (
                        <>
                        <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                        </>
                      )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full mr-4">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Free Shipping</h3>
                  <p className="text-gray-600">On orders over $100</p>
                </div>
              </div>
              <p className="text-gray-500">Enjoy free shipping on all orders exceeding $100. Fast and reliable delivery to your doorstep.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-50 rounded-full mr-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Secure Payment</h3>
                  <p className="text-gray-600">100% secure payment</p>
                </div>
              </div>
              <p className="text-gray-500">Shop with confidence using our encrypted payment system. Your security is our priority.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-50 rounded-full mr-4">
                  <CreditCard className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Easy Returns</h3>
                  <p className="text-gray-600">30-day return policy</p>
                </div>
              </div>
              <p className="text-gray-500">Not satisfied? Return your purchase within 30 days for a full refund, no questions asked.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}