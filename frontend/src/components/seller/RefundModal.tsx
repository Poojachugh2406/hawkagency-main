



import { Image, Package, User, X,ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { apiGet } from "../../utils/api";
import type { RefundWithDetails } from "@/types/refunds";

const RefundModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  order: string;
  // data: RefundWithDetails | null;
}> = ({ isOpen, onClose, order }) => {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [data, setData] = useState<RefundWithDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await apiGet('refund/order/' + order);
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();

  }, [order]);

  if (!isOpen || !data) return null;


  // Function to open image in lightbox
  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  // Function to close lightbox
  const closeImage = () => {
    setSelectedImage(null);
  };

  // Close lightbox when clicking on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeImage();
    }
  };

  // Get all available screenshots
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
                      <p><span className="font-medium">UPI ID:</span> {data.upiId}</p>
                    )}

                  {data.bankInfo && (
                    <>
                      <p><span className="font-medium">Acount Number:</span> {data.bankInfo?.accountNumber}</p>
                      <p><span className="font-medium">IFSC Code:</span> {data.bankInfo?.ifscCode}</p>
                    </>
                  )
                  }

                  <p><span className="font-medium">Review Link:</span> <a href={data.reviewLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{data.reviewLink}</a></p>
                  <p><span className="font-medium">Refund form Submitted on:</span> {format(new Date(data.createdAt), "dd MMM yyyy")}</p>
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


        </div >
      </div >


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