import type { Timestamps } from ".";
import type { Order, OrderWithDetails } from "./orders";

export type RefundStatus = 'accepted' | 'rejected' | 'pending' | 'payment_done' | 'refill';

export interface Refund {
  _id: string;
  order: string | Order;
  upiId?: string;
  bankInfo?:{
      accountNumber:string,
      ifscCode:string
  },
  reviewLink?: string;
  deliveredSS?: string;
  reviewSS?: string;
  sellerFeedbackSS?: string;
  returnWindowSS?: string;
  isReturnWindowClosed:boolean;
  status: RefundStatus;
  rejectionMessage?: string;
  note?: string;
}

export interface RefundWithDetails extends Refund, Timestamps {
  order: OrderWithDetails;
}

export interface RefundsResponse {
  data:{
    refunds: RefundWithDetails[];
  }
}

export interface CreateRefundData {
  order: string;
  upiId?: string;
  reviewLink?: string;
  bankInfo?:{
    accountNumber:string,
    ifscCode:string
},
  deliveredSS?: string;
  reviewSS?: string;
  sellerFeedbackSS?: string;
  status?: RefundStatus;
}

export interface UpdateRefundData extends Partial<CreateRefundData> {}

export interface UpdateRefundStatusData {
  status: RefundStatus;
  rejectionMessage?: string;
  note?: string;
}