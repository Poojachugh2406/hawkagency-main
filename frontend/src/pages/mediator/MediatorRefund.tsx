// src/pages/admin/AdminRefunds.tsx

// import type { RefundsResponse } from '@/types/products';
import MediatorRefundTable from '@/components/mediator/MediatorRefundTable';
import type { RefundsResponse, RefundWithDetails } from '@/types/refunds';
import { apiGet } from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';


const MediatorRefunds: React.FC = () => {
  const [refunds, setRefunds] = useState<RefundWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response: any = await apiGet<RefundsResponse>('/refund/mediator/all-refunds');
      if (response.success) {
        setRefunds(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch refunds');
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Refunds</h1>
          <p className="text-gray-600">Review and process all refund requests.</p>
        </div>
        
      </div>
      <MediatorRefundTable refunds={refunds} setRefunds={setRefunds} />
    </div>
  );
};

export default MediatorRefunds;