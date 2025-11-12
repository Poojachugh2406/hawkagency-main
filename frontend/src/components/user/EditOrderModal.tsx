import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  Package,
  Star,
  ExternalLink
} from 'lucide-react';
import Button from '../UI/Button';
import type { OrderWithDetails, UpdateOrderData } from '@/types/orders';
import { useForm } from 'react-hook-form';
import Select from '../UI/Select';
import { apiGet, userAPI } from '@/utils/api';
import type { ActiveProduct } from '@/types/products';
import Input from '../UI/Input';
import RadioGroup from '../UI/RadioGroup';
import FileUpload from '../UI/FileUpload';

interface EditOrderModalProps {
  onClose: () => void;
  data: OrderWithDetails;
  onSave: (updatedData: Partial<UpdateOrderData>, orderId: string, files?: { orderSS?: File, priceBreakupSS?: File }) => Promise<void>;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ onClose, data, onSave }) => {
  const [products, setProducts] = useState<ActiveProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ActiveProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSS, setOrderSS] = useState<File | null>(null);
  const [priceBreakupSS, setPriceBreakupSS] = useState<File | null>(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: any = await userAPI.getAllActiveProducts();
        if (response.success) {
          setProducts(response.data);
          // Set initial selected product
          const initialProduct = response.data.find((p: ActiveProduct) => p._id === data.product?._id);
          if (initialProduct) {
            setSelectedProduct(initialProduct);
          }
        } else {
          toast.error("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateOrderData>({
    defaultValues: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      orderDate: data.orderDate ? new Date(data.orderDate).toISOString().split('T')[0] : '',
      orderAmount: data.orderAmount,
      lessPrice: data.lessPrice,
      product: data.product?._id,
      dealType: data.dealType,
      isReplacement: data.isReplacement,
      oldOrderNumber: data.oldOrderNumber || '',
      ratingOrReview: data.ratingOrReview,
      exchangeProduct: data.exchangeProduct || ''
    }
  });

  // console.log(data);

  // Watch form values
  const selectedProductId = watch("product");
  const isReplacement = watch("isReplacement");
  const dealType = watch("dealType");
  // const ratingOrReview = watch("ratingOrReview");

  useEffect(() => {
    if (selectedProductId && products.length > 0) {
      const product = products.find(p => p._id === selectedProductId);
      if (product) {
        setSelectedProduct(product);
        fetchSlots();
      }
    } else {
      setSelectedProduct(null);
    }
  }, [selectedProductId, products]);



  const productOptions = products?.map((product) => ({
    value: product?._id,
    label: `${product?.productCode} - ${product?.name}`,
  })) || [];
  // console.log(productOptions);


  const fetchSlots = async ()=>{
    try{
        const response :any = await apiGet('/product/slots/'+selectedProductId);
        if(response.success && response.data){
            // setAvailableSlots(response.data.slots);
            const options = response.data.slots.map((slot:any)=>{
                if(slot.slots>0) return {
                    value:slot.value,
                    label:`${slot.label} (available slots: ${slot.slots})`
                }
            }).filter(Boolean);
            setAvailableSlots(options);
           
        }
    }catch(error:any){
        console.log(error.response.data.message)
    }
}
  const onSubmit = async (formData: UpdateOrderData) => {
    if (!formData.product || !formData.name || !formData.email || !formData.phone || !formData.orderDate || !formData.orderAmount || !formData.lessPrice) {
      toast.error("Please fill all deatails");
      return;
    }
    const updatedOrder: any = {};
    if (formData.product !== data.product?._id) {
      updatedOrder.product = formData.product;
    }
    if (formData.name !== data.name) {
      updatedOrder.name = formData.name;
    }
    if (formData.email !== data.email) {
      updatedOrder.email = formData.email;
    }
    if (formData.phone !== data.phone) {
      updatedOrder.phone = formData.phone;
    }
    if (new Date(formData.orderDate).getTime() !== new Date(data.orderDate).getTime()) {
      console.log(formData.orderDate)
      console.log(data.orderDate)
      updatedOrder.orderDate = formData.orderDate;
    }
    if (formData.orderAmount !== data.orderAmount) {
      updatedOrder.orderAmount = formData.orderAmount;
    }
    if (formData.lessPrice !== data.lessPrice) {
      updatedOrder.lessPrice = formData.lessPrice;
    }
    if (formData.isReplacement !== data.isReplacement || formData.isReplacement === 'yes') {
      updatedOrder.isReplacement = formData.isReplacement;
      if (formData.isReplacement === 'yes') {
        updatedOrder.oldOrderNumber = formData.oldOrderNumber;
      }
    }
    if (formData.dealType !== data.dealType || formData.dealType === 'exchange') {
      updatedOrder.dealType = formData.dealType;
      if (formData.dealType === 'exchange') {
        updatedOrder.exchangeProduct = formData.exchangeProduct;
      }
    }

    if (formData.ratingOrReview !== data.ratingOrReview) {
      updatedOrder.ratingOrReview = formData.ratingOrReview;
    }

    setIsSubmitting(true);
    try {
      const files: any = {};
      if (orderSS) files.orderSS = orderSS;
      if (priceBreakupSS) files.priceBreakupSS = priceBreakupSS;


      await onSave(updatedOrder, data._id, files);
      console.log(updatedOrder);
      toast.success('Order updated successfully!');
      onClose();
    } catch (error: any) {
      console.error("Order update error:", error);
      toast.error(error.message || "Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductLinkClick = () => {
    if (selectedProduct?.productLink) {
      window.open(selectedProduct.productLink, '_blank');
    }
  };

  // const getSlotAvailabilityMessage = () => {
  //   if (!selectedProduct) return null;

  //   if (ratingOrReview === "rating") {
  //     const ratingSlots = selectedProduct.ratingSlots || 0;
  //     if (ratingSlots > 0) {
  //       return (
  //         <div className="flex items-center gap-2 text-green-600 text-sm">
  //           <span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
  //             <span className="text-white text-xs">✓</span>
  //           </span>
  //           Rating slots available: {ratingSlots}
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div className="flex items-center gap-2 text-red-600 text-sm">
  //           <span className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
  //             <span className="text-white text-xs">✕</span>
  //           </span>
  //           No rating slots available
  //         </div>
  //       );
  //     }
  //   } else if (ratingOrReview === "review") {
  //     const reviewSlots = selectedProduct.reviewSlots || 0;
  //     if (reviewSlots > 0) {
  //       return (
  //         <div className="flex items-center gap-2 text-green-600 text-sm">
  //           <span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
  //             <span className="text-white text-xs">✓</span>
  //           </span>
  //           Review slots available: {reviewSlots}
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div className="flex items-center gap-2 text-red-600 text-sm">
  //           <span className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
  //             <span className="text-white text-xs">✕</span>
  //           </span>
  //           No review slots available
  //         </div>
  //       );
  //     }
  //   }
  //   return null;
  // };




  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Order</h2>
            <p className="text-gray-600 text-sm mt-1">Order #{data.orderNumber}</p>
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
            {/* Product Information Section */}
            <section className="space-y-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Select
                  label="Product"
                  required
                  value={selectedProduct?._id}
                  placeholder="Choose a product"
                  options={productOptions}
                  {...register('product', { required: 'Product selection is required' })}
                  error={errors.product?.message}
                />
                <Input
                  label="Product Name"
                  required
                  value={selectedProduct?.name || ""}
                  placeholder="Product Name"
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Input
                  label="Product Link"
                  required
                  value={selectedProduct?.productLink || ""}
                  placeholder="Product Link"
                  onClick={handleProductLinkClick}
                  disabled
                  className={selectedProduct?.productLink ? "cursor-pointer" : ""}
                  rightIcon={selectedProduct?.productLink ? <ExternalLink className="w-4 h-4" /> : undefined}
                />
                <Input
                  label="Platform"
                  required
                  value={selectedProduct?.productPlatform || ""}
                  placeholder="Platform"
                  disabled
                />
                <Input
                  label="Brand"
                  required
                  value={selectedProduct?.brand || ""}
                  placeholder="Brand"
                  disabled
                />
              </div>


            </section>

            {/* Basic Information Section */}
            <section className="space-y-6">


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  label="Email Address"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="your.email@example.com"
                  required
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address"
                    }
                  })}
                  error={errors.email?.message}
                />
                <Input
                  label="WhatsApp Number"
                  icon={<Phone className="w-4 h-4" />}
                  placeholder="9876543210"
                  required
                  register={register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits"
                    }
                  })}
                  error={errors.phone?.message}
                />
              </div>

              <Input
                label="Reviewer Name"
                icon={<User className="w-4 h-4" />}
                placeholder="Enter reviewer name"
                required
                register={register("name", {
                  required: "Reviewer name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters"
                  }
                })}
                error={errors.name?.message}
              />
            </section>

            {/* Order Details Section */}
            <section className="space-y-6">


              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Input
                    label="Order Date"
                    type="date"
                    icon={<Calendar className="w-4 h-4" />}
                    required
                    register={register("orderDate", { required: "Order date is required" })}
                    error={errors.orderDate?.message}
                  />
                  <Input
                    label="Total Order Amount"
                    type="number"
                    icon={<IndianRupee className="w-4 h-4" />}
                    placeholder="0.00"
                    required
                    register={register("orderAmount", {
                      required: "Order amount is required",
                      min: { value: 0, message: "Order amount must be positive" },
                      valueAsNumber: true
                    })}
                    error={errors.orderAmount?.message}
                  />
                  <Input
                    label="Your Less Price"
                    type="number"
                    icon={<IndianRupee className="w-4 h-4" />}
                    placeholder="0.00"
                    required
                    register={register("lessPrice", {
                      required: "Less price is required",
                      min: { value: 0, message: "Less price must be positive" },
                      valueAsNumber: true
                    })}
                    error={errors.lessPrice?.message}
                  />
                </div>

                <RadioGroup
                  label="Is this a replacement order?"
                  required
                  options={[
                    { value: "no", label: "No" },
                    { value: "yes", label: "Yes" }
                  ]}
                  register={register("isReplacement", { required: "Please select an option" })}
                  error={errors.isReplacement?.message}
                />

                {isReplacement === "yes" && (
                  <Input
                    label="Old Order ID to Replace"
                    placeholder="Enter old order ID"
                    required
                    register={register("oldOrderNumber", { required: "Old order ID is required" })}
                    error={errors.oldOrderNumber?.message}
                  />
                )}
              </div>
            </section>

            {/* Deal Type & Rating Section */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Deal Type */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Deal Type</h3>
                  </div>
                  <RadioGroup
                    label=""
                    required
                    options={[
                      { value: "original", label: "Original" },
                      { value: "exchange", label: "Exchange" },
                      { value: "empty", label: "Empty" }
                    ]}
                    register={register("dealType", { required: "Please select deal type" })}
                    error={errors.dealType?.message}
                  />
                  {dealType === "exchange" && (
                    <Input
                      label="Exchange Product"
                      placeholder="Enter exchange product details"
                      required
                      register={register("exchangeProduct", { required: "Exchange product is required" })}
                      error={errors.exchangeProduct?.message}
                    />
                  )}
                </div>

                {/* Rating/Review */}
                {/* <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Rating / Review</h3>
                  </div>

                  {getSlotAvailabilityMessage()}

                  <RadioGroup
                    label=""
                    required
                    options={[
                      {
                        value: "rating",
                        label: selectedProduct?.ratingSlots && selectedProduct.ratingSlots > 0
                          ? "Rating"
                          : "Rating (Not Available)",
                        disabled: (!selectedProduct || (selectedProduct.ratingSlots ?? 0) <= 0)
                      },
                      {
                        value: "review",
                        label: selectedProduct?.reviewSlots && selectedProduct.reviewSlots > 0
                          ? "Review"
                          : "Review (Not Available)",
                        disabled: !selectedProduct || (selectedProduct.reviewSlots ?? 0) <= 0
                      },
                      {
                        value: "only_order",
                        label: "Only Order"
                      },
                      {
                        value: "review_submitted",
                        label: "Review Submitted"
                      }
                    ]}
                    register={register("ratingOrReview", { required: "Please select an option" })}
                    error={errors.ratingOrReview?.message}
                  />
                </div> */}
                        {/* Rating/Review */}
                        <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Rating / Review</h3>
                  </div>

                  {/* {getSlotAvailabilityMessage()} */}

                  <RadioGroup
                    label=""
                    required
                    options={
                      availableSlots.map((slot:any)=>{
                          return {
                              label:slot.label,
                              value:slot.value
                          }
                      })
                  }
                    register={register("ratingOrReview", { required: "Please select an option" })}
                    error={errors.ratingOrReview?.message}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                  label="Order Screenshot"
                  accept="image/*,.pdf"
                  value={orderSS}
                  onChange={setOrderSS}
                />
                <FileUpload
                  label="Price Breakup Screenshot"
                  accept="image/*,.pdf"
                  value={priceBreakupSS}
                  onChange={setPriceBreakupSS}
                />

              </div>
            </section>
          </form>
        </div>

        {/* Fixed Footer */}

        <div className="border-t border-gray-200 bg-white p-6 sticky bottom-0">
          <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end">
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
              {isSubmitting ? "Updating..." : "Update Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderModal;