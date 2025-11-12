// import  { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { Plus, Search, Edit, Trash2, Power, PowerOff, RefreshCw, Package } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import Input from '@/components/UI/Input';
// import Select from '@/components/UI/Select';
// import { adminAPI } from '@/utils/api';
// import type { ProductWithDetails } from '@/types/products';
// import type { User } from '@/types/auth';
// import ProductCreateComp from '@/components/admin/product/ProductCreateComp';
// import ProductEdit from '@/components/admin/product/ProductEdit';



// function AdminProducts() {
//   const [products, setProducts] = useState<ProductWithDetails[]>([]);
//   const [sellers, setSellers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   // const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
//   const [filterSeller, setFilterSeller] = useState('');
//   // const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       await Promise.all([fetchProducts(), fetchSellers()])
//     }
//     fetchData();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       const response = await adminAPI.getAllProducts();
//       if (response.success && response.data) {
//         setProducts(response.data);
//       }
//     } catch (error: any) {
//       toast.error('Failed to fetch products');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSellers = async () => {
//     try {
//       const response = await adminAPI.getAllSellers();
//       if (response.success && response.data) {
//         setSellers(response.data);
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch sellers:', error);
//     }
//   };




//   const handleDeleteProduct = async (id: string) => {
//     if(!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
//       return;
//     }
//     try {
//       const response = await adminAPI.deleteProduct(id);
//       if (response.success) {
//         toast.success('Product deleted successfully!');
//         fetchProducts();
//         // setDeleteConfirm(null);
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to delete product');
//     }
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       const response = await adminAPI.toggleProductStatus(id);
//       if (response.success) {
//         toast.success('Product status updated successfully!');
//         fetchProducts();
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to update product status');
//     }
//   };

//   const handleEditClick = (product: ProductWithDetails) => {
//     setSelectedProduct(product);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setSelectedProduct(null);
//   };
//   const handleCloseCreateModal = () => {
//     setIsCreateModalOpen(false);
//     setSelectedProduct(null);
//   };

//   const filteredProducts = products.filter(product => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product.productCode?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       filterStatus === 'all' ||
//       (filterStatus === 'active' && product.isActive) ||
//       (filterStatus === 'inactive' && !product.isActive);

//     const matchesSeller =
//       !filterSeller ||
//       (typeof product.seller === 'object' && product.seller && product.seller._id === filterSeller);

//     return matchesSearch && matchesStatus && matchesSeller;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
//           <p className="text-gray-600 mt-1">Manage all products in the system</p>
//         </div>
//         <Button onClick={() => setIsCreateModalOpen(true)}>
//           <Plus className="w-5 h-5 mr-2" />
//           Add Product
//         </Button>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="md:col-span-2">
//             <Input
//               label="Search"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               placeholder="Search by name, brand, or code..."
//               leftIcon={<Search className="w-4 h-4" />}
//             />
//           </div>
//           <Select
//             label="Status Filter"
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value as any)}
//             options={[
//               { value: 'all', label: 'All Products' },
//               { value: 'active', label: 'Active' },
//               { value: 'inactive', label: 'Inactive' }
//             ]}
//           />
//           <Select
//             label="Seller Filter"
//             value={filterSeller}
//             onChange={(e) => setFilterSeller(e.target.value)}
//             options={[
//               { value: '', label: 'All Sellers' },
//               ...sellers.map(seller => ({
//                 value: seller?._id,
//                 label: seller?.name
//               }))
//             ]}
//           />
//         </div>
//         <div className="flex items-center justify-between mt-4">
//           <p className="text-sm text-gray-600">
//             Showing {filteredProducts.length} of {products.length} products
//           </p>
//           <Button variant="outline" size="sm" onClick={fetchProducts}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {isLoading ? (
//           <div className="text-center py-12">
//             <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
//             <p className="text-gray-600">Loading products...</p>
//           </div>
//         ) : filteredProducts.length === 0 ? (
//           <div className="text-center py-12">
//             <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No products found</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product / Brand
//                   </th>
//                   {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Brand
//                   </th> */}
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Codes
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Platform
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Slots
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Seller
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredProducts.map((product) => (
//                   <tr key={product._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{product.name}</div>
//                       <div className="text-sm text-gray-900">{product.brand}</div>
//                       {product.productLink && (
//                         <a
//                           href={product.productLink}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-xs text-blue-600 hover:underline"
//                         >
//                           View Product
//                         </a>
//                       )}
//                     </td>
//                     {/* <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{product.brand}</div>
//                     </td> */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {product.productCode && (
//                           <div>PC: {product.productCode}</div>
//                         )}
//                         {product.brandCode && (
//                           <div>BC: {product.brandCode}</div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {product.productPlatform || 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div>Rating:
//                         <span> {product.bookedRatingSlots || 0} / </span>
//                         <span>{product.ratingSlots || 0}</span>
//                       </div>
//                       <div>Review:
//                         <span> {product.bookedReviewSlots || 0} / </span>
//                         <span>{product.reviewSlots || 0}</span>
//                       </div>
//                       <div>Only Order:
//                         <span> {product.bookedOnlyOrderSlots || 0} / </span>
//                         <span>{product.onlyOrderSlots || 0}</span>
//                       </div>
//                       <div>Review Submit:
//                         <span> {product.bookedReviewSubmitted || 0} / </span>
//                         <span>{product.reviewSubmittedSlots || 0}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         {typeof product.seller === 'object' ? product.seller?.name ?? "N/A" : 'N/A'}
//                       </div>
//                       {typeof product.seller === 'object' && product.seller?.email && (
//                         <div className="text-xs text-gray-500">{product.seller?.email}</div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                           }`}
//                       >
//                         {product.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => handleToggleStatus(product._id)}
//                           className="text-gray-600 hover:text-green-600"
//                           title={product.isActive ? 'Deactivate' : 'Activate'}
//                         >
//                           {product.isActive ? (
//                             <PowerOff className="w-4 h-4 hover:cursor-pointer" />
//                           ) : (
//                             <Power className="w-4 h-4" />
//                           )}
//                         </button>
//                         <button
//                           onClick={() => handleEditClick(product)}
//                           className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
                 
//                           <button
//                             onClick={() => handleDeleteProduct(product._id)}
//                             className="text-red-600 hover:text-red-900 hover:cursor-pointer"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
                       
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Product Modal */}
//       {isCreateModalOpen &&
//         <ProductCreateComp
//           onClose={handleCloseCreateModal}
//           sellers={sellers}
//           fetchProducts = {fetchProducts}
//         />
//       }
//       {isEditModalOpen &&
//         <ProductEdit
//           onClose={handleCloseEditModal}
//           sellers={sellers}
//           product = {selectedProduct}
//           fetchProducts = {fetchProducts}
//         />
//       }
//     </div>
//   );
// }

// export default AdminProducts;










import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2, Power, PowerOff, RefreshCw, Package } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';
import { adminAPI } from '@/utils/api';
import type { ProductWithDetails } from '@/types/products';
import type { User } from '@/types/auth';
import ProductCreateComp from '@/components/admin/product/ProductCreateComp';
import ProductEdit from '@/components/admin/product/ProductEdit';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function AdminProducts() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterSeller, setFilterSeller] = useState('');
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await adminAPI.getAllProducts();
      if (response.success && response.data) {
        return response.data as ProductWithDetails[];
      }
      throw new Error(response.message || 'Failed to fetch products');
    },
  });

  // Fetch sellers
  const { data: sellers = [] } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const response = await adminAPI.getAllSellers();
      if (response.success && response.data) {
        return response.data.filter(seller=> seller.isVerified===true) as User[];
      }
      throw new Error(response.message || 'Failed to fetch sellers');
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteProduct(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Product deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete product');
    },
  });

  // Toggle product status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminAPI.toggleProductStatus(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Product status updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update product status');
    },
  });

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    deleteProductMutation.mutate(id);
  };

  const handleToggleStatus = async (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleEditClick = (product: ProductWithDetails) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive);

    const matchesSeller =
      !filterSeller ||
      (typeof product.seller === 'object' && product.seller && product.seller._id === filterSeller);

    return matchesSearch && matchesStatus && matchesSeller;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage all products in the system</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, brand, or code..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            label="Status Filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Products' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
          <Select
            label="Seller Filter"
            value={filterSeller}
            onChange={(e) => setFilterSeller(e.target.value)}
            options={[
              { value: '', label: 'All Sellers' },
              ...sellers.map(seller => ({
                value: seller?._id,
                label: seller?.name
              }))
            ]}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Error loading products</p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product / Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Codes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slots
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-900">{product.brand}</div>
                      {product.productLink && (
                        <a
                          href={product.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Product
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.productCode && (
                          <div>PC: {product.productCode}</div>
                        )}
                        {product.brandCode && (
                          <div>BC: {product.brandCode}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.productPlatform || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Rating:
                        <span> {product.bookedRatingSlots || 0} / </span>
                        <span>{product.ratingSlots || 0}</span>
                      </div>
                      <div>Review:
                        <span> {product.bookedReviewSlots || 0} / </span>
                        <span>{product.reviewSlots || 0}</span>
                      </div>
                      <div>Only Order:
                        <span> {product.bookedOnlyOrderSlots || 0} / </span>
                        <span>{product.onlyOrderSlots || 0}</span>
                      </div>
                      <div>Review Submit:
                        <span> {product.bookedReviewSubmitted || 0} / </span>
                        <span>{product.reviewSubmittedSlots || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {typeof product.seller === 'object' ? product.seller?.name ?? "N/A" : 'N/A'}
                      </div>
                      {typeof product.seller === 'object' && product.seller?.email && (
                        <div className="text-xs text-gray-500">{product.seller?.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleStatus(product._id)}
                          className="text-gray-600 hover:text-green-600"
                          title={product.isActive ? 'Deactivate' : 'Activate'}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {product.isActive ? (
                            <PowerOff className="w-4 h-4 hover:cursor-pointer" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-900 hover:cursor-pointer"
                          disabled={deleteProductMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <ProductCreateComp
          onClose={handleCloseCreateModal}
          sellers={sellers}
        />
      )}
      {isEditModalOpen && selectedProduct && (
        <ProductEdit
          onClose={handleCloseEditModal}
          sellers={sellers}
          product={selectedProduct}
        />
      )}
    </div>
  );
}

export default AdminProducts;