// import React from 'react';
// import { CheckCircle, XCircle, Eye,  Clock } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import type { User } from '@/types/auth';
// import { format } from 'date-fns';

// interface PendingMediatorsProps {
//   pendingMediators: User[];
//   onVerify: (id: string) => Promise<void>;
//   onReject: (id: string) => Promise<void>;
//   onView: (mediator: User) => void;
//   isLoading?: boolean;
// }

// const PendingMediators: React.FC<PendingMediatorsProps> = ({
//   pendingMediators,
//   onVerify,
//   onReject,
//   onView,
//   isLoading = false
// }) => {
//   if (pendingMediators.length === 0) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6 text-center">
//         <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
//         <p className="text-gray-500">There are no pending mediator verification requests.</p>
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
//               {pendingMediators.length} pending
//             </span>
//           </div>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Mediator Info
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
//             {pendingMediators.map((mediator) => (
//               <tr key={mediator._id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{mediator.name}</div>
//                   {mediator.nickName && (
//                     <div className="text-sm text-gray-500">@{mediator.nickName}</div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="text-sm text-gray-900">{mediator.email}</div>
//                   <div className="text-sm text-gray-500">{mediator.phone}</div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {format(new Date(mediator.createdAt), 'dd MMM yyyy')}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       onClick={() => onView(mediator)}
//                       // className="text-blue-600 hover:text-blue-900 hover:cursor-pointer p-1"
//                       title="View Details"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </Button>
//                     <Button
//                       onClick={() => onVerify(mediator._id)}
//                       size="sm"
//                       className="bg-green-600 hover:bg-green-700"
//                       disabled={isLoading}
//                     >
//                       <CheckCircle className="w-4 h-4 mr-1" />
//                       Verify
//                     </Button>
//                     <Button
//                       onClick={() => onReject(mediator._id)}
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

// export default PendingMediators;



















import React from 'react';
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react';
import Button from '@/components/UI/Button';
import type { User } from '@/types/auth';
import { format } from 'date-fns';

interface PendingMediatorsProps {
  pendingMediators: User[];
  onVerify: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onView: (mediator: User) => void;
  isLoading?: boolean;
}

const PendingMediators: React.FC<PendingMediatorsProps> = ({
  pendingMediators,
  onVerify,
  onReject,
  onView,
  isLoading = false
}) => {
  if (pendingMediators.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Requests</h3>
        <p className="text-gray-500">There are no pending mediator verification requests.</p>
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
              {pendingMediators.length} pending
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mediator Info
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
            {pendingMediators.map((mediator) => (
              <tr key={mediator._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{mediator.name}</div>
                  {mediator.nickName && (
                    <div className="text-sm text-gray-500">@{mediator.nickName}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{mediator.email}</div>
                  <div className="text-sm text-gray-500">{mediator.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(mediator.createdAt), 'dd MMM yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => onView(mediator)}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onVerify(mediator._id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      onClick={() => onReject(mediator._id)}
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

export default PendingMediators;