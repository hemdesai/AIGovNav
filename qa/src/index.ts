import { SecurityValidator } from './security/SecurityValidator';
import { PerformanceOptimizer } from './performance/PerformanceOptimizer';
import { CodeQualityChecker } from './quality/CodeQualityChecker';
import { ArchitecturalConsistency } from './architecture/ArchitecturalConsistency';
import { TestingCoverage } from './testing/TestingCoverage';
import { ContinuousLearning } from './learning/ContinuousLearning';

export interface QACheckpoint {
  id: string;
  name: string;
  category: 'security' | 'performance' | 'quality' | 'architecture' | 'testing';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'passed' | 'failed' | 'warning' | 'skipped';
  message?: string;
  metadata?: Record<string, any>;
}

export interface QAResult {
  overallScore: number;
  totalCheckpoints: number;
  passedCheckpoints: number;
  failedCheckpoints: number;
  warningCheckpoints: number;
  results: QACheckpoint[];
  timestamp: string;
  duration: number;
}

export class QASystem {
  private securityValidator: SecurityValidator;
  private performanceOptimizer: PerformanceOptimizer;
  private codeQualityChecker: CodeQualityChecker;
  private architecturalConsistency: ArchitecturalConsistency;
  private testingCoverage: TestingCoverage;
  private continuousLearning: ContinuousLearning;

  constructor() {
    this.securityValidator = new SecurityValidator();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.codeQualityChecker = new CodeQualityChecker();
    this.architecturalConsistency = new ArchitecturalConsistency();
    this.testingCoverage = new TestingCoverage();
    this.continuousLearning = new ContinuousLearning();
  }

  async runFullQA(projectPath: string): Promise<QAResult> {
    const startTime = Date.now();
    const results: QACheckpoint[] = [];

    // Run all 147 quality checkpoints
    const [
      securityResults,
      performanceResults,
      qualityResults,
      architectureResults,
      testingResults
    ] = await Promise.all([
      this.securityValidator.validate(projectPath),
      this.performanceOptimizer.analyze(projectPath),
      this.codeQualityChecker.check(projectPath),
      this.architecturalConsistency.verify(projectPath),
      this.testingCoverage.measure(projectPath)
    ]);

    results.push(...securityResults, ...performanceResults, ...qualityResults, ...architectureResults, ...testingResults);

    const passedCheckpoints = results.filter(r => r.status === 'passed').length;
    const failedCheckpoints = results.filter(r => r.status === 'failed').length;
    const warningCheckpoints = results.filter(r => r.status === 'warning').length;
    const overallScore = Math.round((passedCheckpoints / results.length) * 100);

    const qaResult: QAResult = {
      overallScore,
      totalCheckpoints: results.length,
      passedCheckpoints,
      failedCheckpoints,
      warningCheckpoints,
      results,
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime
    };

    // Feed results to continuous learning system
    await this.continuousLearning.analyzeResults(qaResult);

    return qaResult;
  }

  async runCategory(category: QACheckpoint['category'], projectPath: string): Promise<QACheckpoint[]> {
    switch (category) {
      case 'security':
        return this.securityValidator.validate(projectPath);
      case 'performance':
        return this.performanceOptimizer.analyze(projectPath);
      case 'quality':
        return this.codeQualityChecker.check(projectPath);
      case 'architecture':
        return this.architecturalConsistency.verify(projectPath);
      case 'testing':
        return this.testingCoverage.measure(projectPath);
      default:
        return [];
    }
  }

  getQualityStandards(): Record<string, string[]> {
    return {
      security: [
        'SQL injection prevention',
        'XSS attack protection',
        'Authentication flow security',
        'Data encryption compliance',
        'OWASP Top 10 vulnerability scanning'
      ],
      performance: [
        'Database query efficiency',
        'API response time thresholds',
        'Memory usage optimization',
        'Caching strategy implementation',
        'Load testing validation'
      ],
      quality: [
        'Naming convention compliance',
        'Documentation completeness',
        'Error handling robustness',
        'Logging implementation',
        'Code complexity metrics'
      ],
      architecture: [
        'Design pattern adherence',
        'Component reusability',
        'API design standards',
        'Database schema integrity',
        'Integration point validation'
      ],
      testing: [
        'Unit test completeness',
        'Integration test coverage',
        'End-to-end scenario validation',
        'Error condition testing',
        'Performance benchmark testing'
      ]
    };
  }
}