import { useState } from "react";
import Input from "../UI/Input";
import {  Filter, Package } from "lucide-react";
import Button from '../UI/Button';
import OrderModal from "./OrderModal";
import type { OrderWithDetails } from "@/types/orders.ts";
import OrderCard from "./OrderCard";

function OrderTable({ orders, setOrders }: { orders: OrderWithDetails[], setOrders: React.Dispatch<React.SetStateAction<OrderWithDetails[]>> }) {
    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderWithDetails | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // const [isExporting, setIsExporting] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [filters, setFilters] = useState({
        status: '',
        brand: '',
        mediator: '',
        platform: '',
        productName: '',
        brandName: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReview = (item: OrderWithDetails) => {
        setSelectedOrderItem(item as OrderWithDetails);
        setIsModalOpen(true);
    };

    // Function to get status display information
    const getOrderStatusInfo = (status: string) => {
        const statusInfo = {
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            refill: { label: 'Refill', color: 'bg-yellow-100 text-yellow-800' },
            refund_placed: { label: 'Refund Placed', color: 'bg-blue-100 text-blue-800' },
            rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
            accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
            payment_done: { label: 'Payment Done', color: 'bg-green-100 text-green-800' }
        };
        return statusInfo[status as keyof typeof statusInfo] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const handleUpdateOrder = (data: OrderWithDetails) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order._id === data._id ? data : order
            )
        );
        setIsModalOpen(false);
        setSelectedOrderItem(null);
    }

    const filteredOrders = orders.filter(item => {
        const matchesSearch =
            item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product?.brandCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product?.productCode?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilters =
            (!filters.status || item.orderStatus === filters.status) &&
            (!filters.mediator || (item.mediator && item.mediator._id && item.mediator?._id?.toLowerCase().includes(filters.mediator.toLowerCase()))) &&
            (!filters.platform || item.product?.productPlatform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
            (!filters.productName ||(item.product && item.product._id &&  item.product?._id?.toLowerCase().includes(filters.productName.toLowerCase())));

        return matchesSearch && matchesFilters;
    });



    // Calculate pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (pageNo - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    return (
        <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow p-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Show entries</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mediator</label>
                        <select
                            value={filters.mediator}
                            onChange={(e) => setFilters({ ...filters, mediator: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Mediators</option>
                            {Array.from(new Set(
                                orders
                                    .map(o => o.mediator?._id)
                                    .filter(id => id)
                            )).map(mediatorId => {
                                const mediatorOrder = orders.find(o => o.mediator?._id === mediatorId);
                                const mediator = mediatorOrder?.mediator;

                                return (
                                    <option key={mediatorId} value={mediatorId}>
                                        {mediator?.nickName || mediator?.name || 'Unknown Mediator'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="refill">Refill</option>
                            <option value="accepted">Accepted</option>
                            <option value="refund_placed">Refund Placed</option>
                            <option value="rejected">Rejected</option>
                            <option value="payment_done">Payment Done</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                        <select
                            value={filters.platform}
                            onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Platforms</option>
                            {Array.from(new Set(orders.map(o => o.product?.productPlatform))).map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilters({ status: '', brand: '', mediator: '', platform: '', brandName: '', productName: '' });
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


            {/* Orders Grid */}
            <div className="space-y-4">
                {currentOrders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        onReview={handleReview}
                        getStatusInfo={getOrderStatusInfo}
                    />
                ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        No orders match your current search criteria. Try adjusting your filters or search terms.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Page {pageNo} of {totalPages}
                    </p>
                    
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={pageNo === 1}
                            onClick={() => setPageNo(pageNo - 1)}
                            size="sm"
                        >
                            Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                                // Show limited pages with ellipsis for better UX
                                let pageNumber;
                                if (totalPages <= 5) {
                                    pageNumber = index + 1;
                                } else if (pageNo <= 3) {
                                    pageNumber = index + 1;
                                } else if (pageNo >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + index;
                                } else {
                                    pageNumber = pageNo - 2 + index;
                                }

                                return (
                                    <Button
                                        key={pageNumber}
                                        onClick={() => setPageNo(pageNumber)}
                                        variant={pageNo === pageNumber ? "primary" : "outline"}
                                        size="sm"
                                        className="min-w-[40px]"
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            disabled={pageNo >= totalPages}
                            onClick={() => setPageNo(pageNo + 1)}
                            size="sm"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Order Modal */}
            {selectedOrderItem && (
                <OrderModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedOrderItem(null);
                    }}
                    orderId={selectedOrderItem._id}
                    onUpdate={handleUpdateOrder}
                />
            )}
        </div>
    );
}

export default OrderTable;