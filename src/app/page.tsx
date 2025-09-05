import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-white border rounded-lg mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Welcome to E-Shop</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
          Discover amazing products at great prices. Start shopping today.
        </p>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to Start Shopping?</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Browse our collection of products and find what you're looking for.
        </p>
        <Link href="/products">
          <Button size="lg">
            Explore Products
          </Button>
        </Link>
      </section>
    </div>
  );
}
