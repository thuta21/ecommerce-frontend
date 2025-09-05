'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, Product, PaginatedResponse } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';

function ProductsPageContent() {
  const [productsData, setProductsData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get('page') || '1');
  const perPage = 12; // Products per page

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        category: searchParams.get('category') || undefined,
        sort: searchParams.get('sort') || undefined,
        search: searchParams.get('search') || undefined,
        page: currentPage,
        per_page: perPage,
      };

      const response = await api.getProducts(params);
      setProductsData(response);
    } catch (error: any) {
      setError(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`/products?${params.toString()}`);
  };

  const products = productsData?.data || [];
  const totalItems = productsData?.total || 0;
  const totalPages = productsData?.last_page || 1;
  const showingFrom = productsData?.from || 0;
  const showingTo = productsData?.to || 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Mobile/Desktop Filters */}
        <div className="lg:hidden">
          <ProductFilters />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Products</h1>
            <p className="text-gray-600">
              {totalItems > 0 ? (
                <>Showing {showingFrom}-{showingTo} of {totalItems} products</>
              ) : (
                '0 products found'
              )}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showingFrom={showingFrom}
                  showingTo={showingTo}
                  totalItems={totalItems}
                />
              )}
            </>
          )}
        </main>
        </div>
      </div>
    </div>
  );
}

function ProductsPageLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">Loading products...</div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
}