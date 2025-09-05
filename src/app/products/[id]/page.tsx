'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { api, Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await api.getProduct(id);
      setProduct(response.data);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!product) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-gray-400 text-6xl">📦</div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <p className="text-gray-600 mb-4">Category: {product.category.name}</p>
            )}
            <p className="text-4xl font-bold text-primary mb-4">
              {formatPrice(product.price)}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Stock Available</p>
              <p className="font-semibold">{product.stock_quantity} units</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-semibold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          {product.stock_quantity > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium text-xl min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock_quantity}
                  className="h-10 w-10 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500 ml-2">
                  Max: {product.stock_quantity}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock_quantity === 0}
            size="lg"
            className="w-full"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isAddingToCart ? 'Adding to Cart...' : product.stock_quantity === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
          </Button>
        </div>
      </div>
    </div>
  );
}