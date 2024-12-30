import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

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

interface CartSectionProps {
  items: CartItem[];
  onRemoveItem: (cartItemId: number) => Promise<void>;
}

interface CartItemProps {
  item: CartItem;
  onRemove: (cartItemId: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onRemove }) => {
  return (
    <div className="flex items-center justify-between bg-base-200 p-4 rounded-lg mb-4">
      <div className="flex items-center space-x-4">
        <img 
          src={`http://127.0.0.1:8000/storage/${item.product.image}` || '/placeholder-product.png'} 
          alt={item.product.name} 
          className="w-16 h-16 object-cover rounded-md"
        />
        <div>
          <h3 className="font-semibold">{item.product.name}</h3>
          <p className="text-base-content/70">${item.product.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="badge badge-primary">Qty: {item.quantity}</div>
        <button 
          onClick={() => onRemove(item.id)} 
          className="btn btn-ghost btn-square btn-sm"
          title="Remove item"
        >
          <Trash2 className="text-error" size={20} />
        </button>
      </div>
    </div>
  );
};

const CartSection: React.FC<CartSectionProps> = ({ items, onRemoveItem }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotal = (): number => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create orders for each cart item
      for (const item of items) {
        const orderData = {
          product_id: item.product_id,
          user_id: item.user_id,
          quantity: item.quantity,
          order_date: new Date().toISOString().split('T')[0]
        };

        const response = await fetch('http://127.0.0.1:8000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }
      }

      // Clear cart items after successful order creation
      items.forEach(async (item) => {
        await onRemoveItem(item.id);
      });

      setIsConfirmOpen(false);
      // Show success message using DaisyUI toast
      (window as any).confirm_modal.close();
      (window as any).success_toast.showToast();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-base-100 shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>
      {items.length === 0 ? (
        <p className="text-center text-base-content/70">Your cart is empty</p>
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
          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}
          <button 
            className="btn btn-primary w-full mt-4"
            onClick={() => (window as any).confirm_modal.showModal()}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner"></span>
                Processing...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </button>

          {/* DaisyUI Modal for Confirmation */}
          <dialog id="confirm_modal" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Purchase</h3>
              <p className="py-4">
                Are you sure you want to complete this purchase for ${calculateTotal().toFixed(2)}?
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-ghost">Cancel</button>
                  <button 
                    className="btn btn-primary ml-2" 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    Confirm Purchase
                  </button>
                </form>
              </div>
            </div>
          </dialog>

          {/* Success Toast */}
          <div className="toast toast-end" id="success_toast">
            <div className="alert alert-success">
              <span>Order placed successfully!</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSection;