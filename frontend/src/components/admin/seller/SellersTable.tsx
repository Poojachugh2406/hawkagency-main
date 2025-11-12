// import React from 'react';
// import { Edit, Trash2, Power, PowerOff, Eye, Users, RefreshCw, Search } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import Input from '@/components/UI/Input';
// import Select from '@/components/UI/Select';
// import type { User } from '@/types/auth';

// interface SellersTableProps {
//   sellers: User[];
//   isLoading: boolean;
//   searchTerm: string;
//   filterStatus: 'all' | 'active' | 'inactive';
//   onSearchChange: (value: string) => void;
//   onFilterChange: (value: 'all' | 'active' | 'inactive') => void;
//   onRefresh: () => void;
//   onView: (seller: User) => void;
//   onEdit: (seller: User) => void;
//   onToggleStatus: (id: string) => void;
//   onDelete: (id: string) => void;
// }

// const SellersTable: React.FC<SellersTableProps> = ({
//   sellers,
//   isLoading,
//   searchTerm,
//   filterStatus,
//   onSearchChange,
//   onFilterChange,
//   onRefresh,
//   onView,
//   onEdit,
//   onToggleStatus,
//   onDelete
// }) => {
//   const filteredSellers = sellers.filter(seller => {
//     const matchesSearch =
//       seller?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       seller?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       seller?.phone.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       filterStatus === 'all' ||
//       (filterStatus === 'active' && seller?.isActive) ||
//       (filterStatus === 'inactive' && !seller?.isActive);

//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="space-y-6">
//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-2">
//             <Input
//               label="Search"
//               value={searchTerm}
//               onChange={(e) => onSearchChange(e.target.value)}
//               placeholder="Search by name, email, or phone..."
//               leftIcon={<Search className="w-4 h-4" />}
//             />
//           </div>
//           <Select
//             label="Status Filter"
//             value={filterStatus}
//             onChange={(e) => onFilterChange(e.target.value as any)}
//             options={[
//               { value: 'all', label: 'All Sellers' },
//               { value: 'active', label: 'Active' },
//               { value: 'inactive', label: 'Inactive' }
//             ]}
//           />
//         </div>
//         <div className="flex items-center justify-between mt-4">
//           <p className="text-sm text-gray-600">
//             Showing {filteredSellers.length} of {sellers.length} sellers
//           </p>
//           <Button variant="outline" size="sm" onClick={onRefresh}>
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       {/* Sellers Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         {isLoading ? (
//           <div className="text-center py-12">
//             <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
//             <p className="text-gray-600">Loading sellers...</p>
//           </div>
//         ) : filteredSellers.length === 0 ? (
//           <div className="text-center py-12">
//             <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No sellers found</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Seller Info
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Contact
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Verified
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredSellers.map((seller) => (
//                   <tr key={seller._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{seller.name}</div>
//                       {seller.nickName && (
//                         <div className="text-sm text-gray-500">@{seller.nickName}</div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">{seller.email}</div>
//                       <div className="text-sm text-gray-500">{seller.phone}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           seller.isActive
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {seller.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           seller.isVerified
//                             ? 'bg-blue-100 text-blue-800'
//                             : 'bg-gray-100 text-gray-800'
//                         }`}
//                       >
//                         {seller.isVerified ? 'Verified' : 'Not Verified'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => onView(seller)}
//                           className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => onToggleStatus(seller._id)}
//                           className="text-gray-600 hover:text-green-600 hover:cursor-pointer"
//                           title={seller.isActive ? 'Deactivate' : 'Activate'}
//                         >
//                           {seller.isActive ? (
//                             <PowerOff className="w-4 h-4" />
//                           ) : (
//                             <Power className="w-4 h-4" />
//                           )}
//                         </button>
//                         <button
//                           onClick={() => onEdit(seller)}
//                           className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
//                           title="Edit"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => onDelete(seller._id)}
//                           className="text-red-600 hover:text-red-900 hover:cursor-pointer"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellersTable;










import React from 'react';
import { Edit, Trash2, Power, PowerOff, Eye, Users, RefreshCw, Search } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';
import type { User } from '@/types/auth';

interface SellersTableProps {
  sellers: User[];
  isLoading: boolean;
  searchTerm: string;
  filterStatus: 'all' | 'active' | 'inactive';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  onRefresh: () => void;
  onView: (seller: User) => void;
  onEdit: (seller: User) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const SellersTable: React.FC<SellersTableProps> = ({
  sellers,
  isLoading,
  searchTerm,
  filterStatus,
  onSearchChange,
  onFilterChange,
  onRefresh,
  onView,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch =
      seller?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller?.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && seller?.isActive) ||
      (filterStatus === 'inactive' && !seller?.isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email, or phone..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            label="Status Filter"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Sellers' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredSellers.length} of {sellers.length} sellers
          </p>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading sellers...</p>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No sellers found</p>
          </div>
        ) : (
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSellers.map((seller) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          seller.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {seller.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          seller.isVerified
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {seller.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(seller)}
                          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(seller._id)}
                          className="text-gray-600 hover:text-green-600 hover:cursor-pointer"
                          title={seller.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {seller.isActive ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(seller)}
                          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(seller._id)}
                          className="text-red-600 hover:text-red-900 hover:cursor-pointer"
                          title="Delete"
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
    </div>
  );
};

export default SellersTable;