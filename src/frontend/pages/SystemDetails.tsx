/**
 * System Details Page Component
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  AlertCircle,
  Shield,
  Info,
  ChevronRight,
  FileText,
  Settings,
  Users
} from 'lucide-react';

interface AISystemDetails {
  id: string;
  name: string;
  description: string;
  purpose: string;
  intendedUse: string;
  actorRole: string;
  riskLevel: string | null;
  status: string;
  gpaiFlag: boolean;
  usesGPAI: boolean;
  providesEssentialService: boolean;
  categories: string[];
  geographicScope: string;
  targetUsers: string;
  dataTypes: string[];
  automationLevel: string;
  transparencyMeasures: string | null;
  humanOversight: string | null;
  performanceMetrics: string | null;
  biasControls: string | null;
  foreseenMisuse: string | null;
  technicalDocumentation: string | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  riskAssessments?: Array<{
    id: string;
    classification: string;
    rationale: string;
    confidence: number;
    euActArticles: string[];
    annexCategories: string[];
    assessedAt: string;
    assessedBy: string;
  }>;
}

export const SystemDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [system, setSystem] = useState<AISystemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSystemDetails();
  }, [id]);

  const fetchSystemDetails = async () => {
    try {
      console.log('Fetching system details for ID:', id);
      const response = await fetch(API_ENDPOINTS.INTAKE_DETAIL(id!), {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        console.log('Setting system data:', result.data);
        setSystem(result.data);
      } else {
        setError(result.error || 'Failed to fetch system details');
      }
    } catch (err) {
      console.error('Error fetching system:', err);
      setError('Failed to fetch system details');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelConfig = (level: string | null) => {
    const configs = {
      'PROHIBITED': { 
        label: 'Unacceptable',
        icon: AlertTriangle, 
        color: 'text-red-600 bg-red-50 border-red-200',
        bgColor: 'bg-red-100'
      },
      'HIGH_RISK': { 
        label: 'High Risk',
        icon: AlertCircle, 
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        bgColor: 'bg-orange-100'
      },
      'LIMITED_RISK': { 
        label: 'Limited Risk',
        icon: Shield, 
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        bgColor: 'bg-yellow-100'
      },
      'MINIMAL_RISK': { 
        label: 'Minimal Risk',
        icon: CheckCircle, 
        color: 'text-green-600 bg-green-50 border-green-200',
        bgColor: 'bg-green-100'
      }
    };

    return configs[level || ''] || { 
      label: 'Unclassified',
      icon: Info, 
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      bgColor: 'bg-gray-100'
    };
  };

  const formatCategoryName = (category: string): string => {
    const categoryNames: { [key: string]: string } = {
      'annex_iii_1': 'Biometric Identification',
      'annex_iii_2': 'Critical Infrastructure',
      'annex_iii_3': 'Education & Training',
      'annex_iii_4': 'Employment & Workers',
      'annex_iii_5': 'Essential Services',
      'annex_iii_6': 'Law Enforcement',
      'annex_iii_7': 'Migration & Border Control',
      'annex_iii_8': 'Justice & Democracy',
      'biometrics': 'Biometrics',
      'critical_infrastructure': 'Critical Infrastructure',
      'education': 'Education',
      'employment': 'Employment',
      'essential_services': 'Essential Services',
      'law_enforcement': 'Law Enforcement',
      'migration': 'Migration',
      'justice': 'Justice'
    };
    return categoryNames[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading system details...</p>
        </div>
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">{error || 'System not found'}</p>
        </div>
        <Link 
          to="/registry" 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Registry
        </Link>
      </div>
    );
  }

  const riskConfig = getRiskLevelConfig(system.riskLevel);
  const RiskIcon = riskConfig.icon;
  const latestAssessment = system.riskAssessments?.[0];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/registry"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{system.systemName}</h1>
            <p className="text-sm text-gray-600 mt-1">System ID: {system.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Risk Level</p>
          <p className="text-lg font-semibold text-yellow-600 capitalize">{system.riskLevel}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Status</p>
          <p className="text-lg font-semibold text-blue-600 capitalize">{system.status}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
          <p className="text-lg font-semibold text-gray-900">
            {latestAssessment ? `${(latestAssessment.confidence * 100).toFixed(0)}%` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                <p className="text-gray-600">{system.systemDescription}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Purpose</p>
                <p className="text-gray-600">{system.systemPurpose}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Intended Use</p>
                <p className="text-gray-600">{system.intendedUse}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Actor Role</p>
                  <p className="text-gray-600 capitalize">{system.actorRole ? system.actorRole.toLowerCase() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Geographic Scope</p>
                  <p className="text-gray-600 uppercase">{system.geographicScope}</p>
                </div>
              </div>
              {system.categories && system.categories.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {system.categories.map((cat, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                      >
                        {formatCategoryName(cat)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {system.dataTypes && system.dataTypes.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Data Types</p>
                  <div className="flex flex-wrap gap-2">
                    {system.dataTypes.map((type, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Risk Management</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Transparency Measures</p>
                <p className="text-gray-600">{system.transparencyMeasures}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Human Oversight</p>
                <p className="text-gray-600">{system.humanOversight}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Automation Level</p>
                <p className="text-gray-600 capitalize">{system.automationLevel}</p>
              </div>
              {system.performanceMetrics && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Performance Metrics</p>
                  <p className="text-gray-600">{system.performanceMetrics}</p>
                </div>
              )}
              {system.biasControls && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Bias Controls</p>
                  <p className="text-gray-600">{system.biasControls}</p>
                </div>
              )}
              {system.foreseenMisuse && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Foreseen Misuse</p>
                  <p className="text-gray-600">{system.foreseenMisuse}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Risk Assessment</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Assessed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(latestAssessment.assessedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Rationale</p>
                  <p className="text-sm text-gray-600">{latestAssessment.rationale}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Metadata</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Owner</p>
                <p className="text-sm font-medium text-gray-900">{system.owner.name}</p>
                <p className="text-sm text-gray-600">{system.owner.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(system.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Modified</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(system.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};