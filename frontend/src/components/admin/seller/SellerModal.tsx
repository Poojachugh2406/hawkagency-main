// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { X } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import Input from '@/components/UI/Input';
// import type { User } from '@/types/auth';

// interface SellerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   seller?: User | null;
//   onSave: (data: any) => Promise<void>;
// }

// const SellerModal: React.FC<SellerModalProps> = ({ isOpen, onClose, seller, onSave }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     nickName: '',
//     role: 'seller' as 'seller'
//   });
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (seller) {
//       setFormData({
//         name: seller.name || '',
//         email: seller.email || '',
//         phone: seller.phone || '',
//         password: '',
//         nickName: seller.nickName || '',
//         role: 'seller'
//       });
//     } else {
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         nickName: '',
//         role: 'seller'
//       });
//     }
//   }, [seller, isOpen]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!seller && !formData.password) {
//       toast.error('Password is required for new sellers');
//       return;
//     }

//     setIsSaving(true);

//     try {
//       await onSave(formData);
//       onClose();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to save seller');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {seller ? 'Edit Seller' : 'Create New Seller'}
//           </h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter seller name"
//             />

//             <Input
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter email address"
//               disabled={!!seller}
//             />

//             <Input
//               label="Phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               placeholder="Enter phone number"
//             />

//             <Input
//               label="Nick Name"
//               name="nickName"
//               value={formData.nickName}
//               onChange={handleChange}
//               placeholder="Enter nick name (optional)"
//             />

//             {!seller && (
//               <Input
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter password"
//               />
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 mt-6">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" isLoading={isSaving}>
//               {seller ? 'Update Seller' : 'Create Seller'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SellerModal;








import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import type { User } from '@/types/auth';

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller?: User | null;
  onSave: (data: any) => Promise<void>;
  isSaving?: boolean;
}

const SellerModal: React.FC<SellerModalProps> = ({ 
  isOpen, 
  onClose, 
  seller, 
  onSave,
  isSaving = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    nickName: '',
    role: 'seller' as 'seller'
  });

  useEffect(() => {
    if (seller) {
      setFormData({
        name: seller.name || '',
        email: seller.email || '',
        phone: seller.phone || '',
        password: '',
        nickName: seller.nickName || '',
        role: 'seller'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        nickName: '',
        role: 'seller'
      });
    }
  }, [seller, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!seller && !formData.password) {
      toast.error('Password is required for new sellers');
      return;
    }

    try {
      await onSave(formData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save seller');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {seller ? 'Edit Seller' : 'Create New Seller'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter seller name"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              disabled={!!seller}
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />

            <Input
              label="Nick Name"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
              placeholder="Enter nick name (optional)"
            />

            {!seller && (
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {seller ? 'Update Seller' : 'Create Seller'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerModal;