// import React from 'react';
// import { X } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import type { User } from '@/types/auth';
// import { format } from 'date-fns';

// interface ViewMediatorModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mediator: User | null;
// }

// const ViewMediatorModal: React.FC<ViewMediatorModalProps> = ({ isOpen, onClose, mediator }) => {
//   if (!isOpen || !mediator) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">Mediator Details</h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Name</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.name}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Nick Name</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.nickName || 'N/A'}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Email</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.email}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Phone</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.phone}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Status</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">
//                 <span className={`px-3 py-1 rounded-full text-sm ${mediator.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                   {mediator.isActive ? 'Active' : 'Inactive'}
//                 </span>
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Verified</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">
//                 <span className={`px-3 py-1 rounded-full text-sm ${mediator.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
//                   {mediator.isVerified ? 'Yes' : 'No'}
//                 </span>
//               </p>
//             </div>
            
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">UPI ID</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.upiId??"N/A"}</p>
//             </div>
            
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Account Number</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.accountNumber??"N/A"}</p>
//             </div>
         
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">IFSC Code</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.accountIfsc??"N/A"}</p>
//             </div>
        
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <label className="text-sm font-medium text-gray-500">Created At</label>
//               <p className="text-lg font-semibold text-gray-900 mt-1">
//                 {format(new Date(mediator.createdAt), 'dd MMM yyyy hh:mm a')}
//               </p>
//             </div>
//             {mediator.lastLogin && (
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <label className="text-sm font-medium text-gray-500">Last Login</label>
//                 <p className="text-lg font-semibold text-gray-900 mt-1">
//                   {format(new Date(mediator.lastLogin), 'dd MMM yyyy hh:mm a')}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-end p-6 border-t">
//           <Button variant="outline" onClick={onClose}>
//             Close
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewMediatorModal;

















import React from 'react';
import { X } from 'lucide-react';
import Button from '@/components/UI/Button';
import type { User } from '@/types/auth';
import { format } from 'date-fns';

interface ViewMediatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediator: User | null;
}

const ViewMediatorModal: React.FC<ViewMediatorModalProps> = ({ isOpen, onClose, mediator }) => {
  if (!isOpen || !mediator) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Mediator Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.name}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Nick Name</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.nickName || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.phone}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Status</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm ${mediator.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {mediator.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Verified</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                <span className={`px-3 py-1 rounded-full text-sm ${mediator.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {mediator.isVerified ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">UPI ID</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.upiId??"N/A"}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Account Number</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.accountNumber??"N/A"}</p>
            </div>
         
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">IFSC Code</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{mediator.accountIfsc??"N/A"}</p>
            </div>
        
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {format(new Date(mediator.createdAt), 'dd MMM yyyy hh:mm a')}
              </p>
            </div>
            {mediator.lastLogin && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-500">Last Login</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {format(new Date(mediator.lastLogin), 'dd MMM yyyy hh:mm a')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewMediatorModal;