'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle navigation in useEffect to avoid setState during render
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/cart');
      return;
    }
  }, [isAuthenticated, items.length, router]);

  // Show loading while navigation is happening
  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center">Redirecting...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const order = await api.createOrder({
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });

      clearCart();
      router.push(`/orders/${order.data.id}`);
    } catch (error: any) {
      setError(error.message || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                    placeholder="Enter your complete shipping address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Method
                  </label>
                  <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900 text-sm sm:text-base">Cash on Delivery</p>
                        <p className="text-xs sm:text-sm text-blue-700">Pay when your order is delivered</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Currently, only Cash on Delivery is available as a payment method.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full text-sm sm:text-base"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base line-clamp-2">{item.product.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {formatPrice(item.product.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-sm sm:text-base flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base sm:text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}