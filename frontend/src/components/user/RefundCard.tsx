// src/components/user/RefundCard.tsx
import type { RefundWithDetails } from "@/types/refunds";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import Button from "../UI/Button";

type RefundCardProps = {
  item: RefundWithDetails;
  onReview: (item: RefundWithDetails) => void;
};

const RefundCard: React.FC<RefundCardProps> = ({ item, onReview }) => {
  // Status configuration
  const getStatusInfo = (status: string) => {
    const statusInfo = {
      pending: { 
        label: 'Pending', 
        color: 'bg-yellow-100 text-yellow-800',
        cardColor: 'bg-amber-50 border-amber-200'
      },
      accepted: { 
        label: 'Accepted', 
        color: 'bg-blue-100 text-blue-800',
        cardColor: 'bg-blue-50 border-blue-200'
      },
      rejected: { 
        label: 'Rejected', 
        color: 'bg-red-100 text-red-800',
        cardColor: 'bg-red-50 border-red-200'
      },
      payment_done: { 
        label: 'Payment Done', 
        color: 'bg-green-100 text-green-800',
        cardColor: 'bg-emerald-50 border-emerald-200'
      }
    };
    
    return statusInfo[status as keyof typeof statusInfo] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-800',
      cardColor: 'bg-gray-50 border-gray-200'
    };
  };

  const statusInfo = getStatusInfo(item.status);

  return (
    <div onClick={() => onReview(item)} className={`hover:cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${statusInfo.cardColor}`}>
      {/* Compact Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {item.order.orderNumber}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color} shrink-0`}>
              {statusInfo.label}
            </span>
            {item.status==='rejected' && 
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs shrink-0`}>
              {item.rejectionMessage}
            </span>
            
            }
          </div>
          <p className="text-xs text-gray-500">
            {format(item.createdAt, "dd MMM yyyy, HH:mm")}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReview(item)}
          className="shrink-0 ml-2"
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
      </div>

      {/* Compact Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Product
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={item.order.product?.name}>
            {item.order.product?.name ?? "N/A"}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Reviewer
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={item.order.name}>
            {item.order.name}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Platform
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={item.order.product?.productPlatform}>
            {item.order.product?.productPlatform ?? "N/A"}
          </p>
        </div>

        <div className="min-w-0">
          <label className="text-xs font-medium text-gray-500 block truncate">
            Mediator
          </label>
          <p className="text-sm text-gray-900 font-medium truncate mt-0.5" title={item.order.mediator?.nickName}>
            {item.order.mediator?.nickName || 'N/A'}
          </p>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 border-opacity-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            ₹{item.order.orderAmount}
          </span>
        </div>
        
        
      </div>
    </div>
  );
};

export default RefundCard;