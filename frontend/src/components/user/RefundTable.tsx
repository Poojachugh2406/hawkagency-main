// src/components/user/RefundTable.tsx

import { useEffect, useState } from "react";
import { Filter, Package } from "lucide-react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import type { RefundWithDetails } from "@/types/refunds";
import RefundModal from "./RefundModal";
import RefundCard from "./RefundCard"; // <-- Import the new card component
import { useLocation } from "react-router-dom";

function RefundTable({ refunds, setRefunds }: { refunds: RefundWithDetails[], setRefunds: React.Dispatch<React.SetStateAction<RefundWithDetails[]>> }) {
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const [filters, setFilters] = useState({
    status: '',
    platform: '',
    mediator: '',
    product: '',
    brandName: '',
  });
  const [pageNo, setPageNo] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedRefundItem, setSelectedRefundItem] = useState<RefundWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleReview = (item: RefundWithDetails) => {
    setSelectedRefundItem(item);
    setIsModalOpen(true);
  };

  // Function to determine status based on Refund properties
  const getRefundStatus = (item: RefundWithDetails): string => {
    return item.status;
  };

  const filteredRefunds = refunds.filter(item => {
    const matchesSearch =
      item.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.order.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.order.product.brandCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.order.product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ;

    const matchesFilters =
      (!filters.status || getRefundStatus(item) === filters.status) &&
      (!filters.mediator || (item.order && item.order.mediator && item.order.mediator._id && item.order.mediator?._id && item.order.mediator?._id.toLowerCase().includes(filters.mediator?.toLowerCase()))) &&
      (!filters.product || (item.order && item.order.product && item.order.product._id && item.order.product?._id.toLowerCase().includes(filters.product.toLowerCase()))) &&
      (!filters.platform || (item.order && item.order.product && item.order.product.productPlatform && item.order.product.productPlatform.toLowerCase().includes(filters.platform.toLowerCase())));
    return matchesSearch && matchesFilters;
  });

  useEffect(()=>{
    if(location.state && location.state.orderNumber){
      setSearchTerm(location.state.orderNumber);
    }
  }, [location.state])

  // Get current page's data
  const paginatedRefunds = filteredRefunds.slice(
    (pageNo - 1) * itemsPerPage,
    pageNo * itemsPerPage
  );

  return (
    <div>
      {/* Search and Filter Section (Unchanged) */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
      
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Show entries</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPageNo(1); // Reset to first page on count change
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="refill">Refill</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="payment_done">Payment Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
            <select
              value={filters.platform}
              onChange={(e) => setFilters({
                ...filters,
                'platform': e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Platforms</option>
              {Array.from(new Set(refunds.map(r => r.order.product.productPlatform).filter(Boolean)
              )).map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mediator</label>
            <select
              value={filters.mediator}
              onChange={(e) => setFilters({ ...filters, mediator: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Mediators</option>
              {Array.from(new Set(refunds.map(r => r.order.mediator).filter(r=>r)
              )).map((item) => (
                <option key={item._id} value={item._id}>{item.nickName}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ status: '', platform: '', mediator: '', product: '', brandName: '' })
                setSearchTerm('');
              }}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        
        </div>


        <div className="grid  gap-4 mb-6">
          <div className="mt-2">
            <Input
              label="Search"
              placeholder="Search by order ID, product name, reviewer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
    
         
        </div>
      </div>

      {/* ====== Card List Section (Replaces Table) ====== */}
      <div className="space-y-4">
        {paginatedRefunds.map((item) => (
          <RefundCard 
            key={item._id} 
            item={item} 
            onReview={handleReview} 
          />
        ))}
      </div>
      
      {/* ====== No Results Message (Unchanged) ====== */}
      {filteredRefunds.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No refunds found matching your criteria</p>
        </div>
      )}
      
      {/* ====== Pagination Section (Unchanged, but added a check) ====== */}
      {filteredRefunds.length > itemsPerPage && (
         <div className="flex justify-between items-center mt-6">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pageNo - 1) * itemsPerPage + 1}</span>
                {' '}to <span className="font-medium">{Math.min(pageNo * itemsPerPage, filteredRefunds.length)}</span>
                {' '}of <span className="font-medium">{filteredRefunds.length}</span> results
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"
                disabled={pageNo === 1}
                onClick={() => setPageNo(pageNo - 1)}
              >
                Previous
              </Button>
              {/* Note: Pagination logic can be simplified, but keeping yours */}
              {
                Array.from({ length: Math.ceil(filteredRefunds.length / itemsPerPage) }, (_, k) => (
                  <Button
                    onClick={() => setPageNo(k + 1)}
                    variant={pageNo === k + 1 ? "primary" : "outline"} 
                    key={k}
                    className={
                      (k + 1 > pageNo + 2 || k + 1 < pageNo - 2) && (k + 1 !== 0 && k + 1 !== Math.ceil(filteredRefunds.length / itemsPerPage) -1)
                      ? 'hidden' // Hides buttons far from the current page
                      : ''
                    }
                  >
                    {k + 1}
                  </Button>
                ))
              }
              <Button variant="outline"
                disabled={pageNo * itemsPerPage >= filteredRefunds.length}
                onClick={() => setPageNo(pageNo + 1)}
              >
                Next
              </Button>
            </div>
         </div>
      )}
     
      {/* ====== Modal (Unchanged) ====== */}
      {selectedRefundItem &&
        <RefundModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRefundItem(null);
          }}
          refundId={selectedRefundItem._id}
          setRefunds={setRefunds}
        />
      }

    </div>
  )
}

export default RefundTable;