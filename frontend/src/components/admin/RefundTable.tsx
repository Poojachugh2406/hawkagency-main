
// import { useEffect, useState } from "react";
// import { Download, Eye, Filter, Package, RefreshCw, Trash2Icon } from "lucide-react";

// import toast from "react-hot-toast";
// import { format } from "date-fns";
// import { exportToExcel, formatRefundsForExport } from "../../utils/exportUtils";
// import Input from "../UI/Input";
// import Button from "../UI/Button";
// import type { RefundsResponse, RefundWithDetails } from "@/types/refunds";
// import RefundModal from "./RefundModal";
// import { apiDelete, apiGet } from "@/utils/api";
// import { useLocation } from "react-router-dom";
// // import type { PaginationType } from "@/types";

// function RefundTable() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [refunds, setRefunds] = useState<RefundWithDetails[]>([]);
//   const [pagination, setPagination] = useState<any>();
//   const location = useLocation();

//   // const [filters, setFilters] = useState({
//   //   status: '',
//   //   platform: '',
//   //   mediator: '',
//   //   product: '',
//   //   brandName: '',
//   // });

//   const [filters, setFilters] = useState({
//     seller: '',
//     status: '',
//     brand: '',
//     mediator: '',
//     platform: '',
//     product: '',
//     brandName: '',
//     fromDate: '',
//     toDate: ''
//   });
//   const [pageNo, setPageNo] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedRefundItem, setSelectedRefundItem] = useState<RefundWithDetails | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [filtersData, setFiltersData] = useState<any>({});
//   const [isExporting, setIsExporting] = useState(false);


//   const handleReview = (item: RefundWithDetails) => {
//     setSelectedRefundItem(item);
//     setIsModalOpen(true);
//   };

//   // Function to determine status based on Refund properties
//   const getRefundStatus = (item: RefundWithDetails): string => {
//     return item.status;
//   };
//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure you wants to delete this order")) return
//     try {
//       setIsLoading(true);
//       const response = await apiDelete('/refund/delete/' + id);
//       if (response.success) {
//         setRefunds(refunds.filter(refund => refund._id !== id));
//         toast.success('Refund deleted successfully');
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       console.error('Error deleting Refund:', error);
//       toast.error(error.response.data.message || error.message || "Failed to Delete Message");
//     } finally {
//       setIsLoading(false);
//     }
//   };



//   const fetchRefunds = async () => {
//     setIsLoading(true);
//     try {
//       const response: any = await apiGet(
//         `/refund/all-refunds?page=${pageNo}&limit=${itemsPerPage}&status=${filters.status}&mediator=${filters.mediator}&product=${filters.product}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&platform=${filters.platform}&searchTerm=${searchTerm}`
//       );
//       if (response.success) {
//         setRefunds(response.data || []);
//         setPagination(response.pagination);
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to fetch refunds');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRefunds();
//   }, [filters]);

//   useEffect(() => {
//     const fetchFiltersData = async () => {
//       try {
//         const response: any = await apiGet(`/admin/filter-options`);
//         if (response.success) {
//           setFiltersData(response.data);
//         }
//         throw new Error('Failed to fetch filter options');
//       } catch (error: any) {
//         throw new Error(error.message || "failed to fetch filters Data");
//       }
//     };
//     fetchFiltersData();
//   }, [])



//   // const fetchOrders = async (): Promise<OrdersResponse> => {
//   //   try {
//   //       const response: any = await apiGet(
//   //           `/order/all-orders?page=${pageNo}&limit=${itemsPerPage}&status=${filters.status}&mediator=${filters.mediator}&product=${filters.productName}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&platform=${filters.platform}&searchTerm=${searchTerm}`
//   //       );
//   //       if (!response.success) {
//   //           throw new Error(response.message || 'Failed to fetch orders');
//   //       }
//   //       return response.data;
//   //   } catch (error: any) {
//   //       throw new Error(error.message || "Failed to fetch orders")
//   //   }
//   // }


//   const filteredRefunds = refunds.filter(item => {
//     const matchesSearch =
//       item?.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       //  ( item.order.product && item.order.product.productCode && item.order.product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) )||
//       item?.order?.name?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesFilters =
//       (!filters.status || getRefundStatus(item) === filters.status) &&
//       (!filters.mediator || (item.order && item.order.mediator && item.order.mediator._id && item.order.mediator?._id && item.order.mediator?._id.toLowerCase().includes(filters.mediator?.toLowerCase()))) &&
//       (!filters.mediator || (item.order && item.order.product && item.order.product && item.order.product.seller && item.order.product.seller._id && item.order.product.seller?._id && item.order.mediator?._id.toLowerCase().includes(filters.mediator?.toLowerCase()))) &&
//       (!filters.product || (item.order && item.order.product && item.order.product._id && item.order.product?._id.toLowerCase().includes(filters.product.toLowerCase()))) &&
//       (!filters.platform || (item.order && item.order.product && item.order.product.productPlatform && item.order.product.productPlatform.toLowerCase().includes(filters.platform.toLowerCase())));


//     const matchesDate = () => {
//       if (!filters.fromDate && !filters.toDate) return true;

//       const refundDate = new Date(item.createdAt);
//       // refundDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

//       if (filters.fromDate && filters.toDate) {
//         const fromDate = new Date(filters.fromDate);
//         const toDate = new Date(filters.toDate);
//         toDate.setHours(23, 59, 59, 999); // End of the day
//         return refundDate >= fromDate && refundDate <= toDate;
//       }

//       if (filters.fromDate) {
//         const fromDate = new Date(filters.fromDate);
//         return refundDate >= fromDate;
//       }

//       if (filters.toDate) {
//         const toDate = new Date(filters.toDate);
//         toDate.setHours(23, 59, 59, 999); // End of the day
//         return refundDate <= toDate;
//       }

//       return true;
//     };
//     return matchesSearch && matchesFilters && matchesDate();
//   });


//   useEffect(() => {
//     if (location.state?.orderNumber) {
//       setSearchTerm(location.state.orderNumber)
//     }
//   }, [location.state])

//   const handleExport = async () => {
//     setIsExporting(true);

//     try {
//       const response: any = await apiGet(`/refund/download?status=${filters.status}&mediator=${filters.mediator}&product=${filters.product}&platform=${filters.platform}&searchQuery=${searchTerm}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}`);
//       if (response.success) {
//         const formattedData = formatRefundsForExport(response.data);
//         exportToExcel(formattedData, 'refunds');
//         // console.log(response.data);
//         toast.success('Refunds exported successfully!');

//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error('Failed to export data');
//     } finally {
//       setIsExporting(false);
//     }
//   };
//   return (
//     <div>
//       {/* Search and Filter Section */}
//       <div className="bg-white rounded-lg shadow p-6 mb-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4 items-end">
//           <div className="md:col-span-2 lg:col-span-3">
//             <Input
//               label="Search"
//               placeholder="Search by order ID, Reviewer name"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Show entries</label>
//             <select
//               value={itemsPerPage}
//               onChange={(e) => setItemsPerPage(Number(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value={5}>5</option>
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//             </select>
//           </div>

//           <div className="flex items-end">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setFilters({ status: '', brand: '', mediator: '', platform: '', brandName: '', product: '', seller: '', fromDate: '', toDate: '' });
//                 setSearchTerm('');
//               }}
//               className="w-full"
//             >
//               <Filter className="w-4 h-4 mr-2" />
//               Clear Filters
//             </Button>
//           </div>
//           <div className="flex items-end">
//             <Button
//               variant="outline"
//               onClick={handleExport}
//               disabled={isExporting || refunds.length === 0}
//               className="w-full"
//             >
//               {isExporting ? (
//                 <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//               ) : (
//                 <Download className="w-4 h-4 mr-2" />
//               )}
//               Export
//             </Button>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="rejected">Rejected</option>
//               <option value="payment_done">Payment Done</option>
//               <option value="refill">Refill</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Product Name
//             </label>
//             <select
//               value={filters.product}
//               onChange={(e) => setFilters({
//                 ...filters,
//                 'product': e.target.value
//               })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Products</option>
//               {filtersData?.products?.map((product: any) => (
//                 <option key={product._id} value={product._id}>
//                   {product.name} - {product.productCode}
//                 </option>
//               ))}
//             </select>


//           </div>



//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
//             <select
//               value={filters.platform}
//               onChange={(e) => setFilters({
//                 ...filters,
//                 'platform': e.target.value
//               })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Platforms</option>
//               {filtersData?.platforms?.map((platform: any) => (
//                 <option key={platform.value} value={platform.value}>
//                   {platform.name}
//                 </option>
//               ))}
//             </select>
//           </div>


//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Mediator</label>
//             <select
//               value={filters.mediator}
//               onChange={(e) => setFilters({ ...filters, mediator: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Mediators</option>
//               {filtersData?.mediators?.map((mediator: any) => (
//                 <option key={mediator._id} value={mediator._id}>
//                   {mediator.name} - {mediator.email}
//                 </option>
//               ))}
//             </select>
//           </div>


//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>

//             <select
//               value={filters.seller}
//               onChange={(e) => setFilters({ ...filters, seller: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Sellers</option>



//               {filtersData?.sellers?.map((seller: any) => (
//                 <option key={seller._id} value={seller._id}>
//                   {seller.name} - {seller.email}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               From Date
//             </label>
//             <input
//               type="date"
//               value={filters.fromDate}
//               onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               To Date
//             </label>
//             <input
//               type="date"
//               value={filters.toDate}
//               onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Data Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50 ">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Order ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Product
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Reviewer
//                 </th>

//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Mediator
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>

//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRefunds.slice((pageNo - 1) * itemsPerPage, pageNo * itemsPerPage).map((item) => {
//                 const status = getRefundStatus(item);
//                 const statusColors: any = {
//                   pending: 'bg-yellow-100 text-yellow-800',
//                   accepted: 'bg-blue-100 text-blue-800',
//                   rejected: 'bg-red-100 text-red-800',
//                   payment_done: 'bg-green-100 text-green-800',
//                   refill: 'bg-yellow-100 text-yellow-800'
//                 };

//                 const statusLabels: any = {
//                   pending: 'Pending',
//                   accepted: 'Accepted',
//                   rejected: 'Rejected',
//                   payment_done: 'Payment Done',
//                   refill: 'Refill'
//                 };

//                 return (
//                   <tr key={item._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item?.order?.orderNumber ?? "N/A"}
//                       <div className=" py-1 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
//                           {statusLabels[status]}
//                         </span>
//                       </div>


//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">


//                       <div className="flex flex-col">
//                         <p>
//                           {item.order.product?.name ?? "N/A"} /
//                           <span className="text-xs"> {item.order.product?.productCode ?? "N/A"}</span>
//                         </p>
//                         <p>
//                           {item.order.product?.brand ?? "N/A"} /
//                           <span className="text-xs "> {item.order.product?.brandCode ?? "N/A"}</span>
//                         </p>
//                         <p>
//                           {item.order.product?.productPlatform ?? "N/A"}
//                         </p>


//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {item?.order?.name ?? "N/A"}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {item?.order?.mediator?.nickName || 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ₹{item?.order?.orderAmount ?? "N/A"}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {format(item.createdAt, "dd MMM yyyy")}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleReview(item)}
//                         >
//                           <Eye className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           disabled={isLoading}
//                           onClick={() => handleDelete(item._id)}
//                         >
//                           <Trash2Icon className="w-4 h-4 text-red-500" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {filteredRefunds.length === 0 && (
//           <div className="text-center py-12">
//             <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No refunds found matching your criteria</p>
//           </div>
//         )}
//       </div>


//       {pagination?.totalPages > 0 && (
//         <div className="flex justify-end mt-4 gap-2">
//           <Button
//             variant="outline"
//             disabled={!pagination.hasPrevPage}
//             onClick={() => setPageNo(pageNo - 1)}
//           >
//             Previous
//           </Button>
//           {Array.from({ length: pagination.totalPages }, (_, k) => (
//             <Button
//               key={k}
//               onClick={() => setPageNo(k + 1)}
//               variant={pageNo === k + 1 ? "primary" : "outline"}
//             >
//               {k + 1}
//             </Button>
//           ))}
//           <Button
//             variant="outline"
//             disabled={!pagination.hasNextPage}
//             onClick={() => setPageNo(pageNo + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       )}




//       {selectedRefundItem &&
//         <RefundModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedRefundItem(null);
//           }}
//           // data={selectedRefundItem}
//           // orderNumber = {selectedRefundItem.order.orderNumber}
//           refundId={selectedRefundItem._id}
//           // onUpdate={handleUpdateRefund}
//           setRefunds={setRefunds}
//         />

//       }

//     </div>
//   )
// }

// export default RefundTable;






import { useState } from "react";
import { Download, Eye, Filter, Package, RefreshCw, SearchIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { exportToExcel, formatRefundsForExport } from "../../utils/exportUtils";
import Input from "../UI/Input";
import Button from "../UI/Button";
import type { RefundWithDetails } from "@/types/refunds";
import RefundModal from "./RefundModal"; // Make sure path is correct
import { apiDelete, apiGet } from "@/utils/api";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function RefundTable() {
    const [searchQuery, setSearchQuery] = useState(''); // For the input box
    const [searchTerm, setSearchTerm] = useState(''); // For the API query
    const [selectedRefundItem, setSelectedRefundItem] = useState<RefundWithDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const location = useLocation();
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState({
        seller: '',
        status: '',
        brand: '',
        mediator: '',
        platform: '',
        product: '',
        brandName: '',
        fromDate: '',
        toDate: ''
    });

    // --- Data Fetching with useQuery ---
    const fetchRefunds = async ({ queryKey }: any): Promise<any> => {
        const [_key, { ...params }] = queryKey;
        const queryString = new URLSearchParams(params).toString();
        
        try {
            const response: any = await apiGet(`/refund/all-refunds?${queryString}`);
            if (response.success) {
                return response; // Return the full response { data, pagination }
            }
            throw new Error(response.message || 'Failed to fetch refunds');
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch refunds');
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["refunds", { ...filters, page: pageNo, limit: itemsPerPage, searchTerm }],
        queryFn: fetchRefunds,
        placeholderData: (prev) => prev,
        staleTime: 5*2 * 60 * 1000, // 10 minutes
    });

    const refunds:any[] = data?.data || [];
    const pagination: any = data?.pagination || {};

    // --- Filters Data ---
    const { data: filtersData } = useQuery({
        queryKey: ["filtersData"],
        queryFn: async () => {
            try {
                const response: any = await apiGet(`/admin/filter-options`);
                if (response.success) {
                    return response.data;
                }
                throw new Error('Failed to fetch filter options');
            } catch (error: any) {
                throw new Error(error.message || "failed to fetch filters Data");
            }
        },
        staleTime: 50 * 60 * 1000, // 5 0 minutes
    });

    // --- Mutation for Deleting ---
    const deleteRefundMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiDelete('/refund/delete/' + id);
            if (!response.success) {
                throw new Error(response.message || 'Failed to delete refund');
            }
            return response;
        },
        onSuccess: () => {
            toast.success('Refund deleted successfully');
            // Invalidate the query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['refunds'] });
        },
        onError: (error: any) => {
            console.error('Error deleting Refund:', error);
            toast.error(error.response?.data?.message || error.message || "Failed to delete refund");
        }
    });

    const handleDelete = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this refund?")) return;
        deleteRefundMutation.mutate(id);
    };

    // --- Handlers ---
    const handleReview = (item: RefundWithDetails) => {
        setSelectedRefundItem(item);
        setIsModalOpen(true);
    };

    // Handle search with enter key
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchTerm(searchQuery);
            setPageNo(1); // Reset to first page
        }
    };

    // Handle search icon click
    const handleSearchClick = () => {
        setSearchTerm(searchQuery);
        setPageNo(1); // Reset to first page
    };

    // Handle filter changes with page reset
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPageNo(1); // Reset to first page
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setPageNo(1); // Reset to first page
    };

    const clearAllFilters = () => {
        setFilters({
            seller: '',
            status: '',
            brand: '',
            mediator: '',
            platform: '',
            product: '',
            brandName: '',
            fromDate: '',
            toDate: ''
        });
        setSearchTerm('');
        setSearchQuery('');
        setPageNo(1);
    };

    // --- Export ---
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Build the same query string as the main fetch
            const queryParams = { ...filters, searchTerm, status: filters.status, product: filters.product };
            const queryString = new URLSearchParams(queryParams).toString();

            const response: any = await apiGet(`/refund/download?${queryString}`);
            if (response.success) {
                const formattedData = formatRefundsForExport(response.data);
                exportToExcel(formattedData, 'refunds');
                toast.success('Refunds exported successfully!');
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            toast.error('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };
    
    // Set search term from navigation state (e.g., coming from OrderTable)
    useState(() => {
        if (location.state?.orderNumber) {
            const orderNum = location.state.orderNumber;
            setSearchQuery(orderNum);
            setSearchTerm(orderNum);
        }
    });

    // --- Render Logic ---
    if (isLoading && !data) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading refunds...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-600">Something went wrong: {error?.message}</p>
                <Button
                    onClick={() => queryClient.refetchQueries({ queryKey: ['refunds'] })}
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
                            disabled={isExporting || refunds.length === 0}
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
                            <option value="rejected">Rejected</option>
                            <option value="payment_done">Payment Done</option>
                            <option value="refill">Refill</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <select
                            value={filters.product}
                            onChange={(e) => handleFilterChange('product', e.target.value)}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Date
                        </label>
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
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 ">
                            <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reviewer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mediator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* REMOVED .slice() and .filter() - data is pre-filtered and pre-paginated! */}
                            {refunds.map((item , index) => {
                                const status = item.status;
                                const statusColors: any = {
                                    pending: 'bg-yellow-100 text-yellow-800',
                                    accepted: 'bg-blue-100 text-blue-800',
                                    rejected: 'bg-red-100 text-red-800',
                                    payment_done: 'bg-green-100 text-green-800',
                                    refill: 'bg-yellow-100 text-yellow-800'
                                };
                                const statusLabels: any = {
                                    pending: 'Pending',
                                    accepted: 'Accepted',
                                    rejected: 'Rejected',
                                    payment_done: 'Payment Done',
                                    refill: 'Refill'
                                };

                                return (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1 + (pageNo - 1) * itemsPerPage}
                                            </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item?.order?.orderNumber ?? "N/A"}
                                            <div className=" py-1 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
                                                    {statusLabels[status]}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-col">
                                                <p>
                                                    {item.order.product?.name ?? "N/A"} /
                                                    <span className="text-xs"> {item.order.product?.productCode ?? "N/A"}</span>
                                                </p>
                                                <p>
                                                    {item.order.product?.brand ?? "N/A"} /
                                                    <span className="text-xs "> {item.order.product?.brandCode ?? "N/A"}</span>
                                                </p>
                                                <p>
                                                    {item.order.product?.productPlatform ?? "N/A"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item?.order?.name ?? "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item?.order?.mediator?.nickName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{item?.order?.orderAmount ?? "N/A"}
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
                                                    disabled={deleteRefundMutation.isPending}
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <Trash2Icon className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {refunds.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No refunds found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 0 && (
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

            {/* Modal */}
            {selectedRefundItem &&
                <RefundModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedRefundItem(null);
                    }}
                    refundId={selectedRefundItem._id}
                // No more setRefunds or onUpdate props!
                />
            }
        </div>
    )
}

export default RefundTable;