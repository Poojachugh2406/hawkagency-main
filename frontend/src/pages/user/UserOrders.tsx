// src/pages/admin/OrdersPage.tsx

import Button from '@/components/UI/Button';
import OrderTable from '@/components/user/OrderTable';
import type {  OrdersResponse, OrderWithDetails } from '@/types/orders';
import { apiGet } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response: any = await apiGet<OrdersResponse>('/order/user/all-orders');
      if (response.success) {
        setOrders(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">View and manage your product orders</p>
        </div>
        <div>
          <Button onClick={()=>navigate("/order")}>
            Order form
          </Button>
        </div>
      </div>
      <OrderTable orders={orders} setOrders ={setOrders}/>
    </div>
  );
};

export default UserOrders;