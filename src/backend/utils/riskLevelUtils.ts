/**
 * Risk Level Utilities
 * Handles conversion between frontend and backend risk level formats
 */

export type BackendRiskLevel = 'PROHIBITED' | 'HIGH_RISK' | 'LIMITED_RISK' | 'MINIMAL_RISK' | null;
export type FrontendRiskLevel = 'unacceptable' | 'high' | 'limited' | 'minimal' | 'unclassified';

/**
 * Convert frontend risk level to backend enum
 */
export const convertFrontendToBackendRiskLevel = (frontendLevel: string): BackendRiskLevel => {
  switch (frontendLevel.toLowerCase()) {
    case 'unacceptable':
      return 'PROHIBITED';
    case 'high':
      return 'HIGH_RISK';
    case 'limited':
      return 'LIMITED_RISK';
    case 'minimal':
      return 'MINIMAL_RISK';
    case 'unclassified':
      return null;
    default:
      return null;
  }
};

/**
 * Convert backend risk level enum to frontend format
 */
export const convertBackendToFrontendRiskLevel = (backendLevel: BackendRiskLevel): FrontendRiskLevel => {
  switch (backendLevel) {
    case 'PROHIBITED':
      return 'unacceptable';
    case 'HIGH_RISK':
      return 'high';
    case 'LIMITED_RISK':
      return 'limited';
    case 'MINIMAL_RISK':
      return 'minimal';
    case null:
    default:
      return 'unclassified';
  }
};

/**
 * Validate if a risk level is valid for the frontend
 */
export const isValidFrontendRiskLevel = (level: string): level is FrontendRiskLevel => {
  return ['unacceptable', 'high', 'limited', 'minimal', 'unclassified'].includes(level.toLowerCase());
};

/**
 * Build where clause for risk level filtering
 */
export const buildRiskLevelWhere = (riskLevel?: string) => {
  if (!riskLevel) return {};
  
  if (riskLevel === 'unclassified') {
    return { riskLevel: null };
  }
  
  const backendRiskLevel = convertFrontendToBackendRiskLevel(riskLevel);
  if (backendRiskLevel) {
    return { riskLevel: backendRiskLevel };
  }
  
  return {};
};