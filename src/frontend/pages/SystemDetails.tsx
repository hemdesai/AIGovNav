/**
 * System Details Page Component
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Clock, CheckCircle } from 'lucide-react';

export const SystemDetails: React.FC = () => {
  const { id } = useParams();

  // Mock data - would normally fetch from API
  const system = {
    id,
    systemName: 'Customer Support Chatbot',
    systemDescription: 'AI-powered chatbot for customer service interactions using natural language processing',
    systemPurpose: 'Automate customer support responses and improve response time',
    intendedUse: 'Handle common customer queries and route complex issues to human agents',
    actorRole: 'deployer',
    riskLevel: 'limited',
    status: 'classified',
    isGPAI: false,
    usesGPAI: true,
    providesEssentialService: false,
    categories: ['customer_service'],
    geographicScope: 'eu',
    targetUsers: 'General public, customers',
    dataTypes: ['Personal Data', 'Communication Data'],
    automationLevel: 'assistive',
    transparencyMeasures: 'Clear notification that users are interacting with an AI system',
    humanOversight: 'Human agents can intervene and override AI decisions at any time',
    createdAt: '2024-01-15T10:30:00',
    lastModified: '2024-01-20T14:45:00',
    owner: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    riskAssessment: {
      assessedAt: '2024-01-20T15:00:00',
      confidenceScore: 0.85,
      rationale: 'System interacts directly with humans and requires transparency obligations under Article 52',
      recommendations: [
        'Implement clear user notification mechanisms',
        'Ensure human oversight capabilities',
        'Document transparency measures'
      ]
    }
  };

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
            {(system.riskAssessment.confidenceScore * 100).toFixed(0)}%
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
                  <p className="text-gray-600 capitalize">{system.actorRole}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Geographic Scope</p>
                  <p className="text-gray-600 uppercase">{system.geographicScope}</p>
                </div>
              </div>
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
                      {new Date(system.riskAssessment.assessedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Rationale</p>
                  <p className="text-sm text-gray-600">{system.riskAssessment.rationale}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {system.riskAssessment.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
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