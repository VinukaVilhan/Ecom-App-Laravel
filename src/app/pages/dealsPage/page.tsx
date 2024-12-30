"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';

const DealsPage: React.FC = () => {
    interface Deal {
        id: number;
        title: string;
        description: string;
        product_id: number;
        product?: Product;
    }
    
    interface Product {
        id: number;
        name: string;
        price: number;
        // Add other product properties as needed
    }

    const [deals, setDeals] = useState<Deal[]>([]);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    // Notification Handler
    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Fetch deals and products
      const fetchDeals = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/deals', {
              headers: {
                'Accept': 'application/json'
              }
            });
    
            if (response.status === 200) {
              setDeals(response.data);
            }
          } catch (error) {
            console.error('Failed to fetch deals:', error);
          }
      };
    
      const fetchProducts = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/products');
          setProducts(response.data.products);
        } catch (error) {
          showNotification('Failed to fetch products', 'error');
        }
      };
    
      useEffect(() => {
        fetchDeals();
        fetchProducts();
      }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Deals</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deals.map((deal) => (
                        <div key={deal.id} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-2">{deal.title}</h2>
                            <p className="text-gray-700 mb-4">{deal.description}</p>
                            <p className="text-gray-500">Product Name: {deal.product?.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DealsPage;