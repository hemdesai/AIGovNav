/**
 * Policy Pack Detail Page
 */

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  Shield,
  FileText,
  Users,
  Calendar,
  BarChart,
  BookOpen,
  AlertTriangle
} from 'lucide-react';

// Mock data for policy packs (same as in PolicyPacks.tsx)
const policyPacksData = {
  '1': {
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
    overview: 'This comprehensive policy pack addresses all requirements for high-risk AI systems as defined in the EU AI Act. It includes controls for risk management, data governance, technical documentation, transparency, human oversight, and accuracy requirements.',
    keyControls: [
      { id: 'HR-001', title: 'Risk Management System', article: 'Article 9', required: true },
      { id: 'HR-002', title: 'Data Governance', article: 'Article 10', required: true },
      { id: 'HR-003', title: 'Technical Documentation', article: 'Article 11', required: true },
      { id: 'HR-004', title: 'Record-keeping', article: 'Article 12', required: true },
      { id: 'HR-005', title: 'Transparency Provisions', article: 'Article 13', required: true },
      { id: 'HR-006', title: 'Human Oversight', article: 'Article 14', required: true },
      { id: 'HR-007', title: 'Accuracy and Robustness', article: 'Article 15', required: true }
    ]
  },
  '2': {
    id: '2',
    title: 'Data Governance and Management',
    description: 'Policies for data quality, management, and governance (Article 10)',
    version: '1.5',
    category: 'Data Management',
    applicableRiskLevels: ['high', 'limited'],
    controls: 28,
    lastUpdated: '2024-01-10',
    status: 'active',
    compliance: 92,
    overview: 'Comprehensive data governance framework ensuring training, validation and testing data sets meet quality criteria. Covers data management practices, bias detection, and data documentation requirements.',
    keyControls: [
      { id: 'DG-001', title: 'Data Quality Criteria', article: 'Article 10(2)', required: true },
      { id: 'DG-002', title: 'Training Data Governance', article: 'Article 10(3)', required: true },
      { id: 'DG-003', title: 'Bias Examination', article: 'Article 10(2)(f)', required: true },
      { id: 'DG-004', title: 'Data Documentation', article: 'Article 10(1)', required: true },
      { id: 'DG-005', title: 'Data Relevance Assessment', article: 'Article 10(4)', required: false }
    ]
  },
  '3': {
    id: '3',
    title: 'Human Oversight Framework',
    description: 'Implementation guidelines for human oversight requirements (Article 14)',
    version: '1.2',
    category: 'Governance',
    applicableRiskLevels: ['high'],
    controls: 15,
    lastUpdated: '2024-01-08',
    status: 'active',
    compliance: 78,
    overview: 'Establishes measures for effective human oversight of AI systems, including monitoring capabilities, intervention mechanisms, and decision override procedures.',
    keyControls: [
      { id: 'HO-001', title: 'Human-Machine Interface Design', article: 'Article 14(2)', required: true },
      { id: 'HO-002', title: 'Oversight Capabilities', article: 'Article 14(4)(a)', required: true },
      { id: 'HO-003', title: 'Intervention Mechanisms', article: 'Article 14(4)(d)', required: true },
      { id: 'HO-004', title: 'Stop/Interrupt Procedures', article: 'Article 14(4)(e)', required: true }
    ]
  },
  '4': {
    id: '4',
    title: 'Transparency and User Information',
    description: 'Policies for transparency obligations and user notifications (Article 13)',
    version: '1.0',
    category: 'Transparency',
    applicableRiskLevels: ['high', 'limited'],
    controls: 20,
    lastUpdated: '2024-01-05',
    status: 'active',
    compliance: 88,
    overview: 'Defines transparency requirements including clear user instructions, AI system capabilities and limitations disclosure, and interaction notifications.',
    keyControls: [
      { id: 'TR-001', title: 'Instructions for Use', article: 'Article 13(1)', required: true },
      { id: 'TR-002', title: 'AI Interaction Disclosure', article: 'Article 52(1)', required: true },
      { id: 'TR-003', title: 'Capabilities Communication', article: 'Article 13(3)(a)', required: true },
      { id: 'TR-004', title: 'Limitations Disclosure', article: 'Article 13(3)(b)', required: true }
    ]
  },
  '5': {
    id: '5',
    title: 'Risk Management System',
    description: 'Comprehensive risk management framework (Article 9)',
    version: '2.1',
    category: 'Risk Management',
    applicableRiskLevels: ['high'],
    controls: 35,
    lastUpdated: '2024-01-20',
    status: 'active',
    compliance: 90,
    overview: 'Iterative risk management process covering the entire AI system lifecycle, including risk identification, assessment, mitigation, and monitoring procedures.',
    keyControls: [
      { id: 'RM-001', title: 'Risk Identification Process', article: 'Article 9(2)(a)', required: true },
      { id: 'RM-002', title: 'Risk Assessment Methodology', article: 'Article 9(2)(b)', required: true },
      { id: 'RM-003', title: 'Risk Mitigation Measures', article: 'Article 9(2)(c)', required: true },
      { id: 'RM-004', title: 'Residual Risk Evaluation', article: 'Article 9(4)', required: true },
      { id: 'RM-005', title: 'Testing Procedures', article: 'Article 9(7)', required: true }
    ]
  },
  '6': {
    id: '6',
    title: 'GPAI Model Obligations',
    description: 'Specific requirements for General-Purpose AI models (Chapter V)',
    version: '1.0',
    category: 'GPAI',
    applicableRiskLevels: ['high', 'limited'],
    controls: 25,
    lastUpdated: '2023-12-20',
    status: 'draft',
    compliance: 65,
    overview: 'Requirements for general-purpose AI models including technical documentation, transparency obligations, and systemic risk assessments for models above compute thresholds.',
    keyControls: [
      { id: 'GP-001', title: 'Model Documentation', article: 'Article 53(1)(a)', required: true },
      { id: 'GP-002', title: 'Copyright Compliance', article: 'Article 53(1)(c)', required: true },
      { id: 'GP-003', title: 'Model Evaluation', article: 'Article 55(1)(a)', required: false },
      { id: 'GP-004', title: 'Systemic Risk Assessment', article: 'Article 55(1)(b)', required: false }
    ]
  }
};

export const PolicyPackDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const pack = policyPacksData[id as keyof typeof policyPacksData];

  if (!pack) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">Policy pack not found</p>
        </div>
        <Link 
          to="/policy-packs" 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Policy Packs
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const config = {
      active: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
      draft: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle },
      archived: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Shield }
    };

    const { color, icon: Icon } = config[status as keyof typeof config] || config.draft;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${color}`}>
        <Icon className="h-4 w-4 mr-1.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/policy-packs"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pack.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{pack.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Edit className="h-5 w-5 mr-2" />
            Customize
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <p className="text-sm text-gray-600">Version</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">v{pack.version}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-5 w-5 text-gray-400" />
            <p className="text-sm text-gray-600">Controls</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{pack.controls}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <BarChart className="h-5 w-5 text-gray-400" />
            <p className="text-sm text-gray-600">Compliance</p>
          </div>
          <p className={`text-2xl font-bold ${getComplianceColor(pack.compliance).split(' ')[0]}`}>
            {pack.compliance}%
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <p className="text-sm text-gray-600">Status</p>
          </div>
          <div className="mt-1">{getStatusBadge(pack.status)}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview and Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">{pack.overview}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Key Controls</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pack.keyControls.map((control) => (
                  <div key={control.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-0.5">
                      {control.required ? (
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{control.title}</p>
                          <p className="text-sm text-gray-600 mt-1">Control ID: {control.id}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {control.article}
                        </span>
                      </div>
                      {control.required && (
                        <p className="text-sm text-amber-600 mt-2">
                          <span className="font-medium">Required:</span> This control is mandatory for compliance
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{pack.category}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Applicable Risk Levels</p>
                <div className="flex gap-2 mt-2">
                  {pack.applicableRiskLevels.map(level => (
                    <span
                      key={level}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize"
                    >
                      {level} Risk
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {new Date(pack.lastUpdated).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Implementation Status</p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{pack.compliance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        pack.compliance >= 90 ? 'bg-green-600' :
                        pack.compliance >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${pack.compliance}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Apply to Systems</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This policy pack can be applied to your AI systems with matching risk levels to ensure compliance.
                </p>
                <button className="mt-3 inline-flex items-center px-3 py-1.5 border border-blue-600 text-sm font-medium rounded-lg text-blue-600 hover:bg-blue-100">
                  Apply Policy Pack
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};