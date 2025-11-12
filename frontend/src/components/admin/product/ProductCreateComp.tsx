// import Button from "@/components/UI/Button";
// import Input from "@/components/UI/Input";
// import Select from "@/components/UI/Select";
// import type { User } from "@/types/auth";
// import type { CreateProductData } from "@/types/products";
// import { adminAPI } from "@/utils/api";
// import { X } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// const ProductCreateComp = ({ onClose, sellers , fetchProducts}: { onClose: () => void, sellers: User[] , fetchProducts:()=>Promise<void>}) => {
//     const [isSaving, setIsSaving] = useState(false);
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm<CreateProductData>({
//         defaultValues: {
//             seller: "",
//             ratingSlots: 0,
//             reviewSlots: 0,
//             onlyOrderSlots: 0,
//             reviewSubmittedSlots: 0
//         }
//     });

//     const onSubmit = async (data: CreateProductData) => {
//         const processedData = {
//             ...data,
//             ratingSlots: Number(data.ratingSlots),
//             reviewSlots: Number(data.reviewSlots),
//             onlyOrderSlots: Number(data.onlyOrderSlots),
//             reviewSubmittedSlots: Number(data.reviewSubmittedSlots)
//         };

//         try{
//             setIsSaving(true);
//             const response:any = await adminAPI.createProduct(processedData);
//             if(response.success){
//                 toast.success('Product Created Successfully!');
//                 onClose();
//                 fetchProducts();
//             }else{
//                 throw new  Error(response.message);
//             }
//         }catch(error:any){
//             console.error(error.response.data.message);
//             toast.error(error.response.data.message??'Failed to create product');
//         }finally{
//             setIsSaving(false)
//         }
//     }


//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
//                 <div className="flex items-center justify-between p-6 border-b">
//                     <h2 className="text-2xl font-bold text-gray-900">
//                         Create New Product
//                     </h2>
//                     <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
//                         <X className="w-6 h-6" />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <Select
//                             label="Seller"
//                             options={
//                                 sellers.map(seller => ({
//                                     value: seller?._id,
//                                     label: `${seller.nickName ?? seller?.name}-${seller?.email}`
//                                 }))}
//                             {...register('seller', { required: 'Seller is required' })}
//                             error={errors.seller?.message}
//                             required
//                             placeholder="Select a seller"
//                         />


//                         <Input
//                             label="Product Name"
//                             {...register('name', {
//                                 required: 'Product Name is required',
//                                 minLength: { value: 2, message: ' Product Name must be at least 2 characters' }
//                             })}
//                             required
//                             error={errors.name?.message}
//                             placeholder="Enter product name"
//                         />
//                         <Input
//                             label="Product Code"
//                             {...register('productCode', {
//                                 required: 'Product Code is required',
//                                 minLength: { value: 2, message: ' Product Code must be at least 2 characters' }
//                             })}
//                             required
//                             error={errors.productCode?.message}
//                             placeholder="Enter product code"
//                         />
//                         <Input
//                             label="Brand Name"
//                             {...register('brand', {
//                                 required: 'Brand Name is required',
//                                 minLength: { value: 2, message: ' Brand Name must be at least 2 characters' }
//                             })}
//                             required
//                             error={errors.brand?.message}
//                             placeholder="Enter brand name"
//                         />
//                         <Input
//                             label="Brand Code"
//                             {...register('brandCode', {
//                                 required: 'Brand Code is required',
//                                 minLength: { value: 2, message: ' Brand Code must be at least 2 characters' }
//                             })}
//                             required
//                             error={errors.brandCode?.message}
//                             placeholder="Enter brand code"
//                         />
//                         <Input
//                             label="Product Link"
//                             {...register('productLink', {
//                                 required: 'Product Link is required',
//                             })}
//                             type='url'
//                             required
//                             error={errors.productLink?.message}
//                             placeholder="Enter product URL"
//                         />
//                         <Input
//                             label="Product Platform"
//                             {...register('productPlatform', {
//                                 required: 'Product Platform is required',
//                             })}
//                             required
//                             error={errors.productPlatform?.message}
//                             placeholder="Enter platform name"
//                             />

//                             </div>
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">

//                             <Input
//                                 type='number'
//                                 min={0}
//                                 label="Rating Slots"
//                                 {...register('ratingSlots')}
//                                 error={errors.ratingSlots?.message}
//                                 placeholder="Enter rating slots"
//                             />
//                             <Input
//                                 type='number'
//                                 min={0}
//                                 label="Review Slots"
//                                 {...register('reviewSlots')}
//                                 error={errors.reviewSlots?.message}
//                                 placeholder="Enter review slots"
//                             />
//                             <Input
//                                 type='number'
//                                 min={0}
//                                 label="Only Order Slots"
//                                 {...register('onlyOrderSlots')}
//                                 error={errors.onlyOrderSlots?.message}
//                                 placeholder="Enter only order slots"
//                             />
//                             <Input
//                                 type='number'
//                                 min={0}
//                                 label="Review Submit Slots"
//                                 {...register('reviewSubmittedSlots')}
//                                 error={errors.reviewSubmittedSlots?.message}
//                                 placeholder="Enter reviews submit slots"
//                             />

//                         </div>



//                     <div className="flex justify-end space-x-3 mt-6">
//                         <Button variant="outline" onClick={onClose}>
//                             Cancel
//                         </Button>
//                         <Button type="submit" isLoading={isSaving}>
//                             Create Product
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ProductCreateComp
















import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Select from "@/components/UI/Select";
import type { User } from "@/types/auth";
import type { CreateProductData } from "@/types/products";
import { adminAPI } from "@/utils/api";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ProductCreateComp = ({ onClose, sellers }: { onClose: () => void, sellers: User[] }) => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateProductData>({
        defaultValues: {
            seller: "",
            ratingSlots: 0,
            reviewSlots: 0,
            onlyOrderSlots: 0,
            reviewSubmittedSlots: 0
        }
    });

    const createProductMutation = useMutation({
        mutationFn: (data: CreateProductData) => {
            const processedData = {
                ...data,
                ratingSlots: Number(data.ratingSlots),
                reviewSlots: Number(data.reviewSlots),
                onlyOrderSlots: Number(data.onlyOrderSlots),
                reviewSubmittedSlots: Number(data.reviewSubmittedSlots)
            };
            return adminAPI.createProduct(processedData);
        },
        onSuccess: (response: any) => {
            if (response.success) {
                toast.success('Product Created Successfully!');
                queryClient.invalidateQueries({ queryKey: ['products'] });
                onClose();
            } else {
                throw new Error(response.message);
            }
        },
        onError: (error: any) => {
            console.error(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to create product');
        }
    });

    const onSubmit = async (data: CreateProductData) => {
        createProductMutation.mutate(data);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Create New Product
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Seller"
                            options={
                                sellers.map(seller => ({
                                    value: seller?._id,
                                    label: `${seller.nickName ?? seller?.name}-${seller?.email}`
                                }))}
                            {...register('seller', { required: 'Seller is required' })}
                            error={errors.seller?.message}
                            required
                            placeholder="Select a seller"
                        />

                        <Input
                            label="Product Name"
                            {...register('name', {
                                required: 'Product Name is required',
                                minLength: { value: 2, message: ' Product Name must be at least 2 characters' }
                            })}
                            required
                            error={errors.name?.message}
                            placeholder="Enter product name"
                        />
                        <Input
                            label="Product Code"
                            {...register('productCode', {
                                required: 'Product Code is required',
                                minLength: { value: 2, message: ' Product Code must be at least 2 characters' }
                            })}
                            required
                            error={errors.productCode?.message}
                            placeholder="Enter product code"
                        />
                        <Input
                            label="Brand Name"
                            {...register('brand', {
                                required: 'Brand Name is required',
                                minLength: { value: 2, message: ' Brand Name must be at least 2 characters' }
                            })}
                            required
                            error={errors.brand?.message}
                            placeholder="Enter brand name"
                        />
                        <Input
                            label="Brand Code"
                            {...register('brandCode', {
                                required: 'Brand Code is required',
                                minLength: { value: 2, message: ' Brand Code must be at least 2 characters' }
                            })}
                            required
                            error={errors.brandCode?.message}
                            placeholder="Enter brand code"
                        />
                        <Input
                            label="Product Link"
                            {...register('productLink', {
                                required: 'Product Link is required',
                            })}
                            type='url'
                            required
                            error={errors.productLink?.message}
                            placeholder="Enter product URL"
                        />
                        <Input
                            label="Product Platform"
                            {...register('productPlatform', {
                                required: 'Product Platform is required',
                            })}
                            required
                            error={errors.productPlatform?.message}
                            placeholder="Enter platform name"
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
                        <Input
                            type='number'
                            min={0}
                            label="Rating Slots"
                            {...register('ratingSlots')}
                            error={errors.ratingSlots?.message}
                            placeholder="Enter rating slots"
                        />
                        <Input
                            type='number'
                            min={0}
                            label="Review Slots"
                            {...register('reviewSlots')}
                            error={errors.reviewSlots?.message}
                            placeholder="Enter review slots"
                        />
                        <Input
                            type='number'
                            min={0}
                            label="Only Order Slots"
                            {...register('onlyOrderSlots')}
                            error={errors.onlyOrderSlots?.message}
                            placeholder="Enter only order slots"
                        />
                        <Input
                            type='number'
                            min={0}
                            label="Review Submit Slots"
                            {...register('reviewSubmittedSlots')}
                            error={errors.reviewSubmittedSlots?.message}
                            placeholder="Enter reviews submit slots"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={createProductMutation.isPending}>
                            Create Product
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreateComp;