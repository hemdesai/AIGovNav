/**
 * Policy Packs Page Component
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search,
  CheckCircle,
  AlertCircle,
  Shield,
  Book,
  Filter
} from 'lucide-react';

interface PolicyPack {
  id: string;
  title: string;
  description: string;
  version: string;
  category: string;
  applicableRiskLevels: string[];
  controls: number;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  compliance: number;
  isFunctional?: boolean;
  appliedSystems?: number;
  totalApplicableSystems?: number;
}

export const PolicyPacks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [policyPacks, setPolicyPacks] = useState<PolicyPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicyPacks();
  }, []);

  const fetchPolicyPacks = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.POLICY_PACKS, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Transform the data to match our interface
        const transformedPacks = result.data.map((pack: any) => ({
          ...pack,
          applicableRiskLevels: pack.applicableRiskLevels?.map((level: string) => 
            level.replace('_RISK', '').toLowerCase()
          ) || []
        }));
        console.log('Policy packs received:', transformedPacks);
        setPolicyPacks(transformedPacks);
      } else {
        // Fallback to mock data if API fails
        setPolicyPacks(getMockPolicyPacks());
      }
    } catch (error) {
      console.error('Failed to fetch policy packs:', error);
      setPolicyPacks(getMockPolicyPacks());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockPolicyPacks = (): PolicyPack[] => [
    {
      id: '1',
      title: 'EU AI Act High-Risk Requirements',
      description: 'Complete policy framework for high-risk AI systems under EU AI Act',
      version: '2.0',
      category: 'Compliance',
      applicableRiskLevels: ['high'],
      controls: 42,
      lastUpdated: '2024-01-15',
      status: 'active',
      compliance: 85,
      isFunctional: true,
      appliedSystems: 0,
      totalApplicableSystems: 6
    },
    {
      id: '2',
      title: 'Data Governance and Management',
      description: 'Policies for data quality, management, and governance (Article 10)',
      version: '1.5',
      category: 'Data Management',
      applicableRiskLevels: ['high', 'limited'],
      controls: 28,
      lastUpdated: '2024-01-10',
      status: 'active',
      compliance: 92
    },
    {
      id: '3',
      title: 'Human Oversight Framework',
      description: 'Implementation guidelines for human oversight requirements (Article 14)',
      version: '1.2',
      category: 'Governance',
      applicableRiskLevels: ['high'],
      controls: 15,
      lastUpdated: '2024-01-08',
      status: 'active',
      compliance: 78
    },
    {
      id: '4',
      title: 'Transparency and User Information',
      description: 'Policies for transparency obligations and user notifications (Article 13)',
      version: '1.0',
      category: 'Transparency',
      applicableRiskLevels: ['high', 'limited'],
      controls: 20,
      lastUpdated: '2024-01-05',
      status: 'active',
      compliance: 88
    },
    {
      id: '5',
      title: 'Risk Management System',
      description: 'Comprehensive risk management framework (Article 9)',
      version: '2.1',
      category: 'Risk Management',
      applicableRiskLevels: ['high'],
      controls: 35,
      lastUpdated: '2024-01-20',
      status: 'active',
      compliance: 90
    },
    {
      id: '6',
      title: 'GPAI Model Obligations',
      description: 'Specific requirements for General-Purpose AI models (Chapter V)',
      version: '1.0',
      category: 'GPAI',
      applicableRiskLevels: ['high', 'limited'],
      controls: 25,
      lastUpdated: '2023-12-20',
      status: 'draft',
      compliance: 65
    }
  ];

  const categories = ['all', 'Compliance', 'Data Management', 'Governance', 'Transparency', 'Risk Management', 'GPAI'];

  const filteredPacks = policyPacks.filter(pack => {
    const matchesSearch = pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pack.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pack.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      draft: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
      archived: { color: 'bg-gray-100 text-gray-700', icon: Shield }
    };

    const { color, icon: Icon } = config[status] || config.draft;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Packs</h1>
          <p className="mt-1 text-sm text-gray-600">
            EU AI Act compliance policies and control frameworks
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Create Policy Pack
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search policy packs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Pack Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPacks.map(pack => (
          <div 
            key={pack.id} 
            className={`rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
              pack.isFunctional 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300' 
                : 'bg-white border-gray-200'
            }`}
            style={pack.isFunctional ? { 
              background: 'linear-gradient(to bottom right, #eff6ff, #eef2ff)',
              borderColor: '#93c5fd'
            } : {}}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pack.title}</h3>
                    {pack.isFunctional && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                        FUNCTIONAL
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{pack.description}</p>
                </div>
                {getStatusBadge(pack.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-sm font-medium text-gray-900">{pack.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="text-sm font-medium text-gray-900">v{pack.version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Controls</p>
                  <p className="text-sm font-medium text-gray-900">{pack.controls} controls</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Compliance</p>
                  <p className={`text-sm font-medium ${getComplianceColor(pack.compliance)}`}>
                    {pack.compliance}%
                  </p>
                </div>
              </div>

              {pack.isFunctional && (
                <div className="mb-4 p-3 bg-blue-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Applied Systems</span>
                    <span className="text-sm font-bold text-blue-900">
                      {pack.appliedSystems || 0} / {pack.totalApplicableSystems || 0}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${pack.totalApplicableSystems > 0 ? (pack.appliedSystems / pack.totalApplicableSystems) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Applicable Risk Levels</p>
                <div className="flex gap-2">
                  {pack.applicableRiskLevels.map(level => (
                    <span
                      key={level}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(pack.lastUpdated).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2">
                  <Link 
                    to={`/policy-packs/${pack.id}`}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center space-x-3 text-blue-700 hover:text-blue-900">
            <Book className="h-5 w-5" />
            <span className="text-sm font-medium">EU AI Act Full Text</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-blue-700 hover:text-blue-900">
            <FileText className="h-5 w-5" />
            <span className="text-sm font-medium">Implementation Guide</span>
          </a>
          <a href="#" className="flex items-center space-x-3 text-blue-700 hover:text-blue-900">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">Best Practices</span>
          </a>
        </div>
      </div>
    </div>
  );
};