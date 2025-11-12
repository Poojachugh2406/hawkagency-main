// import React from 'react';
// import { CheckCircle, XCircle, Eye,  Clock } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import type { User } from '@/types/auth';
// import { format } from 'date-fns';

// interface PendingSellersProps {
//   pendingSellers: User[];
//   onVerify: (id: string) => Promise<void>;
//   onReject: (id: string) => Promise<void>;
//   onView: (seller: User) => void;
//   isLoading?: boolean;
// }

// const PendingSellers: React.FC<PendingSellersProps> = ({
//   pendingSellers,
//   onVerify,
//   onReject,
//   onView,
//   isLoading = false
// }) => {
//   if (pendingSellers.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6 text-center">
//         <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
//         <p className="text-gray-500">There are no pending seller verification requests.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden">
//       <div className="px-6 py-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Clock className="w-5 h-5 text-yellow-500" />
//             <h2 className="text-lg font-semibold text-gray-900">Pending Verification Requests</h2>
//             <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
//               {pendingSellers.length} pending
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Seller Info
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Contact
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Request Date
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {pendingSellers.map((seller) => (
//               <tr key={seller._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{seller.name}</div>
//                   {seller.nickName && (
//                     <div className="text-sm text-gray-500">@{seller.nickName}</div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{seller.email}</div>
//                   <div className="text-sm text-gray-500">{seller.phone}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {format(new Date(seller.createdAt), 'dd MMM yyyy')}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => onView(seller)}
//                       className="text-blue-600 hover:text-blue-900 p-1 hover:cursor-pointer"
//                       title="View Details"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//                     <Button
//                       onClick={() => onVerify(seller._id)}
//                       size="sm"
//                       className="bg-green-600 hover:bg-green-700"
//                       disabled={isLoading}
//                     >
//                       <CheckCircle className="w-4 h-4 mr-1" />
//                       Verify
//                     </Button>
//                     <Button
//                       onClick={() => onReject(seller._id)}
//                       variant="outline"
//                       size="sm"
//                       className="text-red-600 border-red-600 hover:bg-red-50"
//                       disabled={isLoading}
//                     >
//                       <XCircle className="w-4 h-4 mr-1" />
//                       Reject
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PendingSellers;









import React from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import Button from '@/components/UI/Button';
import type { User } from '@/types/auth';
import { format } from 'date-fns';

interface PendingSellersProps {
  pendingSellers: User[];
  onVerify: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onView: (seller: User) => void;
  isLoading?: boolean;
}

const PendingSellers: React.FC<PendingSellersProps> = ({
  pendingSellers,
  onVerify,
  onReject,
  onView,
  isLoading = false
}) => {
  if (pendingSellers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
        <p className="text-gray-500">There are no pending seller verification requests.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">Pending Verification Requests</h2>
            <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded-full">
              {pendingSellers.length} pending
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingSellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                  {seller.nickName && (
                    <div className="text-sm text-gray-500">@{seller.nickName}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{seller.email}</div>
                  <div className="text-sm text-gray-500">{seller.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(seller.createdAt), 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(seller)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Button
                      onClick={() => onVerify(seller._id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      onClick={() => onReject(seller._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      disabled={isLoading}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingSellers;