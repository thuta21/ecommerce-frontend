'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalAmount, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">You need to be logged in to view your cart.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartId));
    try {
      await updateQuantity(cartId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    setUpdatingItems(prev => new Set(prev).add(cartId));
    try {
      await removeFromCart(cartId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 text-center">
        <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">Add some products to get started!</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.product.image_url ? (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-gray-400 text-xl sm:text-2xl">📦</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold hover:text-primary text-sm sm:text-base line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                      {formatPrice(item.product.price)} each
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={updatingItems.has(item.id) || item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItems.has(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <p className="font-semibold text-sm sm:text-base">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updatingItems.has(item.id)}
                        className="text-red-600 hover:text-red-700 ml-2 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-3 sm:pt-4">
                <div className="flex justify-between font-semibold text-base sm:text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>
              <Button
                className="w-full text-sm sm:text-base"
                size="lg"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}