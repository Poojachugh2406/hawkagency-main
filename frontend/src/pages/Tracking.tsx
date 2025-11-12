import React, { useState, useEffect } from 'react';
import {  useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Search,
  Package,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  IndianRupee,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { apiGet } from '@/utils/api';

interface Product {
  _id: string;
  productPlatform: string;
  productSlots: number;
  productLink: string;
  brandCode: string;
  productCode: string;
  brand: string;
  name: string;
}

interface Mediator {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface timeLine {
  orderSubmitted: boolean;
  refundSubmitted: boolean;
  status?: string;
}

interface TrackingData {
  product: Product;
  mediator: Mediator;
  orderAmount: number;
  lessPrice: number;
  orderPlacedOn: string;
  createdAt: string;
  orderNumber: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  lastUpdated: string;
  timeLine: timeLine;
  upiId?: string;
}

const TrackOrderPage: React.FC = () => {
  // const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');


  useEffect(() => {
    if (location.state?.orderNumber) {
      setOrderNumber(location.state.orderNumber);
      fetchTrackingData(location.state.orderNumber);
    }
  }, [location.state]);

  



  const fetchTrackingData = async (orderNum: string) => {
    if (!orderNum.trim()) {
      toast.error('Please enter an order number');
      return;
    }
    setIsLoading(true);
    try {
      const response: any = await apiGet(`/track/${orderNum.toUpperCase()}`);

      if (response.success && response.data) {
        setTrackingData(response.data);
        toast.success('Order found successfully!');
      } else {
        throw new Error(response.message || 'Order not found');
      }
    } catch (error: any) {
      console.error('Tracking error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch order details';
      toast.error(errorMessage);
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      setOrderNumber(orderNumber);
      fetchTrackingData(orderNumber);
    }
  }, [orderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackingData(orderNumber);
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              
            </Button>
            <h1 className="text-4xl font-bold text-gray-900">Track Your Order</h1>
            <div className="w-24"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your order number to track the status and get real-time updates
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20 mb-10">
          <form onSubmit={handleSearch} className="space-y-6 w-full">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Track Order</h2>
            </div>

            {/* Input + Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-full sm:flex-1">
                <Input
                  label="Order Number"
                  placeholder="Enter your order number (e.g., OD123456)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!orderNumber.trim() || isLoading}
                className="sm:w-auto w-full h-[44px]"
              >
                {isLoading ? 'Searching...' : 'Track Order'}
              </Button>
            </div>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-8">
            {/* Order Status Overview */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Status</h2>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getStatusColor(trackingData.status)}`}>
                  {getStatusIcon(trackingData.status)}
                  <span className="font-semibold capitalize">{trackingData.status}</span>
                </div>
              </div>

              {/* Timeline */}
              {/* <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Timeline</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      trackingData.timeLine.orderSubmitted ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {trackingData.timeLine.orderSubmitted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <ClockIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Order Submitted</p>
                      <p className="text-sm text-gray-600">{formatDate(trackingData.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex-1 h-1 bg-gray-200 mx-4"></div>

                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      trackingData.timeLine.refundSubmitted ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {trackingData.timeLine.refundSubmitted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <ClockIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Refund {trackingData.timeLine.refundSubmitted ? 'Submitted' : 'Pending'}</p>
                      {trackingData.timeLine.refundSubmitted && trackingData.timeLine.status && (
                        <p className="text-sm text-gray-600 capitalize">Status: {trackingData.timeLine.status}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div> */}


              {/* Tracking Results */}
              {trackingData && !isLoading && (
                <div className="space-y-6 sm:space-y-8">
                  {/* Timeline Card */}
                  <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/20">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-6">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Order Progress</h2>
                    </div>

                    {/* Vertical Progress Bar for Mobile, Horizontal for Desktop */}
                    <div className="relative">
                      {/* Horizontal Progress Bar for Desktop */}
                      <div className="hidden sm:block relative mb-8 bg-red-600  ">
                        <div
                          className="absolute top-5 h-1 bg-gray-200 transform -translate-y-1/2 -z-10"
                          style={{
                            left: '50px',
                            right: '50px'
                          }}
                        ></div>
                        <div
                          className="absolute top-5 h-1 bg-green-500 transform -translate-y-1/2 -z-10 transition-all duration-500"
                          style={{
                            left: '50px',
                            width: `${(() => {
                              const steps = [
                                trackingData.timeLine.orderSubmitted,
                                trackingData.timeLine.refundSubmitted,
                                trackingData.timeLine.status
                              ];
                              const completedSteps = steps.filter(step => step).length;

                              if (completedSteps === 0) return '0%';

                              // Calculate the width based on completed steps
                              const totalWidth = 'calc(100% - 100px)'; // 100% minus left and right padding
                              const stepWidth = 100 / 3; // 3 gaps between 4 steps

                              return `calc(${totalWidth} * ${completedSteps === 4 ? 1 : (completedSteps - 1) * stepWidth / 100 + stepWidth / 200})`;
                            })()}`
                          }}
                        ></div>
                      </div>

                      {/* Vertical Progress Bar for Mobile */}
                      <div className="sm:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
                      <div
                        className="sm:hidden absolute left-4 top-0 w-0.5 bg-green-500 -z-10 transition-all duration-500"
                        style={{
                          height: `${(() => {
                            const steps = [
                              trackingData.timeLine.orderSubmitted,
                              trackingData.timeLine.refundSubmitted,
                              trackingData.timeLine.status
                            ];
                            const completedSteps = steps.filter(step => step).length;
                            return (completedSteps / 4) * 100;
                          })()}%`
                        }}
                      ></div>

                      {/* Progress steps - Vertical on mobile, Horizontal on desktop */}
                      <div className="flex flex-col sm:flex-row sm:justify-between relative space-y-6 sm:space-y-0">
                        {/* Order Submitted Step */}
                        <div className="flex items-start gap-4 sm:flex-col sm:items-center">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-xs sm:text-base flex-shrink-0 ${trackingData.timeLine.orderSubmitted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {trackingData.timeLine.orderSubmitted ? (
                              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                            ) : (
                              <span>1</span>
                            )}
                          </div>
                          <div className="flex-1 sm:flex-none sm:text-center">
                            <span className="text-sm font-medium text-gray-700 block">Order Submitted</span>
                            {trackingData.timeLine.orderSubmitted && (
                              <span className="text-xs text-green-600 mt-1 block">Completed</span>
                            )}
                          </div>
                        </div>

                        {/* Refund Form Step */}
                        <div className="flex items-start gap-4 sm:flex-col sm:items-center">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-xs sm:text-base flex-shrink-0 ${trackingData.timeLine.refundSubmitted
                              ? 'bg-green-500 border-green-500 text-white'
                              : trackingData.timeLine.orderSubmitted
                                ? 'bg-white border-gray-300 text-gray-600'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {trackingData.timeLine.refundSubmitted ? (
                              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                            ) : (
                              <span>2</span>
                            )}
                          </div>
                          <div className="flex-1 sm:flex-none sm:text-center">
                            <span className="text-sm font-medium text-gray-700 block">Refund Form</span>
                            {trackingData.timeLine.refundSubmitted ? (
                              <span className="text-xs text-green-600 mt-1 block">Completed</span>
                            ) : trackingData.timeLine.orderSubmitted ? (
                              <span className="text-xs text-blue-600 mt-1 block">In Progress</span>
                            ) : (
                              <span className="text-xs text-gray-500 mt-1 block">Pending</span>
                            )}
                          </div>
                        </div>

                        {/* Admin Review Step */}
                        <div className="flex items-start gap-4 sm:flex-col sm:items-center">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-xs sm:text-base flex-shrink-0 ${trackingData.timeLine.status
                              ? 'bg-green-500 border-green-500 text-white'
                              : trackingData.timeLine.refundSubmitted
                                ? 'bg-white border-gray-300 text-gray-600'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {trackingData.timeLine.status ? (
                              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                            ) : (
                              <span>3</span>
                            )}
                          </div>
                          <div className="flex-1 sm:flex-none sm:text-center">
                            <span className="text-sm font-medium text-gray-700 block">Admin Review</span>
                            {trackingData.timeLine.status === 'accepted' ? (
                              <span className="text-xs text-green-600 mt-1 block">Completed</span>
                            ) : trackingData.timeLine.refundSubmitted ? (
                              <span className="text-xs text-blue-600 mt-1 block">Pending</span>
                            ) : (
                              <span className="text-xs text-gray-500 mt-1 block">Not Started</span>
                            )}
                          </div>
                        </div>

                        {/* Payment Processed Step */}
                        <div className="flex items-start gap-4 sm:flex-col sm:items-center">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-xs sm:text-base flex-shrink-0 ${trackingData.timeLine.status === 'payment_done'
                              ? 'bg-green-500 border-green-500 text-white'
                              : trackingData.timeLine.refundSubmitted
                                ? 'bg-white border-gray-300 text-gray-600'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            {trackingData.timeLine.status === 'payment_done' ? (
                              <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                            ) : (
                              <span>4</span>
                            )}
                          </div>
                          <div className="flex-1 sm:flex-none sm:text-center">
                            <span className="text-sm font-medium text-gray-700 block">Payment Processed</span>
                            {trackingData.timeLine.status === 'payment_done' ? (
                              <span className="text-xs text-green-600 mt-1 block">Completed</span>
                            ) : trackingData.timeLine.refundSubmitted ? (
                              <span className="text-xs text-blue-600 mt-1 block">Processing</span>
                            ) : (
                              <span className="text-xs text-gray-500 mt-1 block">Not Started</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Information */}
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Product Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Product Name</label>
                    <p className="text-lg font-semibold text-gray-900">{trackingData.product.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Product Code</label>
                      <p className="text-lg text-gray-900">{trackingData.product.productCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Brand Code</label>
                      <p className="text-lg text-gray-900">{trackingData.product.brandCode}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Platform</label>
                    <p className="text-lg text-gray-900">{trackingData.product.productPlatform}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Available Slots</label>
                    <p className="text-lg text-gray-900">{trackingData.product.productSlots}</p>
                  </div>

                  {trackingData.product.productLink && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Product Link</label>
                      <a
                        href={trackingData.product.productLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>View Product</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer & Order Details */}
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Customer & Order Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="text-lg font-semibold text-gray-900">{trackingData.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {trackingData.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {trackingData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Order Number</label>
                      <p className="text-lg font-semibold text-gray-900">{trackingData.orderNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Order Date</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(trackingData.orderPlacedOn)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Order Amount</label>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        {trackingData.orderAmount}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Less Price</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        {trackingData.lessPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mediator Information */}
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Mediator Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mediator Name</label>
                    <p className="text-lg font-semibold text-gray-900">{trackingData.mediator.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {trackingData.mediator.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-lg text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {trackingData.mediator.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Refund Information */}
              <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Refund Information</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Refund Status</label>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(trackingData.timeLine.status || 'pending')}
                      <span className="text-lg font-semibold capitalize">
                        {trackingData.timeLine.refundSubmitted ? (trackingData.timeLine.status || 'Processing') : 'Not Submitted'}
                      </span>
                    </div>
                  </div>

                  {trackingData.timeLine.refundSubmitted && trackingData.upiId && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">UPI ID for Refund</label>
                      <p className="text-lg text-gray-900">{trackingData.upiId}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Order Created</label>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(trackingData.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Updated</label>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatDateTime(trackingData.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!trackingData && !isLoading && orderNumber && (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Order Found</h3>
            <p className="text-gray-500">Please check your order number and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;