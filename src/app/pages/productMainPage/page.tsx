'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/navbar';
import { CartItem } from "@/types/CartItem";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  rating: number;
  image: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/products', {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };


    const handleBuyNow = (product: Product) => {
        console.log('Buy now:', product);
    };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Navbar />
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Products</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-6 p-2 border border-gray-300 rounded-lg w-1/2"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
              {product.image && (
                <Image
                  src={`http://127.0.0.1:8000/storage/${product.image}`}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="rounded-lg"
                />
              )}
              <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
              <div className="text-gray-700 mt-2">
                {product.description.split('. ').map((sentence, index) => (
                  <p key={index} className="mb-2">{sentence}.</p>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-gray-900 font-semibold">Price: ${product.price.toFixed(2)}</p>
                <p className="text-gray-500">Stock: {product.stock}</p>
                <p className="text-gray-500">Category: {product.category}</p>
                <p className="text-yellow-500">Rating: {product.rating}</p>
              </div>
              <div className="mt-4 flex justify-between">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;