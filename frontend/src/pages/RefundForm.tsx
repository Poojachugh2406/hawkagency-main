import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {  format } from "date-fns";
import {
  ShoppingBag,
  Upload,
  ArrowLeft,
  Link,
  CreditCard,
  IndianRupee,
  CheckCircle, // Added for details
  Info, // Added for details
  Banknote, // Added for bank
  Home, // Added for IFSC
} from 'lucide-react';
import { apiPost, apiUpload } from '../utils/api';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Alert from '../components/UI/Alert';
import RadioGroup from '../components/UI/RadioGroup';
import FileUpload from '../components/UI/FileUpload';
import { useAuth } from '@/contexts/AuthContext';

// 1. Define the Order type based on your response fields
interface verifyOrder {
  order: string; // This is what you want to submit
  orderNumber:string;
  name: string;
  email: string;
  phone:string;
  productCode: string;
  brandCode: string;
  orderAmount: number;
  lessPrice: number;
  mediatorName: string;
  createdAt:Date;

}

// 2. Define the form data type
// This matches what react-hook-form will manage
type CreateRefundData = {
  orderNumber: string; // From the verification input
  reviewLink?: string;
  paymentMethod: 'upi' | 'bank';
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  isReturnWindowClosed: 'yes' | 'no';
};

// (Assuming your '@/types/refunds' import might be different, 
// we use the local definition for clarity in this component)

const RefundFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  
  // 3. Use the specific Order type
  const [verifiedOrder, setVerifiedOrder] = useState<verifyOrder | null>(null);
  
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [deliveredScreenshot, setDeliveredScreenshot] = useState<File | null>(
    null,
  );
  const { user: authUser, isAuthenticated, isLoading } = useAuth();
  const [reviewScreenshot, setReviewScreenshot] = useState<File | null>(null);
  const [sellerFeedbackScreenshot, setSellerFeedbackScreenshot] =
    useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CreateRefundData>({
    // 4. Set a default payment method
    defaultValues: {
      paymentMethod: 'upi',
    },
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && authUser) {
      setValue("upiId", authUser.upiId || "");
      setValue("accountNumber", authUser.accountNumber || "");
      setValue("ifscCode", authUser.accountIfsc || "");
    }
  }, [authUser, isAuthenticated, isLoading, setValue]);




  // 5. Watch for changes in paymentMethod and return window status
  const paymentMethod = watch('paymentMethod');
  const isReturnWindowClosed = watch('isReturnWindowClosed');

  // Commented out useEffect logic as you're using a manual verify button
  // useEffect(() => {
  //   const orderNumberFromState = location.state?.orderNumber;
  //   if (orderNumberFromState && !verificationAttempted.current) {
  //     verificationAttempted.current = true;
  //     setValue('orderNumber', orderNumberFromState);
  //     verifyOrder(orderNumberFromState);
  //   }
  // }, [location.state, setValue]);



  const verifyOrder = async (orderNumber: string) => {
    setIsVerifying(true);
    setVerificationError(null);
    setVerifiedOrder(null); // Reset on new verification

    try {
      const response: any = await apiPost('/refund/verify', { orderNumber });
      if (response.success && response.data) {
        // 6. Set the verifiedOrder state
        setVerifiedOrder(response.data);
        toast.success('Order verified successfully!');
      } else {
        throw new Error(response.message || 'Failed to verify order');
      }
    } catch (error: any) {
      console.error('Order verification error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to verify order';
      setVerificationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };


  useEffect(()=>{
    if(location.state && location.state.orderNumber){
      setValue('orderNumber' , location.state.orderNumber);
      verifyOrder(location.state.orderNumber);
    }
  },[location.state]);

  // 7. Modified onSubmit to send the exact payload you requested
  const onSubmit = async (data: CreateRefundData) => {
    if (!verifiedOrder) {
      toast.error('Please verify your order first');
      return;
    }
    if (!deliveredScreenshot || !reviewScreenshot || !sellerFeedbackScreenshot) {
      toast.error('Please upload required screenshots');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: any = {
        order: verifiedOrder.order, // Use orderId from verified order
        reviewLink: data.reviewLink,
        isReturnWindowClosed: data.isReturnWindowClosed,
      };
      
      if (data.paymentMethod === 'upi') {
        payload.upiId = data.upiId;
      } else if (data.paymentMethod === 'bank') {
        payload.bankInfo = {
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
        };
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      formData.append('deliveredSS', deliveredScreenshot);
      formData.append('reviewSS', reviewScreenshot);
      formData.append(
        'sellerFeedbackSS',
        sellerFeedbackScreenshot || new Blob(),
      );

      const response: any = await apiUpload('/refund/create-refund', formData);

      console.log('API Response:', response);

      if (response.success && response.data) {
        toast.success('Refund request submitted successfully!');
        navigate('/track', {
          state: { orderNumber: data.orderNumber }
        });
      } else {
        if (
          response.errors &&
          Array.isArray(response.errors) &&
          response.errors.length > 0
        ) {
          const firstError = response.errors[0];
          toast.error(firstError.msg || 'Validation failed');
        } else {
          throw new Error(response.message || 'Failed to submit refund request');
        }
      }
    } catch (error: any) {
      console.error('Refund submission error:', error);
      
      // Handle timeout errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        toast.error('Request timed out. Please check your internet connection and try again.');
        return;
      }
      
      // Handle duplicate refund errors
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        toast.error(errorData.message || 'A refund already exists for this order.');
        return;
      }
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (
          errorData.errors &&
          Array.isArray(errorData.errors) &&
          errorData.errors.length > 0
        ) {
          const firstError = errorData.errors[0];
          toast.error(firstError.msg || 'Validation failed');
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error(
            'Failed to submit refund request. Please try again.',
          );
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit refund request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
            
            </Button>
            <h1 className="text-4xl font-bold text-gray-900">Request Refund</h1>
            <div className="w-24"></div> {/* Spacer */}
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Verify your order and provide the required details to process your
            refund request.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
          
          {/* Order Verification Section - Always visible until verified */}
          {!verifiedOrder && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Step 1: Order Verification
                </h2>
              </div>

              <div className="space-y-6">
                <Input
                  label="Order Number"
                  icon={<CreditCard className="w-4 h-4" />}
                  placeholder="e.g., OD1234567890123456"
                  required
                  // 10. Register the orderNumber field
                  register={register('orderNumber', {
                    required: 'Order number is required',
                  })}
                  error={errors.orderNumber?.message}
                />

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      const currentOrderNumber = watch('orderNumber');
                      if (currentOrderNumber) {
                        verifyOrder(currentOrderNumber);
                      } else {
                        toast.error('Please enter an order number');
                      }
                    }}
                    isLoading={isVerifying}
                    disabled={!watch('orderNumber') || isVerifying}
                    className="w-full py-3"
                  >
                    {isVerifying ? 'Verifying Order...' : 'Verify Order'}
                  </Button>
                </div>

                {verificationError && (
                  <Alert
                    type="error"
                    message={verificationError}
                    className="mt-4"
                  />
                )}
              </div>
            </div>
          )}

          {/* 11. Show this section ONLY if order is verified */}
          {verifiedOrder && !verificationError && (
            <>
              {/* --- Verified Order Details Section --- */}
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Order Verified
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium text-gray-800">{verifiedOrder.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Order Number:</span>
                    <span className="font-medium text-gray-800">{verifiedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-medium text-gray-800">{verifiedOrder.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Mediator:</span>
                    <span className="font-medium text-gray-800">{verifiedOrder.mediatorName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Phone:</span>
                    <span className="font-medium text-gray-800">{verifiedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Order Amount:</span>
                    <span className="font-medium text-gray-800">₹{verifiedOrder.orderAmount}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Product Code:</span>
                    <span className="font-medium text-gray-800">{verifiedOrder.productCode}</span>
                  </div>
                   <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Less Price:</span>
                    <span className="font-medium text-gray-800">₹{verifiedOrder.lessPrice}</span>
                  </div>
                  
                   <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Brand Code:</span>
                    <span className="font-medium text-gray-800">{verifiedOrder.brandCode}</span>
                  </div>
                   <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Order Form Submitted on:</span>
                    <span className="font-medium text-gray-800">{format(verifiedOrder.createdAt, "dd MMM yyyy")}</span>
                  </div>
                   
                </div>
              </div>

              {/* --- Refund Form Section --- */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <Input
                  label="Review Link"
                  icon={<Link className="w-4 h-4" />}
                  placeholder="Paste your review link here (optional)"
                  type = "url"
                  register={register('reviewLink',{required:"Review Link is Required"})}
                  required
                />

                {/* --- Payment Information Section --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Step 2: Payment Information
                    </h2>
                  </div>

                  <RadioGroup
                    label="Payment Method"
                    options={[
                      { label: 'UPI', value: 'upi' },
                      { label: 'Bank Transfer', value: 'bank' },
                    ]}
                    register={register('paymentMethod', {
                      required: 'Please select a payment method',
                    })}
                    error={errors.paymentMethod?.message}
                  />

                  {paymentMethod === 'upi' && (
                    <Input
                      label="UPI ID"
                      icon={<CreditCard className="w-4 h-4" />}
                      placeholder="Enter your UPI ID"
                      required
                      register={register('upiId', {
                        required: 'UPI ID is required',
                      })}
                      error={errors.upiId?.message}
                      helperText="e.g., yourname@oksbi"
                    />
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Account Number"
                        icon={<Banknote className="w-4 h-4" />}
                        placeholder="Enter account number"
                        required
                        register={register('accountNumber', {
                          required: 'Account number is required',
                        })}
                        error={errors.accountNumber?.message}
                      />
                      <Input
                        label="IFSC Code"
                        icon={<Home className="w-4 h-4" />}
                        placeholder="Enter IFSC code"
                        required
                        register={register('ifscCode', {
                          required: 'IFSC code is required',
                        })}
                        error={errors.ifscCode?.message}
                      />
                    </div>
                  )}
                </div>
                
                {/* --- Return Window Section --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Info className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Step 3: Return Information
                    </h2>
                  </div>

                  <RadioGroup
                    label="Is the product return window closed?"
                    options={[
                      { label: 'Yes', value: 'yes' },
                      { label: 'No', value: 'no' },
                    ]}
                    register={register('isReturnWindowClosed', {
                      required: 'This selection is required',
                    })}
                    required
                    error={errors.isReturnWindowClosed?.message}
                  />
                  
                  {isReturnWindowClosed === 'no' && (
                    <Alert
                      type="info"
                      message="Please upload the return window screenshot (Delivered Screenshot) later when it's available."
                    />
                  )}
                </div>


                {/* --- Screenshot Uploads Section --- */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Upload className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Step 4: Required Screenshots
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FileUpload
                      label="Delivered Screenshot"
                      accept="image/*,.pdf"
                      value={deliveredScreenshot}
                      onChange={setDeliveredScreenshot}
                      required
                    />

                    <FileUpload
                      label="Review Screenshot"
                      accept="image/*,.pdf"
                      value={reviewScreenshot}
                      onChange={setReviewScreenshot}
                      required
                    />

                    <FileUpload
                      label="Seller Feedback Screenshot"
                      accept="image/*,.pdf"
                      value={sellerFeedbackScreenshot}
                      onChange={setSellerFeedbackScreenshot}
                      required
                    />
                  </div>
                </div>

                {/* --- Submit Section --- */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={
                      !deliveredScreenshot ||
                      !reviewScreenshot ||
                      isSubmitting ||
                      !verifiedOrder
                    }
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : 'Submit Refund Request'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundFormPage;