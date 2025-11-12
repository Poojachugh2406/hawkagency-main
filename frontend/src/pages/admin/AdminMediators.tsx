// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { Plus } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import { adminAPI } from '@/utils/api';
// import type { User } from '@/types/auth';
// import PendingMediators from '@/components/admin/mediator/PendingMediators';
// import MediatorsTable from '@/components/admin/mediator/MediatorsTable';
// import MediatorModal from '@/components/admin/mediator/MediatorModal';
// import ViewMediatorModal from '@/components/admin/mediator/ViewMediatorModal';


// function AdminMediators() {
//   const [mediators, setMediators] = useState<User[]>([]);
//   const [pendingMediators, setPendingMediators] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedMediator, setSelectedMediator] = useState<User | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [viewMediator, setViewMediator] = useState<User | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
//   const [isActionLoading, setIsActionLoading] = useState(false);

//   useEffect(() => {
//     fetchMediators();
//   }, []);

//   const fetchMediators = async () => {
//     try {
//       setIsLoading(true);
//       const response = await adminAPI.getAllMediators();
//       if (response.success && response.data) {
//         const allMediators = response.data;
//         setMediators(allMediators);
        
//         // Filter pending mediators (not verified)
//         const pending = allMediators.filter(mediator => !mediator.isVerified);
//         setPendingMediators(pending);
//       }
//     } catch (error: any) {
//       toast.error('Failed to fetch mediators');
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateMediator = async (data: any) => {
//     try{
//       const response = await adminAPI.createUser({ ...data, role: 'mediator' });
//       if (response.success) {
//         toast.success('Mediator created successfully!');
//         fetchMediators();
//       } else {
//         throw new Error(response.message || 'Failed to create mediator');
//       }
//     }catch(error:any){
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to Create Mediator");
//     }
   
//   };

//   const handleUpdateMediator = async (data: any) => {
//     const updatedData: any = {};
//     if (data.name !== selectedMediator?.name) {
//       updatedData.name = data.name;
//     }
//     if (data.nickName !== selectedMediator?.nickName) {
//       updatedData.nickName = data.nickName;
//     }
//     if (data.phone !== selectedMediator?.phone) {
//       updatedData.phone = data.phone;
//     }
//     if (data.email !== selectedMediator?.email) {
//       updatedData.email = data.email;
//     }

//     try {
//       if (!selectedMediator) throw new Error("Mediator not found");
//       const response = await adminAPI.updateUser(updatedData, selectedMediator?._id);
//       if (response.success) {
//         toast.success('Mediator Updated Successfully');
//         fetchMediators();
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to Update Mediator");
//     }
//   };

//   const handleToggleStatus = async (id: string) => {
//     try {
//       const response = await adminAPI.toggleMediatorStatus(id);
//       if (response.success) {
//         toast.success('Mediator status updated successfully!');
//         fetchMediators();
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to toggle Mediator Status");
//     }
//   };

//   const handleVerifyMediator = async (id: string) => {
//     if (!window.confirm('Are you sure you want to Verify this mediator? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       setIsActionLoading(true);
//       // You'll need to create this API endpoint
//       const response = await adminAPI.verifyUser(id);
//       if (response.success) {
//         toast.success('Mediator verified successfully!');
//         fetchMediators();
//       } else {
//         throw new Error(response.message || 'Failed to verify mediator');
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to verify Mediator");
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleRejectMediator = async (id: string) => {
//     if (!window.confirm('Are you sure you want to reject this mediator? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       setIsActionLoading(true);
//       // You'll need to create this API endpoint
//       const response = await adminAPI.rejectUser(id);
//       if (response.success) {
//         toast.success('Mediator rejected successfully!');
//         fetchMediators();
//       } else {
//         throw new Error(response.message || 'Failed to reject mediator');
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to reject Mediator");
//     } finally {
//       setIsActionLoading(false);
//     }
//   };

//   const handleDeleteClick = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this mediator?')) {
//       return;
//     }

//     try {
//       const response = await adminAPI.deleteUser(id);
//       if (response.success) {
//         toast.success('Mediator deleted successfully!');
//         fetchMediators();
//       }
//     } catch (error: any) {
//       console.log(error);
//       toast.error(error.response.data.message || error.message || "Failed to Delete Mediator");
//     }
//   };

//   const handleEditClick = (mediator: User) => {
//     setSelectedMediator(mediator);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedMediator(null);
//   };

//   const handleViewClick = (mediator: User) => {
//     setViewMediator(mediator);
//     setIsViewModalOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Mediators Management</h1>
//           <p className="text-gray-600 mt-1">Manage all mediators in the system</p>
//         </div>
//         <Button onClick={() => setIsModalOpen(true)}>
//           <Plus className="w-5 h-5 mr-2" />
//           Add Mediator
//         </Button>
//       </div>

//       {/* Pending Mediators Section */}
//       {pendingMediators.length > 0 && (
//         <PendingMediators
//           pendingMediators={pendingMediators}
//           onVerify={handleVerifyMediator}
//           onReject={handleRejectMediator}
//           onView={handleViewClick}
//           isLoading={isActionLoading}
//         />
//       )}

//       {/* Active Mediators Table */}
//       <MediatorsTable
//         mediators={mediators.filter(mediator => mediator.isVerified)}
//         isLoading={isLoading}
//         searchTerm={searchTerm}
//         filterStatus={filterStatus}
//         onSearchChange={setSearchTerm}
//         onFilterChange={setFilterStatus}
//         onRefresh={fetchMediators}
//         onView={handleViewClick}
//         onEdit={handleEditClick}
//         onToggleStatus={handleToggleStatus}
//         onDelete={handleDeleteClick}
//       />

//       {/* Modals */}
//       <MediatorModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         mediator={selectedMediator}
//         onSave={selectedMediator ? handleUpdateMediator : handleCreateMediator}
//       />

//       <ViewMediatorModal
//         isOpen={isViewModalOpen}
//         onClose={() => {
//           setIsViewModalOpen(false);
//           setViewMediator(null);
//         }}
//         mediator={viewMediator}
//       />
//     </div>
//   );
// }

// export default AdminMediators;



















import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import Button from '@/components/UI/Button';
import { adminAPI } from '@/utils/api';
import type { User } from '@/types/auth';
import PendingMediators from '@/components/admin/mediator/PendingMediators';
import MediatorsTable from '@/components/admin/mediator/MediatorsTable';
import MediatorModal from '@/components/admin/mediator/MediatorModal';
import ViewMediatorModal from '@/components/admin/mediator/ViewMediatorModal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function AdminMediators() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMediator, setSelectedMediator] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewMediator, setViewMediator] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const queryClient = useQueryClient();

  // Fetch mediators
  const { data: mediators = [], isLoading } = useQuery({
    queryKey: ['mediators'],
    queryFn: async () => {
      const response = await adminAPI.getAllMediators();
      if (response.success && response.data) {
        return response.data as User[];
      }
      throw new Error(response.message || 'Failed to fetch mediators');
    },
  });

  // Filter pending mediators (not verified)
  const pendingMediators = mediators.filter(mediator => !mediator.isVerified);

  // Create mediator mutation
  const createMediatorMutation = useMutation({
    mutationFn: (data: any) => adminAPI.createUser({ ...data, role: 'mediator' }),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Mediator created successfully!');
        queryClient.invalidateQueries({ queryKey: ['mediators'] });
        setIsModalOpen(false);
      } else {
        throw new Error(response.message || 'Failed to create mediator');
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to Create Mediator");
    }
  });

  // Update mediator mutation
  const updateMediatorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminAPI.updateUser(data, id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Mediator Updated Successfully');
        queryClient.invalidateQueries({ queryKey: ['mediators'] });
        setIsModalOpen(false);
        setSelectedMediator(null);
      } else {
        throw new Error(response.message);
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to Update Mediator");
    }
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => adminAPI.toggleMediatorStatus(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Mediator status updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['mediators'] });
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to toggle Mediator Status");
    }
  });

  // Verify mediator mutation
  const verifyMediatorMutation = useMutation({
    mutationFn: (id: string) => adminAPI.verifyUser(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Mediator verified successfully!');
        queryClient.invalidateQueries({ queryKey: ['mediators'] });
      } else {
        throw new Error(response.message || 'Failed to verify mediator');
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to verify Mediator");
    }
  });

  // Reject mediator mutation
  const rejectMediatorMutation = useMutation({
    mutationFn: (id: string) => adminAPI.rejectUser(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Mediator rejected successfully!');
        queryClient.invalidateQueries({ queryKey: ['mediators'] });
      } else {
        throw new Error(response.message || 'Failed to reject mediator');
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to reject Mediator");
    }
  });

  // Delete mediator mutation
  const deleteMediatorMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteUser(id),
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success('Mediator deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['mediators'] });
      }
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed to Delete Mediator");
    }
  });

  const handleCreateMediator = async (data: any) => {
    createMediatorMutation.mutate(data);
  };

  const handleUpdateMediator = async (data: any) => {
    if (!selectedMediator) {
      toast.error("Mediator not found");
      return;
    }

    const updatedData: any = {};
    if (data.name !== selectedMediator?.name) updatedData.name = data.name;
    if (data.nickName !== selectedMediator?.nickName) updatedData.nickName = data.nickName;
    if (data.phone !== selectedMediator?.phone) updatedData.phone = data.phone;
    if (data.email !== selectedMediator?.email) updatedData.email = data.email;

    updateMediatorMutation.mutate({ id: selectedMediator._id, data: updatedData });
  };

  const handleToggleStatus = async (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleVerifyMediator = async (id: string) => {
    if (!window.confirm('Are you sure you want to Verify this mediator? This action cannot be undone.')) {
      return;
    }
    verifyMediatorMutation.mutate(id);
  };

  const handleRejectMediator = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this mediator? This action cannot be undone.')) {
      return;
    }
    rejectMediatorMutation.mutate(id);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this mediator?')) {
      return;
    }
    deleteMediatorMutation.mutate(id);
  };

  const handleEditClick = (mediator: User) => {
    setSelectedMediator(mediator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMediator(null);
  };

  const handleViewClick = (mediator: User) => {
    setViewMediator(mediator);
    setIsViewModalOpen(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['mediators'] });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mediators Management</h1>
          <p className="text-gray-600 mt-1">Manage all mediators in the system</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Mediator
        </Button>
      </div>

      {/* Pending Mediators Section */}
      {pendingMediators.length > 0 && (
        <PendingMediators
          pendingMediators={pendingMediators}
          onVerify={handleVerifyMediator}
          onReject={handleRejectMediator}
          onView={handleViewClick}
          isLoading={verifyMediatorMutation.isPending || rejectMediatorMutation.isPending}
        />
      )}

      {/* Active Mediators Table */}
      <MediatorsTable
        mediators={mediators.filter(mediator => mediator.isVerified)}
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
      <MediatorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mediator={selectedMediator}
        onSave={selectedMediator ? handleUpdateMediator : handleCreateMediator}
        isSaving={createMediatorMutation.isPending || updateMediatorMutation.isPending}
      />

      <ViewMediatorModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewMediator(null);
        }}
        mediator={viewMediator}
      />
    </div>
  );
}

export default AdminMediators;