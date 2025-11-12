import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Upload, Calendar, User, Mail, Phone, Package, Star, RefreshCw, ArrowLeft, IndianRupee, ShoppingCart } from "lucide-react";
import { apiGet, apiUpload, userAPI } from "../utils/api";

import type { CreateOrderData } from "@/types/orders";
import Input from "@/components/UI/Input";
import RadioGroup from "@/components/UI/RadioGroup";
import FileUpload from "@/components/UI/FileUpload";
import Button from "@/components/UI/Button";
import Select from "@/components/UI/Select";
import type { ActiveProduct } from "@/types/products";
import type { ActiveMediators } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";



const OrderFormPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderScreenshot, setOrderScreenshot] = useState<File | null>(null);
    const [priceBreakup, setPriceBreakup] = useState<File | null>(null);
    const [products, setProducts] = useState<ActiveProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ActiveProduct | null>(null);
    const [mediators, setMediators] = useState<ActiveMediators[]>([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const { user: authUser, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response: any = await userAPI.getAllActiveProducts();
                if (response.success) {
                    setProducts(response.data);
                } else {
                    toast.error("Failed to load products. Please try again later.");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products");
            }
        }
        const fetchMediators = async () => {
            try {
                const response: any = await userAPI.getAllActiveMediators();
                if (response.success) {
                    setMediators(response.data);
                } else {
                    toast.error("Failed to load mediators. Please try again later.");
                }
            } catch (error) {
                console.error("Error fetching mediators:", error);
                toast.error("Failed to load mediators");
            }

        }
        Promise.all([fetchProducts(), fetchMediators()])
    }, []);

    const productOptions = products?.map((product) => ({
        value: product._id,
        label: product.productCode,
    })) || [];
    const mediatorOptions = mediators?.map((mediator) => ({
        value: mediator._id,
        label: mediator.nickName,
    })) || [];

    console.log(productOptions)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<CreateOrderData>({
        defaultValues: {
            product: "",
            mediator: ""
        }
    });


    useEffect(() => {
        if (location.state?.productId) {
            setValue("product", location.state.productId);
            // now change the product in select as well


        }
    }, [location.state]);

    // Watch for product selection changes
    const selectedProductId = watch("product");

    const fetchSlots = async (productId: string) => {
        try {
            const response: any = await apiGet('/product/slots/' + productId);
            if (response.success && response.data) {
                // setAvailableSlots(response.data.slots);
                const options = response.data.slots.map((slot: any) => {
                    if (slot.slots > 0) return {
                        value: slot.value,
                        label: `${slot.label} available slots: ${slot.slots}`
                    }
                }).filter(Boolean);
                setAvailableSlots(options);

            }
        } catch (error: any) {
            console.log(error.response.data.message)
        }
    }

    // Update product details when product selection changes
    useEffect(() => {
        if (selectedProductId && products.length > 0) {
            const product = products.find(p => p._id === selectedProductId);
            if (product) {
                setSelectedProduct(product);
            }
            fetchSlots(selectedProductId);

        } else {
            setSelectedProduct(null);
        }


    }, [selectedProductId, products]);

    // const handleProductLinkClick = () => {
    //     if (selectedProduct?.productLink) {
    //         window.open(selectedProduct.productLink, '_blank');
    //     }
    // };

    useEffect(() => {
        if (!isLoading && isAuthenticated && authUser) {
            setValue("email", authUser.email || "");
            setValue("phone", authUser.phone || "");
            setValue("name", authUser.name || "");
        }
    }, [authUser, isAuthenticated, isLoading, setValue]);



    const isReplacement = watch("isReplacement");

    const onSubmit = async (data: CreateOrderData) => {
        if (!orderScreenshot || !priceBreakup) {
            toast.error("Please upload both order screenshot and price breakup");
            return;
        }

        // Validate mediator selection
        if (!data.mediator) {
            toast.error("Please select a mediator");
            return;
        }

        // Validate platform selection
        if (!data.product) {
            toast.error("Please select a product");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();

            formData.append("data", JSON.stringify(data));
            formData.append("orderSS", orderScreenshot);
            formData.append("priceBreakupSS", priceBreakup);

            // console.log("Form Data:", formData);

            const response: any = await apiUpload("/order/create-order", formData);

            console.log("API Response:", response);

            if (response.success) {
                toast.success("Order submitted successfully!");
                navigate("/");
            } else {
                if (response.errors && response.errors.length > 0) {
                    const errorMessage = response.errors[0].msg || "Validation failed";
                    toast.error(errorMessage);
                } else {
                    toast.error(response.message || "Failed to submit order");
                }
            }
        } catch (error: any) {
            console.error("Order submission error:", error);
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.errors && errorData.errors.length > 0) {
                    toast.error(errorData.errors[0].msg || "Validation failed");
                } else {
                    toast.error(errorData.message || "Failed to submit order");
                }
            } else {
                toast.error(error.message || "Failed to submit order. Please try again.");
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
                    <div className="flex mb-4">
                        <div>
                            <Button variant="outline" className="hover:cursor-pointer" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                        {/* Product Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-red-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Product Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Product Code"
                                    required
                                    placeholder="Choose a product"
                                    options={productOptions}
                                    {...register('product', { required: 'Product selection is required' })}
                                    error={errors.product?.message}
                                    value={selectedProduct?._id}
                                />
                                <Input
                                    label="Product Name"
                                    required
                                    value={selectedProduct?.name || ""}
                                    placeholder="Product Name"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="flex items-center text-sm font-medium text-gray-700"
                                    >Product Link</label>
                                    <a
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-blue-700 hover:bg-gray-50 transition-colors block truncate"
                                        href={selectedProduct?.productLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {selectedProduct?.productLink ?? "N/A"}
                                    </a>
                                </div>

                                {/* <Input
                                    label="Product Link"
                                    required
                                    value={selectedProduct?.productLink || ""}
                                    placeholder="Product Link"
                                    onClick={handleProductLinkClick}
                                    disabled
                                    className={selectedProduct?.productLink ? "cursor-pointer hover:bg-gray-50" : ""}
                                    /> */}
                                <Input
                                    label="Platform"
                                    required
                                    value={selectedProduct?.productPlatform || ""}
                                    placeholder="Product Platform"
                                    disabled
                                    className={selectedProduct?.productPlatform ? "cursor-pointer hover:bg-gray-50" : ""}
                                />
                                <Input
                                    label="Brand Code"
                                    required
                                    value={selectedProduct?.brand || ""}
                                    placeholder="Product Platform"
                                    // onClick={handlePlatformClick}
                                    disabled
                                    className={selectedProduct?.brandCode ? "cursor-pointer hover:bg-gray-50" : ""}
                                />
                            </div>
                        </div>

                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    icon={<Mail className="w-4 h-4" />}
                                    placeholder="your.email@example.com"
                                    required
                                    register={register("email", { required: "Email is required" })}
                                    error={errors.email?.message}
                                />


                                <Input
                                    label="Phone Number"
                                    icon={<Phone className="w-4 h-4" />}
                                    placeholder="9876543210"
                                    required
                                    register={register("phone", {
                                        required: 'Phone number is required',
                                        pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit phone number' }
                                    })}
                                    error={errors.phone?.message}
                                />
                            </div>

                            <Input
                                label="Full Name"
                                icon={<User className="w-4 h-4" />}
                                placeholder="Enter reviewer name"
                                required
                                register={register("name", {
                                    required: 'Name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                })}
                                error={errors.name?.message}
                            />
                        </div>

                        {/* Replacement Order Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                            </div>


                            {/* {(isReplacement === "no" || isReplacement === "yes") && ( */}
                            <div className="bg-gray-50/50 rounded-2xl p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <Input
                                        label="Order Number"
                                        placeholder="Enter order number"
                                        required
                                        register={register("orderNumber", { required: "order number is required" })}
                                        error={errors.orderNumber?.message}
                                    />
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
                                            min: { value: 0, message: "Order amount must be positive" }
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
                                            min: { value: 0, message: "Less price must be positive" }
                                        })}
                                        error={errors.lessPrice?.message}
                                    />
                                    <Select
                                        label="Mediator"
                                        required
                                        placeholder="Choose a mediator"
                                        options={mediatorOptions}
                                        {...register("mediator", { required: "Mediator selection is required" })}
                                        error={errors.mediator?.message}
                                    />

                                </div>
                            </div>
                            {/* )} */}
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

                        {/* Deal Type & Rating Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
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
                                {/* // only show exchange input box when the dealType radio button is selected as exchange*/}
                                {watch("dealType") === "exchange" && (
                                    <Input
                                        label="Exchange Product"
                                        placeholder="Enter exchange product"
                                        required
                                        register={register("exchangeProduct", { required: "Exchange product is required" })}
                                        error={errors.exchangeProduct?.message}
                                    />
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Star className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Rating / Review</h3>
                                </div>

                                {/* show some text below the radio group saying that the slots available for rating and review are 5 */}
                                {/* {selectedProduct && (<>
                                    <p className={"text-sm " +(selectedProduct && selectedProduct.ratingSlots && selectedProduct.ratingSlots>0?"text-gray-600":"text-red-400")}>Slots available for rating and review are: {selectedProduct?.ratingSlots}</p>
                                    <p className={"text-sm " +(selectedProduct && selectedProduct.reviewSlots && selectedProduct.reviewSlots>0?"text-gray-600":"text-red-400")}>Slots available for review are: {selectedProduct?.reviewSlots}</p>
                                </>
                                )} */}

                                <RadioGroup
                                    label=""
                                    required
                                    options={
                                        availableSlots.map((slot: any) => {
                                            return {
                                                label: slot.label,
                                                value: slot.value
                                            }
                                        })
                                    }
                                    register={register("ratingOrReview", { required: "Please select an option" })}
                                    error={errors.ratingOrReview?.message}
                                />
                                {
                                    availableSlots.length == 0 &&
                                    <p className="text-sm text-red-500">No available slots for this product</p>
                                }
                            </div>
                        </div>

                        {/* File Uploads Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Required Documents</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FileUpload
                                    label="Order Screenshot"
                                    accept="image/*,.pdf"
                                    value={orderScreenshot}
                                    onChange={setOrderScreenshot}
                                    required
                                />
                                <FileUpload
                                    label="Price Breakup Screenshot"
                                    accept="image/*,.pdf"
                                    value={priceBreakup}
                                    onChange={setPriceBreakup}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                disabled={!orderScreenshot || !priceBreakup || isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Order"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderFormPage;