// src/pages/admin/OrdersPage.tsx

// import OrderTable from '@/components/admin/OrderTable';
import MediatorOrderTable from '@/components/mediator/MediatorOrderTable';
import type {  OrdersResponse, OrderWithDetails } from '@/types/orders';
import { apiGet } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';


const MediatorOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response: any = await apiGet<OrdersResponse>('/order/mediator/all-orders');
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600">Review and process all customer orders.</p>
        </div>
      </div>
      <MediatorOrderTable orders={orders} setOrders ={setOrders}/>
    </div>
  );
};

export default MediatorOrders;