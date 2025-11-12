import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { ApiResponse, SearchParams } from '../types';
import type { ChangePasswordData, ForgotPasswordData, LoginData, RegisterData, ResetPasswordData, User, VerifyData } from '../types/auth';
import type { ActiveMediators, CreateUserData, Mediator, Seller, UpdateProfileData, UserProfileData } from '../types/users';
import type { ActiveProduct, CreateProductData, Product, ProductWithDetails, UpdateProductData } from '../types/products';
import type { CreateOrderData, Order, OrderWithDetails, UpdateOrderData, UpdateOrderStatusData } from '../types/orders.ts';
import type { CreateRefundData, Refund, RefundWithDetails, UpdateRefundData, UpdateRefundStatusData } from '../types/refunds.ts';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://brandboosters-backend.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Increased to 60 seconds for file uploads
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error) => {
    // Only redirect to login if it's not a login request itself
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !isLoginRequest) {
      // Token expired or invalid - only for non-login requests
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic API functions
export const apiGet = async <T>(url: string, params?: any): Promise<ApiResponse<T>> => {
  const response = await api.get<ApiResponse<T>>(url, { params });
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await api.post<ApiResponse<T>>(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await api.put<ApiResponse<T>>(url, data);
  return response.data;
};

export const apiPatch = async <T>(url: string, data?: any): Promise<ApiResponse<T>> => {
  const response = await api.patch<ApiResponse<T>>(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<ApiResponse<T>> => {
  const response = await api.delete<ApiResponse<T>>(url);
  return response.data;
};

// File upload function
export const apiUpload = async <T>(url: string, formData: FormData): Promise<ApiResponse<T>> => {
  const response = await api.post<ApiResponse<T>>(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 120000, // 2 minutes timeout specifically for file uploads
  });
  return response.data;
};

// Auth API
export const authAPI = {
  login: (data: LoginData): Promise<ApiResponse<{ token: string; user: User }>> =>
    apiPost('/auth/login', data),

  register: (data: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> =>
    apiPost('/auth/register', data),

  verify: (data: VerifyData): Promise<ApiResponse<{ user: User }>> =>
    apiPost('/auth/verify', data),

  resendVerification: (email: string): Promise<ApiResponse> =>
    apiPost('/auth/resend-verification', { email }),

  forgotPassword: (data: ForgotPasswordData): Promise<ApiResponse> =>
    apiPost('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordData): Promise<ApiResponse> =>
    apiPost('/auth/reset-password', data),

  getMe: (): Promise<ApiResponse<User>> =>
    apiGet('/auth/me'),

  changePassword: (data: ChangePasswordData): Promise<ApiResponse> =>
    apiPut('/auth/change-password', data),
};

// Admin API
export const adminAPI = {
  // User Management
  createUser: (data: CreateUserData): Promise<ApiResponse<User>> =>
    apiPost('/admin/new-user', data),

  getAllMediators: (): Promise<ApiResponse<Mediator[]>> =>
    apiGet('/admin/all-mediators'),

  getAllSellers: (): Promise<ApiResponse<Seller[]>> =>
    apiGet('/admin/all-sellers'),

  toggleMediatorStatus: (id: string): Promise<ApiResponse<Mediator>> =>
    apiPatch(`/admin/mediator/${id}/toggle-status`),

  toggleSellerStatus: (id: string): Promise<ApiResponse<Seller>> =>
    apiPatch(`/admin/seller/${id}/toggle-status`),

  deleteUser: (id: string): Promise<ApiResponse> =>
    apiDelete(`/admin/delete-user/${id}`),

  // Product Management
  createProduct: (data: CreateProductData): Promise<ApiResponse<Product>> =>
    apiPost('/product/new', data),

  getAllProducts: (): Promise<ApiResponse<ProductWithDetails[]>> =>
    apiGet('/product/all-products'),

  getProductById: (id: string): Promise<ApiResponse<ProductWithDetails>> =>
    apiGet(`/product/${id}`),

  updateProduct: (id: string, data: UpdateProductData): Promise<ApiResponse<ProductWithDetails>> =>
    apiPut(`/product/update-product/${id}`, data),

  deleteProduct: (id: string): Promise<ApiResponse> =>
    apiDelete(`/product/delete-product/${id}`),

  toggleProductStatus: (id: string): Promise<ApiResponse<ProductWithDetails>> =>
    apiPatch(`/product/${id}/toggle-status`),

  updateUser: (data: UpdateProfileData , id:string ): Promise<ApiResponse<UserProfileData>> => 
    apiPut('/admin/update-profile/'+id, data),

  verifyUser: (id: string) => {
    return apiPost(`/admin/verify-user`,{id});
  },
  
  rejectUser: (id: string) => {
    return apiPost(`/admin/reject-user`,{id});
  }
};

export const userAPI = {
  getAllActiveProducts: (): Promise<ApiResponse<ActiveProduct[]>> =>
    apiGet('/product/active-products'),
  getAllActiveMediators: (): Promise<ApiResponse<ActiveMediators[]>> =>
    apiGet('/mediator/active-mediators'),
  getOrders: (): Promise<ApiResponse<Order[]>> => apiGet('/order/user/all-orders'),
  updateOrder: async (orderData: Partial<Order>) => {
    // The endpoint should match the one you defined in your backend routes
    const response = await api.put('/order/update-order/:id', orderData);
    return response.data;
  },
   // Refunds
   getRefunds: (): Promise<ApiResponse<RefundWithDetails[]>> => apiGet('/refund/user/all-refunds'),
  
   // Profile
   getProfile: (): Promise<ApiResponse<UserProfileData>> => apiGet('/auth/me'),
   updateProfile: (data: UpdateProfileData): Promise<ApiResponse<UserProfileData>> => 
     apiPut('/auth/update-profile', data),
   changePassword: (data: ChangePasswordData): Promise<ApiResponse<void>> =>
     apiPut('/user/changepass', data),
}

// Orders API
export const ordersAPI = {
  createOrder: (orderData: CreateOrderData, files?: { orderScreenshot?: File; priceBreakup?: File }): Promise<ApiResponse<Order>> => {
    const formData = new FormData();
    formData.append('orderData', JSON.stringify(orderData));
    
    if (files?.orderScreenshot) {
      formData.append('orderScreenshot', files.orderScreenshot);
    }
    if (files?.priceBreakup) {
      formData.append('priceBreakup', files.priceBreakup);
    }

    return apiUpload('/orders/create-order', formData);
  },

  getAllOrders: (params?: SearchParams): Promise<ApiResponse<OrderWithDetails[]>> =>
    apiGet('/order/all-orders', params),

  getOrderById: (id: string): Promise<ApiResponse<OrderWithDetails>> =>
    apiGet(`/order/${id}`),

  // updateOrder: (data: UpdateOrderData , orderId:string): Promise<ApiResponse<OrderWithDetails>> =>
  //   apiPut('/order/update-order/'+orderId, data),

  updateOrder: (id: string, data: UpdateOrderData, files?: { orderSS?: File; priceBreakupSS?: File; }): Promise<ApiResponse<OrderWithDetails>> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    if (files?.orderSS) {
      formData.append('orderSS', files.orderSS);
    }
    if (files?.priceBreakupSS) {
      formData.append('priceBreakupSS', files.priceBreakupSS);
    }
  
    return apiUpload(`/order/update-order/${id}`, formData);
  },

  updateOrderStatus: (id: string, data: UpdateOrderStatusData): Promise<ApiResponse<OrderWithDetails>> =>
    apiPatch(`/order/update-status/${id}`, data),

  deleteOrder: (id: string): Promise<ApiResponse> =>
    apiDelete(`/orders/${id}`),

  getOrdersByMediator: (mediatorId: string): Promise<ApiResponse<OrderWithDetails[]>> =>
    apiGet(`/orders/mediator/${mediatorId}`),

  getOrdersByProduct: (productId: string): Promise<ApiResponse<OrderWithDetails[]>> =>
    apiGet(`/orders/product/${productId}`),
};

// Refunds API
export const refundsAPI = {
  createRefund: (refundData: CreateRefundData, files?: { deliveredSS?: File; reviewSS?: File; sellerFeedbackSS?: File }): Promise<ApiResponse<Refund>> => {
    const formData = new FormData();
    formData.append('refundData', JSON.stringify(refundData));
    
    if (files?.deliveredSS) {
      formData.append('deliveredSS', files.deliveredSS);
    }
    if (files?.reviewSS) {
      formData.append('reviewSS', files.reviewSS);
    }
    if (files?.sellerFeedbackSS) {
      formData.append('sellerFeedbackSS', files.sellerFeedbackSS);
    }

    return apiUpload('/refunds/create-refund', formData);
  },

  getAllRefunds: (): Promise<ApiResponse<RefundWithDetails[]>> =>
    apiGet('/refunds/all-refunds'),

  getRefundById: (id: string): Promise<ApiResponse<RefundWithDetails>> =>
    apiGet(`/refunds/${id}`),

  updateRefund: (id: string, data: UpdateRefundData, files?: { deliveredSS?: File; reviewSS?: File; sellerFeedbackSS?: File , returnWindowSS?:File }): Promise<ApiResponse<RefundWithDetails>> => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    if (files?.deliveredSS) {
      formData.append('deliveredSS', files.deliveredSS);
    }
    if (files?.reviewSS) {
      formData.append('reviewSS', files.reviewSS);
    }
    if (files?.sellerFeedbackSS) {
      formData.append('sellerFeedbackSS', files.sellerFeedbackSS);
    }
    if (files?.returnWindowSS) {
      formData.append('returnWindowSS', files.returnWindowSS);
    }
    return apiUpload(`/refund/update-refund/${id}`, formData);
  },

  updateRefundStatus: (id: string, data: UpdateRefundStatusData): Promise<ApiResponse<RefundWithDetails>> =>
    apiPut(`/refund/update-status/${id}`, data),

  deleteRefund: (id: string): Promise<ApiResponse> =>
    apiDelete(`/refunds/${id}`),

  // Legacy update route
  updateRefundLegacy: (data: UpdateRefundData): Promise<ApiResponse<RefundWithDetails>> =>
    apiPut('/refunds/update-refund', data),
};

// Track API
export const trackAPI = {
  trackOrder: (orderNumber: string): Promise<ApiResponse<{ order: OrderWithDetails; refund?: RefundWithDetails }>> =>
    apiGet(`/track/${orderNumber}`),
};

// Export the main api instance as well
export default api;