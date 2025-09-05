import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Truck, Shield, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to E-Shop</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, secure delivery.
        </p>
        <Link href="/products">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Now
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center">
          <CardHeader>
            <Truck className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <CardTitle>Fast Delivery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Get your orders delivered quickly with our reliable shipping partners.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <CardTitle>Secure Shopping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Shop with confidence knowing your data and payments are protected.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Star className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
            <CardTitle>Quality Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              We curate only the best products to ensure your satisfaction.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gray-100 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Browse our extensive collection of products and find exactly what you're looking for.
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
