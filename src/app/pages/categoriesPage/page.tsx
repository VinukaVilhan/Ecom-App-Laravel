"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/components/navbar';
import { Product } from '@/types/Product';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CategoriesPage: React.FC = () => {
    const [productsByCategory, setProductsByCategory] = useState<{ [key: string]: Product[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/products');
                const products: Product[] = response.data.products;
                const groupedProducts = products.reduce((acc: { [key: string]: Product[] }, product) => {
                    if (!acc[product.category]) {
                        acc[product.category] = [];
                    }
                    acc[product.category].push(product);
                    return acc;
                }, {});
                setProductsByCategory(groupedProducts);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-64px)]">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Categories</h1>
                <p className="text-lg text-gray-600 mb-8">Discover our curated collection of products by category</p>
                <div className="space-y-12">
                    {Object.keys(productsByCategory).map(category => (
                        <CategorySection key={category} category={category} products={productsByCategory[category]} />
                    ))}
                </div>
            </div>
        </div>
    );
};

interface CategorySectionProps {
    category: string;
    products: Product[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, products }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedProducts = showAll ? products : products.slice(0, 5);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 capitalize">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {displayedProducts.map(product => (
                    <div key={product.id} className="group bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                        <div className="aspect-square overflow-hidden">
                            <img 
                                src={`http://127.0.0.1:8000/storage/${product.image}`}
                                alt={product.name}
                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                            <p className="text-lg font-semibold text-blue-600">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>
            {products.length > 5 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="inline-flex items-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                        {showAll ? (
                            <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>View More <ChevronDown className="ml-2 h-4 w-4" /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;