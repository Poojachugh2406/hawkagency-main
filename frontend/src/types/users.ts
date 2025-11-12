import type { User } from "./auth";

export type UserProfileData = User;

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  upiId?: string;
  accountNumber?: string;
  accountIfsc?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'admin' | 'mediator' | 'user' | 'seller';
}

export interface ActiveMediators {
  nickName:string;
  _id:string;
}
export type Mediator = User;
export type Seller = User;