/**
 * EU AI Act Risk Classification Service
 * Implements automated risk classification based on EU AI Act Article 6 and Annex III
 */

import { AISystem } from '@prisma/client';

export interface RiskClassificationResult {
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable';
  confidenceScore: number;
  annexIIICategories: string[];
  rationale: string;
  mitigationRequired: string[];
  recommendations: string[];
}

export class RiskClassificationService {
  
  // Annex III High-Risk AI System Categories
  private readonly ANNEX_III_CATEGORIES = {
    BIOMETRICS: {
      id: 'annex_iii_1',
      name: 'Biometric identification and categorisation',
      keywords: ['biometric', 'facial recognition', 'fingerprint', 'identification'],
      riskFactors: ['real-time identification', 'remote identification', 'categorisation']
    },
    CRITICAL_INFRASTRUCTURE: {
      id: 'annex_iii_2', 
      name: 'Critical infrastructure management and operation',
      keywords: ['infrastructure', 'utility', 'transport', 'energy', 'water'],
      riskFactors: ['safety component', 'critical operation']
    },
    EDUCATION_TRAINING: {
      id: 'annex_iii_3',
      name: 'Education and vocational training',
      keywords: ['education', 'training', 'assessment', 'admission', 'evaluation'],
      riskFactors: ['access to education', 'student assessment', 'educational opportunity']
    },
    EMPLOYMENT: {
      id: 'annex_iii_4',
      name: 'Employment and worker management',
      keywords: ['recruitment', 'hiring', 'promotion', 'termination', 'employee', 'worker'],
      riskFactors: ['recruitment decisions', 'work allocation', 'performance monitoring']
    },
    ESSENTIAL_SERVICES: {
      id: 'annex_iii_5',
      name: 'Access to essential private and public services',
      keywords: ['credit', 'loan', 'insurance', 'social benefits', 'emergency services'],
      riskFactors: ['creditworthiness', 'risk assessment', 'eligibility determination']
    },
    LAW_ENFORCEMENT: {
      id: 'annex_iii_6',
      name: 'Law enforcement',
      keywords: ['police', 'crime', 'investigation', 'prosecution', 'evidence'],
      riskFactors: ['individual assessment', 'risk profiling', 'polygraph', 'evidence evaluation']
    },
    MIGRATION_ASYLUM: {
      id: 'annex_iii_7',
      name: 'Migration, asylum and border control',
      keywords: ['migration', 'asylum', 'visa', 'border', 'immigration'],
      riskFactors: ['asylum application', 'visa decision', 'security assessment']
    },
    JUSTICE_DEMOCRACY: {
      id: 'annex_iii_8',
      name: 'Administration of justice and democratic processes',
      keywords: ['court', 'judicial', 'legal', 'election', 'voting', 'democratic'],
      riskFactors: ['judicial decision', 'legal interpretation', 'dispute resolution']
    }
  };

  // Prohibited AI practices (Unacceptable risk)
  private readonly PROHIBITED_PRACTICES = [
    'subliminal techniques',
    'exploiting vulnerabilities',
    'social scoring',
    'real-time biometric identification in public spaces',
    'predictive policing based on profiling',
    'emotion recognition in workplace',
    'emotion recognition in education'
  ];

  /**
   * Classify an AI system according to EU AI Act risk levels
   */
  async classifySystem(aiSystem: AISystem): Promise<RiskClassificationResult> {
    // Check for prohibited practices first
    const prohibitedCheck = this.checkProhibitedPractices(aiSystem);
    if (prohibitedCheck.isProhibited) {
      return {
        riskLevel: 'unacceptable',
        confidenceScore: prohibitedCheck.confidence,
        annexIIICategories: [],
        rationale: prohibitedCheck.rationale,
        mitigationRequired: ['System modification required - prohibited practice detected'],
        recommendations: prohibitedCheck.recommendations
      };
    }

    // Check for high-risk categories (Annex III)
    const annexCheck = this.checkAnnexIIICategories(aiSystem);
    if (annexCheck.categories.length > 0) {
      return {
        riskLevel: 'high',
        confidenceScore: annexCheck.confidence,
        annexIIICategories: annexCheck.categories,
        rationale: annexCheck.rationale,
        mitigationRequired: this.getHighRiskMitigations(annexCheck.categories),
        recommendations: this.getHighRiskRecommendations(aiSystem, annexCheck.categories)
      };
    }

    // Check for limited risk characteristics
    const limitedRiskCheck = this.checkLimitedRisk(aiSystem);
    if (limitedRiskCheck.isLimited) {
      return {
        riskLevel: 'limited',
        confidenceScore: limitedRiskCheck.confidence,
        annexIIICategories: [],
        rationale: limitedRiskCheck.rationale,
        mitigationRequired: limitedRiskCheck.mitigations,
        recommendations: limitedRiskCheck.recommendations
      };
    }

    // Default to minimal risk
    return {
      riskLevel: 'minimal',
      confidenceScore: 0.85,
      annexIIICategories: [],
      rationale: 'System does not fall under high-risk categories and has minimal impact on fundamental rights',
      mitigationRequired: [],
      recommendations: [
        'Maintain documentation of system purpose and design',
        'Implement voluntary best practices',
        'Consider regular impact assessments'
      ]
    };
  }

  /**
   * Check if system involves prohibited practices
   */
  private checkProhibitedPractices(aiSystem: AISystem): {
    isProhibited: boolean;
    confidence: number;
    rationale: string;
    recommendations: string[];
  } {
    const systemText = `${aiSystem.systemDescription} ${aiSystem.systemPurpose} ${aiSystem.intendedUse}`.toLowerCase();
    
    const detectedPractices = this.PROHIBITED_PRACTICES.filter(practice => 
      systemText.includes(practice.toLowerCase())
    );

    if (detectedPractices.length > 0) {
      return {
        isProhibited: true,
        confidence: 0.95,
        rationale: `System involves prohibited practices under Article 5: ${detectedPractices.join(', ')}`,
        recommendations: [
          'Cease development/deployment of this system',
          'Consult legal counsel for compliance options',
          'Consider alternative approaches that comply with Article 5'
        ]
      };
    }

    return {
      isProhibited: false,
      confidence: 0,
      rationale: '',
      recommendations: []
    };
  }

  /**
   * Check if system falls under Annex III high-risk categories
   */
  private checkAnnexIIICategories(aiSystem: AISystem): {
    categories: string[];
    confidence: number;
    rationale: string;
  } {
    const systemText = `${aiSystem.systemDescription} ${aiSystem.systemPurpose} ${aiSystem.intendedUse}`.toLowerCase();
    const detectedCategories: string[] = [];
    let totalConfidence = 0;
    let categoryCount = 0;

    for (const [key, category] of Object.entries(this.ANNEX_III_CATEGORIES)) {
      let categoryScore = 0;
      let matches = 0;

      // Check keywords
      for (const keyword of category.keywords) {
        if (systemText.includes(keyword)) {
          categoryScore += 0.3;
          matches++;
        }
      }

      // Check risk factors
      for (const factor of category.riskFactors) {
        if (systemText.includes(factor)) {
          categoryScore += 0.5;
          matches++;
        }
      }

      // Additional checks for specific categories
      if (aiSystem.providesEssentialService && key === 'ESSENTIAL_SERVICES') {
        categoryScore += 0.4;
      }

      if (categoryScore >= 0.5) {
        detectedCategories.push(category.id);
        totalConfidence += Math.min(categoryScore, 1);
        categoryCount++;
      }
    }

    const avgConfidence = categoryCount > 0 ? totalConfidence / categoryCount : 0;

    return {
      categories: detectedCategories,
      confidence: avgConfidence,
      rationale: detectedCategories.length > 0
        ? `System falls under Annex III high-risk categories: ${detectedCategories.map(id => 
            Object.values(this.ANNEX_III_CATEGORIES).find(c => c.id === id)?.name
          ).join(', ')}`
        : ''
    };
  }

  /**
   * Check for limited risk characteristics
   */
  private checkLimitedRisk(aiSystem: AISystem): {
    isLimited: boolean;
    confidence: number;
    rationale: string;
    mitigations: string[];
    recommendations: string[];
  } {
    const limitedRiskIndicators = [];
    
    // Check for AI systems that interact with humans
    if (aiSystem.systemDescription.toLowerCase().includes('chatbot') ||
        aiSystem.systemDescription.toLowerCase().includes('interaction') ||
        aiSystem.systemDescription.toLowerCase().includes('assistant')) {
      limitedRiskIndicators.push('Human interaction system');
    }

    // Check for emotion recognition (non-prohibited contexts)
    if (aiSystem.systemDescription.toLowerCase().includes('emotion') &&
        !aiSystem.systemDescription.toLowerCase().includes('workplace') &&
        !aiSystem.systemDescription.toLowerCase().includes('education')) {
      limitedRiskIndicators.push('Emotion recognition system');
    }

    // Check for content generation
    if (aiSystem.systemDescription.toLowerCase().includes('generate') ||
        aiSystem.systemDescription.toLowerCase().includes('deepfake') ||
        aiSystem.systemDescription.toLowerCase().includes('synthetic')) {
      limitedRiskIndicators.push('Content generation system');
    }

    // Check for GPAI systems
    if (aiSystem.isGPAI || aiSystem.usesGPAI) {
      limitedRiskIndicators.push('General-purpose AI system');
    }

    if (limitedRiskIndicators.length > 0) {
      return {
        isLimited: true,
        confidence: 0.75,
        rationale: `System has limited risk characteristics: ${limitedRiskIndicators.join(', ')}`,
        mitigations: [
          'Implement transparency obligations (Article 52)',
          'Inform users they are interacting with an AI system',
          'Mark AI-generated content appropriately'
        ],
        recommendations: [
          'Develop clear user notification mechanisms',
          'Implement content watermarking for generated media',
          'Create transparency documentation'
        ]
      };
    }

    return {
      isLimited: false,
      confidence: 0,
      rationale: '',
      mitigations: [],
      recommendations: []
    };
  }

  /**
   * Get required mitigations for high-risk systems
   */
  private getHighRiskMitigations(categories: string[]): string[] {
    const mitigations = [
      'Establish risk management system (Article 9)',
      'Implement data governance and management (Article 10)',
      'Ensure technical documentation (Article 11)',
      'Implement logging capabilities (Article 12)',
      'Ensure transparency and user information (Article 13)',
      'Enable human oversight (Article 14)',
      'Ensure accuracy, robustness, and cybersecurity (Article 15)'
    ];

    // Add category-specific mitigations
    if (categories.includes('annex_iii_1')) {
      mitigations.push('Implement biometric data protection measures');
      mitigations.push('Ensure explicit consent mechanisms');
    }

    if (categories.includes('annex_iii_4')) {
      mitigations.push('Implement fairness and non-discrimination measures');
      mitigations.push('Enable worker rights and appeals processes');
    }

    return mitigations;
  }

  /**
   * Get recommendations based on system characteristics
   */
  private getHighRiskRecommendations(aiSystem: AISystem, categories: string[]): string[] {
    const recommendations = [
      'Conduct conformity assessment before deployment',
      'Register system in EU database (when operational)',
      'Appoint authorized representative if non-EU provider',
      'Implement quality management system',
      'Prepare for market surveillance activities'
    ];

    // GPAI-specific recommendations
    if (aiSystem.isGPAI) {
      recommendations.push('Comply with GPAI model obligations (Chapter V)');
      recommendations.push('Conduct model evaluation if systemic risk threshold met');
    }

    // Actor-specific recommendations
    switch (aiSystem.actorRole) {
      case 'provider':
        recommendations.push('Ensure CE marking before placing on market');
        recommendations.push('Draw up EU declaration of conformity');
        break;
      case 'deployer':
        recommendations.push('Use system according to provider instructions');
        recommendations.push('Conduct fundamental rights impact assessment');
        break;
      case 'distributor':
        recommendations.push('Verify CE marking and documentation');
        recommendations.push('Ensure proper storage and transport conditions');
        break;
    }

    return recommendations;
  }

  /**
   * Calculate confidence score for classification
   */
  calculateConfidenceScore(factors: { [key: string]: number }): number {
    const weights = {
      keywordMatch: 0.3,
      categoryMatch: 0.4,
      explicitDeclaration: 0.2,
      contextAnalysis: 0.1
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [factor, score] of Object.entries(factors)) {
      if (weights[factor]) {
        totalScore += score * weights[factor];
        totalWeight += weights[factor];
      }
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0.5;
  }
}

export default RiskClassificationService;