import React from 'react';
import { Edit, Trash2, Power, PowerOff, Eye, Users, RefreshCw, Search } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Select from '@/components/UI/Select';
import type { User } from '@/types/auth';

interface MediatorsTableProps {
  mediators: User[];
  isLoading: boolean;
  searchTerm: string;
  filterStatus: 'all' | 'active' | 'inactive';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: 'all' | 'active' | 'inactive') => void;
  onRefresh: () => void;
  onView: (mediator: User) => void;
  onEdit: (mediator: User) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

const MediatorsTable: React.FC<MediatorsTableProps> = ({
  mediators,
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
  const filteredMediators = mediators.filter(mediator => {
    const matchesSearch =
      mediator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mediator.nickName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && mediator.isActive) ||
      (filterStatus === 'inactive' && !mediator.isActive);

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
              placeholder="Search by name, email, phone, or nick name..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            label="Status Filter"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Mediators' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredMediators.length} of {mediators.length} mediators
          </p>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Mediators Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading mediators...</p>
          </div>
        ) : filteredMediators.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No mediators found</p>
          </div>
        ) : (
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
                {filteredMediators.map((mediator) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mediator.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {mediator.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          mediator.isVerified
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {mediator.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(mediator)}
                          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(mediator._id)}
                          className="text-gray-600 hover:text-green-600 hover:cursor-pointer"
                          title={mediator.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {mediator.isActive ? (
                            <PowerOff className="w-4 h-4" />
                          ) : (
                            <Power className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(mediator)}
                          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(mediator._id)}
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

export default MediatorsTable;