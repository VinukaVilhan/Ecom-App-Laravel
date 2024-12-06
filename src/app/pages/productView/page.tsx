'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function ViewProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/products`);
      setProduct(response.data.product);
    } catch (err) {
      setError('Failed to fetch product');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <figure>
          <Image 
            src={`${product.image}`} 
            alt={product.name} 
            width={384} 
            height={384} 
            className="object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{product.name}</h2>
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <div className="card-actions justify-between mt-4">
            <Link 
              href={`/products/edit/${product.id}`} 
              className="btn btn-warning"
            >
              Edit
            </Link>
            <Link 
              href="/products" 
              className="btn btn-neutral"
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}