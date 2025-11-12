import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ExternalLink,
  Search,
  AlertCircle,
} from 'lucide-react';
import { userAPI } from '@/utils/api';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import type { ActiveProduct } from '@/types/products';

interface ActiveDealsProps { }

const ActiveDeals: React.FC<ActiveDealsProps> = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ActiveProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState({
    platform: '',
    brandName: '',
  });

  useEffect(() => {
    fetchActiveProducts();
  }, []);

  const fetchActiveProducts = async () => {
    try {
      setLoading(true);
      const response: any = await userAPI.getAllActiveProducts();
      if (response.success) {
        setProducts(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load active deals');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = (product: ActiveProduct) => {
    // Navigate to order form with product data
    navigate('/order', {
      state: {
        productId: product._id
      }
    });
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase());

      //   const matchesSearch =
      //   item.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   item.order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   item.order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //   item.order.phone.toLowerCase().includes(searchTerm.toLowerCase());

      // const matchesFilters =
      //   (!filters.status || getRefundStatus(item) === filters.status)&&
      //   (!filters.mediator || (item.order.mediator.nickName && item.order.mediator.nickName.toLowerCase().includes(filters.mediator.toLowerCase()))) &&
      //   (!filters.platform || item.order.product.productPlatform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
      //   (!filters.brandName || item.order.product.brand.toLowerCase().includes(filters.brandName.toLowerCase()));


      const matchesFilters =
        (!filters.platform || product.productPlatform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
        (!filters.brandName || product.brand.toLowerCase().includes(filters.brandName.toLowerCase()));


      return matchesSearch && matchesFilters;
    });
  const platforms = [...new Set(products.map(p => p.productPlatform))];

  const getSlotAvailabilityColor = (slots: number) => {
    if (slots === 0) return 'text-red-600 bg-red-50 border-red-200';
    if (slots <= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  // const getSlotAvailabilityText = (slots: number) => {
  //   if (slots === 0) return 'No slots available';
  //   if (slots <= 5) return `${slots} slots left`;
  //   return `${slots} slots available`;
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading active deals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-red-800 font-semibold text-lg mb-2">Unable to load deals</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={fetchActiveProducts}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>

            </Button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Active Deals</h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Search Products"
                icon={<Search className="w-4 h-4" />}
                placeholder="Search by name, brand, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={filters.platform}
                onChange={(e) => {
                  setFilters({ ...filters, platform: e.target.value })
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Platforms</option>
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name
              </label>
              <select
                value={filters.brandName}
                onChange={(e) => {
                  setFilters({ ...filters, brandName: e.target.value })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {Array.from(new Set(products.map(r => r.brand).filter(Boolean)
                )).map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filters.brandName !== 'all'
                ? 'Try adjusting your search filters'
                : 'No active deals available at the moment'}
            </p>
            {(searchTerm || filters.platform !== 'all') && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ ...filters, platform: '', brandName: '' });
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) :(
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S. No.</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
          {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Code</th> */}
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slots</th>
          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {filteredProducts.map((product , index) => (
          <tr key={product._id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-4 text-sm font-medium text-gray-900">{index+1}</td>
            <td className="px-4 py-4 text-sm font-medium text-gray-900">
              <div>
              {product.name}

              </div>
              <code className="text-sm font-mono text-gray-900">{product.productCode}</code>
              </td>
            <td className="px-4 py-4 text-sm text-gray-600">
              <div >
                {product.brand}
              </div>
              <code className="text-sm font-mono text-gray-900">{product.brandCode}</code>
              
              </td>
            <td className="px-4 py-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {product.productPlatform}
              </span>
            </td>
            {/* <td className="px-4 py-4">
              <code className="text-sm font-mono text-gray-900">{product.productCode}</code>
            </td> */}
            <td className="px-4 py-4">
              <div className="flex flex-col gap-1">
                {product && !!product.availableRatingSlots &&  product.availableRatingSlots > 0 && (
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableRatingSlots)}`}>
                    Rating : {product.availableRatingSlots}
                  </span>
                )}
                {product && !!product.availableReviewSlots && product.availableReviewSlots > 0 && (
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableReviewSlots)}`}>
                    Review: {product.availableReviewSlots}
                  </span>
                )}
                {product && !!product.availableOnlyOrderSlots &&  product.availableOnlyOrderSlots > 0 && (
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableOnlyOrderSlots)}`}>
                    Only Order: {product.availableOnlyOrderSlots}
                  </span>
                )}
                {product && !!product.availableReviewSubmitted &&  product.availableReviewSubmitted > 0 && (
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableReviewSubmitted)}`}>
                    Review Submit: {product.availableReviewSubmitted}
                  </span>
                )}
              </div>
            </td>
            <td className="px-4 py-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePlaceOrder(product)}
                  disabled={
                    product.availableRatingSlots === 0 && 
                    product.availableOnlyOrderSlots === 0 && 
                    product.availableReviewSlots === 0 &&
                    product.availableReviewSubmitted === 0
                  }
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs px-3 py-1.5 rounded"
                >
                  Order
                </Button>
                {product.productLink && (
                  <a
                    href={product.productLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-gray-300 rounded text-gray-700 hover:bg-white hover:border-gray-400 transition-colors"
                    title="View Product"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        )}
      </div>
    </div >
  );
};

export default ActiveDeals;