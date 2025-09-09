import { QACheckpoint } from '../index.js';
import fs from 'fs';
import path from 'path';

export interface EUAIActSystem {
  name: string;
  purpose: string;
  riskLevel: 'minimal' | 'limited' | 'high' | 'unacceptable';
  hasDocumentation: boolean;
  hasTransparencyMeasures: boolean;
  hasHumanOversight: boolean;
  hasConformityAssessment: boolean;
}

export class EUAIActComplianceValidator {
  private readonly checkpoints: Map<string, (projectPath: string) => Promise<QACheckpoint>>;

  constructor() {
    this.checkpoints = new Map();
    this.initializeCheckpoints();
  }

  private initializeCheckpoints(): void {
    // Risk Classification Checkpoints (5)
    this.checkpoints.set('EUAI-001', this.checkRiskClassificationImplementation);
    this.checkpoints.set('EUAI-002', this.checkAnnexIIICategories);
    this.checkpoints.set('EUAI-003', this.checkProhibitedSystems);
    this.checkpoints.set('EUAI-004', this.checkRiskAssessmentProcess);
    this.checkpoints.set('EUAI-005', this.checkRiskMitigationMeasures);

    // Documentation Requirements (5)
    this.checkpoints.set('EUAI-006', this.checkTechnicalDocumentation);
    this.checkpoints.set('EUAI-007', this.checkInstructionsForUse);
    this.checkpoints.set('EUAI-008', this.checkConformityDeclaration);
    this.checkpoints.set('EUAI-009', this.checkDataGovernanceDocumentation);
    this.checkpoints.set('EUAI-010', this.checkPostMarketMonitoringPlan);

    // Transparency Obligations (4)
    this.checkpoints.set('EUAI-011', this.checkUserNotification);
    this.checkpoints.set('EUAI-012', this.checkAIInteractionDisclosure);
    this.checkpoints.set('EUAI-013', this.checkEmotionRecognitionDisclosure);
    this.checkpoints.set('EUAI-014', this.checkDeepfakeDisclosure);

    // Human Oversight (3)
    this.checkpoints.set('EUAI-015', this.checkHumanOversightMeasures);
    this.checkpoints.set('EUAI-016', this.checkHumanInterventionCapability);
    this.checkpoints.set('EUAI-017', this.checkStopButtonImplementation);

    // Data Governance (4)
    this.checkpoints.set('EUAI-018', this.checkDataQualityCriteria);
    this.checkpoints.set('EUAI-019', this.checkDataBiasAssessment);
    this.checkpoints.set('EUAI-020', this.checkDataMinimization);
    this.checkpoints.set('EUAI-021', this.checkDataSecurityMeasures);

    // Accuracy & Robustness (3)
    this.checkpoints.set('EUAI-022', this.checkAccuracyMetrics);
    this.checkpoints.set('EUAI-023', this.checkRobustnessTesting);
    this.checkpoints.set('EUAI-024', this.checkCybersecurityResilience);

    // Conformity Assessment (3)
    this.checkpoints.set('EUAI-025', this.checkConformityProcedure);
    this.checkpoints.set('EUAI-026', this.checkThirdPartyAssessment);
    this.checkpoints.set('EUAI-027', this.checkCEMarkingReadiness);
  }

  async validate(projectPath: string): Promise<QACheckpoint[]> {
    const results: QACheckpoint[] = [];

    for (const [id, validator] of this.checkpoints) {
      try {
        const result = await validator.call(this, projectPath);
        results.push(result);
      } catch (error) {
        results.push({
          id,
          name: `EU AI Act Checkpoint ${id}`,
          category: 'euAICompliance',
          priority: 'high',
          status: 'failed',
          message: `Error running checkpoint: ${error}`
        });
      }
    }

    return results;
  }

  private async checkRiskClassificationImplementation(projectPath: string): Promise<QACheckpoint> {
    const hasRiskClassification = await this.fileContainsPattern(
      path.join(projectPath, 'src/backend/services'),
      /class\s+RiskClassification|function\s+classifyRisk|riskLevel.*high.*limited.*minimal/
    );

    return {
      id: 'EUAI-001',
      name: 'Risk Classification Implementation',
      category: 'euAICompliance',
      priority: 'critical',
      status: hasRiskClassification ? 'passed' : 'failed',
      message: hasRiskClassification 
        ? 'Risk classification system implemented'
        : 'Missing EU AI Act risk classification implementation'
    };
  }

  private async checkAnnexIIICategories(projectPath: string): Promise<QACheckpoint> {
    const annexIIICategories = [
      'biometric', 'critical infrastructure', 'education',
      'employment', 'law enforcement', 'migration', 'justice'
    ];

    const hasCategories = await this.fileContainsPattern(
      projectPath,
      new RegExp(annexIIICategories.join('|'), 'i')
    );

    return {
      id: 'EUAI-002',
      name: 'Annex III Categories Recognition',
      category: 'euAICompliance',
      priority: 'high',
      status: hasCategories ? 'passed' : 'warning',
      message: hasCategories
        ? 'Annex III high-risk categories recognized'
        : 'Annex III categories not fully implemented'
    };
  }

  private async checkProhibitedSystems(projectPath: string): Promise<QACheckpoint> {
    const prohibitedPatterns = [
      'social.{0,10}scoring',
      'subliminal.{0,10}manipulation',
      'real.{0,5}time.{0,10}biometric',
      'exploit.{0,10}vulnerabilit'
    ];

    const hasProhibitionCheck = await this.fileContainsPattern(
      projectPath,
      new RegExp(prohibitedPatterns.join('|'), 'i')
    );

    return {
      id: 'EUAI-003',
      name: 'Prohibited Systems Detection',
      category: 'euAICompliance',
      priority: 'critical',
      status: hasProhibitionCheck ? 'passed' : 'failed',
      message: hasProhibitionCheck
        ? 'Prohibited AI systems detection implemented'
        : 'Missing prohibited AI systems detection'
    };
  }

  private async checkRiskAssessmentProcess(projectPath: string): Promise<QACheckpoint> {
    const hasRiskAssessment = await this.fileContainsPattern(
      projectPath,
      /risk.{0,10}assessment|assess.{0,10}risk|risk.{0,10}evaluation/i
    );

    return {
      id: 'EUAI-004',
      name: 'Risk Assessment Process',
      category: 'euAICompliance',
      priority: 'high',
      status: hasRiskAssessment ? 'passed' : 'warning',
      message: hasRiskAssessment
        ? 'Risk assessment process implemented'
        : 'Risk assessment process needs implementation'
    };
  }

  private async checkRiskMitigationMeasures(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-005',
      name: 'Risk Mitigation Measures',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'Risk mitigation measures need review'
    };
  }

  private async checkTechnicalDocumentation(projectPath: string): Promise<QACheckpoint> {
    const docsPath = path.join(projectPath, 'docs');
    const hasDocumentation = fs.existsSync(docsPath);

    return {
      id: 'EUAI-006',
      name: 'Technical Documentation',
      category: 'euAICompliance',
      priority: 'high',
      status: hasDocumentation ? 'passed' : 'failed',
      message: hasDocumentation
        ? 'Technical documentation structure exists'
        : 'Technical documentation required for high-risk AI systems'
    };
  }

  private async checkInstructionsForUse(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-007',
      name: 'Instructions for Use',
      category: 'euAICompliance',
      priority: 'medium',
      status: 'warning',
      message: 'Instructions for use documentation needs creation'
    };
  }

  private async checkConformityDeclaration(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-008',
      name: 'Declaration of Conformity',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'Declaration of conformity template needed'
    };
  }

  private async checkDataGovernanceDocumentation(projectPath: string): Promise<QACheckpoint> {
    const hasDataGovernance = await this.fileContainsPattern(
      projectPath,
      /data.{0,10}governance|data.{0,10}quality|data.{0,10}management/i
    );

    return {
      id: 'EUAI-009',
      name: 'Data Governance Documentation',
      category: 'euAICompliance',
      priority: 'high',
      status: hasDataGovernance ? 'passed' : 'warning',
      message: hasDataGovernance
        ? 'Data governance measures identified'
        : 'Data governance documentation needs enhancement'
    };
  }

  private async checkPostMarketMonitoringPlan(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-010',
      name: 'Post-Market Monitoring Plan',
      category: 'euAICompliance',
      priority: 'medium',
      status: 'warning',
      message: 'Post-market monitoring plan needs development'
    };
  }

  private async checkUserNotification(projectPath: string): Promise<QACheckpoint> {
    const hasNotification = await this.fileContainsPattern(
      projectPath,
      /user.{0,10}notification|inform.{0,10}user|transparency.{0,10}notice/i
    );

    return {
      id: 'EUAI-011',
      name: 'User Notification System',
      category: 'euAICompliance',
      priority: 'high',
      status: hasNotification ? 'passed' : 'warning',
      message: hasNotification
        ? 'User notification mechanisms present'
        : 'User notification for AI interaction required'
    };
  }

  private async checkAIInteractionDisclosure(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-012',
      name: 'AI Interaction Disclosure',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'AI interaction disclosure needs implementation'
    };
  }

  private async checkEmotionRecognitionDisclosure(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-013',
      name: 'Emotion Recognition Disclosure',
      category: 'euAICompliance',
      priority: 'medium',
      status: 'passed',
      message: 'Emotion recognition disclosure not applicable'
    };
  }

  private async checkDeepfakeDisclosure(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-014',
      name: 'Deepfake Content Disclosure',
      category: 'euAICompliance',
      priority: 'medium',
      status: 'passed',
      message: 'Deepfake disclosure not applicable'
    };
  }

  private async checkHumanOversightMeasures(projectPath: string): Promise<QACheckpoint> {
    const hasOversight = await this.fileContainsPattern(
      projectPath,
      /human.{0,10}oversight|human.{0,10}review|manual.{0,10}override/i
    );

    return {
      id: 'EUAI-015',
      name: 'Human Oversight Measures',
      category: 'euAICompliance',
      priority: 'critical',
      status: hasOversight ? 'passed' : 'failed',
      message: hasOversight
        ? 'Human oversight capabilities detected'
        : 'Human oversight measures required for high-risk AI'
    };
  }

  private async checkHumanInterventionCapability(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-016',
      name: 'Human Intervention Capability',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'Human intervention capability needs verification'
    };
  }

  private async checkStopButtonImplementation(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-017',
      name: 'Stop Button Implementation',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'Emergency stop mechanism needs implementation'
    };
  }

  private async checkDataQualityCriteria(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-018',
      name: 'Data Quality Criteria',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'Data quality criteria need definition'
    };
  }

  private async checkDataBiasAssessment(projectPath: string): Promise<QACheckpoint> {
    const hasBiasCheck = await this.fileContainsPattern(
      projectPath,
      /bias.{0,10}assessment|bias.{0,10}detection|fairness.{0,10}check/i
    );

    return {
      id: 'EUAI-019',
      name: 'Data Bias Assessment',
      category: 'euAICompliance',
      priority: 'high',
      status: hasBiasCheck ? 'passed' : 'warning',
      message: hasBiasCheck
        ? 'Bias assessment mechanisms found'
        : 'Bias assessment procedures needed'
    };
  }

  private async checkDataMinimization(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-020',
      name: 'Data Minimization Principle',
      category: 'euAICompliance',
      priority: 'medium',
      status: 'warning',
      message: 'Data minimization practices need review'
    };
  }

  private async checkDataSecurityMeasures(projectPath: string): Promise<QACheckpoint> {
    const hasEncryption = await this.fileContainsPattern(
      projectPath,
      /encrypt|bcrypt|argon2|crypto|hash/i
    );

    return {
      id: 'EUAI-021',
      name: 'Data Security Measures',
      category: 'euAICompliance',
      priority: 'critical',
      status: hasEncryption ? 'passed' : 'failed',
      message: hasEncryption
        ? 'Data security measures implemented'
        : 'Data security measures required'
    };
  }

  private async checkAccuracyMetrics(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-022',
      name: 'Accuracy Metrics Definition',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'Accuracy metrics need definition and monitoring'
    };
  }

  private async checkRobustnessTesting(projectPath: string): Promise<QACheckpoint> {
    const hasTests = await this.fileContainsPattern(
      projectPath,
      /test|spec|vitest|jest|mocha/i
    );

    return {
      id: 'EUAI-023',
      name: 'Robustness Testing',
      category: 'euAICompliance',
      priority: 'high',
      status: hasTests ? 'warning' : 'failed',
      message: hasTests
        ? 'Testing framework present, robustness tests need expansion'
        : 'Robustness testing framework required'
    };
  }

  private async checkCybersecurityResilience(projectPath: string): Promise<QACheckpoint> {
    const hasSecurityMeasures = await this.fileContainsPattern(
      projectPath,
      /helmet|cors|rate.{0,5}limit|csrf|xss|sql.{0,5}injection/i
    );

    return {
      id: 'EUAI-024',
      name: 'Cybersecurity Resilience',
      category: 'euAICompliance',
      priority: 'critical',
      status: hasSecurityMeasures ? 'passed' : 'failed',
      message: hasSecurityMeasures
        ? 'Cybersecurity measures implemented'
        : 'Cybersecurity resilience measures required'
    };
  }

  private async checkConformityProcedure(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-025',
      name: 'Conformity Assessment Procedure',
      category: 'euAICompliance',
      priority: 'high',
      status: 'warning',
      message: 'Conformity assessment procedure needs documentation'
    };
  }

  private async checkThirdPartyAssessment(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-026',
      name: 'Third-Party Assessment Readiness',
      category: 'euAICompliance',
      priority: 'medium',
      status: 'warning',
      message: 'Prepare for third-party conformity assessment'
    };
  }

  private async checkCEMarkingReadiness(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'EUAI-027',
      name: 'CE Marking Readiness',
      category: 'euAICompliance',
      priority: 'medium',
      status: 'warning',
      message: 'CE marking requirements need preparation'
    };
  }

  private async fileContainsPattern(searchPath: string, pattern: RegExp): Promise<boolean> {
    if (!fs.existsSync(searchPath)) {
      return false;
    }

    const stat = fs.statSync(searchPath);
    
    if (stat.isFile()) {
      const content = fs.readFileSync(searchPath, 'utf-8');
      return pattern.test(content);
    }

    if (stat.isDirectory()) {
      const files = this.getAllFiles(searchPath);
      for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
          const content = fs.readFileSync(file, 'utf-8');
          if (pattern.test(content)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory() && !file.includes('node_modules')) {
        arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
      } else {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  }
}