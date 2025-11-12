export interface LoginData {
  email: string;
  password: string;
  role:string;
}

export interface RegisterData {
  name: string;
  nickName?: string;
  email: string;
  phone: string;
  password: string;
  role?: 'admin' | 'mediator' | 'user' | 'seller';
}

export interface VerifyData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  nickName?:string;
  email: string;
  phone: string;
  role?: 'admin' | 'mediator' | 'user' | 'seller';
  isActive: boolean;
  isVerified: boolean;
  upiId?: string;
  accountNumber?: string;
  accountIfsc?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials{
  email: string;
  password:string ;
}