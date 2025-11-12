



// import { Check, ClipboardListIcon, Edit, FileCheck, Image, IndianRupee, Package, User, X, XCircle, ZoomIn } from "lucide-react";
// import toast from "react-hot-toast";
// import { useEffect, useState } from "react";
// import { format } from "date-fns";
// import Button from "../UI/Button";
// import { apiGet, refundsAPI } from "../../utils/api";
// import type { RefundWithDetails } from "@/types/refunds";
// import EditRefundModal from "./EditRefundModal";

// const RefundModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   refundId: string;
//   setRefunds: React.Dispatch<React.SetStateAction<RefundWithDetails[]>>;
//   // data: RefundWithDetails | null;
// }> = ({ isOpen, onClose, refundId, setRefunds }) => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   // const [editedData, setEditedData] = useState<RefundWithDetails | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [data, setData] = useState<RefundWithDetails | null>(null);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectionMessage, setRejectionMessage] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response: any = await apiGet('refund/' + refundId);
//         if (response.success) {
//           setData(response.data);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchData();

//   }, [refundId]);

//   if (!isOpen || !data) return null;

//   // Initialize edited data when modal opens
//   // if (!editedData && data) {
//   //   setEditedData(data);
//   // }
//   const handleUpdateRefund = (data: RefundWithDetails) => {
//     // complete this code that to update the orders State
//     // console.log(data);
//     console.log(data);
//     setRefunds(prevRefunds =>
//       prevRefunds.map(refund =>
//         refund._id === data._id ? data : refund
//       ));
//   }
//   const handlePaid = async () => {
//     if (!window.confirm("Are you sure you want to mark this refund as paid")) return;

//     setIsSaving(true);
//     try {
//       // The body of the request includes the order number and the new status
//       const response: any = await refundsAPI.updateRefundStatus(data._id, { status: 'payment_done' });

//       if (response.success) {
//         toast.success("Refund has been marked as paid.");
//         handleUpdateRefund(response.data); // Update the parent component's state
//         onClose(); // Close the main modal
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to mark refund as paid.");
//     } finally {
//       setIsSaving(false);
//     }
//   };
//   const handleRefill = async () => {
//     if (!window.confirm("Are you sure you want to mark this refund as required Refill")) return;

//     setIsSaving(true);
//     try {
//       // The body of the request includes the order number and the new status
//       const response: any = await refundsAPI.updateRefundStatus(data._id, { status: 'refill' });

//       if (response.success) {
//         toast.success("Refund has been marked as Refill.");
//         handleUpdateRefund(response.data); // Update the parent component's state
//         onClose(); // Close the main modal
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to mark refund as Refill.");
//     } finally {
//       setIsSaving(false);
//     }
//   };


//   const handleAccepted = async () => {
//     if (!window.confirm("Are you sure you want to Accept this order?")) return;

//     setIsSaving(true);
//     try {
//       // The body of the request includes the order number and the new status
//       const response: any = await refundsAPI.updateRefundStatus(data._id, { status: 'accepted' });

//       if (response.success) {
//         toast.success("Order has been Accepted.");
//         handleUpdateRefund(response.data); // Update the parent component's state
//         onClose(); // Close the main modal
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to Accept order.");
//     } finally {
//       setIsSaving(false);
//     }
//   };


//   const handleReject = async () => {
//     // if (!window.confirm("Are you sure you want to reject this order?")) return;

//     setIsSaving(true);
//     try {
//       const response: any = await refundsAPI.updateRefundStatus(data._id, {
//         status: 'rejected',
//         rejectionMessage: rejectionMessage || undefined // Only send if provided
//       });

//       if (response.success) {
//         toast.success("Refund has been rejected.");
//         handleUpdateRefund(response.data);
//         onClose();
//         setShowRejectModal(false);
//         setRejectionMessage(''); // Reset message
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to reject Refund.");
//     } finally {
//       setIsSaving(false);
//     }
//   };






//   // Function to open image in lightbox
//   const openImage = (imageUrl: string) => {
//     setSelectedImage(imageUrl);
//   };

//   // Function to close lightbox
//   const closeImage = () => {
//     setSelectedImage(null);
//   };

//   // Close lightbox when clicking on backdrop
//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       closeImage();
//     }
//   };

//   // Get all available screenshots
//   const screenshots = [
//     { url: data.deliveredSS, label: 'Delivered Screenshot' },
//     { url: data.reviewSS, label: 'Review Screenshot' },
//     { url: data.sellerFeedbackSS, label: 'Seller Feedback Screenshot' },
//     { url: data.returnWindowSS, label: 'Return Window Screenshot' }
//   ].filter(screenshot => screenshot.url);

//   return (
//     <>
//       {/* Main Modal */}
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//           {/* Modal Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               Refund Details
//             </h2>
//             <div className="flex items-center gap-2">
//               {data.status === 'rejected' && (
//                 <span className="text-red-600 font-bold">[REJECTED]</span>
//               )}
//               {data.status === 'payment_done' && (
//                 <span className="text-green-600 font-bold">[PAID]</span>
//               ) || data.status === "accepted" && (
//                 <span className="text-green-600 font-bold">[Accepted]</span>
//               )}
//               <button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           {/* Modal Content */}
//           <div className="p-6">
//             {/* Show reject message if available */}
//             {data.status === 'rejected' && data.rejectionMessage && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
//                 <p className="text-red-700">{data.rejectionMessage}</p>
//               </div>
//             )}

//             {/* Basic Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <div className="bg-blue-50 p-4 rounded-xl">
//                 <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
//                   <Package className="w-5 h-5 mr-2" />
//                   Refund Information
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                   {
//                     data.upiId && (
//                       <p><span className="font-medium">UPI ID:</span> {data?.upiId?? "N/A"}</p>
//                     )}

//                   {data.bankInfo && (
//                     <>
//                       <p><span className="font-medium">Acount Number:</span> {data.bankInfo?.accountNumber??"N/A"}</p>
//                       <p><span className="font-medium">IFSC Code:</span> {data.bankInfo?.ifscCode??"N/A"}</p>
//                     </>
//                   )
//                   }
//                   <p><span className="font-medium">Review Link:</span> <a href={data.reviewLink??"https://na.com"} target="_blank" className="text-blue-600 underline">{data?.reviewLink ??"N/A"}</a></p>
//                   <p><span className="font-medium">Refund form Submitted on:</span> {format(new Date(data.createdAt), "dd MMM yyyy")}</p>
//                   <p><span className="font-medium">Return Window Closed:</span> {data?.isReturnWindowClosed?"Yes":"No"}</p>
//                 </div>
//               </div>

//               <div className="bg-green-50 p-4 rounded-xl">
//                 <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
//                   <User className="w-5 h-5 mr-2" />
//                   Reviewer Information
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="font-medium">Reviewer Name: </span>{data.order.name}</p>
//                   <p><span className="font-medium">Reviewer Email: </span>{data.order.email}</p>
//                   <p><span className="font-medium">Reviewer Phone: </span>{data.order.phone}</p>
//                 </div>
//               </div>
//             </div>


//             <div className="w-full mb-8">
//               <div className="bg-pink-50 w-full p-6 rounded-2xl shadow-sm border border-pink-100">
//                 <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
//                   <Package className="w-5 h-5 mr-2" />
//                   Order Information
//                 </h3>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
//                   <p><span className="font-medium text-gray-800">Product Name:</span> {data.order.product.name ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Product Code:</span> {data.order.product.productCode ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Brand Name:</span> {data.order.product.brand ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Brand Code:</span> {data.order.product.brandCode ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Platform:</span> {data.order.product.productPlatform ?? "N/A"}</p>
//                   <p><span className="font-medium">Product Link:</span> <a href={data.order.product.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.order.product.productLink ?? "N/A"}</a></p>
//                   <p><span className="font-medium text-gray-800">Deal Type:</span> {data.order.dealType ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Rating / Review:</span> {data.order.ratingOrReview ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Replacement Order:</span> {data.order.isReplacement ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Order Amount:</span> {data.order.orderAmount ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Order Number:</span> {data.order.orderNumber ?? "N/A"}</p>
//                   {data.order.isReplacement == 'yes' && <p><span className="font-medium text-gray-800">Old Order Number:</span> {data.order.oldOrderNumber ?? "N/A"}</p>}
//                   <p><span className="font-medium text-gray-800">Less Price:</span> {data.order.lessPrice ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Exchange Product:</span> {data.order.exchangeProduct ?? "N/A"}</p>
//                   <p><span className="font-medium text-gray-800">Refund Amount:</span> {data.order.orderAmount - data.order.lessPrice}</p>
//                   <p><span className="font-medium text-gray-800">Mediator Name:</span> {data.order.mediator?.nickName ?? "N/A"}</p>
//                   {/* <p><span className="font-medium text-gray-800">Refund Note :</span> {data.note ?? "N/A"}</p> */}
//                   {/* <p><span className="font-medium text-gray-800">Order Note :</span> {data.order.note ?? "N/A"}</p> */}
//                 </div>
//               </div>
//             </div>
//             {/* Screenshots Section */}
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <Image className="w-5 h-5 mr-2" />
//                 Screenshots
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {screenshots.map((screenshot, index) => (
//                   <div key={index} className="relative group">
//                     <p className="text-sm font-medium text-gray-700 mb-2">{screenshot.label}</p>
//                     <div
//                       className="relative cursor-pointer transform transition-transform duration-200 group-hover:scale-105"
//                       onClick={() => openImage(screenshot.url as string)}
//                     >
//                       <img
//                         src={screenshot.url}
//                         alt={screenshot.label}
//                         className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
//                       />
//                       <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-opacity rounded-lg flex items-center justify-center">
//                         <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//                       </div>
//                     </div>
//                     <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
//                       Click to enlarge
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {screenshots.length === 0 && (
//                 <p className="text-gray-500 text-center py-4">No screenshots available</p>
//               )}
//             </div>
//           </div>



//           {/* Modal Footer with new buttons */}

//             {/* Modal Footer with new buttons */}
// <div className="flex flex-col gap-3 md:flex-row justify-between md:justify-end items-stretch md:items-center p-4 md:p-6 border-t border-gray-200 w-full">

// {/* Mobile: Grid layout for small screens */}
// <div className="grid grid-cols-3 gap-2 w-full md:hidden">


//   {data.status !== 'accepted' && (
//     <Button onClick={handleAccepted} isLoading={isSaving} className="w-full justify-center">
//       <FileCheck className="w-4 h-4 mr-2" />
//       Accept
//     </Button>
//   )}

//   {data.status !== 'rejected' && (
//     <Button
//       variant="danger"
//       onClick={() => setShowRejectModal(true)}
//       isLoading={isSaving}
//       className="w-full justify-center"
//     >
//       <XCircle className="w-4 h-4 mr-2" />
//       Reject
//     </Button>
//   )}

//  {data.status !=='payment_done' && <Button onClick={handlePaid} isLoading={isSaving} className="w-full justify-center bg-green-600 hover:bg-green-700">
//     <Check className="w-4 h-4 mr-2" />
//     Paid
//   </Button>}
//   <Button variant="outline" onClick={onClose} className="w-full justify-center">
//     Close
//   </Button>
//   <Button onClick={handleRefill} isLoading={isSaving} className="w-full justify-center bg-yellow-600 hover:bg-yellow-700">
//     <ClipboardListIcon className="w-4 h-4 mr-2" />
//     Refill
//   </Button>


//   {data.status !=='payment_done' && data.upiId && data.order.orderNumber && data.order.orderAmount && (
//     <a
//       href={`upi://pay?pa=${encodeURIComponent(data.upiId)}&am=${encodeURIComponent(((data?.order?.orderAmount ?? 0) - (data?.order?.lessPrice ?? 0)))}&cu=INR&tn=${encodeURIComponent(`OrderNumber: ${data?.order?.orderNumber ?? 'N/A'}`)}`}
//       className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded w-full"
//     >
//       <IndianRupee className="w-4 h-4 mr-2" />
//       Pay
//     </a>
//   )}


//   <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} className="w-full ">
//     <Edit className="w-4 h-4 mr-2" />
//     Edit
//   </Button>

// </div>

// {/* Desktop: Flex layout for larger screens */}
// <div className="hidden md:flex flex-wrap gap-2 justify-end items-center">


//   {data.status !== 'accepted' && (
//     <Button onClick={handleAccepted} isLoading={isSaving} className="flex-shrink-0">
//       <FileCheck className="w-4 h-4 mr-2" />
//       Accept
//     </Button>
//   )}

//   {data.status !== 'rejected' && (
//     <Button
//       variant="danger"
//       onClick={() => setShowRejectModal(true)}
//       isLoading={isSaving}
//       className="flex-shrink-0"
//     >
//       <XCircle className="w-4 h-4 mr-2" />
//       Reject
//     </Button>
//   )}

//   {data.status !=='payment_done' && <Button onClick={handlePaid} isLoading={isSaving} className="flex-shrink-0 bg-green-600 hover:bg-green-700">
//     <Check className="w-4 h-4 mr-2" />
//     Paid
//   </Button>}
//   <Button onClick={handleRefill} isLoading={isSaving} className="flex-shrink-0 bg-yellow-600 hover:bg-yellow-700">
//     <ClipboardListIcon className="w-4 h-4 mr-2" />
//     Refill
//   </Button>

//   {data.status !=='payment_done' && data.upiId && data.order.orderNumber && data.order.orderAmount && (
//     <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex-shrink-0">
//       <IndianRupee className="w-4 h-4 mr-2" />

//     <a
//       href={`upi://pay?pa=${encodeURIComponent(data.upiId)}&am=${encodeURIComponent(((data?.order?.orderAmount ?? 0) - (data?.order?.lessPrice ?? 0)))}&cu=INR&tn=${encodeURIComponent(`OrderNumber: ${data?.order?.orderNumber ?? 'N/A'}`)}`}
//       >
//       Pay
//     </a>
//       </Button>
//   )}

//   <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} className="flex-shrink-0">
//     <Edit className="w-4 h-4 mr-2" />
//     Edit
//   </Button>

// </div>


// </div>
//           {/* </div> */}
//           {/* </div> */}
//         </div >





//       </div >

//       {/* Rejection Reason Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900">Reject Order</h3>
//               <button
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setRejectionMessage('');
//                 }}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="p-6">
//               <p className="text-gray-600 mb-4">
//                 Are you sure you want to reject Refund <strong>#{data.order.orderNumber}</strong>?
//               </p>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Rejection Message (Optional)
//                 </label>
//                 <textarea
//                   value={rejectionMessage}
//                   onChange={(e) => setRejectionMessage(e.target.value)}
//                   placeholder="Provide a reason for rejection (this will be visible to the customer)..."
//                   className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                   maxLength={500}
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   {rejectionMessage.length}/500 characters
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 justify-end">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowRejectModal(false);
//                     setRejectionMessage('');
//                   }}
//                   className="w-full sm:w-auto"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={handleReject}
//                   isLoading={isSaving}
//                   className="w-full sm:w-auto"
//                 >
//                   Confirm Reject
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )
//       }
//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <EditRefundModal setData={setData} data={data} onClose={() => setIsEditModalOpen(false)} onUpdate={handleUpdateRefund} />
//       )
//       }

//       {/* Image Lightbox Modal - Higher z-index */}
//       {
//         selectedImage && (
//           <div
//             className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
//             onClick={handleBackdropClick}
//           >
//             <div className="relative max-w-6xl max-h-full">
//               <button
//                 onClick={closeImage}
//                 className="absolute -top-12 -right-4 bg-white mt-10 rounded-full p-2 z-10 hover:bg-gray-200 transition-colors hover:cursor-pointer"
//               >
//                 <X className="w-6 h-6 text-gray-800" />
//               </button>
//               <img
//                 src={selectedImage}
//                 alt="Enlarged view"
//                 className="max-w-full max-h-[90vh] object-contain rounded-lg"
//               />
//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
//                 <button
//                   onClick={() => window.open(selectedImage, '_blank')}
//                   className="text-sm hover:underline"
//                 >
//                   Open image in new tab
//                 </button>
//               </div>
//             </div>
//           </div>
//         )
//       }
//     </>
//   );
// };

// export default RefundModal;




import { Check, ClipboardListIcon, Edit, FileCheck, Image, Package, User, X, XCircle, ZoomIn, RefreshCw, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { format } from "date-fns";
import Button from "../UI/Button";
import { apiGet, refundsAPI } from "../../utils/api";
import type { RefundWithDetails } from "@/types/refunds";
import EditRefundModal from "./EditRefundModal"; // Make sure path is correct
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface RefundModalProps {
    isOpen: boolean;
    onClose: () => void;
    refundId: string;
    // setRefunds prop is removed
}

const RefundModal: React.FC<RefundModalProps> = ({ isOpen, onClose, refundId }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionMessage, setRejectionMessage] = useState('');
    const queryClient = useQueryClient();

    // --- Fetch Refund Details with useQuery ---
    const { data, isLoading, isError } = useQuery({
        queryKey: ['refund', refundId],
        queryFn: async () => {
            const response: any = await apiGet('refund/' + refundId);
            if (response.success) {
                return response.data as RefundWithDetails;
            }
            throw new Error(response.message || 'Failed to fetch refund details');
        },
        enabled: isOpen, // Only fetch when the modal is open
    });

    // --- Mutations ---
    const createStatusMutation = (status: 'payment_done' | 'refill' | 'accepted' | 'rejected') => {
        return useMutation({
            mutationFn: (payload?: { rejectionMessage?: string }) =>
                refundsAPI.updateRefundStatus(refundId, { status, ...payload }),
            onSuccess: (response: any) => {
                toast.success(`Refund status updated to ${status.replace('_', ' ')}`);
                // Invalidate both the list and the detail
                queryClient.invalidateQueries({ queryKey: ['refunds'] });
                queryClient.setQueryData(['refund', refundId], response.data); // Optimistic update for modal

                if (status === 'rejected') {
                    setShowRejectModal(false);
                    setRejectionMessage('');
                }
                onClose(); // Close the main modal
            },
            onError: (error: any) => {
                toast.error(error.message || `Failed to update status`);
            }
        });
    };

    const paidMutation = createStatusMutation('payment_done');
    const refillMutation = createStatusMutation('refill');
    const acceptedMutation = createStatusMutation('accepted');
    const rejectMutation = createStatusMutation('rejected');

    const editRefundMutation = useMutation({
        mutationFn: ({ updatedData, files }: {
            updatedData: any,
            files?: { [key: string]: File }
        }) => refundsAPI.updateRefund(refundId, updatedData, files),
        onSuccess: (response: any) => {
            toast.success('Refund data updated successfully.');
            // Invalidate list
            queryClient.invalidateQueries({ queryKey: ['refunds'] });
            // Update modal data directly
            queryClient.setQueryData(['refund', refundId], response.data);
            setIsEditModalOpen(false); // Close edit modal
        },
        onError: (error: any) => {
            console.error("Refund update error:", error);
            toast.error(error.message || "Failed to update refund");
        }
    });

    // --- Handlers ---
    const handlePaid = () => {
        if (!window.confirm("Are you sure you want to mark this refund as paid?")) return;
        paidMutation.mutate({});
    };

    const handleRefill = () => {
        if (!window.confirm("Are you sure you want to mark this refund as requiring refill?")) return;
        refillMutation.mutate({});
    };

    const handleAccepted = () => {
        if (!window.confirm("Are you sure you want to accept this refund?")) return;
        acceptedMutation.mutate({});
    };

    const handleReject = () => {
        rejectMutation.mutate({ rejectionMessage: rejectionMessage || undefined });
    };

    const handleUpdate = (updatedData: Partial<RefundWithDetails>, files?: { [key: string]: File }) => {
        editRefundMutation.mutate({ updatedData, files });
    };

    // --- Image Modal Handlers ---
    const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
    const closeImage = () => setSelectedImage(null);
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) closeImage();
    };

    // --- Render Logic ---
    if (!isOpen) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full h-96 flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full p-6 text-center">
                    <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
                    <p className="text-gray-700 mb-6">Could not load refund details.</p>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
        );
    }

    const screenshots = [
        { url: data.deliveredSS, label: 'Delivered Screenshot' },
        { url: data.reviewSS, label: 'Review Screenshot' },
        { url: data.sellerFeedbackSS, label: 'Seller Feedback Screenshot' },
        { url: data.returnWindowSS, label: 'Return Window Screenshot' }
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
                            {data.status === 'rejected' && (
                                <span className="text-red-600 font-bold">[REJECTED]</span>
                            )}
                            {data.status === 'payment_done' && (
                                <span className="text-green-600 font-bold">[PAID]</span>
                            ) || data.status === "accepted" && (
                                <span className="text-green-600 font-bold">[Accepted]</span>
                            )}
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
                        {data.status === 'rejected' && data.rejectionMessage && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
                                <p className="text-red-700">{data.rejectionMessage}</p>
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                                    <Package className="w-5 h-5 mr-2" />
                                    Refund Information
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {
                                        data.upiId && (
                                            <p><span className="font-medium">UPI ID:</span> {data?.upiId ?? "N/A"}</p>
                                        )}

                                    {data.bankInfo && (
                                        <>
                                            <p><span className="font-medium">Acount Number:</span> {data.bankInfo?.accountNumber ?? "N/A"}</p>
                                            <p><span className="font-medium">IFSC Code:</span> {data.bankInfo?.ifscCode ?? "N/A"}</p>
                                        </>
                                    )
                                    }
                                    <p><span className="font-medium">Review Link:</span> <a href={data.reviewLink ?? "https://na.com"} target="_blank" className="text-blue-600 underline">{data?.reviewLink ?? "N/A"}</a></p>
                                    <p><span className="font-medium">Refund form Submitted on:</span> {format(new Date(data.createdAt), "dd MMM yyyy")}</p>
                                    <p><span className="font-medium">Return Window Closed:</span> {data?.isReturnWindowClosed ? "Yes" : "No"}</p>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl">
                                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Reviewer Information
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Reviewer Name: </span>{data.order.name}</p>
                                    <p><span className="font-medium">Reviewer Email: </span>{data.order.email}</p>
                                    <p><span className="font-medium">Reviewer Phone: </span>{data.order.phone}</p>
                                </div>
                            </div>
                        </div>


                        <div className="w-full mb-8">
                            <div className="bg-pink-50 w-full p-6 rounded-2xl shadow-sm border border-pink-100">
                                <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                                    <Package className="w-5 h-5 mr-2" />
                                    Order Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <p><span className="font-medium text-gray-800">Product Name:</span> {data.order.product.name ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Product Code:</span> {data.order.product.productCode ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Brand Name:</span> {data.order.product.brand ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Brand Code:</span> {data.order.product.brandCode ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Platform:</span> {data.order.product.productPlatform ?? "N/A"}</p>
                                    <p><span className="font-medium">Product Link:</span> <a href={data.order.product.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.order.product.productLink ?? "N/A"}</a></p>
                                    <p><span className="font-medium text-gray-800">Deal Type:</span> {data.order.dealType ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Rating / Review:</span> {data.order.ratingOrReview ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Replacement Order:</span> {data.order.isReplacement ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Order Amount:</span> {data.order.orderAmount ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Order Number:</span> {data.order.orderNumber ?? "N/A"}</p>
                                    {data.order.isReplacement == 'yes' && <p><span className="font-medium text-gray-800">Old Order Number:</span> {data.order.oldOrderNumber ?? "N/A"}</p>}
                                    <p><span className="font-medium text-gray-800">Less Price:</span> {data.order.lessPrice ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Exchange Product:</span> {data.order.exchangeProduct ?? "N/A"}</p>
                                    <p><span className="font-medium text-gray-800">Refund Amount:</span> {data.order.orderAmount - data.order.lessPrice}</p>
                                    <p><span className="font-medium text-gray-800">Mediator Name:</span> {data.order.mediator?.nickName ?? "N/A"}</p>
                                    {/* <p><span className="font-medium text-gray-800">Refund Note :</span> {data.note ?? "N/A"}</p> */}
                                    {/* <p><span className="font-medium text-gray-800">Order Note :</span> {data.order.note ?? "N/A"}</p> */}
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
                                    <div key={index} className="relative group">
                                        <p className="text-sm font-medium text-gray-700 mb-2">{screenshot.label}</p>
                                        <div
                                            className="relative cursor-pointer transform transition-transform duration-200 group-hover:scale-105"
                                            onClick={() => openImage(screenshot.url as string)}
                                        >
                                            <img
                                                src={screenshot.url}
                                                alt={screenshot.label}
                                                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-opacity rounded-lg flex items-center justify-center">
                                                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            Click to enlarge
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {screenshots.length === 0 && (
                                <p className="text-gray-500 text-center py-4">No screenshots available</p>
                            )}
                        </div>
                    </div>



                    {/* Modal Footer with new buttons */}

                    {/* Modal Footer with new buttons */}
                    <div className="flex flex-col gap-3 md:flex-row justify-between md:justify-end items-stretch md:items-center p-4 md:p-6 border-t border-gray-200 w-full">

                        {/* Mobile: Grid layout for small screens */}
                        <div className="grid grid-cols-3 gap-2 w-full md:hidden">


                            {data.status !== 'accepted' && (
                                <Button onClick={handleAccepted} isLoading={acceptedMutation.isPending} className="w-full justify-center">
                                    <FileCheck className="w-4 h-4 mr-2" />
                                    Accept
                                </Button>
                            )}

                            {data.status !== 'rejected' && (
                                <Button
                                    variant="danger"
                                    onClick={() => setShowRejectModal(true)}
                                    isLoading={rejectMutation.isPending}
                                    className="w-full justify-center"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            )}

                            {data.status !== 'payment_done' && <Button onClick={handlePaid} isLoading={paidMutation.isPending} className="w-full justify-center bg-green-600 hover:bg-green-700">
                                <Check className="w-4 h-4 mr-2" />
                                Paid
                            </Button>}
                            <Button variant="outline" onClick={onClose} className="w-full justify-center">
                                Close
                            </Button>
                            <Button onClick={handleRefill} isLoading={refillMutation.isPending} className="w-full justify-center bg-yellow-600 hover:bg-yellow-700">
                                <ClipboardListIcon className="w-4 h-4 mr-2" />
                                Refill
                            </Button>


                            {data.status !== 'payment_done' && data.upiId && data.order.orderNumber && data.order.orderAmount && (
                                <a
                                    href={`upi://pay?pa=${encodeURIComponent(data.upiId)}&am=${encodeURIComponent(((data?.order?.orderAmount ?? 0) - (data?.order?.lessPrice ?? 0)))}&cu=INR&tn=${encodeURIComponent(`OrderNumber: ${data?.order?.orderNumber ?? 'N/A'}`)}`}
                                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded w-full"
                                >
                                    <IndianRupee className="w-4 h-4 mr-2" />
                                    Pay
                                </a>
                            )}


                            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} className="w-full ">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>

                        </div>

                        {/* Desktop: Flex layout for larger screens */}
                        <div className="hidden md:flex flex-wrap gap-2 justify-end items-center">


                            {data.status !== 'accepted' && (
                                <Button onClick={handleAccepted} isLoading={acceptedMutation.isPending} className="flex-shrink-0">
                                    <FileCheck className="w-4 h-4 mr-2" />
                                    Accept
                                </Button>
                            )}

                            {data.status !== 'rejected' && (
                                <Button
                                    variant="danger"
                                    onClick={() => setShowRejectModal(true)}
                                    isLoading={rejectMutation.isPending}
                                    className="flex-shrink-0"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            )}

                            {data.status !== 'payment_done' && <Button onClick={handlePaid} isLoading={paidMutation.isPending} className="flex-shrink-0 bg-green-600 hover:bg-green-700">
                                <Check className="w-4 h-4 mr-2" />
                                Paid
                            </Button>}
                            <Button onClick={handleRefill} isLoading={refillMutation.isPending} className="flex-shrink-0 bg-yellow-600 hover:bg-yellow-700">
                                <ClipboardListIcon className="w-4 h-4 mr-2" />
                                Refill
                            </Button>

                            {data.status !== 'payment_done' && data.upiId && data.order.orderNumber && data.order.orderAmount && (
                                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex-shrink-0">
                                    <IndianRupee className="w-4 h-4 mr-2" />

                                    <a
                                        href={`upi://pay?pa=${encodeURIComponent(data.upiId)}&am=${encodeURIComponent(((data?.order?.orderAmount ?? 0) - (data?.order?.lessPrice ?? 0)))}&cu=INR&tn=${encodeURIComponent(`OrderNumber: ${data?.order?.orderNumber ?? 'N/A'}`)}`}
                                    >
                                        Pay
                                    </a>
                                </Button>
                            )}

                            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} className="flex-shrink-0">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>

                        </div>


                    </div>
                    {/* </div> */}
                    {/* </div> */}
                </div >





            </div >

            {/* Rejection Reason Modal */}
            {showRejectModal && (
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
                                Are you sure you want to reject Refund <strong>#{data.order.orderNumber}</strong>?
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
                                    isLoading={rejectMutation.isPending}
                                    className="w-full sm:w-auto"
                                >
                                    Confirm Reject
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {/* Edit Modal */}
            {/* {isEditModalOpen && (
        // { onClose, data, onSave, isSubmitting }
        <EditRefundModal setData={setData} data={data} onClose={() => setIsEditModalOpen(false)} onUpdate={handleUpdateRefund} />
      )
      } */}

            {isEditModalOpen && (
                <EditRefundModal
                    onClose={() => setIsEditModalOpen(false)}
                    data={data}
                    onSave={handleUpdate} // Pass the mutation's mutate function
                    isSubmitting={editRefundMutation.isPending} // Pass the mutation's pending state
                />
            )}

            {/* Image Lightbox Modal - Higher z-index */}
            {
                selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
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
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
                                <button
                                    onClick={() => window.open(selectedImage, '_blank')}
                                    className="text-sm hover:underline"
                                >
                                    Open image in new tab
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default RefundModal;