export interface QAConfig {
  projectPath: string;
  thresholds: {
    overall: number;
    security: number;
    performance: number;
    quality: number;
    architecture: number;
    testing: number;
    euAICompliance: number;
    llmGovernance: number;
  };
  euAIAct: {
    enabled: boolean;
    riskLevels: ['minimal', 'limited', 'high', 'unacceptable'];
    documentationRequired: boolean;
    transparencyRequired: boolean;
  };
  llmMonitoring: {
    enabled: boolean;
    promptSafetyCheck: boolean;
    responseValidation: boolean;
    costTracking: boolean;
  };
  reporting: {
    format: 'html' | 'json' | 'markdown' | 'all';
    outputPath: string;
    includeRecommendations: boolean;
    includeTrends: boolean;
  };
}

export const defaultQAConfig: QAConfig = {
  projectPath: process.cwd(),
  thresholds: {
    overall: 80,
    security: 90,
    performance: 75,
    quality: 80,
    architecture: 75,
    testing: 60, // Lowered for MVP phase
    euAICompliance: 85,
    llmGovernance: 80
  },
  euAIAct: {
    enabled: true,
    riskLevels: ['minimal', 'limited', 'high', 'unacceptable'],
    documentationRequired: true,
    transparencyRequired: true
  },
  llmMonitoring: {
    enabled: true,
    promptSafetyCheck: true,
    responseValidation: true,
    costTracking: true
  },
  reporting: {
    format: 'all',
    outputPath: './qa/reports',
    includeRecommendations: true,
    includeTrends: true
  }
};

export const testConfig: QAConfig = {
  ...defaultQAConfig,
  thresholds: {
    ...defaultQAConfig.thresholds,
    testing: 40 // Even lower for initial development
  },
  reporting: {
    ...defaultQAConfig.reporting,
    format: 'json',
    includeRecommendations: false,
    includeTrends: false
  }
};