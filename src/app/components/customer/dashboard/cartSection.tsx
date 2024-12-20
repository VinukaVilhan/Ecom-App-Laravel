import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

// Export interfaces so they can be imported elsewhere
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
}

// Props interface for the CartSection component
interface CartSectionProps {
  items: CartItem[];
  onRemoveItem: (cartItemId: number) => Promise<void>;
}

// Props interface for individual cart item
interface CartItemProps {
  item: CartItem;
  onRemove: (cartItemId: number) => void;
}

// Cart Item Component
const CartItemComponent: React.FC<CartItemProps> = ({ item, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
      <div className="flex items-center space-x-4">
        <img 
          src={item.product.image || '/placeholder-product.png'} 
          alt={item.product.name} 
          className="w-16 h-16 object-cover rounded-md"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
          <p className="text-gray-500">${item.product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="badge badge-primary">Qty: {item.quantity}</div>
        <button 
          aria-label="Remove item from cart"
          onClick={() => onRemove(item.id)} 
          className="btn btn-ghost btn-square btn-sm"
        >
          <Trash2 className="text-red-500" size={20} />
        </button>
      </div>
    </div>
  );
};

// Main CartSection Component
const CartSection: React.FC<CartSectionProps> = ({ items, onRemoveItem }) => {
  const calculateTotal = (): number => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>
      {items.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <>
          {items.map(item => (
            <CartItemComponent 
              key={item.id} 
              item={item} 
              onRemove={onRemoveItem} 
            />
          ))}
          <div className="mt-6 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Total:</h3>
            <p className="text-2xl font-bold text-primary">
              ${calculateTotal().toFixed(2)}
            </p>
          </div>
          <button className="btn btn-primary w-full mt-4">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartSection;