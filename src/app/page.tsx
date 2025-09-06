import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 lg:py-16 bg-white border rounded-lg mb-8 sm:mb-12 px-4 sm:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 leading-tight">
          Welcome to E-Shop
        </h1>
        <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-600 leading-relaxed">
          Discover amazing products at great prices. Start shopping today.
        </p>
        <Link href="/products">
          <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Shop Now
          </Button>
        </Link>
      </section>
    </div>
  );
}
