'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/navbar';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';
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

interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  id: number;
}

const BeautyPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

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
        const electronicsProducts = data.products.filter((product: Product) => 
          product.category.toLowerCase() === 'beauty'
        );
        setProducts(electronicsProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  const addToCart = (product: Product) => {
    const existingCartItems: CartItem[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cartItemIndex = existingCartItems.findIndex(item => item.product_id === product.id);

    if (cartItemIndex > -1) {
      existingCartItems[cartItemIndex].quantity += 1;
    } else {
      const cartItem: CartItem = {
        product_id: product.id,
        quantity: 1,
        price: product.price,
        id: Date.now(), // Unique ID for tracking, optional
      };
      existingCartItems.push(cartItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    toast.success("Item added to cart successfully!");
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);

    if (!isLoggedIn()) {
      alert('Please log in to proceed with the purchase.');
      localStorage.setItem('redirectAfterLogin', '/customer/dashboard?activeTab=cart');
      router.push('/pages/login');
      return;
    }

    router.push('/pages/customerDashboard?activeTab=cart');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Beauty Products</h2>
          <input
            type="text"
            placeholder="Search Beauty Products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-6 p-2 border border-gray-300 rounded-lg w-1/3"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
                {product.image && (
                  <div className="relative h-48">
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
                  <div className="mt-4 flex justify-between">
                    <button className="btn btn-primary" onClick={() => addToCart(product)}>
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleBuyNow(product)}>
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BeautyPage;