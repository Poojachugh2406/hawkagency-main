import type { LoginData, RegisterData, User } from "./auth";

// Base API Response Type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalOrders?: number;
    totalRefunds?: number;
    totalProducts?: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  errors?: string[];
}

// Common types
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

// File upload types
export interface FileUpload {
  path: string;
  secure_url?: string;
}

// Filter and Search types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationType{
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  limit?: number;
}

export interface SearchParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Error types
export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}


export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginData) =>  Promise<void>;
  register: (credentials: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser:(userData: User)=>void;
  isAuthenticated: boolean;
  isLoading: boolean;
}