import { Edit, Image, Package,  X, ZoomIn,  Box } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import MediatorEditOrderModal from "./MediatorEditOrderModal";
// import { apiUpdate } from "../../utils/api";
import Button from "../UI/Button";
import { format } from "date-fns";
import type {  OrderWithDetails, UpdateOrderData } from "@/types/orders";
import { apiGet, ordersAPI } from "@/utils/api";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'accepted': return 'bg-blue-100 text-blue-800';
    case 'refund_placed': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    case 'payment_done': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MediatorOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  // data: OrderWithDetails | null;
  orderId: string;
  onUpdate: (updatedOrder: OrderWithDetails) => void; // 3. Add callback to update parent state
}> = ({ isOpen, onClose, orderId, onUpdate }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 4. State for edit modal
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState<OrderWithDetails | null>(null);
  // const [showRejectModal, setShowRejectModal] = useState(false);
  // const [rejectionMessage, setRejectionMessage] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await apiGet(`/order/${orderId}`);
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch order details');
      }
    };
    fetchData();
  }, [orderId]);



  if (!isOpen || !data) return null;

  const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
  const closeImage = () => setSelectedImage(null);
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeImage();
  };

  // const handleReject = async () => {

  //   setIsUpdating(true);
  //   try {
  //     const response: any = await ordersAPI.updateOrderStatus(data._id, {
  //       orderStatus: 'rejected',
  //       rejectionMessage: rejectionMessage || undefined // Only send if provided
  //     });

  //     if (response.success) {
  //       toast.success("Order has been rejected.");
  //       onUpdate(response.data);
  //       onClose();
  //       setShowRejectModal(false);
  //       setRejectionMessage(''); // Reset message
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || "Failed to reject order.");
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  // const handleAccepted = async () => {
  //   if (!window.confirm("Are you sure you want to Accept this order?")) return;

  //   setIsUpdating(true);
  //   try {
  //     // The body of the request includes the order number and the new status
  //     const response: any = await ordersAPI.updateOrderStatus(data._id, { orderStatus: 'accepted' });

  //     if (response.success) {
  //       toast.success("Order has been Accepted.");
  //       onUpdate(response.data); // Update the parent component's state
  //       onClose(); // Close the main modal
  //     } else {
  //       throw new Error(response.message);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || "Failed to Accept order.");
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  const handleUpdate = async (updatedData: Partial<UpdateOrderData>, orderId: string , files?:{orderSS?:File,priceBreakupSS?:File}) => {
    // This function is passed to the EditOrderModal
    setIsUpdating(true);
    try {
      const response: any = await ordersAPI.updateOrder( orderId , updatedData, files);
      if (response.success) {
        onUpdate(response.data);
        setIsEditModalOpen(false); // Close edit modal on success
      } else {
        throw new Error(response.message);
      }
    } finally {
      setIsUpdating(false); // This re-enables the save button in case of error
      setIsEditModalOpen(false);
    }
  };

  if(isUpdating){
    return <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }
  const screenshots = [
    { url: data.orderSS, label: 'Order Screenshot' },
    { url: data.priceBreakupSS, label: 'Price Breakup' }
  ].filter(screenshot => screenshot.url);

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

       

          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Refund Details
            </h2>
            <div className="flex items-center gap-2">
              {data.orderStatus === 'rejected' && (
                <span className="text-red-600 font-bold">[REJECTED]</span>
              )}
              {data.orderStatus === 'payment_done' && (
                <span className="text-green-600 font-bold">[PAID]</span>
              ) || data.orderStatus === "accepted" && (
                <span className="text-blue-600 font-bold">[Accepted]</span>
              )}
              {data.orderStatus==='pending' && 
                 <span className="text-yellow-600 font-bold">[PENDING]</span>
              }
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Show reject message if available */}
            {data.orderStatus === 'rejected' && data.rejectionMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
                <p className="text-red-700">{data.rejectionMessage}</p>
              </div>
            )}
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* ... (rest of your modal content is unchanged) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Information
                </h3>
                <div className="space-y-2 text-sm">

                  <p><span className="font-medium">Order Number:</span> {data.orderNumber}</p>
                  <p><span className="font-medium">Reviewer Name:</span> {data.name}</p>
                  <p><span className="font-medium">Reviewer Email:</span> {data.email}</p>
                  <p><span className="font-medium">Reviewer Contact:</span> {data.phone}</p>
 
                  <p><span className="font-medium">Mediator Name:</span> {data.mediator?.nickName ?? data.mediator?.name??"N/A"}</p>
                  <p><span className="font-medium">Mediator phone:</span> {data.mediator?.phone??"N/A"}</p>
                  <p><span className="font-medium">Replacement :</span> {data.isReplacement ? "Yes" : "No"}</p>
                  <p><span className="font-medium">Rating / Review:</span> {data.ratingOrReview}</p>
                  <p><span className="font-medium">Deal Type:</span> {data.dealType}</p>
                  {data.dealType === "exchange" &&
                    <p><span className="font-medium">Exchange Product:</span> {data.exchangeProduct}</p>
                  }


                  <p><span className="font-medium">Order Placed on:</span> {format(new Date(data.orderDate), 'dd MMMM, yyyy')}</p>
                  <p><span className="font-medium">Order Form Placed on:</span> {format(new Date(data.createdAt), 'dd MMMM, yyyy')}</p>
                  <p><span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.orderStatus)}`}>
                      {data?.orderStatus.replace('_', ' ')}
                    </span>
                  </p>


                  {data.orderStatus==='rejected' &&
                    <p><span className="font-medium">Rejection Message:</span> {data.rejectionMessage??"N/A"}</p>
                  }
                  {/* ... other fields ... */}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <Box className="w-5 h-5 mr-2" />
                  Product Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Product Name:</span> {data.product?.name??"N/A"}</p>
                  <p><span className="font-medium">Product Code:</span> {data.product?.productCode??"N/A"}</p>
                  <p><span className="font-medium">Brand Name:</span> {data.product?.brand??"N/A"}</p>
                  <p><span className="font-medium">Brand Code:</span> {data.product?.brandCode??"N/A"}</p>
                  <p><span className="font-medium">Product Platform:</span> {data.product?.productPlatform??"N/A"}</p>
                  <p><span className="font-medium ">Product Link:</span> <a target="_blank" className="text-blue-600" href={data.product?.productLink??"N/A"}>{data.product?.productLink??"N/A"}</a></p>
                  <p><span className="font-medium">Order Amount:</span> {data.orderAmount}</p>
                  <p><span className="font-medium">Less Price:</span> {data.lessPrice}</p>
                  <p><span className="font-medium">Refund Amount:</span> {data.orderAmount - data.lessPrice}</p>
                </div>
              </div>
            </div>

            {/* Screenshots Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Screenshots
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="relative group" onClick={() => openImage(screenshot.url as string)}>
                    <p className="text-sm font-medium text-gray-700 mb-2">{screenshot.label}</p>
                    <div className="relative cursor-pointer">
                      <img
                        src={screenshot.url}
                        alt={screenshot.label}
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                      />
                      <div className="absolute inset-0 bg-black/0  group-hover:bg-black/40 transition-opacity rounded-lg flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer with new buttons */}
          <div className="flex flex-col md:flex-row justify-end items-center p-6 border-t border-gray-200">

            <div className="flex space-x-4">
              {/* <Button variant="outline" onClick={onClose} className="w-auto">Close</Button>
              {data.orderStatus !=='accepted' && <Button onClick={handleAccepted} isLoading={isUpdating}
                className="flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Accept
              </Button>}
              {data.orderStatus!=='rejected' && <Button
                variant="danger"
                onClick={() => setShowRejectModal(true)}
                isLoading={isUpdating}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>} */}
              <Button onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>



      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={closeImage}
              className="absolute -top-12 -right-4 bg-white mt-10 rounded-full p-2 z-10 hover:bg-gray-200 transition-colors hover:cursor-pointer"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <button
                onClick={() => window.open(selectedImage, '_blank')}
                className="text-sm hover:underline"
              >
                Open image in new tab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render the Edit Modal when needed */}
      {isEditModalOpen && (
        <MediatorEditOrderModal
          onClose={() => setIsEditModalOpen(false)}
          data={data}
          onSave={handleUpdate}
        />
      )}


      {/* Rejection Reason Modal */}
      {/* {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Reject Order</h3>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionMessage('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject order <strong>#{data.orderNumber}</strong>?
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Message (Optional)
                </label>
                <textarea
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  placeholder="Provide a reason for rejection (this will be visible to the customer)..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {rejectionMessage.length}/500 characters
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionMessage('');
                  }}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  isLoading={isUpdating}
                  className="w-full sm:w-auto"
                >
                  Confirm Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default MediatorOrderModal;