/**
 * Data transformation utilities for frontend
 */

export interface AISystemResponse {
  id: string;
  name: string;
  description: string;
  actorRole: string;
  riskLevel: string | null;
  status: string;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
  riskAssessments?: Array<{
    assessedAt: string;
    confidence: number;
  }>;
}

export interface AISystem {
  id: string;
  systemName: string;
  systemDescription: string;
  actorRole: string;
  riskLevel: string;
  status: string;
  lifecycleStage: string;
  createdAt: string;
  owner: {
    name: string;
    email: string;
  };
  lastAssessment?: {
    date: string;
    confidenceScore: number;
  };
}

/**
 * Convert backend risk level enum to frontend format
 */
export const convertRiskLevel = (backendRiskLevel: string | null): string => {
  if (!backendRiskLevel) return 'unclassified';
  
  return backendRiskLevel
    .toLowerCase()
    .replace('_risk', '')
    .replace('prohibited', 'unacceptable');
};

/**
 * Transform backend AI system data to frontend format
 */
export const transformAISystem = (system: AISystemResponse): AISystem => {
  return {
    id: system.id,
    systemName: system.name,
    systemDescription: system.description,
    actorRole: system.actorRole.toLowerCase(),
    riskLevel: convertRiskLevel(system.riskLevel),
    status: system.status.toLowerCase(),
    lifecycleStage: 'production', // Default for now
    createdAt: new Date(system.createdAt).toISOString().split('T')[0],
    owner: {
      name: system.owner.name || 'Unknown',
      email: system.owner.email || 'unknown@example.com'
    },
    ...(system.riskAssessments && system.riskAssessments.length > 0 && {
      lastAssessment: {
        date: new Date(system.riskAssessments[0].assessedAt).toISOString().split('T')[0],
        confidenceScore: system.riskAssessments[0].confidence || 0
      }
    })
  };
};

/**
 * Transform array of backend AI systems to frontend format
 */
export const transformAISystems = (systems: AISystemResponse[]): AISystem[] => {
  return systems.map(transformAISystem);
};