const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce.thutaminthway.xyz/api';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add custom headers from options
    if (options.headers) {
      const customHeaders = options.headers as Record<string, string>;
      Object.assign(headers, customHeaders);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        // If response is not JSON, create a generic error
        errorData = { message: this.getStatusMessage(response.status) };
      }

      // Create error object with both message and errors (for Laravel validation)
      const error = {
        message: errorData.message || this.getStatusMessage(response.status),
        errors: errorData.errors || null,
        status: response.status
      };

      throw error;
    }

    return response.json();
  }

  private getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Invalid email or password.';
      case 403:
        return 'Access forbidden.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Please check the form for errors.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    try {
      const response = await this.request<{ token: string; user: User }>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      this.setToken(response.token);
      return response;
    } catch (error: any) {
      // Handle specific login errors
      if (error.status === 401) {
        throw {
          message: 'Invalid email or password. Please try again.',
          errors: error.errors,
          status: error.status
        };
      }
      throw error;
    }
  }

  async register(name: string, email: string, password: string, password_confirmation: string) {
    try {
      const response = await this.request<{ token: string; user: User }>('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });
      this.setToken(response.token);
      return response;
    } catch (error: any) {
      // Handle specific registration errors
      if (error.status === 422) {
        throw {
          message: error.message || 'Please fix the errors below.',
          errors: error.errors,
          status: error.status
        };
      }
      throw error;
    }
  }

  async logout() {
    await this.request('/logout', { method: 'POST' });
    this.clearToken();
  }

  async getUser() {
    return this.request<User>('/user');
  }

  // Product endpoints
  async getProducts(params?: { category?: string; sort?: string; search?: string; page?: number; per_page?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
    
    const query = searchParams.toString();
    return this.request<PaginatedResponse<Product>>(`/products${query ? `?${query}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request<{ data: Product }>(`/products/${id}`);
  }

  // Category endpoints
  async getCategories() {
    return this.request<{ data: Category[] }>('/categories');
  }

  async getCategory(id: string) {
    return this.request<{ data: Category }>(`/categories/${id}`);
  }

  // Cart endpoints
  async getCart() {
    return this.request<{ data: CartItem[] }>('/cart');
  }

  async addToCart(product_id: number, quantity: number = 1) {
    return this.request<{ data: CartItem }>('/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id, quantity }),
    });
  }

  async updateCart(cartId: number, quantity: number) {
    return this.request<{ data: CartItem }>(`/cart/${cartId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartId: number) {
    return this.request(`/cart/${cartId}`, { method: 'DELETE' });
  }

  // Order endpoints
  async getOrders() {
    return this.request<{ data: Order[] }>('/orders');
  }

  async createOrder(orderData: { shipping_address: string; payment_method: string }) {
    return this.request<{ data: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id: string) {
    return this.request<{ data: Order }>(`/orders/${id}`);
  }
}

export const api = new ApiClient(API_BASE_URL);

// Types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  category?: Category;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}