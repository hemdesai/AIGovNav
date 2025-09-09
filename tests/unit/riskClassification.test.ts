import { describe, it, expect, beforeEach } from 'vitest';

// Import the actual risk classification service when available
// import { RiskClassificationService } from '../../src/backend/services/riskClassification';

describe('EU AI Act Risk Classification Service', () => {
  let riskService: any;

  beforeEach(() => {
    // Mock service for now
    riskService = new MockRiskClassificationService();
  });

  describe('Risk Level Classification', () => {
    it('should classify minimal risk systems correctly', () => {
      const testCases = [
        { purpose: 'spam filter', expectedRisk: 'minimal' },
        { purpose: 'inventory management', expectedRisk: 'minimal' },
        { purpose: 'recommendation system for entertainment', expectedRisk: 'minimal' }
      ];

      testCases.forEach(({ purpose, expectedRisk }) => {
        const result = riskService.classifyRisk({ purpose });
        expect(result.riskLevel).toBe(expectedRisk);
      });
    });

    it('should classify limited risk systems correctly', () => {
      const testCases = [
        { purpose: 'chatbot for customer service', expectedRisk: 'limited' },
        { purpose: 'emotion recognition system', expectedRisk: 'limited' },
        { purpose: 'deep fake detection', expectedRisk: 'limited' }
      ];

      testCases.forEach(({ purpose, expectedRisk }) => {
        const result = riskService.classifyRisk({ purpose });
        expect(result.riskLevel).toBe(expectedRisk);
      });
    });

    it('should classify high risk systems correctly', () => {
      const testCases = [
        { purpose: 'CV screening for recruitment', expectedRisk: 'high' },
        { purpose: 'credit scoring system', expectedRisk: 'high' },
        { purpose: 'medical diagnosis AI', expectedRisk: 'high' },
        { purpose: 'educational assessment tool', expectedRisk: 'high' },
        { purpose: 'biometric identification', expectedRisk: 'high' }
      ];

      testCases.forEach(({ purpose, expectedRisk }) => {
        const result = riskService.classifyRisk({ purpose });
        expect(result.riskLevel).toBe(expectedRisk);
        expect(result.requiresConformityAssessment).toBe(true);
      });
    });

    it('should classify unacceptable risk systems correctly', () => {
      const testCases = [
        { purpose: 'social credit scoring by government', expectedRisk: 'unacceptable' },
        { purpose: 'real-time biometric surveillance in public', expectedRisk: 'unacceptable' },
        { purpose: 'subliminal manipulation system', expectedRisk: 'unacceptable' },
        { purpose: 'exploiting vulnerabilities of children', expectedRisk: 'unacceptable' }
      ];

      testCases.forEach(({ purpose, expectedRisk }) => {
        const result = riskService.classifyRisk({ purpose });
        expect(result.riskLevel).toBe(expectedRisk);
        expect(result.prohibited).toBe(true);
      });
    });
  });

  describe('Compliance Requirements', () => {
    it('should generate correct requirements for high-risk systems', () => {
      const result = riskService.getComplianceRequirements('high');
      
      expect(result).toContain('risk management system');
      expect(result).toContain('data governance');
      expect(result).toContain('technical documentation');
      expect(result).toContain('transparency obligations');
      expect(result).toContain('human oversight');
      expect(result).toContain('accuracy and robustness');
      expect(result).toContain('conformity assessment');
    });

    it('should generate correct requirements for limited-risk systems', () => {
      const result = riskService.getComplianceRequirements('limited');
      
      expect(result).toContain('transparency obligations');
      expect(result).toContain('inform users of AI interaction');
      expect(result).not.toContain('conformity assessment');
    });
  });

  describe('Documentation Requirements', () => {
    it('should list required documentation for high-risk systems', () => {
      const docs = riskService.getRequiredDocumentation('high');
      
      expect(docs).toContain('technical documentation');
      expect(docs).toContain('risk assessment report');
      expect(docs).toContain('data management plan');
      expect(docs).toContain('instructions for use');
      expect(docs).toContain('declaration of conformity');
      expect(docs).toContain('post-market monitoring plan');
    });
  });

  describe('Annex III High-Risk Categories', () => {
    it('should identify all Annex III categories', () => {
      const annexIIICategories = [
        'biometric identification',
        'critical infrastructure management',
        'education and vocational training',
        'employment and workers management',
        'access to essential services',
        'law enforcement',
        'migration and border control',
        'administration of justice'
      ];

      annexIIICategories.forEach(category => {
        const result = riskService.isAnnexIIICategory(category);
        expect(result).toBe(true);
      });
    });
  });
});

// Mock implementation for testing
class MockRiskClassificationService {
  classifyRisk(system: { purpose: string }) {
    const purpose = system.purpose.toLowerCase();
    
    // Unacceptable risk patterns
    if (purpose.includes('social credit') || 
        purpose.includes('social scoring') ||
        purpose.includes('real-time biometric surveillance') ||
        purpose.includes('subliminal manipulation') ||
        purpose.includes('exploiting vulnerabilities')) {
      return { riskLevel: 'unacceptable', prohibited: true };
    }
    
    // High risk patterns
    if (purpose.includes('recruitment') || 
        purpose.includes('credit scoring') ||
        purpose.includes('medical diagnosis') ||
        purpose.includes('educational assessment') ||
        purpose.includes('biometric identification') ||
        purpose.includes('cv screening')) {
      return { riskLevel: 'high', requiresConformityAssessment: true };
    }
    
    // Limited risk patterns
    if (purpose.includes('chatbot') || 
        purpose.includes('emotion recognition') ||
        purpose.includes('deep fake')) {
      return { riskLevel: 'limited' };
    }
    
    // Default to minimal risk
    return { riskLevel: 'minimal' };
  }

  getComplianceRequirements(riskLevel: string): string[] {
    const requirements: Record<string, string[]> = {
      high: [
        'risk management system',
        'data governance',
        'technical documentation',
        'transparency obligations',
        'human oversight',
        'accuracy and robustness',
        'conformity assessment'
      ],
      limited: [
        'transparency obligations',
        'inform users of AI interaction'
      ],
      minimal: [],
      unacceptable: ['System prohibited under EU AI Act']
    };
    
    return requirements[riskLevel] || [];
  }

  getRequiredDocumentation(riskLevel: string): string[] {
    if (riskLevel === 'high') {
      return [
        'technical documentation',
        'risk assessment report',
        'data management plan',
        'instructions for use',
        'declaration of conformity',
        'post-market monitoring plan'
      ];
    }
    return [];
  }

  isAnnexIIICategory(category: string): boolean {
    const annexIII = [
      'biometric identification',
      'critical infrastructure',
      'education',
      'employment',
      'essential services',
      'law enforcement',
      'migration',
      'border control',
      'justice'
    ];
    
    return annexIII.some(item => category.toLowerCase().includes(item));
  }
}