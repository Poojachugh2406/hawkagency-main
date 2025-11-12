// import  { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { Plus } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import { adminAPI } from '@/utils/api';
// import type { User } from '@/types/auth';
// import PendingSellers from '@/components/admin/seller/PendingSellers';
// import SellersTable from '@/components/admin/seller/SellersTable';
// import SellerModal from '@/components/admin/seller/SellerModal';
// import ViewSellerModal from '@/components/admin/seller/ViewSellerModal';


// function AdminSellers() {
//   const [sellers, setSellers] = useState<User[]>([]);
//   const [pendingSellers, setPendingSellers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [viewSeller, setViewSeller] = useState<User | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
//   const [isActionLoading, setIsActionLoading] = useState(false);

//   useEffect(() => {
//     fetchSellers();
//   }, []);

//   const fetchSellers = async () => {
//     try {
//       setIsLoading(true);
//       const response = await adminAPI.getAllSellers();
//       if (response.success && response.data) {
//         const allSellers = response.data;
//         setSellers(allSellers);
        
//         // Filter pending sellers (not verified)
//         const pending = allSellers.filter(seller => !seller.isVerified);
//         setPendingSellers(pending);
//       }
//     } catch (error: any) {
//       toast.error('Failed to fetch sellers');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateSeller = async (data: any) => {

//     try{
//       const response = await adminAPI.createUser({ ...data, role: 'seller' });
//     if (response.success) {
//       toast.success('Seller created successfully!');
//       fetchSellers();
//     } else {
//       throw new Error(response.message || 'Failed to create seller');
//     }
//     }catch(error:any){
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to Create Seller");
//     }
    
//   };

//   const handleUpdateSeller = async (data: any) => {
//     const updatedData: any = {};
//     if (data.name !== selectedSeller?.name) {
//       updatedData.name = data.name;
//     }
//     if (data.nickName !== selectedSeller?.nickName) {
//       updatedData.nickName = data.nickName;
//     }
//     if (data.phone !== selectedSeller?.phone) {
//       updatedData.phone = data.phone;
//     }
//     if (data.email !== selectedSeller?.email) {
//       updatedData.email = data.email;
//     }

//     try {
//       if (!selectedSeller) throw new Error("Seller not found");
//       const response = await adminAPI.updateUser(updatedData, selectedSeller?._id);
//       if (response.success) {
//         toast.success('Seller Updated Successfully');
//         fetchSellers();
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to update seller");
//     }
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       const response = await adminAPI.toggleSellerStatus(id);
//       if (response.success) {
//         toast.success('Seller status updated successfully!');
//         fetchSellers();
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to update seller status");
//     }
//   };

//   const handleVerifySeller = async (id: string) => {
//     if (!window.confirm('Are you sure you want to Verify this seller? This action cant be undone.')) {
//       return; 
//     }
//     try {
//       setIsActionLoading(true);
//       const response = await adminAPI.verifyUser(id);
//       if (response.success) {
//         toast.success('Seller verified successfully!');
//         fetchSellers();
//       } else {
//         throw new Error(response.message || 'Failed to verify seller');
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to Verify seller");
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleRejectSeller = async (id: string) => {
//     if (!window.confirm('Are you sure you want to reject this seller? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       setIsActionLoading(true);
//       const response = await adminAPI.rejectUser(id);
//       if (response.success) {
//         toast.success('Seller rejected successfully!');
//         fetchSellers();
//       } else {
//         throw new Error(response.message || 'Failed to reject seller');
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to reject seller");
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleDeleteClick = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this seller?')) {
//       return;
//     }

//     try {
//       const response = await adminAPI.deleteUser(id);
//       if (response.success) {
//         toast.success('Seller deleted successfully!');
//         fetchSellers();
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to delete seller");
//     }
//   };

//   const handleEditClick = (seller: User) => {
//     setSelectedSeller(seller);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedSeller(null);
//   };

//   const handleViewClick = (seller: User) => {
//     setViewSeller(seller);
//     setIsViewModalOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Sellers Management</h1>
//           <p className="text-gray-600 mt-1">Manage all sellers in the system</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)}>
//           <Plus className="w-5 h-5 mr-2" />
//           Add Seller
//         </Button>
//       </div>

//       {/* Pending Sellers Section */}
//       {pendingSellers.length > 0 && (
//         <PendingSellers
//           pendingSellers={pendingSellers}
//           onVerify={handleVerifySeller}
//           onReject={handleRejectSeller}
//           onView={handleViewClick}
//           isLoading={isActionLoading}
//         />
//       )}

//       {/* Active Sellers Table */}
//       <SellersTable
//         sellers={sellers.filter(seller => seller.isVerified)}
//         isLoading={isLoading}
//         searchTerm={searchTerm}
//         filterStatus={filterStatus}
//         onSearchChange={setSearchTerm}
//         onFilterChange={setFilterStatus}
//         onRefresh={fetchSellers}
//         onView={handleViewClick}
//         onEdit={handleEditClick}
//         onToggleStatus={handleToggleStatus}
//         onDelete={handleDeleteClick}
//       />

//       {/* Modals */}
//       <SellerModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         seller={selectedSeller}
//         onSave={selectedSeller ? handleUpdateSeller : handleCreateSeller}
//       />

//       <ViewSellerModal
//         isOpen={isViewModalOpen}
//         onClose={() => {
//           setIsViewModalOpen(false);
//           setViewSeller(null);
//         }}
//         seller={viewSeller}
//       />
//     </div>
//   );
// }

// export default AdminSellers;










import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import Button from '@/components/UI/Button';
import { adminAPI } from '@/utils/api';
import type { User } from '@/types/auth';
import PendingSellers from '@/components/admin/seller/PendingSellers';
import SellersTable from '@/components/admin/seller/SellersTable';
import SellerModal from '@/components/admin/seller/SellerModal';
import ViewSellerModal from '@/components/admin/seller/ViewSellerModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function AdminSellers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewSeller, setViewSeller] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const queryClient = useQueryClient();

  // Fetch sellers
  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const response = await adminAPI.getAllSellers();
      if (response.success && response.data) {
        return response.data as User[];
      }
      throw new Error(response.message || 'Failed to fetch sellers');
    },
    staleTime: 20* 60 * 1000 // 20 minutes
  });

  // Filter pending sellers (not verified)
  const pendingSellers = sellers.filter(seller => !seller.isVerified);

  // Create seller mutation
  const createSellerMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createUser({ ...data, role: 'seller' }),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Seller created successfully!');
        queryClient.invalidateQueries({ queryKey: ['sellers'] });
        setIsModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to create seller');
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to Create Seller");
    }
  });

  // Update seller mutation
  const updateSellerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateUser(data, id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Seller Updated Successfully');
        queryClient.invalidateQueries({ queryKey: ['sellers'] });
        setIsModalOpen(false);
        setSelectedSeller(null);
      } else {
        throw new Error(response.message);
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to update seller");
    }
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminAPI.toggleSellerStatus(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Seller status updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['sellers'] });
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to update seller status");
    }
  });

  // Verify seller mutation
  const verifySellerMutation = useMutation({
    mutationFn: (id: string) => adminAPI.verifyUser(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Seller verified successfully!');
        queryClient.invalidateQueries({ queryKey: ['sellers'] });
      } else {
        throw new Error(response.message || 'Failed to verify seller');
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to Verify seller");
    }
  });

  // Reject seller mutation
  const rejectSellerMutation = useMutation({
    mutationFn: (id: string) => adminAPI.rejectUser(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Seller rejected successfully!');
        queryClient.invalidateQueries({ queryKey: ['sellers'] });
      } else {
        throw new Error(response.message || 'Failed to reject seller');
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to reject seller");
    }
  });

  // Delete seller mutation
  const deleteSellerMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteUser(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Seller deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['sellers'] });
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete seller");
    }
  });

  const handleCreateSeller = async (data: any) => {
    createSellerMutation.mutate(data);
  };

  const handleUpdateSeller = async (data: any) => {
    if (!selectedSeller) {
      toast.error("Seller not found");
      return;
    }

    const updatedData: any = {};
    if (data.name !== selectedSeller?.name) updatedData.name = data.name;
    if (data.nickName !== selectedSeller?.nickName) updatedData.nickName = data.nickName;
    if (data.phone !== selectedSeller?.phone) updatedData.phone = data.phone;
    if (data.email !== selectedSeller?.email) updatedData.email = data.email;

    updateSellerMutation.mutate({ id: selectedSeller._id, data: updatedData });
  };

  const handleToggleStatus = async (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleVerifySeller = async (id: string) => {
    if (!window.confirm('Are you sure you want to Verify this seller? This action cant be undone.')) {
      return; 
    }
    verifySellerMutation.mutate(id);
  };

  const handleRejectSeller = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this seller? This action cannot be undone.')) {
      return;
    }
    rejectSellerMutation.mutate(id);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this seller?')) {
      return;
    }
    deleteSellerMutation.mutate(id);
  };

  const handleEditClick = (seller: User) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSeller(null);
  };

  const handleViewClick = (seller: User) => {
    setViewSeller(seller);
    setIsViewModalOpen(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['sellers'] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sellers Management</h1>
          <p className="text-gray-600 mt-1">Manage all sellers in the system</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Seller
        </Button>
      </div>

      {/* Pending Sellers Section */}
      {pendingSellers.length > 0 && (
        <PendingSellers
          pendingSellers={pendingSellers}
          onVerify={handleVerifySeller}
          onReject={handleRejectSeller}
          onView={handleViewClick}
          isLoading={verifySellerMutation.isPending || rejectSellerMutation.isPending}
        />
      )}

      {/* Active Sellers Table */}
      <SellersTable
        sellers={sellers.filter(seller => seller.isVerified)}
        isLoading={isLoading}
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilterStatus}
        onRefresh={handleRefresh}
        onView={handleViewClick}
        onEdit={handleEditClick}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteClick}
      />

      {/* Modals */}
      <SellerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        seller={selectedSeller}
        onSave={selectedSeller ? handleUpdateSeller : handleCreateSeller}
        isSaving={createSellerMutation.isPending || updateSellerMutation.isPending}
      />

      <ViewSellerModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewSeller(null);
        }}
        seller={viewSeller}
      />
    </div>
  );
}

export default AdminSellers;