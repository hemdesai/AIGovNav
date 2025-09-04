/**
 * React Query Hooks for API Integration
 * Provides caching, synchronization, and optimistic updates
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// ============ AI Systems Hooks ============

export const useAISystems = (params?: any) => {
  return useQuery({
    queryKey: ['aiSystems', params],
    queryFn: () => api.intake.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAISystem = (id: string) => {
  return useQuery({
    queryKey: ['aiSystem', id],
    queryFn: () => api.intake.get(id),
    enabled: !!id,
  });
};

export const useCreateAISystem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.intake.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiSystems'] });
    },
  });
};

export const useUpdateAISystem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      api.intake.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aiSystem', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['aiSystems'] });
    },
  });
};

export const useClassifyAISystem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, force = false }: { id: string; force?: boolean }) => 
      api.intake.classify(id, force),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aiSystem', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['aiSystems'] });
    },
  });
};

// ============ Policy Pack Hooks ============

export const usePolicyPacks = (params?: any) => {
  return useQuery({
    queryKey: ['policyPacks', params],
    queryFn: () => api.policies.list(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePolicyPack = (id: string) => {
  return useQuery({
    queryKey: ['policyPack', id],
    queryFn: () => api.policies.get(id),
    enabled: !!id,
  });
};

export const useApplyPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ policyId, systemId }: { policyId: string; systemId: string }) => 
      api.policies.apply(policyId, systemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['aiSystem', variables.systemId] });
      queryClient.invalidateQueries({ queryKey: ['compliance'] });
    },
  });
};

// ============ Risk Assessment Hooks ============

export const useRiskAssessment = (systemId: string) => {
  return useQuery({
    queryKey: ['riskAssessment', systemId],
    queryFn: () => api.risk.history(systemId),
    enabled: !!systemId,
  });
};

export const useRiskRecommendations = (systemId: string) => {
  return useQuery({
    queryKey: ['riskRecommendations', systemId],
    queryFn: () => api.risk.recommendations(systemId),
    enabled: !!systemId,
  });
};

export const useAssessRisk = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (systemId: string) => api.risk.assess(systemId),
    onSuccess: (_, systemId) => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessment', systemId] });
      queryClient.invalidateQueries({ queryKey: ['aiSystem', systemId] });
    },
  });
};

// ============ Compliance Hooks ============

export const useComplianceCheck = (systemId: string) => {
  return useQuery({
    queryKey: ['compliance', systemId],
    queryFn: () => api.compliance.check(systemId),
    enabled: !!systemId,
  });
};

export const useComplianceRequirements = (riskLevel: string) => {
  return useQuery({
    queryKey: ['complianceRequirements', riskLevel],
    queryFn: () => api.compliance.requirements(riskLevel),
    enabled: !!riskLevel,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useGenerateComplianceReport = () => {
  return useMutation({
    mutationFn: ({ systemId, format = 'json' }: { systemId: string; format?: 'pdf' | 'json' }) => 
      api.compliance.report(systemId, format),
  });
};

// ============ Dashboard Hooks ============

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: api.dashboard.stats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

export const useDashboardActivity = (limit = 10) => {
  return useQuery({
    queryKey: ['dashboardActivity', limit],
    queryFn: () => api.dashboard.activity(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useDashboardTasks = () => {
  return useQuery({
    queryKey: ['dashboardTasks'],
    queryFn: api.dashboard.tasks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============ Audit Log Hooks ============

export const useAuditLogs = (params?: any) => {
  return useQuery({
    queryKey: ['auditLogs', params],
    queryFn: () => api.audit.logs(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useVerifyAuditLog = (logId: string) => {
  return useQuery({
    queryKey: ['auditLogVerify', logId],
    queryFn: () => api.audit.verify(logId),
    enabled: !!logId,
  });
};

// ============ User Profile Hooks ============

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: api.users.profile,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.users.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => 
      api.users.changePassword(currentPassword, newPassword),
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.users.preferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

// ============ Health Check Hook ============

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: api.health,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Check every minute
  });
};

// ============ Optimistic Update Helpers ============

export const optimisticUpdate = <T>(
  queryClient: ReturnType<typeof useQueryClient>,
  queryKey: any[],
  updater: (old: T) => T
) => {
  const previousData = queryClient.getQueryData<T>(queryKey);
  
  if (previousData) {
    queryClient.setQueryData(queryKey, updater(previousData));
  }
  
  return previousData;
};

// ============ Error Handling Helper ============

export const useApiError = () => {
  return {
    handleError: (error: any) => {
      console.error('API Error:', error);
      
      // You can add toast notifications here
      const message = error?.response?.data?.error || 
                     error?.message || 
                     'An unexpected error occurred';
      
      // If using a toast library:
      // toast.error(message);
      
      return message;
    },
  };
};