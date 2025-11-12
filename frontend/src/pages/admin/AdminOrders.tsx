// src/pages/admin/OrdersPage.tsx
import OrderTable from '@/components/admin/OrderTable';
import React from 'react';


const AdminOrders: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-600">Review and process all customer orders.</p>
        </div>
      </div>
      <OrderTable />
    </div>
  );
};

export default AdminOrders;