'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !price || !image) {
      setError('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', image);

    try {
      await axios.post('http://127.0.0.1:8000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/pages/productView');
    } catch (err) {
      setError('Failed to create product');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

    <form onSubmit={handleSubmit} className="space-y-4">
    <div className="form-control">
        <label className="label" htmlFor="product-name">
        <span className="label-text">Product Name</span>
        </label>
        <input
        id="product-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter product name"
        className="input input-bordered"
        required
        />
    </div>

    <div className="form-control">
        <label className="label" htmlFor="price">
        <span className="label-text">Price</span>
        </label>
        <input
        id="price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter product price"
        className="input input-bordered"
        step="0.01"
        required
        />
    </div>

    <div className="form-control">
        <label className="label" htmlFor="product-image">
        <span className="label-text">Product Image</span>
        </label>
        <input
        id="product-image"
        type="file"
        onChange={handleImageChange}
        className="file-input file-input-bordered"
        accept="image/*"
        required
        />
    </div>

    <div className="form-control mt-6">
        <button type="submit" className="btn btn-primary">
        Create Product
        </button>
    </div>
    </form>

    </div>
  );
}