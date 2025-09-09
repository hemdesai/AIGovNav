/**
 * EU AI Act Risk Classification Service
 * Implements automated risk classification based on EU AI Act Article 6 and Annex III
 */

import { AISystem } from '@prisma/client';

export interface RiskClassificationResult {
  riskLevel: 'MINIMAL_RISK' | 'LIMITED_RISK' | 'HIGH_RISK' | 'PROHIBITED';
  confidenceScore: number;
  annexIIICategories: string[];
  euActArticles: string[];
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
        riskLevel: 'PROHIBITED',
        confidenceScore: prohibitedCheck.confidence,
        annexIIICategories: [],
        euActArticles: ['Article 5'],
        rationale: prohibitedCheck.rationale,
        mitigationRequired: ['System modification required - prohibited practice detected'],
        recommendations: prohibitedCheck.recommendations
      };
    }

    // Check for high-risk categories (Annex III)
    const annexCheck = this.checkAnnexIIICategories(aiSystem);
    if (annexCheck.categories.length > 0) {
      return {
        riskLevel: 'HIGH_RISK',
        confidenceScore: annexCheck.confidence,
        annexIIICategories: annexCheck.categories,
        euActArticles: ['Article 6', 'Annex III'],
        rationale: `${annexCheck.rationale}. High-risk AI systems are subject to strict requirements including risk management, data governance, technical documentation, transparency, human oversight, and accuracy requirements under Articles 8-15 of the EU AI Act.`,
        mitigationRequired: this.getHighRiskMitigations(annexCheck.categories),
        recommendations: this.getHighRiskRecommendations(aiSystem, annexCheck.categories)
      };
    }

    // Check for limited risk characteristics
    const limitedRiskCheck = this.checkLimitedRisk(aiSystem);
    if (limitedRiskCheck.isLimited) {
      return {
        riskLevel: 'LIMITED_RISK',
        confidenceScore: limitedRiskCheck.confidence,
        annexIIICategories: [],
        euActArticles: ['Article 52'],
        rationale: `${limitedRiskCheck.rationale}. Under Article 52, these systems must comply with transparency obligations to ensure users are aware they are interacting with an AI system.`,
        mitigationRequired: limitedRiskCheck.mitigations,
        recommendations: limitedRiskCheck.recommendations
      };
    }

    // Default to minimal risk
    return {
      riskLevel: 'MINIMAL_RISK',
      confidenceScore: 0.85,
      annexIIICategories: [],
      euActArticles: [],
      rationale: 'System does not fall under prohibited or high-risk categories defined in the EU AI Act. The system has minimal impact on fundamental rights and is not subject to specific regulatory requirements, though voluntary adoption of AI best practices is encouraged.',
      mitigationRequired: [],
      recommendations: [
        'Maintain documentation of system purpose and design',
        'Implement voluntary best practices for responsible AI',
        'Consider regular impact assessments',
        'Monitor for changes in use case that might affect risk classification'
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
    const systemText = `${aiSystem.description} ${aiSystem.purpose} ${aiSystem.intendedUse || ''}`.toLowerCase();
    
    const detectedPractices = this.PROHIBITED_PRACTICES.filter(practice => 
      systemText.includes(practice.toLowerCase())
    );

    if (detectedPractices.length > 0) {
      return {
        isProhibited: true,
        confidence: 0.95,
        rationale: `System involves prohibited practices under Article 5 of the EU AI Act: ${detectedPractices.join(', ')}. These practices are considered unacceptable risks as they contravene Union values by violating fundamental rights and pose clear threats to safety, livelihoods, and democratic processes.`,
        recommendations: [
          'Immediately cease development/deployment of this system',
          'Consult legal counsel for compliance options',
          'Consider alternative approaches that comply with Article 5',
          'Review system design to remove prohibited elements'
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
   * Map intake form category IDs to classification system IDs
   */
  private mapIntakeCategory(intakeCategory: string): string | null {
    const mapping: { [key: string]: string } = {
      'biometrics': 'annex_iii_1',
      'critical_infrastructure': 'annex_iii_2', 
      'education': 'annex_iii_3',
      'employment': 'annex_iii_4',
      'essential_services': 'annex_iii_5',
      'law_enforcement': 'annex_iii_6',
      'migration': 'annex_iii_7',
      'justice': 'annex_iii_8'
    };
    
    return mapping[intakeCategory] || null;
  }

  /**
   * Check if system falls under Annex III high-risk categories
   */
  private checkAnnexIIICategories(aiSystem: AISystem): {
    categories: string[];
    confidence: number;
    rationale: string;
  } {
    const systemText = `${aiSystem.description} ${aiSystem.purpose} ${aiSystem.intendedUse || ''}`.toLowerCase();
    const detectedCategories: string[] = [];
    let totalConfidence = 0;
    let categoryCount = 0;

    // Check if categories were explicitly selected in the intake form
    if (aiSystem.categories && Array.isArray(aiSystem.categories)) {
      for (const selectedCategory of aiSystem.categories) {
        // Map frontend category IDs to our classification system
        const mappedCategory = this.mapIntakeCategory(selectedCategory);
        if (mappedCategory) {
          detectedCategories.push(mappedCategory);
          totalConfidence += 0.9; // High confidence for explicitly selected categories
          categoryCount++;
        }
      }
    }

    // Additional text-based analysis
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

      // Additional checks using new database fields
      if (aiSystem.providesEssentialService && category.id === 'annex_iii_5') {
        categoryScore += 0.6; // High boost for essential services
      }

      // Only add if not already detected from explicit selection and meets threshold
      if (categoryScore >= 0.5 && !detectedCategories.includes(category.id)) {
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
        ? `System has been classified as high-risk under Annex III of the EU AI Act. Detected categories: ${detectedCategories.map(id => 
            Object.values(this.ANNEX_III_CATEGORIES).find(c => c.id === id)?.name
          ).filter(Boolean).join(', ')}`
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
    if (aiSystem.description.toLowerCase().includes('chatbot') ||
        aiSystem.description.toLowerCase().includes('interaction') ||
        aiSystem.description.toLowerCase().includes('assistant')) {
      limitedRiskIndicators.push('Human interaction system');
    }

    // Check for emotion recognition (non-prohibited contexts)
    if (aiSystem.description.toLowerCase().includes('emotion') &&
        !aiSystem.description.toLowerCase().includes('workplace') &&
        !aiSystem.description.toLowerCase().includes('education')) {
      limitedRiskIndicators.push('Emotion recognition system');
    }

    // Check for content generation
    if (aiSystem.description.toLowerCase().includes('generate') ||
        aiSystem.description.toLowerCase().includes('deepfake') ||
        aiSystem.description.toLowerCase().includes('synthetic')) {
      limitedRiskIndicators.push('Content generation system');
    }

    // Check for GPAI systems
    if (aiSystem.gpaiFlag || aiSystem.usesGPAI) {
      limitedRiskIndicators.push('General-purpose AI system');
    }

    if (limitedRiskIndicators.length > 0) {
      return {
        isLimited: true,
        confidence: 0.75,
        rationale: `System has been classified as limited risk due to the following characteristics: ${limitedRiskIndicators.join(', ')}`,
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
    if (aiSystem.gpaiFlag || aiSystem.usesGPAI) {
      recommendations.push('Comply with GPAI model obligations (Chapter V)');
      recommendations.push('Conduct model evaluation if systemic risk threshold met');
    }

    // Actor-specific recommendations
    switch (aiSystem.actorRole.toLowerCase()) {
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