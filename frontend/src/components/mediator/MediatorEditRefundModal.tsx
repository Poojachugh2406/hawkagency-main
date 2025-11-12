



import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  X,
  Link,
  CreditCard,
  Banknote,
  Home,
  FileText,
} from 'lucide-react';
import Button from '../UI/Button';
import { useForm } from 'react-hook-form';
import Input from '../UI/Input';
import RadioGroup from '../UI/RadioGroup';
import FileUpload from '../UI/FileUpload';
import type { RefundWithDetails } from '@/types/refunds';
import { refundsAPI } from '@/utils/api';

type EditRefundData = {
  reviewLink?: string;
  paymentMethod: 'upi' | 'bank';
  upiId?: string;
  accountNumber?: string;
  ifscCode?: string;
  isReturnWindowClosed: 'yes' | 'no';
  status: 'accepted' | 'rejected' | 'pending' | 'payment_done' | 'refill';
  rejectionMessage?: string;
  note?: string;
};

interface EditRefundModalProps {
  onClose: () => void;
  data: RefundWithDetails;
  onUpdate: (updatedOrder: RefundWithDetails) => void;
  setData:React.Dispatch<React.SetStateAction<RefundWithDetails|null>>;
}
const MediatorEditRefundModal: React.FC<EditRefundModalProps> = ({ onClose, data, onUpdate , setData}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveredSS, setDeliveredSS] = useState<File | null>(null);
  const [reviewSS, setReviewSS] = useState<File | null>(null);
  const [sellerFeedbackSS, setSellerFeedbackSS] = useState<File | null>(null);
  const [returnWindowSS, setReturnWindowSS] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<EditRefundData>({
    defaultValues: {
      reviewLink: data.reviewLink,
      paymentMethod: data.bankInfo ? 'bank' : 'upi',
      upiId: data.upiId ?? "",
      accountNumber: data.bankInfo?.accountNumber ?? "",
      ifscCode: data.bankInfo?.ifscCode ?? "",
      isReturnWindowClosed: data.isReturnWindowClosed ? 'yes' : 'no',
      status: data.status,
      rejectionMessage: data.rejectionMessage ?? "",
      note: data.note ?? "",
    }
  });

  const onSubmit = async (formData: EditRefundData) => {
    const updatedRefund: any = {};

    // Basic fields
    if (formData.reviewLink !== data.reviewLink) {
      updatedRefund.reviewLink = formData.reviewLink;
    }

    // Payment info
    if (formData.paymentMethod === 'bank') {
      updatedRefund.bankInfo = {
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode
      };
    } else {
      updatedRefund.upiId = formData.upiId;
    }

    // Return window status
    updatedRefund.isReturnWindowClosed = formData.isReturnWindowClosed === 'yes';

    setIsSubmitting(true);
    try {
      // Create FormData for file uploads
      const files:any = {}

      if (deliveredSS) files.deliveredSS= deliveredSS;
      if (reviewSS) files.reviewSS=reviewSS;
      if (sellerFeedbackSS) files.sellerFeedbackSS=sellerFeedbackSS;
      if (returnWindowSS) files.returnWindowSS=returnWindowSS;
 
      const response: any = await refundsAPI.updateRefund(data._id,updatedRefund,files);
      toast.success('Refund data updated successfully.');
      onUpdate(response.data);
      setData(response.data);
    } catch (error: any) {
      console.error("Refund update error:", error);
      toast.error(error.message || "Failed to update refund");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };



  const paymentMethod = watch('paymentMethod');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Refund</h2>
            <p className="text-gray-600 text-sm mt-1">Refund #{data.order.orderNumber}</p>
            
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Information Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <Input
                  label="Review Link"
                  icon={<Link className="w-4 h-4" />}
                  placeholder="https://example.com/review"
                  register={register("reviewLink")}
                  error={errors.reviewLink?.message}
                />
              </div>
            </section>

            {/* Payment Information Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Payment Information
              </h3>

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
                  placeholder="yourname@upi"
                  required
                  register={register('upiId', {
                    required: 'UPI ID is required for UPI payments',
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
            </section>

            {/* Return Information Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Return Information
              </h3>

              <RadioGroup
                label="Is Return Window Closed?"
                options={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ]}
                register={register('isReturnWindowClosed', {
                  required: 'This selection is required',
                })}
                error={errors.isReturnWindowClosed?.message}
              />
            </section>

            {/* Screenshots Section */}
            <section className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Update Screenshots
              </h3>
              <p className="text-sm text-gray-600">
                Upload new files only if you want to replace existing ones
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                  label="Delivered Screenshot"
                  accept="image/*,.pdf"
                  value={deliveredSS}
                  onChange={setDeliveredSS}
                />
                <FileUpload
                  label="Review Screenshot"
                  accept="image/*,.pdf"
                  value={reviewSS}
                  onChange={setReviewSS}
                />
                <FileUpload
                  label="Seller Feedback Screenshot"
                  accept="image/*,.pdf"
                  value={sellerFeedbackSS}
                  onChange={setSellerFeedbackSS}
                />
                <FileUpload
                  label="Return Window Screenshot"
                  accept="image/*,.pdf"
                  value={returnWindowSS}
                  onChange={setReturnWindowSS}
                />
              </div>

              {/* Display existing files info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Current Files:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {data.deliveredSS && (
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Delivered Screenshot</span>
                    </div>
                  )}
                  {data.reviewSS && (
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Review Screenshot</span>
                    </div>
                  )}
                  {data.sellerFeedbackSS && (
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Seller Feedback</span>
                    </div>
                  )}
                  {data.returnWindowSS && (
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Return Window</span>
                    </div>
                  )}
                </div>  
              </div>
            </section>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="border-t border-gray-200 bg-white p-6 sticky bottom-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Updating..." : "Update Refund"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediatorEditRefundModal;