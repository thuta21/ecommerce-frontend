'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardContent className="p-3 sm:p-4 flex-1">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square bg-gray-100 rounded-lg mb-3 sm:mb-4 flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 text-3xl sm:text-4xl">📦</div>
            )}
          </div>
          <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2 sm:line-clamp-3">{product.description}</p>
        </Link>
        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            Stock: {product.stock_quantity}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
        {/* Quantity Selector */}
        {product.stock_quantity > 0 && (
          <div className="w-full flex items-center justify-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="font-medium text-base sm:text-lg min-w-[1.5rem] sm:min-w-[2rem] text-center">{quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock_quantity}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}
        <Button
          onClick={handleAddToCart}
          disabled={isLoading || product.stock_quantity === 0}
          className="w-full text-xs sm:text-sm h-8 sm:h-10"
        >
          <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">
            {isLoading ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
          <span className="xs:hidden">
            {isLoading ? '+' : product.stock_quantity === 0 ? '✗' : '+'}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}