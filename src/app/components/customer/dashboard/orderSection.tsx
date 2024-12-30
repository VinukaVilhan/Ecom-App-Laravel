import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router' to 'next/navigation'

interface OrderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  order_date: string;
  product: OrderProduct;
}

export const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Wrap the fetch in a condition to ensure it only runs on the client side
    if (typeof window !== 'undefined') {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No authentication token found');
          }

          const response = await fetch('http://127.0.0.1:8000/api/orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to fetch orders');
          }

          const data = await response.json();
          setOrders(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load orders');
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, []);

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (isLoading) {
    return (
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        <div className="flex justify-center items-center py-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-base-100 shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
        <button 
          onClick={handleContinueShopping}
          className="btn btn-primary mt-4"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-base-100 shadow-xl rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center text-base-content/70">
          <p>No orders found.</p>
          <button 
            onClick={handleContinueShopping}
            className="btn btn-primary mt-4"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="card bg-base-200"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded">
                        <img 
                          src={`http://127.0.0.1:8000/storage/${order.product.image}`}
                          alt={order.product.name}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {order.product.name}
                      </h3>
                      <div className="badge badge-primary">
                        Qty: {order.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${(order.product.price * order.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Ordered on: {new Date(order.order_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="text-center mt-6">
            <button 
              onClick={handleContinueShopping}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;