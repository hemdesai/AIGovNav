// Frontend entry point for AI Governance Navigator
import React, { useEffect, useState } from 'react';

interface HealthCheck {
  status: string;
  timestamp: string;
  environment: string;
  version: string;
}

function App() {
  const [backendHealth, setBackendHealth] = useState<HealthCheck | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check backend connection
    fetch('http://localhost:4000/api/health')
      .then(res => res.json())
      .then(data => setBackendHealth(data))
      .catch(err => setError('Backend not connected'));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              AI Governance Navigator
            </h1>
            <span className="text-sm text-gray-500">Stage 0 MVP</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Frontend Status
            </h2>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Running on port 5173</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Backend Status
            </h2>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                backendHealth ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {backendHealth ? `Running (${backendHealth.version})` : error || 'Connecting...'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Database Status
            </h2>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Supabase Cloud</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              🎯 AI Use-Case Intake
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Submit and classify AI systems according to EU AI Act risk levels
            </p>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              Start Intake
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              📊 AI Registry
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              View and manage your organization's AI systems portfolio
            </p>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              View Registry
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              📋 Policy Pack
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Access EU AI Act compliance policies and controls
            </p>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
              View Policies
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;