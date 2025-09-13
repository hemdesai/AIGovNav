/**
 * AI Registry Page Component
 */

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { SkeletonTable } from '../components/SkeletonLoader';
import { transformAISystems, AISystem } from '../utils/dataTransforms';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  AlertTriangle,
  AlertCircle,
  Shield,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';


export const Registry: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>(searchParams.get('riskLevel') || 'all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(!!searchParams.get('riskLevel'));

  // Handle URL parameter changes
  useEffect(() => {
    const riskLevelParam = searchParams.get('riskLevel');
    if (riskLevelParam && riskLevelParam !== filterRiskLevel) {
      setFilterRiskLevel(riskLevelParam);
      setShowFilters(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSystems();
  }, [currentPage, filterRiskLevel, filterStatus]);

  const fetchSystems = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...(filterRiskLevel !== 'all' && { riskLevel: filterRiskLevel }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      });


      const response = await fetch(`${API_ENDPOINTS.INTAKE_LIST}?${queryParams}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const transformedSystems = transformAISystems(result.data);

        setSystems(transformedSystems);
        setTotalPages(result.pagination.pages);
      } else {
        console.error('API error:', result.error);
        setSystems([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch systems:', error);
      setSystems([]);
      setLoading(false);
    }
  };

  const getRiskLevelBadge = (level: string) => {
    const configs = {
      unacceptable: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: '🚫', 
        pulse: true 
      },
      high: { 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        icon: '⚠️', 
        pulse: false 
      },
      limited: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: '⚡', 
        pulse: false 
      },
      minimal: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: '✅', 
        pulse: false 
      },
      unclassified: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: '❓', 
        pulse: false 
      }
    };

    const config = configs[level as keyof typeof configs] || configs.unclassified;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color} ${config.pulse ? 'animate-pulse' : ''}`}>
        <span className="mr-1">{config.icon}</span>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: '📝' },
      classified: { color: 'bg-blue-100 text-blue-800', icon: '🔍' },
      approved: { color: 'bg-green-100 text-green-800', icon: '✅' },
      deployed: { color: 'bg-purple-100 text-purple-800', icon: '🚀' },
      retired: { color: 'bg-red-100 text-red-800', icon: '🗄️' }
    };

    const config = configs[status as keyof typeof configs] || configs.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredSystems = systems.filter(system => {
    const matchesSearch = system.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         system.systemDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRiskLevel === 'all' || system.riskLevel === filterRiskLevel;
    const matchesStatus = filterStatus === 'all' || system.status === filterStatus;
    
    return matchesSearch && matchesRisk && matchesStatus;
  });


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Systems Registry</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and monitor your organization's AI systems portfolio
            </p>
          </div>
        </div>
        
        <div className={`rounded-lg shadow-sm border p-4 ${
          searchParams.get('riskLevel') 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
        
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">AI Systems Registry</h1>
            {searchParams.get('riskLevel') && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Filtered by: {searchParams.get('riskLevel')?.replace('_', ' ').toLowerCase()}
                <button 
                  onClick={() => {
                    setFilterRiskLevel('all');
                    setSearchParams({});
                  }}
                  className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {searchParams.get('riskLevel') 
              ? `Showing ${searchParams.get('riskLevel')} risk systems only`
              : 'Manage and monitor your organization\'s AI systems portfolio'
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          {searchParams.get('riskLevel') && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← Back to Dashboard
            </Link>
          )}
          <Link
            to="/intake/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New AI System
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`rounded-lg shadow-sm border p-4 ${
        searchParams.get('riskLevel') 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search AI systems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {(filterRiskLevel !== 'all' || filterStatus !== 'all') && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  Active
                </span>
              )}
            </button>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Level
                </label>
                <select
                  value={filterRiskLevel}
                  onChange={(e) => setFilterRiskLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="unacceptable">Unacceptable</option>
                  <option value="high">High</option>
                  <option value="limited">Limited</option>
                  <option value="minimal">Minimal</option>
                  <option value="unclassified">Unclassified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="classified">Classified</option>
                  <option value="approved">Approved</option>
                  <option value="deployed">Deployed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Systems Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Assessment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSystems.map((system) => (
                <tr key={system.id} className="hover:bg-blue-50 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{system.systemName}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {system.systemDescription}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRiskLevelBadge(system.riskLevel)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(system.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{system.owner.name}</p>
                      <p className="text-sm text-gray-500">{system.owner.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {system.lastAssessment ? (
                      <div>
                        <p className="text-sm text-gray-900">{system.lastAssessment.date}</p>
                        <p className="text-sm text-gray-500">
                          Confidence: {(system.lastAssessment.confidenceScore * 100).toFixed(0)}%
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not assessed</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/systems/${system.id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View details"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit system"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {filteredSystems.length} of {systems.length} systems
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};