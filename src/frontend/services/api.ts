/**
 * API Service Layer
 * Centralized API communication with backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request handler with authentication
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const token = options.token || localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============ Authentication ============
  auth = {
    login: async (email: string, password: string) => {
      return this.request<{
        success: boolean;
        token: string;
        user: any;
      }>('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    signup: async (email: string, password: string, name: string) => {
      return this.request<{
        success: boolean;
        token: string;
        user: any;
      }>('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
    },

    logout: async () => {
      return this.request('/v1/auth/logout', { method: 'POST' });
    },

    me: async () => {
      return this.request('/v1/auth/me');
    },
  };

  // ============ AI Systems / Intake ============
  intake = {
    create: async (data: any) => {
      return this.request<{
        success: boolean;
        data: any;
      }>('/v1/intake', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    get: async (id: string) => {
      return this.request(`/v1/intake/${id}`);
    },

    update: async (id: string, data: any) => {
      return this.request(`/v1/intake/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    list: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      riskLevel?: string;
      actorRole?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      return this.request(`/v1/intake?${queryParams}`);
    },

    classify: async (id: string, forceReclassification = false) => {
      return this.request(`/v1/intake/${id}/classify`, {
        method: 'POST',
        body: JSON.stringify({ forceReclassification }),
      });
    },

    delete: async (id: string) => {
      return this.request(`/v1/intake/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // ============ Policy Packs ============
  policies = {
    list: async (params?: {
      category?: string;
      riskLevel?: string;
      status?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      return this.request(`/v1/policy-pack?${queryParams}`);
    },

    get: async (id: string) => {
      return this.request(`/v1/policy-pack/${id}`);
    },

    create: async (data: any) => {
      return this.request('/v1/policy-pack', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, data: any) => {
      return this.request(`/v1/policy-pack/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    apply: async (policyId: string, systemId: string) => {
      return this.request(`/v1/policy-pack/${policyId}/apply`, {
        method: 'POST',
        body: JSON.stringify({ systemId }),
      });
    },
  };

  // ============ Risk Assessment ============
  risk = {
    assess: async (systemId: string) => {
      return this.request(`/v1/risk/assess/${systemId}`, {
        method: 'POST',
      });
    },

    history: async (systemId: string) => {
      return this.request(`/v1/risk/history/${systemId}`);
    },

    recommendations: async (systemId: string) => {
      return this.request(`/v1/risk/recommendations/${systemId}`);
    },
  };

  // ============ Compliance ============
  compliance = {
    check: async (systemId: string) => {
      return this.request(`/v1/compliance/check/${systemId}`);
    },

    report: async (systemId: string, format: 'pdf' | 'json' = 'json') => {
      return this.request(`/v1/compliance/report/${systemId}?format=${format}`);
    },

    requirements: async (riskLevel: string) => {
      return this.request(`/v1/compliance/requirements/${riskLevel}`);
    },
  };

  // ============ Dashboard ============
  dashboard = {
    stats: async () => {
      return this.request('/v1/dashboard/stats');
    },

    activity: async (limit = 10) => {
      return this.request(`/v1/dashboard/activity?limit=${limit}`);
    },

    tasks: async () => {
      return this.request('/v1/dashboard/tasks');
    },
  };

  // ============ Audit Logs ============
  audit = {
    logs: async (params?: {
      entityType?: string;
      entityId?: string;
      userId?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }) => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
      }
      return this.request(`/v1/audit/logs?${queryParams}`);
    },

    verify: async (logId: string) => {
      return this.request(`/v1/audit/verify/${logId}`);
    },
  };

  // ============ User Management ============
  users = {
    profile: async () => {
      return this.request('/v1/users/profile');
    },

    updateProfile: async (data: any) => {
      return this.request('/v1/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    changePassword: async (currentPassword: string, newPassword: string) => {
      return this.request('/v1/users/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
    },

    preferences: async (preferences: any) => {
      return this.request('/v1/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
    },
  };

  // ============ Health Check ============
  health = async () => {
    return this.request('/health');
  };
}

// Create and export singleton instance
export const api = new ApiService(API_BASE_URL);

// Export types for use in components
export type { ApiService };