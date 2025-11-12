// import { useState } from "react";
// import Input from "../UI/Input";
// import { Download, Eye, Filter, Package, RefreshCw, SearchIcon, SquareArrowOutUpRight, Trash2Icon } from "lucide-react";
// import { exportToExcel, formatOrdersForExport } from '../../utils/exportUtils.ts';
// import Button from '../UI/Button';
// import toast from "react-hot-toast";
// import OrderModal from "./OrderModal";
// import { format } from "date-fns";
// import type { OrdersResponse, OrderWithDetails } from "@/types/orders.ts";
// import { apiDelete, apiGet } from "@/utils/api.ts";
// import { useNavigate } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// function OrderTable() {
//     const [selectedOrderItem, setSelectedOrderItem] = useState<OrderWithDetails | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isExporting, setIsExporting] = useState(false);
//     const [pageNo, setPageNo] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(5);
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();
    
//     const [filters, setFilters] = useState({
//         seller: '',
//         status: '',
//         brand: '',
//         mediator: '',
//         platform: '',
//         productName: '',
//         brandName: '',
//         fromDate: '',
//         toDate: ''
//     });

//     const fetchOrders = async (): Promise<OrdersResponse> => {
//         try {
//             const response: any = await apiGet(
//                 `/order/all-orders?page=${pageNo}&limit=${itemsPerPage}&status=${filters.status}&mediator=${filters.mediator}&product=${filters.productName}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&platform=${filters.platform}&searchTerm=${searchTerm}`
//             );
//             if (!response.success) {
//                 throw new Error(response.message || 'Failed to fetch orders');
//             }
//             return response.data;
//         } catch (error: any) {
//             throw new Error(error.message || "Failed to fetch orders")
//         }
//     }

//     const fetchFiltersData = async () => {
//         try {
//             const response: any = await apiGet(`/admin/filter-options`);
//             if (response.success) {
//                 return response.data;
//             }
//             throw new Error('Failed to fetch filter options');
//         } catch (error: any) {
//             throw new Error(error.message || "failed to fetch filters Data");
//         }
//     };

//     // Orders query
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ["orders", { ...filters, itemsPerPage, pageNo, searchTerm }],
//         queryFn: fetchOrders,
//         placeholderData: (prev) => prev,
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         // keepPreviousData: true,
//     });

//     // Filters query
//     const { data: filtersData } = useQuery({
//         queryKey: ["filtersData"],
//         queryFn: fetchFiltersData,
//         placeholderData: (prev) => prev,
//         staleTime: 10 * 60 * 1000, // 10 minutes
//     });

//     // Delete order mutation
//     const deleteOrderMutation = useMutation({
//         mutationFn: async (id: string) => {
//             const response = await apiDelete('/order/' + id);
//             if (!response.success) {
//                 throw new Error(response.message);
//             }
//             return { id, ...response };
//         },
//         onSuccess: () => {
//             // Invalidate and refetch orders
//             queryClient.invalidateQueries({ queryKey: ['orders'] });
//             toast.success('Order deleted successfully');
//         },
//         onError: (error: any) => {
//             console.error('Error deleting order:', error);
//             toast.error(error.response?.data?.message || error.message || "Failed to delete order");
//         },
//     });

//     // Update order mutation (for OrderModal)

//     const updateOrderMutation = useMutation({
//         mutationFn: async (updatedOrder: OrderWithDetails) => {
//             // This would typically be an API call to update the order
//             // For now, we'll just return the updated order
//             return updatedOrder;
//         },
//         onSuccess: (updatedOrder) => {
//             // Update the cache directly for immediate UI update
//             queryClient.setQueryData(
//                 ["orders", { ...filters, itemsPerPage, pageNo, searchTerm }],
//                 (oldData: any) => {
//                     if (!oldData) return oldData;
//                     return {
//                         ...oldData,
//                         orders: oldData.orders.map((order: OrderWithDetails) =>
//                             order._id === updatedOrder._id ? updatedOrder : order
//                         )
//                     };
//                 }
//             );
//             // toast.success('Order updated successfully');
//         },
//         onError: (error: any) => {
//             console.error('Error updating order:', error);
//             toast.error(error.message || "Failed to update order");
//         },
//     });

//     console.log("data received from tanstack query ", data);

//     const orders = data?.orders || [];
//     const pagination: any = data?.pagination || {};
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleReview = (item: OrderWithDetails) => {
//         setSelectedOrderItem(item);
//         setIsModalOpen(true);
//     };

//     const handleDelete = async (id: string) => {
//         if (!window.confirm("Are you sure you want to delete this order?")) return;
//         deleteOrderMutation.mutate(id);
//     };

//     const handleRefundForm = async (orderNumber: string) => {
//         navigate("/admin/refunds", { state: { orderNumber } });
//     };

//     // Function to get status display information
//     const getOrderStatusInfo = (status: string) => {
//         const statusInfo = {
//             pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
//             refill: { label: 'Refill', color: 'bg-yellow-100 text-yellow-800' },
//             refund_placed: { label: 'Refund Placed', color: 'bg-blue-100 text-blue-800' },
//             rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
//             accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
//             payment_done: { label: 'Payment Done', color: 'bg-green-100 text-green-800' }
//         };
//         return statusInfo[status as keyof typeof statusInfo] || { label: status, color: 'bg-gray-100 text-gray-800' };
//     };

//     const handleUpdateOrder = (data: OrderWithDetails) => {
//         // Use the mutation to update the order
//         updateOrderMutation.mutate(data);
//         // setIsModalOpen(false);
//         // setSelectedOrderItem(null);
//     };

//     const handleExport = async () => {
//         setIsExporting(true);
//         try {
//             const response: any = await apiGet(`/order/download?status=${filters.status}&mediator=${filters.mediator}&product=${filters.productName}&platform=${filters.platform}&searchQuery=${searchTerm}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}`);
//             if (response.success) {
//                 const formattedData = formatOrdersForExport(response.data);
//                 exportToExcel(formattedData, 'orders');
//                 toast.success('Orders exported successfully!');
//             } else {
//                 throw new Error(response.message);
//             }
//         } catch (error: any) {
//             toast.error('Failed to export data');
//         } finally {
//             setIsExporting(false);
//         }
//     };

//     // Handle search with enter key
//     const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             setSearchTerm(searchQuery);
//             setPageNo(1); // Reset to first page when searching
//         }
//     };

//     // Handle search icon click
//     const handleSearchClick = () => {
//         setSearchTerm(searchQuery);
//         setPageNo(1); // Reset to first page when searching
//     };

//     // Handle filter changes with page reset
//     const handleFilterChange = (key: keyof typeof filters, value: string) => {
//         setFilters(prev => ({ ...prev, [key]: value }));
//         setPageNo(1); // Reset to first page when filters change
//     };

//     // Handle items per page change
//     const handleItemsPerPageChange = (value: number) => {
//         setItemsPerPage(value);
//         setPageNo(1); // Reset to first page when changing items per page
//     };

//     // Clear all filters
//     const clearAllFilters = () => {
//         setFilters({
//             status: '',
//             brand: '',
//             mediator: '',
//             platform: '',
//             productName: '',
//             brandName: '',
//             seller: '',
//             fromDate: '',
//             toDate: ''
//         });
//         setSearchTerm('');
//         setSearchQuery('');
//         setPageNo(1);
//     };

//     if (isLoading) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="text-center">
//                 <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//                 <p className="text-gray-600">Loading orders...</p>
//             </div>
//         </div>
//     );

//     if (isError) return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <div className="text-center">
//                 <p className="text-red-600">Something went wrong: {error?.message}</p>
//                 <Button 
//                     onClick={() => queryClient.refetchQueries({ queryKey: ['orders'] })} 
//                     className="mt-4"
//                 >
//                     Retry
//                 </Button>
//             </div>
//         </div>
//     );

//     return (
//         <div>
//             {/* Search and Filter Section */}
//             <div className="bg-white rounded-lg shadow p-6 mb-6">
//                 <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4 items-end">
//                     <div className="md:col-span-2 lg:col-span-3">
//                         <Input
//                             label="Search"
//                             className="flex-1"
//                             placeholder="Search by order ID, Reviewer name"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             onKeyPress={handleSearchKeyPress}
//                             rightIcon={
//                                 <div 
//                                     onClick={handleSearchClick}
//                                     className="hover:cursor-pointer hover:text-gray-900 text-gray-500"
//                                 >
//                                     <SearchIcon className="w-4 h-4" />
//                                 </div>
//                             }
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Show entries</label>
//                         <select
//                             value={itemsPerPage}
//                             onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value={5}>5</option>
//                             <option value={10}>10</option>
//                             <option value={25}>25</option>
//                             <option value={50}>50</option>
//                         </select>
//                     </div>
//                     <div className="flex items-end">
//                         <Button
//                             variant="outline"
//                             onClick={clearAllFilters}
//                             className="w-full"
//                         >
//                             <Filter className="w-4 h-4 mr-2" />
//                             Clear Filters
//                         </Button>
//                     </div>
//                     <div className="flex items-end">
//                         <Button
//                             variant="outline"
//                             onClick={handleExport}
//                             disabled={isExporting || orders.length === 0}
//                             className="w-full"
//                         >
//                             {isExporting ? (
//                                 <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                             ) : (
//                                 <Download className="w-4 h-4 mr-2" />
//                             )}
//                             Export
//                         </Button>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                         <select
//                             value={filters.status}
//                             onChange={(e) => handleFilterChange('status', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">All Status</option>
//                             <option value="pending">Pending</option>
//                             <option value="accepted">Accepted</option>
//                             <option value="refund_placed">Refund Placed</option>
//                             <option value="refill">Refill</option>
//                             <option value="payment_done">Payment Done</option>
//                             <option value="rejected">Rejected</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//                         <select
//                             value={filters.productName}
//                             onChange={(e) => handleFilterChange('productName', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">All Products</option>
//                             {filtersData?.products?.map((product: any) => (
//                                 <option key={product._id} value={product._id}>
//                                     {product.name} - {product.productCode}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
//                         <select
//                             value={filters.platform}
//                             onChange={(e) => handleFilterChange('platform', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">All Platforms</option>
//                             {filtersData?.platforms?.map((platform: any) => (
//                                 <option key={platform.value} value={platform.value}>
//                                     {platform.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Mediator</label>
//                         <select
//                             value={filters.mediator}
//                             onChange={(e) => handleFilterChange('mediator', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">All Mediators</option>
//                             {filtersData?.mediators?.map((mediator: any) => (
//                                 <option key={mediator._id} value={mediator._id}>
//                                     {mediator.name} - {mediator.email}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
//                         <select
//                             value={filters.seller}
//                             onChange={(e) => handleFilterChange('seller', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             <option value="">All Sellers</option>
//                             {filtersData?.sellers?.map((seller: any) => (
//                                 <option key={seller._id} value={seller._id}>
//                                     {seller.name} - {seller.email}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//                         <input
//                             type="date"
//                             value={filters.fromDate}
//                             onChange={(e) => handleFilterChange('fromDate', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//                         <input
//                             type="date"
//                             value={filters.toDate}
//                             onChange={(e) => handleFilterChange('toDate', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>
//                 </div>
//             </div>

//             {/* Data Table */}
//             <div className="bg-white rounded-lg shadow overflow-hidden">
//                 <div className="overflow-x-auto">
//                     {isLoading ? (
//                         <div className="flex justify-center items-center h-64">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                         </div>
//                     ) : (
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mediator</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {orders.map((item, index) => {
//                                     const statusInfo = getOrderStatusInfo(item.orderStatus);
//                                     return (
//                                         <tr key={item._id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                 {index + 1 + (pageNo - 1) * itemsPerPage}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                 {item.orderNumber}
//                                                 <div className="py-1">
//                                                     <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
//                                                         {statusInfo.label}
//                                                     </span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 <div className="flex flex-col">
//                                                     <p>{item.product?.name ?? "N/A"} / <span className="text-xs"> {item.product?.productCode ?? "N/A"}</span></p>
//                                                     <p>{item.product?.brand ?? "N/A"} / <span className="text-xs "> {item.product?.brandCode ?? "N/A"}</span></p>
//                                                     <p>{item.product?.productPlatform ?? "N/A"}</p>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 {item.name}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 {item.mediator?.nickName || 'N/A'}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 ₹{item.orderAmount}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                                 {format(new Date(item.createdAt), "dd MMM yyyy")}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                                 <div className="flex space-x-2">
//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline"
//                                                         onClick={() => handleReview(item)}
//                                                     >
//                                                         <Eye className="w-4 h-4" />
//                                                     </Button>
//                                                     <Button
//                                                         size="sm"
//                                                         variant="outline"
//                                                         disabled={deleteOrderMutation.isPending}
//                                                         onClick={() => handleDelete(item._id)}
//                                                     >
//                                                         <Trash2Icon className="w-4 h-4 text-red-500" />
//                                                     </Button>
//                                                     {item.orderStatus === 'refund_placed' && (
//                                                         <Button
//                                                             size="sm"
//                                                             variant="outline"
//                                                             onClick={() => handleRefundForm(item?.orderNumber)}
//                                                         >
//                                                             <SquareArrowOutUpRight className="w-4 h-4 text-blue-700" />
//                                                         </Button>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     )}

//                     {orders.length === 0 && !isLoading && (
//                         <div className="text-center py-12">
//                             <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                             <p className="text-gray-500">No orders found matching your criteria</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Pagination */}
//             {pagination.totalPages > 0 && (
//                 <div className="flex justify-end mt-4 gap-2">
//                     <Button
//                         variant="outline"
//                         disabled={!pagination.hasPrevPage}
//                         onClick={() => setPageNo(pageNo - 1)}
//                     >
//                         Previous
//                     </Button>
//                     {Array.from({ length: pagination.totalPages }, (_, k) => (
//                         <Button
//                             key={k}
//                             onClick={() => setPageNo(k + 1)}
//                             variant={pageNo === k + 1 ? "primary" : "outline"}
//                         >
//                             {k + 1}
//                         </Button>
//                     ))}
//                     <Button
//                         variant="outline"
//                         disabled={!pagination.hasNextPage}
//                         onClick={() => setPageNo(pageNo + 1)}
//                     >
//                         Next
//                     </Button>
//                 </div>
//             )}

//             {/* Order Modal */}
//             {selectedOrderItem && (
//                 <OrderModal
//                     isOpen={isModalOpen}
//                     onClose={() => {
//                         setIsModalOpen(false);
//                         setSelectedOrderItem(null);
//                     }}
//                     orderId={selectedOrderItem._id}
//                     onUpdate={handleUpdateOrder}
//                 />
//             )}
//         </div>
//     );
// }

// export default OrderTable;



import { useState } from "react";
import Input from "../UI/Input";
import { Download, Eye, Filter, Package, RefreshCw, SearchIcon, SquareArrowOutUpRight, Trash2Icon } from "lucide-react";
import { exportToExcel, formatOrdersForExport } from '../../utils/exportUtils.ts';
import Button from '../UI/Button';
import toast from "react-hot-toast";
import OrderModal from "./OrderModal"; // Make sure path is correct
import { format } from "date-fns";
import type { OrdersResponse, OrderWithDetails } from "@/types/orders.ts";
import { apiDelete, apiGet } from "@/utils/api.ts";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function OrderTable() {
    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderWithDetails | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState({
        seller: '',
        status: '',
        brand: '',
        mediator: '',
        platform: '',
        productName: '',
        brandName: '',
        fromDate: '',
        toDate: ''
    });

    const fetchOrders = async (): Promise<OrdersResponse> => {
        try {
            const response: any = await apiGet(
                `/order/all-orders?page=${pageNo}&limit=${itemsPerPage}&status=${filters.status}&mediator=${filters.mediator}&product=${filters.productName}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&platform=${filters.platform}&searchTerm=${searchTerm}`
            );
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch orders');
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || "Failed to fetch orders")
        }
    }

    const fetchFiltersData = async () => {
        try {
            const response: any = await apiGet(`/admin/filter-options`);
            if (response.success) {
                return response.data;
            }
            throw new Error('Failed to fetch filter options');
        } catch (error: any) {
            throw new Error(error.message || "failed to fetch filters Data");
        }
    };

    // Orders query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["orders", { ...filters, itemsPerPage, pageNo, searchTerm }],
        queryFn: fetchOrders,
        placeholderData: (prev) => prev,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Filters query
    const { data: filtersData } = useQuery({
        queryKey: ["filtersData"],
        queryFn: fetchFiltersData,
        placeholderData: (prev) => prev,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    // Delete order mutation
    const deleteOrderMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiDelete('/order/' + id);
            if (!response.success) {
                throw new Error(response.message);
            }
            return { id, ...response };
        },
        onSuccess: () => {
            // Invalidate and refetch orders
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order deleted successfully');
        },
        onError: (error: any) => {
            console.error('Error deleting order:', error);
            toast.error(error.response?.data?.message || error.message || "Failed to delete order");
        },
    });

    // console.log("data received from tanstack query ", data);

    const orders = data?.orders || [];
    const pagination: any = data?.pagination || {};
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReview = (item: OrderWithDetails) => {
        setSelectedOrderItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        deleteOrderMutation.mutate(id);
    };

    const handleRefundForm = async (orderNumber: string) => {
        navigate("/admin/refunds", { state: { orderNumber } });
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

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response: any = await apiGet(`/order/download?status=${filters.status}&mediator=${filters.mediator}&product=${filters.productName}&platform=${filters.platform}&searchQuery=${searchTerm}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}`);
            if (response.success) {
                const formattedData = formatOrdersForExport(response.data);
                exportToExcel(formattedData, 'orders');
                toast.success('Orders exported successfully!');
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            toast.error('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    // Handle search with enter key
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchTerm(searchQuery);
            setPageNo(1); // Reset to first page when searching
        }
    };

    // Handle search icon click
    const handleSearchClick = () => {
        setSearchTerm(searchQuery);
        setPageNo(1); // Reset to first page when searching
    };

    // Handle filter changes with page reset
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPageNo(1); // Reset to first page when filters change
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setPageNo(1); // Reset to first page when changing items per page
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            status: '',
            brand: '',
            mediator: '',
            platform: '',
            productName: '',
            brandName: '',
            seller: '',
            fromDate: '',
            toDate: ''
        });
        setSearchTerm('');
        setSearchQuery('');
        setPageNo(1);
    };

    if (isLoading && !data) return ( // Show loading only on initial fetch
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading orders...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-600">Something went wrong: {error?.message}</p>
                <Button
                    onClick={() => queryClient.refetchQueries({ queryKey: ['orders'] })}
                    className="mt-4"
                >
                    Retry
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4 items-end">
                    <div className="md:col-span-2 lg:col-span-3">
                        <Input
                            label="Search"
                            className="flex-1"
                            placeholder="Search by order ID, Reviewer name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            rightIcon={
                                <div
                                    onClick={handleSearchClick}
                                    className="hover:cursor-pointer hover:text-gray-900 text-gray-500"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                </div>
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Show entries</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={clearAllFilters}
                            className="w-full"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            disabled={isExporting || orders.length === 0}
                            className="w-full"
                        >
                            {isExporting ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 mr-2" />
                            )}
                            Export
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="refund_placed">Refund Placed</option>
                            <option value="refill">Refill</option>
                            <option value="payment_done">Payment Done</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <select
                            value={filters.productName}
                            onChange={(e) => handleFilterChange('productName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Products</option>
                            {filtersData?.products?.map((product: any) => (
                                <option key={product._id} value={product._id}>
                                    {product.name} - {product.productCode}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                        <select
                            value={filters.platform}
                            onChange={(e) => handleFilterChange('platform', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Platforms</option>
                            {filtersData?.platforms?.map((platform: any) => (
                                <option key={platform.value} value={platform.value}>
                                    {platform.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mediator</label>
                        <select
                            value={filters.mediator}
                            onChange={(e) => handleFilterChange('mediator', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Mediators</option>
                            {filtersData?.mediators?.map((mediator: any) => (
                                <option key={mediator._id} value={mediator._id}>
                                    {mediator.name} - {mediator.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
                        <select
                            value={filters.seller}
                            onChange={(e) => handleFilterChange('seller', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Sellers</option>
                            {filtersData?.sellers?.map((seller: any) => (
                                <option key={seller._id} value={seller._id}>
                                    {seller.name} - {seller.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => handleFilterChange('toDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && !data ? ( // This shows a spinner overlay *during* refetching
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mediator</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((item, index) => {
                                    const statusInfo = getOrderStatusInfo(item.orderStatus);
                                    return (
                                        <tr key={item._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1 + (pageNo - 1) * itemsPerPage}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.orderNumber}
                                                <div className="py-1">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex flex-col">
                                                    <p>{item.product?.name ?? "N/A"} / <span className="text-xs"> {item.product?.productCode ?? "N/A"}</span></p>
                                                    <p>{item.product?.brand ?? "N/A"} / <span className="text-xs "> {item.product?.brandCode ?? "N/A"}</span></p>
                                                    <p>{item.product?.productPlatform ?? "N/A"}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.mediator?.nickName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                ₹{item.orderAmount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(item.createdAt), "dd MMM yyyy")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReview(item)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={deleteOrderMutation.isPending}
                                                        onClick={() => handleDelete(item._id)}
                                                    >
                                                        <Trash2Icon className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                    {item.orderStatus === 'refund_placed' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleRefundForm(item?.orderNumber)}
                                                        >
                                                            <SquareArrowOutUpRight className="w-4 h-4 text-blue-700" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {orders.length === 0 && !isLoading && (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No orders found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 0 && (
                <div className="flex justify-end mt-4 gap-2">
                    <Button
                        variant="outline"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPageNo(pageNo - 1)}
                    >
                        Previous
                    </Button>
                    {Array.from({ length: pagination.totalPages }, (_, k) => (
                        <Button
                            key={k}
                            onClick={() => setPageNo(k + 1)}
                            variant={pageNo === k + 1 ? "primary" : "outline"}
                        >
                            {k + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPageNo(pageNo + 1)}
                    >
                        Next
                    </Button>
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
                // No more onUpdate prop!
                />
            )}
        </div>
    );
}

export default OrderTable;