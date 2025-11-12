// components/OrderCard.tsx
import { Eye } from "lucide-react";
import Button from '../UI/Button';
import { format } from "date-fns";
import type { OrderWithDetails } from "@/types/orders.ts";
import { useNavigate } from "react-router-dom";

interface OrderCardProps {
  order: OrderWithDetails;
  onReview: (order: OrderWithDetails) => void;
  getStatusInfo: (status: string) => { label: string; color: string };
}

function OrderCard({ order, onReview, getStatusInfo }: OrderCardProps) {
  const statusInfo = getStatusInfo(order.orderStatus);

  // Function to generate a subtle background color based on order status
  const getCardColor = (status: string) => {
    const colorMap = {
      pending: 'bg-amber-50 border-amber-200 ',
      refund_placed: 'bg-green-50 border-green-200',
      rejected: 'bg-red-50 border-red-200',
      accepted: 'bg-blue-50 border-green-200',
      payment_done: 'bg-emerald-50 border-emerald-200'
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-50 border-gray-200';
  };
  const navigate = useNavigate();

  const handleViewRefund= ()=>{
    navigate('/user/refunds', {state:{orderNumber:order.orderNumber}});
  }
  const handleFillRefund= ()=>{
    navigate('/refund', {state:{orderNumber:order.orderNumber}});
  }

  return (
    <div onClick={() => onReview(order)} className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md hover:cursor-pointer ${getCardColor(order.orderStatus)}`}>
      {/* Compact Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {order.orderNumber}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} shrink-0`}>
              {statusInfo.label}
            </span>
            {statusInfo.label === 'Rejected' &&
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs shrink-0`}>
                Message: {order.rejectionMessage}
              </span>

            }
          </div>
          <p className="text-xs text-gray-500">
            {format(order.createdAt, "dd MMM yyyy, HH:mm")}
          </p>
        </div>
        <div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onReview(order)}
            className="shrink-0 ml-2"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>

          {(order.orderStatus === 'accepted' || order.orderStatus === 'pending') &&
            <Button
              size="sm"
              onClick={handleFillRefund}
              className="shrink-0 ml-2"
            >
              Fill Refund
            </Button>
          }

          {(order.orderStatus === 'refund_placed' || order.orderStatus === 'payment_done') &&

            <Button
              size="sm"
              onClick={handleViewRefund}
              className="shrink-0 ml-2"
            >
              View Refund
            </Button>

          }
        </div>
      </div>

      {/* Compact Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Brand
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={order.product?.brand}>
            {order.product?.brand ?? "N/A"}
          </p>
        </div>
        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Product
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={order.product?.name}>
            {order.product?.name ?? "N/A"}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Reviewer Name
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={order.name}>
            {order.name}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Platform
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={order.product?.productPlatform}>
            {order.product?.productPlatform ?? "N/A"}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Mediator
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={order.mediator?.nickName}>
            {order.mediator?.nickName || 'N/A'}
          </p>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 border-opacity-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            ₹{order.orderAmount}
          </span>
        </div>


      </div>
    </div>
  );
}

export default OrderCard;