'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, Category } from '@/lib/api';
import { Filter, X, ChevronDown, Tag, ArrowUpDown, Loader2, ChevronUp, Search } from 'lucide-react';

export default function ProductFilters() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'default';
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all' && value !== 'default') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchTerm);
  };

  const clearFilters = () => {
    setSearchTerm('');
    router.push('/products');
  };

  const hasActiveFilters = (currentCategory && currentCategory !== 'all') || 
                          (currentSort && currentSort !== 'default') || 
                          (currentSearch && currentSearch.trim() !== '');

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between text-left group lg:cursor-default"
          aria-expanded={!isCollapsed}
        >
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Filter className="h-5 w-5 text-primary" />
            Filters
            {hasActiveFilters && (
              <span className="inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-primary rounded-full">
                {(currentCategory && currentCategory !== 'all' ? 1 : 0) + 
                 (currentSort && currentSort !== 'default' ? 1 : 0) + 
                 (currentSearch && currentSearch.trim() !== '' ? 1 : 0)}
              </span>
            )}
          </CardTitle>
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 lg:hidden ${
            isCollapsed ? 'rotate-0' : 'rotate-180'
          }`} />
        </button>
      </CardHeader>
      <CardContent className={`space-y-6 transition-all duration-300 ease-in-out lg:block ${
        isCollapsed ? 'hidden' : 'block'
      }`}>
        {/* Search Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Search className="h-4 w-4 text-gray-500" />
            Search Products
          </label>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-11 pr-10 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium text-gray-900 placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
        {/* Category Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Tag className="h-4 w-4 text-gray-500" />
            Category
          </label>
          <div className="relative">
            <Select 
              value={currentCategory} 
              onValueChange={(value) => updateFilters('category', value)} 
              disabled={isLoading}
            >
              <SelectTrigger className="h-11 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium text-gray-900">
                <SelectValue 
                  placeholder={isLoading ? "Loading categories..." : "All Categories"} 
                  className="text-gray-900 font-medium"
                />
              </SelectTrigger>
              <SelectContent className="max-h-64 bg-white border-gray-200 shadow-xl z-50">
                <SelectItem value="all" className="font-medium hover:bg-gray-50 focus:bg-gray-50 text-gray-900">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    All Categories
                  </div>
                </SelectItem>
                {!isLoading && categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()} className="hover:bg-blue-50 focus:bg-blue-50 text-gray-900 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  !isLoading && (
                    <SelectItem value="no-categories" disabled className="text-gray-400 opacity-75">
                      <div className="flex items-center gap-2">
                        <X className="h-3 w-3" />
                        {error || 'No categories available'}
                      </div>
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            Sort By
          </label>
          <Select value={currentSort} onValueChange={(value) => updateFilters('sort', value)}>
            <SelectTrigger className="h-11 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-medium text-gray-900">
              <SelectValue placeholder="Default" className="text-gray-900 font-medium" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
              <SelectItem value="default" className="font-medium hover:bg-gray-50 focus:bg-gray-50 text-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  Default
                </div>
              </SelectItem>
              <SelectItem value="price_asc" className="hover:bg-green-50 focus:bg-green-50 text-gray-900 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Price: Low to High
                </div>
              </SelectItem>
              <SelectItem value="price_desc" className="hover:bg-red-50 focus:bg-red-50 text-gray-900 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Price: High to Low
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-gray-100">
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="w-full h-11 border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors group"
            >
              <X className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Clear All Filters
            </Button>
          </div>
        )}
        
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-2 space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {currentSearch && currentSearch.trim() !== '' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  <Search className="h-3 w-3" />
                  "{currentSearch}"
                </span>
              )}
              {currentCategory && currentCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  <Tag className="h-3 w-3" />
                  {categories.find(c => c.id.toString() === currentCategory)?.name || currentCategory}
                </span>
              )}
              {currentSort && currentSort !== 'default' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  <ArrowUpDown className="h-3 w-3" />
                  {currentSort.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}