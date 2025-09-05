'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api, Order } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders();
      setOrders(response.data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">You need to be logged in to view your orders.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg mb-6">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Order #{order.id}</CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Placed on {format(new Date(order.created_at), 'PPP')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-base sm:text-lg">
                      {formatPrice(order.total_amount)}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Items:</p>
                    <div className="mt-1 space-y-1">
                      {order.items?.map((item) => (
                        <p key={item.id} className="text-xs sm:text-sm text-gray-600">
                          {item.product.name} × {item.quantity} - {formatPrice(item.price * item.quantity)}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Shipping Address:</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{order.shipping_address}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Payment Method:</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {order.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>

                  <div className="pt-2 sm:pt-4">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}