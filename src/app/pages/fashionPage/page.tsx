'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/app/components/navbar';

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

const FashionPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
        const beautyProducts = data.products.filter((product: Product) => 
          product.category.toLowerCase() === 'fashion'
        );
        setProducts(beautyProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Fashion Products</h1>
        <input
          type="text"
          placeholder="Search fashion products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-6 p-2 border border-gray-300 rounded-lg w-1/3"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
              {product.image && (
                <div className="relative h-96 w-full">
                  <Image
                    src={`http://127.0.0.1:8000/storage/${product.image}`}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <div className="text-gray-700 mb-4 flex-grow">
                  {product.description.split('. ').map((sentence, index) => (
                    <p key={index} className="mb-2">{sentence}.</p>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Stock: {product.stock}</span>
                    <span className="flex items-center">
                      Rating: <span className="text-yellow-500 ml-1">{product.rating}/5</span>
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Add to Cart
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FashionPage;