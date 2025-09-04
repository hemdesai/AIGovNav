/**
 * Dashboard Page Component
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

interface DashboardStats {
  totalSystems: number;
  byRiskLevel: {
    unacceptable: number;
    high: number;
    limited: number;
    minimal: number;
    unclassified: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    system: string;
    timestamp: string;
  }>;
  pendingTasks: Array<{
    id: string;
    title: string;
    type: string;
    dueDate: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSystems: 0,
    byRiskLevel: {
      unacceptable: 0,
      high: 0,
      limited: 0,
      minimal: 0,
      unclassified: 0
    },
    recentActivity: [],
    pendingTasks: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // This would normally fetch from the API
      // For now, using mock data
      setTimeout(() => {
        setStats({
          totalSystems: 12,
          byRiskLevel: {
            unacceptable: 1,
            high: 3,
            limited: 4,
            minimal: 2,
            unclassified: 2
          },
          recentActivity: [
            { id: '1', action: 'System Classified', system: 'Customer Support Bot', timestamp: '2 hours ago' },
            { id: '2', action: 'Intake Submitted', system: 'Fraud Detection Model', timestamp: '5 hours ago' },
            { id: '3', action: 'Policy Updated', system: 'HR Screening Tool', timestamp: '1 day ago' }
          ],
          pendingTasks: [
            { id: '1', title: 'Complete risk assessment', type: 'Assessment', dueDate: 'Today' },
            { id: '2', title: 'Review compliance documentation', type: 'Review', dueDate: 'Tomorrow' },
            { id: '3', title: 'Submit quarterly report', type: 'Report', dueDate: 'Next week' }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'unacceptable': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'limited': return 'text-yellow-600 bg-yellow-100';
      case 'minimal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'unacceptable': return AlertTriangle;
      case 'high': return AlertCircle;
      case 'limited': return Shield;
      case 'minimal': return CheckCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to AI Governance Navigator</h1>
        <p className="text-blue-100">Monitor and manage your AI systems' EU AI Act compliance</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/intake/new"
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quick Action</p>
              <h3 className="text-lg font-semibold text-gray-900">Submit New AI System</h3>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </div>
        </Link>

        <Link 
          to="/registry"
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quick Action</p>
              <h3 className="text-lg font-semibold text-gray-900">View AI Registry</h3>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </div>
        </Link>

        <Link 
          to="/policy-packs"
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quick Action</p>
              <h3 className="text-lg font-semibold text-gray-900">Access Policy Packs</h3>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </div>
        </Link>
      </div>

      {/* Risk Level Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Risk Level Distribution</h2>
          <p className="text-sm text-gray-600 mt-1">AI Systems by EU AI Act risk classification</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(stats.byRiskLevel).map(([level, count]) => {
              const Icon = getRiskLevelIcon(level);
              return (
                <div key={level} className="text-center">
                  <div className={`inline-flex p-3 rounded-lg ${getRiskLevelColor(level)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 capitalize">{level}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.system}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {task.type}
                      </span>
                      <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliant Systems</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900">70%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};