import type { Timestamps } from ".";
import type { User } from "./auth";
import type { Product } from "./products";

export type OrderStatus = 'accepted' | 'pending' | 'rejected' | 'payment_done' | 'refund_placed' | 'refill';

export interface Order {
  _id: string;
  product: string | Product;
  mediator: string | User;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  orderDate: string;
  orderAmount: number;
  lessPrice: number;
  oldOrderNumber?: string;
  orderSS?: string;
  priceBreakupSS?: string;
  orderStatus: OrderStatus;
  rejectionMessage?: string;
  note?: string;
  dealType?: string;
  isReplacement?:string;
  ratingOrReview?:string;
  exchangeProduct?:string;
  
}

export interface OrderWithDetails extends Order, Timestamps {
  product: Product;
  mediator: User;
}

export interface OrdersResponse {

    orders: OrderWithDetails[];
    pagination:{
      currentPage:number;
      totalPages:number;
      totalCount  :number;
      hasNextPage:boolean;
      hasPrevPage:boolean;
      limit:number;
    }
  
}


export interface CreateOrderData {
  product: string;
  mediator: string;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  orderDate: string;
  orderAmount: number;
  lessPrice: number;
  oldOrderNumber?: string;
  orderSS?: string;
  priceBreakupSS?: string;
  orderStatus?: OrderStatus;
  note?:string;
  dealType?: string;
  isReplacement?:string;
  ratingOrReview?:string;
  exchangeProduct?:string;
}

export interface UpdateOrderData{
  name?:string;
  email?:string;
  phone?:string;
  orderDate?:string;
  orderAmount?:number;
  lessPrice?:number;
  product?:string;
  dealType?:string;
  isReplacement?:string;
  oldOrderNumber?:string;
  ratingOrReview?:string;
  exchangeProduct?:string;
}

export interface UpdateOrderStatusData {
  orderStatus: OrderStatus;
  rejectionMessage?: string;
  note?: string;
}