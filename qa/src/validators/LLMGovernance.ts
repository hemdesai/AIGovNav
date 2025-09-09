import { QACheckpoint } from '../index.js';
import fs from 'fs';
import path from 'path';

export interface LLMGovernanceCheck {
  promptSafety: boolean;
  responseValidation: boolean;
  costTracking: boolean;
  rateLimiting: boolean;
  auditLogging: boolean;
  modelVersionControl: boolean;
}

export class LLMGovernanceValidator {
  private readonly checkpoints: Map<string, (projectPath: string) => Promise<QACheckpoint>>;

  constructor() {
    this.checkpoints = new Map();
    this.initializeCheckpoints();
  }

  private initializeCheckpoints(): void {
    // Prompt Safety & Security (5)
    this.checkpoints.set('LLM-001', this.checkPromptInjectionPrevention);
    this.checkpoints.set('LLM-002', this.checkPromptSanitization);
    this.checkpoints.set('LLM-003', this.checkSensitiveDataFiltering);
    this.checkpoints.set('LLM-004', this.checkPromptLengthLimits);
    this.checkpoints.set('LLM-005', this.checkMaliciousPromptDetection);

    // Response Validation (5)
    this.checkpoints.set('LLM-006', this.checkResponseValidation);
    this.checkpoints.set('LLM-007', this.checkHallucinationDetection);
    this.checkpoints.set('LLM-008', this.checkToxicityFiltering);
    this.checkpoints.set('LLM-009', this.checkPIIRedaction);
    this.checkpoints.set('LLM-010', this.checkResponseAccuracy);

    // Cost & Resource Management (4)
    this.checkpoints.set('LLM-011', this.checkTokenUsageTracking);
    this.checkpoints.set('LLM-012', this.checkCostMonitoring);
    this.checkpoints.set('LLM-013', this.checkRateLimiting);
    this.checkpoints.set('LLM-014', this.checkQuotaManagement);

    // Audit & Compliance (5)
    this.checkpoints.set('LLM-015', this.checkPromptLogging);
    this.checkpoints.set('LLM-016', this.checkResponseLogging);
    this.checkpoints.set('LLM-017', this.checkUserAttributionTracking);
    this.checkpoints.set('LLM-018', this.checkComplianceReporting);
    this.checkpoints.set('LLM-019', this.checkAuditTrail);

    // Model Governance (4)
    this.checkpoints.set('LLM-020', this.checkModelVersionControl);
    this.checkpoints.set('LLM-021', this.checkModelPerformanceMonitoring);
    this.checkpoints.set('LLM-022', this.checkModelUpdatePolicy);
    this.checkpoints.set('LLM-023', this.checkFallbackMechanisms);
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
          name: `LLM Governance Checkpoint ${id}`,
          category: 'llmGovernance',
          priority: 'high',
          status: 'failed',
          message: `Error running checkpoint: ${error}`
        });
      }
    }

    return results;
  }

  private async checkPromptInjectionPrevention(projectPath: string): Promise<QACheckpoint> {
    const hasProtection = await this.fileContainsPattern(
      projectPath,
      /prompt.{0,10}injection|injection.{0,10}prevention|sanitize.{0,10}prompt/i
    );

    return {
      id: 'LLM-001',
      name: 'Prompt Injection Prevention',
      category: 'llmGovernance',
      priority: 'critical',
      status: hasProtection ? 'passed' : 'failed',
      message: hasProtection
        ? 'Prompt injection prevention implemented'
        : 'Prompt injection prevention required for LLM safety'
    };
  }

  private async checkPromptSanitization(projectPath: string): Promise<QACheckpoint> {
    const hasSanitization = await this.fileContainsPattern(
      projectPath,
      /sanitize|clean.{0,10}input|validate.{0,10}prompt|escape.{0,10}special/i
    );

    return {
      id: 'LLM-002',
      name: 'Prompt Sanitization',
      category: 'llmGovernance',
      priority: 'high',
      status: hasSanitization ? 'passed' : 'warning',
      message: hasSanitization
        ? 'Prompt sanitization implemented'
        : 'Prompt sanitization recommended'
    };
  }

  private async checkSensitiveDataFiltering(projectPath: string): Promise<QACheckpoint> {
    const hasFiltering = await this.fileContainsPattern(
      projectPath,
      /sensitive.{0,10}data|pii|personal.{0,10}information|redact/i
    );

    return {
      id: 'LLM-003',
      name: 'Sensitive Data Filtering',
      category: 'llmGovernance',
      priority: 'critical',
      status: hasFiltering ? 'passed' : 'failed',
      message: hasFiltering
        ? 'Sensitive data filtering detected'
        : 'Sensitive data filtering required for compliance'
    };
  }

  private async checkPromptLengthLimits(projectPath: string): Promise<QACheckpoint> {
    const hasLimits = await this.fileContainsPattern(
      projectPath,
      /max.{0,10}length|token.{0,10}limit|prompt.{0,10}size|character.{0,10}limit/i
    );

    return {
      id: 'LLM-004',
      name: 'Prompt Length Limits',
      category: 'llmGovernance',
      priority: 'medium',
      status: hasLimits ? 'passed' : 'warning',
      message: hasLimits
        ? 'Prompt length limits configured'
        : 'Consider implementing prompt length limits'
    };
  }

  private async checkMaliciousPromptDetection(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'LLM-005',
      name: 'Malicious Prompt Detection',
      category: 'llmGovernance',
      priority: 'high',
      status: 'warning',
      message: 'Malicious prompt detection system recommended'
    };
  }

  private async checkResponseValidation(projectPath: string): Promise<QACheckpoint> {
    const hasValidation = await this.fileContainsPattern(
      projectPath,
      /validate.{0,10}response|response.{0,10}validation|output.{0,10}check/i
    );

    return {
      id: 'LLM-006',
      name: 'Response Validation',
      category: 'llmGovernance',
      priority: 'high',
      status: hasValidation ? 'passed' : 'warning',
      message: hasValidation
        ? 'Response validation implemented'
        : 'Response validation needed for quality assurance'
    };
  }

  private async checkHallucinationDetection(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'LLM-007',
      name: 'Hallucination Detection',
      category: 'llmGovernance',
      priority: 'high',
      status: 'warning',
      message: 'Hallucination detection mechanisms recommended'
    };
  }

  private async checkToxicityFiltering(projectPath: string): Promise<QACheckpoint> {
    const hasFiltering = await this.fileContainsPattern(
      projectPath,
      /toxic|harmful.{0,10}content|inappropriate|offensive/i
    );

    return {
      id: 'LLM-008',
      name: 'Toxicity Filtering',
      category: 'llmGovernance',
      priority: 'high',
      status: hasFiltering ? 'passed' : 'warning',
      message: hasFiltering
        ? 'Toxicity filtering measures found'
        : 'Toxicity filtering recommended for safety'
    };
  }

  private async checkPIIRedaction(projectPath: string): Promise<QACheckpoint> {
    const hasRedaction = await this.fileContainsPattern(
      projectPath,
      /redact|mask.{0,10}pii|anonymize|remove.{0,10}personal/i
    );

    return {
      id: 'LLM-009',
      name: 'PII Redaction',
      category: 'llmGovernance',
      priority: 'critical',
      status: hasRedaction ? 'passed' : 'failed',
      message: hasRedaction
        ? 'PII redaction implemented'
        : 'PII redaction required for privacy compliance'
    };
  }

  private async checkResponseAccuracy(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'LLM-010',
      name: 'Response Accuracy Monitoring',
      category: 'llmGovernance',
      priority: 'medium',
      status: 'warning',
      message: 'Response accuracy monitoring needs implementation'
    };
  }

  private async checkTokenUsageTracking(projectPath: string): Promise<QACheckpoint> {
    const hasTracking = await this.fileContainsPattern(
      projectPath,
      /token.{0,10}usage|token.{0,10}count|usage.{0,10}tracking/i
    );

    return {
      id: 'LLM-011',
      name: 'Token Usage Tracking',
      category: 'llmGovernance',
      priority: 'high',
      status: hasTracking ? 'passed' : 'warning',
      message: hasTracking
        ? 'Token usage tracking implemented'
        : 'Token usage tracking recommended for cost management'
    };
  }

  private async checkCostMonitoring(projectPath: string): Promise<QACheckpoint> {
    const hasMonitoring = await this.fileContainsPattern(
      projectPath,
      /cost.{0,10}tracking|cost.{0,10}monitor|api.{0,10}cost|billing/i
    );

    return {
      id: 'LLM-012',
      name: 'Cost Monitoring',
      category: 'llmGovernance',
      priority: 'high',
      status: hasMonitoring ? 'passed' : 'warning',
      message: hasMonitoring
        ? 'Cost monitoring implemented'
        : 'Cost monitoring system needed'
    };
  }

  private async checkRateLimiting(projectPath: string): Promise<QACheckpoint> {
    const hasRateLimiting = await this.fileContainsPattern(
      projectPath,
      /rate.{0,10}limit|throttle|request.{0,10}limit|api.{0,10}quota/i
    );

    return {
      id: 'LLM-013',
      name: 'Rate Limiting',
      category: 'llmGovernance',
      priority: 'critical',
      status: hasRateLimiting ? 'passed' : 'failed',
      message: hasRateLimiting
        ? 'Rate limiting configured'
        : 'Rate limiting required to prevent abuse'
    };
  }

  private async checkQuotaManagement(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'LLM-014',
      name: 'Quota Management',
      category: 'llmGovernance',
      priority: 'medium',
      status: 'warning',
      message: 'User quota management system recommended'
    };
  }

  private async checkPromptLogging(projectPath: string): Promise<QACheckpoint> {
    const hasLogging = await this.fileContainsPattern(
      projectPath,
      /log.{0,10}prompt|prompt.{0,10}log|audit.{0,10}prompt/i
    );

    return {
      id: 'LLM-015',
      name: 'Prompt Logging',
      category: 'llmGovernance',
      priority: 'high',
      status: hasLogging ? 'passed' : 'warning',
      message: hasLogging
        ? 'Prompt logging implemented'
        : 'Prompt logging needed for audit trail'
    };
  }

  private async checkResponseLogging(projectPath: string): Promise<QACheckpoint> {
    const hasLogging = await this.fileContainsPattern(
      projectPath,
      /log.{0,10}response|response.{0,10}log|output.{0,10}logging/i
    );

    return {
      id: 'LLM-016',
      name: 'Response Logging',
      category: 'llmGovernance',
      priority: 'high',
      status: hasLogging ? 'passed' : 'warning',
      message: hasLogging
        ? 'Response logging implemented'
        : 'Response logging needed for compliance'
    };
  }

  private async checkUserAttributionTracking(projectPath: string): Promise<QACheckpoint> {
    const hasAttribution = await this.fileContainsPattern(
      projectPath,
      /user.{0,10}id|user.{0,10}tracking|attribution|user.{0,10}context/i
    );

    return {
      id: 'LLM-017',
      name: 'User Attribution Tracking',
      category: 'llmGovernance',
      priority: 'high',
      status: hasAttribution ? 'passed' : 'warning',
      message: hasAttribution
        ? 'User attribution tracking found'
        : 'User attribution tracking recommended'
    };
  }

  private async checkComplianceReporting(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'LLM-018',
      name: 'Compliance Reporting',
      category: 'llmGovernance',
      priority: 'medium',
      status: 'warning',
      message: 'LLM compliance reporting system needs development'
    };
  }

  private async checkAuditTrail(projectPath: string): Promise<QACheckpoint> {
    const hasAudit = await this.fileContainsPattern(
      projectPath,
      /audit.{0,10}trail|audit.{0,10}log|activity.{0,10}log/i
    );

    return {
      id: 'LLM-019',
      name: 'Audit Trail',
      category: 'llmGovernance',
      priority: 'high',
      status: hasAudit ? 'passed' : 'failed',
      message: hasAudit
        ? 'Audit trail system implemented'
        : 'Audit trail required for governance'
    };
  }

  private async checkModelVersionControl(projectPath: string): Promise<QACheckpoint> {
    const hasVersioning = await this.fileContainsPattern(
      projectPath,
      /model.{0,10}version|version.{0,10}control|model.{0,10}registry/i
    );

    return {
      id: 'LLM-020',
      name: 'Model Version Control',
      category: 'llmGovernance',
      priority: 'high',
      status: hasVersioning ? 'passed' : 'warning',
      message: hasVersioning
        ? 'Model version control detected'
        : 'Model version control recommended'
    };
  }

  private async checkModelPerformanceMonitoring(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'LLM-021',
      name: 'Model Performance Monitoring',
      category: 'llmGovernance',
      priority: 'medium',
      status: 'warning',
      message: 'Model performance monitoring needs implementation'
    };
  }

  private async checkModelUpdatePolicy(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'LLM-022',
      name: 'Model Update Policy',
      category: 'llmGovernance',
      priority: 'medium',
      status: 'warning',
      message: 'Model update policy documentation needed'
    };
  }

  private async checkFallbackMechanisms(projectPath: string): Promise<QACheckpoint> {
    const hasFallback = await this.fileContainsPattern(
      projectPath,
      /fallback|backup.{0,10}model|failover|contingency/i
    );

    return {
      id: 'LLM-023',
      name: 'Fallback Mechanisms',
      category: 'llmGovernance',
      priority: 'high',
      status: hasFallback ? 'passed' : 'warning',
      message: hasFallback
        ? 'Fallback mechanisms detected'
        : 'Fallback mechanisms recommended for reliability'
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