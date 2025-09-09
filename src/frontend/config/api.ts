/**
 * API Configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
export const API_VERSION = '/api/v1';

export const API_ENDPOINTS = {
  // Intake endpoints
  INTAKE_LIST: `${API_BASE_URL}${API_VERSION}/intake`,
  INTAKE_CREATE: `${API_BASE_URL}${API_VERSION}/intake`,
  INTAKE_DETAIL: (id: string) => `${API_BASE_URL}${API_VERSION}/intake/${id}`,
  INTAKE_UPDATE: (id: string) => `${API_BASE_URL}${API_VERSION}/intake/${id}`,
  INTAKE_CLASSIFY: (id: string) => `${API_BASE_URL}${API_VERSION}/intake/${id}/classify`,
  INTAKE_DASHBOARD: `${API_BASE_URL}${API_VERSION}/intake/dashboard`,
  
  // Auth endpoints
  AUTH_LOGIN: `${API_BASE_URL}${API_VERSION}/auth/login`,
  AUTH_SIGNUP: `${API_BASE_URL}${API_VERSION}/auth/signup`,
  AUTH_LOGOUT: `${API_BASE_URL}${API_VERSION}/auth/logout`,
  
  // Policy endpoints
  POLICIES: `${API_BASE_URL}${API_VERSION}/policies`,
  POLICY_PACKS: `${API_BASE_URL}${API_VERSION}/policies/packs`,
  POLICY_PACK_DETAIL: (id: string) => `${API_BASE_URL}${API_VERSION}/policies/packs/${id}`,
  POLICY_APPLY: `${API_BASE_URL}${API_VERSION}/policies/apply`,
  POLICY_SYSTEMS: (policyPackId: string) => `${API_BASE_URL}${API_VERSION}/policies/systems/${policyPackId}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`
};

export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token') || 'mock-jwt-token'}`,
  'Content-Type': 'application/json'
});