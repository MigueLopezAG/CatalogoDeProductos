export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  category: string;
  thumbnail: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  page?: number;
  limit?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoading: boolean;
}


export interface AuthResponse {
  token: string;
}