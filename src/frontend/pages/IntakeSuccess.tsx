/**
 * Intake Success Page Component
 */

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, FileText, ArrowRight } from 'lucide-react';

export const IntakeSuccess: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="min-h-[600px] flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Intake Submitted Successfully!
        </h1>

        <p className="text-gray-600 mb-8">
          Your AI system has been successfully submitted for classification. 
          The system will now undergo automated EU AI Act risk assessment.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Intake ID</span>
            <span className="text-sm font-mono font-medium text-gray-900">{id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending Classification
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to={`/systems/${id}`}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="h-5 w-5 mr-2" />
            View System Details
          </Link>

          <Link
            to="/intake/new"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Submit Another System
          </Link>

          <Link
            to="/dashboard"
            className="w-full inline-flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-900"
          >
            Back to Dashboard
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};