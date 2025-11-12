
import { useState } from "react";
import Input from "../UI/Input";
import {  Download, Eye, Filter, Package, RefreshCw, SquareArrowOutUpRight } from "lucide-react";
import { exportToExcel, formatOrdersForExport } from '../../utils/exportUtils.ts';
import Button from '../UI/Button';
import toast from "react-hot-toast";
import MediatorOrderModal from "./MediatorOrderModal";
import { format } from "date-fns";
import type { OrderWithDetails } from "@/types/orders.ts";
import {  apiGet } from "@/utils/api.ts";
import { useNavigate } from "react-router-dom";
function MediatorOrderTable({ orders, setOrders }: { orders: OrderWithDetails[], setOrders: React.Dispatch<React.SetStateAction<OrderWithDetails[]>> }) {
    const [selectedOrderItem, setSelectedOrderItem] = useState<OrderWithDetails | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReview = (item: OrderWithDetails) => {
        setSelectedOrderItem(item as OrderWithDetails);
        setIsModalOpen(true);
    };
    // const handleDelete = async (id: string) => {
    //     if(!window.confirm("Are you sure you wants to delete this order")) return
    //     try{
    //         setIsLoading(true);
    //         const response = await apiDelete('/order/'+id);
    //         if(response.success){
    //             setOrders(orders.filter(order => order._id !== id));
    //             toast.success('Order deleted successfully');
    //         }else{
    //             throw new Error(response.message);
    //         }
    //     }catch(error:any){
    //         console.error('Error deleting order:' , error);
    //         toast.error(error.response.data.message || error.message || "Failed to Delete Message");
    //     }finally{
    //         setIsLoading(false);
    //     }
    // };


    const handleRefundForm = async (orderNumber:string)=>{
        navigate("/mediator/refunds",{state:{orderNumber}});
    }

    // Function to get status display information
    const getOrderStatusInfo = (status: string) => {
        const statusInfo = {
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            refund_placed: { label: 'Refund Placed', color: 'bg-blue-100 text-blue-800' },
            rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
            accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
            payment_done: { label: 'Payment Done', color: 'bg-green-100 text-green-800' }
        };
        return statusInfo[status as keyof typeof statusInfo] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const handleUpdateOrder = (data: OrderWithDetails) => {
        // complete this code that to update the orders State
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
            // ( item.product && item.product.productCode && item.product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) )||
            item.name.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilters =
            (!filters.status || item.orderStatus === filters.status) &&
            (!filters.mediator || (item.mediator && item.mediator._id && item.mediator?._id?.toLowerCase().includes(filters.mediator.toLowerCase()))) &&
            (!filters.seller || (item.product && item.product.seller && item.product.seller.name && item.product.seller?._id?.toLowerCase().includes(filters.seller.toLowerCase()))) &&
            (!filters.platform || item.product?.productPlatform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
            (!filters.productName || (item.product && item.product._id && item.product?._id?.toLowerCase().includes(filters.productName.toLowerCase())));

        // Date range filtering
        const matchesDate = () => {
            if (!filters.fromDate && !filters.toDate) return true;

            const orderDate = new Date(item.createdAt);
            // orderDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

            if (filters.fromDate && filters.toDate) {
                const fromDate = new Date(filters.fromDate);
                const toDate = new Date(filters.toDate);
                toDate.setHours(23, 59, 59, 999); // End of the day
                return orderDate >= fromDate && orderDate <= toDate;
            }

            if (filters.fromDate) {
                const fromDate = new Date(filters.fromDate);
                return orderDate >= fromDate;
            }

            if (filters.toDate) {
                const toDate = new Date(filters.toDate);
                toDate.setHours(23, 59, 59, 999); // End of the day
                return orderDate <= toDate;
            }

            return true;
        };
        return matchesSearch && matchesFilters && matchesDate();
    });


    const handleExport = async () => {
        setIsExporting(true);

        try {
            const response: any = await apiGet(`/order/download?status=${filters.status}&mediator=${orders[0]?.mediator?._id}&product=${filters.productName}&platform=${filters.platform}&searchQuery=${searchTerm}&seller=${filters.seller}&fromDate=${filters.fromDate}&toDate=${filters.toDate}`);
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


    return (
        <div>
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4 items-end">
                    <div className="md:col-span-2 lg:col-span-3">
                        <Input
                            label="Search"
                            placeholder="Search by order ID, Reviewer name "
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Show entries</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                            onClick={() => {
                                setFilters({ status: '', brand: '', mediator: '', platform: '', brandName: '', productName: '', seller: '', fromDate: '', toDate: '' });
                                setSearchTerm('');
                            }}
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
                

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="refund_placed">Refund Placed</option>
                            {/* <option value="payment_done">Payment Done</option> */}
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    
                        <select
                            value={filters.productName}
                            onChange={(e) => setFilters({ ...filters, productName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Products</option>
                            {Array.from(new Map(
                                orders
                                    .filter(order => order.product && order.product._id)
                                    .map(order => [order.product._id, {
                                        id: order.product._id,
                                        name: order.product.name
                                    }])
                            ).values()).map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Platform
                        </label>
                        <select
                            value={filters.platform}
                            onChange={(e) => setFilters({
                                ...filters,
                                platform: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Platforms</option>
                            {Array.from(new Set(orders.map(o => o.product?.productPlatform))).map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                
                    
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mediator</label>

                        <select
                            value={filters.mediator}
                            onChange={(e) => setFilters({ ...filters, mediator: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Mediators</option>
                            {Array.from(new Set(
                                orders
                                    .map(o => o.mediator?._id) // Get all mediator IDs
                                    .filter(id => id) // Remove undefined/null IDs
                            )).map(mediatorId => {
                                // Find the first order with this mediator to get details
                                const mediatorOrder = orders.find(o => o.mediator?._id === mediatorId);
                                const mediator = mediatorOrder?.mediator;

                                return (
                                    <option key={mediatorId} value={mediatorId}>
                                        {mediator?.nickName || mediator?.name || 'Unknown Mediator'}
                                    </option>
                                );
                            })}
                        </select>
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>

                        <select
                            value={filters.seller}
                            onChange={(e) => setFilters({ ...filters, seller: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Sellers</option>

                            {Array.from(new Set(
                                orders.map(o => {
                                    if (o.product && o.product.seller && o.product.seller._id && o.product.seller.name) {
                                        return o.product.seller._id;
                                    }
                                }).filter(Boolean)

                            )).map(sellerId => {
                                const seller = orders.find(o => o.product?.seller?._id === sellerId)?.product?.seller;
                                return (
                                    <option key={sellerId} value={sellerId}>
                                        {seller?.name || 'Unknown Seller'}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
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
                            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    

                  

                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reviewer
                                </th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Platform
                                </th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mediator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th> */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.slice((pageNo - 1) * itemsPerPage, pageNo * itemsPerPage).map((item) => {
                                const statusInfo = getOrderStatusInfo(item.orderStatus);

                                return (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.orderNumber}
                                            <td className=" py-1">
                                                <span className={`inline-flex  px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-col">
                                                <p>
                                                    {item.product?.name ?? "N/A"} /
                                                    <span className="text-xs"> {item.product?.productCode ?? "N/A"}</span>
                                                </p>
                                                <p>
                                                    {item.product?.brand ?? "N/A"} /
                                                    <span className="text-xs "> {item.product?.brandCode ?? "N/A"}</span>
                                                </p>
                                                <p>
                                                    {item.product?.productPlatform ?? "N/A"}
                                                </p>


                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.name}
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.product?.productPlatform ?? "N/A"}
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.mediator?.nickName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{item.orderAmount}
                                        </td>
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(item.createdAt, "dd MMM yyyy")}
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
                                                {/* <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled ={isLoading}
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <Trash2Icon className="w-4 h-4 text-red-500" />
                                                </Button> */}

                                                { item.orderStatus ==='refund_placed' && 
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    // disabled ={isLoading}
                                                    onClick={() => handleRefundForm(item?.orderNumber)}
                                                    >
                                                        <SquareArrowOutUpRight  className="w-4 h-4 text-blue-700" />
                                                    </Button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No orders found matching your criteria</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline"
                    disabled={pageNo === 1}
                    onClick={() => setPageNo(pageNo - 1)}
                >
                    Previous
                </Button>
                {
                    Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }, (_, k) => <Button
                        onClick={() => setPageNo(k + 1)}
                        variant={pageNo === k + 1 ? "primary" : "outline"} key={k}>{k + 1}</Button>)
                }
                <Button variant="outline"
                    disabled={pageNo * itemsPerPage >= filteredOrders.length}
                    onClick={() => setPageNo(pageNo + 1)}
                >
                    Next
                </Button>
            </div>
            {selectedOrderItem &&

                <MediatorOrderModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedOrderItem(null);
                    }}
                    // data={selectedOrderItem}
                    orderId={selectedOrderItem._id}
                    onUpdate={handleUpdateOrder}
                />}
        </div>
    );
}

export default MediatorOrderTable;