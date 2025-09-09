import fs from 'fs';
import path from 'path';
import { QAResult, QACheckpoint } from '../index';

export interface LearningPattern {
  id: string;
  category: string;
  pattern: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  lastSeen: string;
}

export interface KnowledgeUpdate {
  checkpointId: string;
  oldThreshold: number;
  newThreshold: number;
  reason: string;
  timestamp: string;
}

export class ContinuousLearning {
  private readonly LEARNING_DATA_PATH = 'qa-learning-data.json';
  private learningPatterns: LearningPattern[] = [];
  private knowledgeUpdates: KnowledgeUpdate[] = [];

  constructor() {
    this.loadLearningData();
  }

  async analyzeResults(qaResult: QAResult): Promise<void> {
    // 1. Failure Analysis - Identify root cause patterns
    await this.performFailureAnalysis(qaResult);
    
    // 2. Knowledge Update - Learn from new patterns
    await this.updateKnowledge(qaResult);
    
    // 3. System-Wide Learning - Apply improvements across all agents
    await this.applySystemWideLearning(qaResult);
    
    // 4. Prevention Implementation - Prevent similar issues
    await this.implementPrevention(qaResult);
    
    // Save learning data
    await this.saveLearningData();
  }

  private async performFailureAnalysis(qaResult: QAResult): Promise<void> {
    const failedCheckpoints = qaResult.results.filter(r => r.status === 'failed');
    const warningCheckpoints = qaResult.results.filter(r => r.status === 'warning');

    // Analyze failure patterns
    for (const checkpoint of [...failedCheckpoints, ...warningCheckpoints]) {
      await this.analyzeCheckpointPattern(checkpoint);
    }

    // Identify recurring issues
    const recurringPatterns = this.identifyRecurringPatterns();
    
    // Update pattern frequency
    for (const pattern of recurringPatterns) {
      const existingPattern = this.learningPatterns.find(p => p.id === pattern.id);
      if (existingPattern) {
        existingPattern.frequency++;
        existingPattern.lastSeen = new Date().toISOString();
      } else {
        this.learningPatterns.push({
          ...pattern,
          frequency: 1,
          lastSeen: new Date().toISOString()
        });
      }
    }
  }

  private async analyzeCheckpointPattern(checkpoint: QACheckpoint): Promise<void> {
    // Pattern analysis based on checkpoint category and failure type
    const patternId = `${checkpoint.category}-${checkpoint.id}`;
    
    let severity: LearningPattern['severity'] = 'low';
    switch (checkpoint.priority) {
      case 'critical':
        severity = 'critical';
        break;
      case 'high':
        severity = 'high';
        break;
      case 'medium':
        severity = 'medium';
        break;
      default:
        severity = 'low';
    }

    const pattern: LearningPattern = {
      id: patternId,
      category: checkpoint.category,
      pattern: this.extractPattern(checkpoint),
      frequency: 0,
      severity,
      recommendation: this.generateRecommendation(checkpoint),
      lastSeen: new Date().toISOString()
    };

    // Add to learning patterns if not already exists
    if (!this.learningPatterns.find(p => p.id === patternId)) {
      this.learningPatterns.push(pattern);
    }
  }

  private extractPattern(checkpoint: QACheckpoint): string {
    // Extract failure patterns based on checkpoint type
    switch (checkpoint.category) {
      case 'security':
        return this.extractSecurityPattern(checkpoint);
      case 'performance':
        return this.extractPerformancePattern(checkpoint);
      case 'quality':
        return this.extractQualityPattern(checkpoint);
      case 'architecture':
        return this.extractArchitecturePattern(checkpoint);
      case 'testing':
        return this.extractTestingPattern(checkpoint);
      default:
        return checkpoint.message || 'Unknown pattern';
    }
  }

  private extractSecurityPattern(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('SQL')) return 'SQL injection vulnerability detected';
    if (checkpoint.id.includes('XSS')) return 'Cross-site scripting vulnerability detected';
    if (checkpoint.id.includes('AUTH')) return 'Authentication security issue detected';
    if (checkpoint.id.includes('ENCRYPT')) return 'Encryption implementation issue detected';
    return 'General security pattern detected';
  }

  private extractPerformancePattern(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('DATABASE')) return 'Database performance issue detected';
    if (checkpoint.id.includes('API')) return 'API response time issue detected';
    if (checkpoint.id.includes('MEMORY')) return 'Memory usage optimization needed';
    if (checkpoint.id.includes('CACHE')) return 'Caching strategy improvement needed';
    return 'General performance pattern detected';
  }

  private extractQualityPattern(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('NAMING')) return 'Naming convention violation detected';
    if (checkpoint.id.includes('DOC')) return 'Documentation completeness issue detected';
    if (checkpoint.id.includes('ERROR')) return 'Error handling implementation issue detected';
    if (checkpoint.id.includes('LOG')) return 'Logging implementation issue detected';
    return 'General code quality pattern detected';
  }

  private extractArchitecturePattern(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('PATTERN')) return 'Design pattern implementation issue detected';
    if (checkpoint.id.includes('API')) return 'API design consistency issue detected';
    if (checkpoint.id.includes('DATABASE')) return 'Database schema integrity issue detected';
    if (checkpoint.id.includes('INTEGRATION')) return 'Integration point validation issue detected';
    return 'General architectural pattern detected';
  }

  private extractTestingPattern(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('UNIT')) return 'Unit test coverage issue detected';
    if (checkpoint.id.includes('INTEGRATION')) return 'Integration test coverage issue detected';
    if (checkpoint.id.includes('E2E')) return 'End-to-end test coverage issue detected';
    if (checkpoint.id.includes('PERFORMANCE')) return 'Performance test coverage issue detected';
    return 'General testing pattern detected';
  }

  private generateRecommendation(checkpoint: QACheckpoint): string {
    switch (checkpoint.category) {
      case 'security':
        return this.generateSecurityRecommendation(checkpoint);
      case 'performance':
        return this.generatePerformanceRecommendation(checkpoint);
      case 'quality':
        return this.generateQualityRecommendation(checkpoint);
      case 'architecture':
        return this.generateArchitectureRecommendation(checkpoint);
      case 'testing':
        return this.generateTestingRecommendation(checkpoint);
      default:
        return 'Review and address the identified issue';
    }
  }

  private generateSecurityRecommendation(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('SQL')) return 'Implement parameterized queries and input validation';
    if (checkpoint.id.includes('XSS')) return 'Add output encoding and CSP headers';
    if (checkpoint.id.includes('AUTH')) return 'Strengthen authentication mechanisms and session management';
    if (checkpoint.id.includes('ENCRYPT')) return 'Implement proper encryption for data at rest and in transit';
    return 'Follow OWASP security guidelines and best practices';
  }

  private generatePerformanceRecommendation(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('DATABASE')) return 'Optimize database queries and implement proper indexing';
    if (checkpoint.id.includes('API')) return 'Implement caching and optimize API response times';
    if (checkpoint.id.includes('MEMORY')) return 'Review memory usage patterns and implement optimization strategies';
    if (checkpoint.id.includes('CACHE')) return 'Implement comprehensive caching strategy';
    return 'Profile application performance and optimize bottlenecks';
  }

  private generateQualityRecommendation(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('NAMING')) return 'Establish and enforce consistent naming conventions';
    if (checkpoint.id.includes('DOC')) return 'Improve code documentation and maintain up-to-date README';
    if (checkpoint.id.includes('ERROR')) return 'Implement comprehensive error handling and logging';
    if (checkpoint.id.includes('LOG')) return 'Establish structured logging with appropriate levels';
    return 'Follow coding standards and best practices';
  }

  private generateArchitectureRecommendation(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('PATTERN')) return 'Implement consistent design patterns across the application';
    if (checkpoint.id.includes('API')) return 'Follow RESTful API design principles and maintain consistency';
    if (checkpoint.id.includes('DATABASE')) return 'Review and optimize database schema design';
    if (checkpoint.id.includes('INTEGRATION')) return 'Implement robust integration patterns with proper error handling';
    return 'Maintain architectural consistency and follow established patterns';
  }

  private generateTestingRecommendation(checkpoint: QACheckpoint): string {
    if (checkpoint.id.includes('UNIT')) return 'Increase unit test coverage and improve test quality';
    if (checkpoint.id.includes('INTEGRATION')) return 'Implement comprehensive integration tests';
    if (checkpoint.id.includes('E2E')) return 'Create end-to-end tests for critical user workflows';
    if (checkpoint.id.includes('PERFORMANCE')) return 'Implement performance testing and monitoring';
    return 'Improve test coverage and quality across all testing levels';
  }

  private identifyRecurringPatterns(): LearningPattern[] {
    // Return patterns that have been seen multiple times
    return this.learningPatterns.filter(pattern => pattern.frequency > 2);
  }

  private async updateKnowledge(qaResult: QAResult): Promise<void> {
    // Update thresholds based on performance
    if (qaResult.overallScore > 95) {
      // System performing excellently, maybe increase thresholds
      await this.adjustThresholds('increase', qaResult);
    } else if (qaResult.overallScore < 70) {
      // System struggling, maybe decrease thresholds temporarily
      await this.adjustThresholds('decrease', qaResult);
    }

    // Learn from successful patterns
    const successfulCheckpoints = qaResult.results.filter(r => r.status === 'passed');
    for (const checkpoint of successfulCheckpoints) {
      await this.reinforceSuccessPattern(checkpoint);
    }
  }

  private async adjustThresholds(direction: 'increase' | 'decrease', qaResult: QAResult): Promise<void> {
    const adjustment = direction === 'increase' ? 1.1 : 0.9;
    
    // Example threshold adjustments (in a real system, these would be more sophisticated)
    const update: KnowledgeUpdate = {
      checkpointId: 'GLOBAL',
      oldThreshold: 80,
      newThreshold: 80 * adjustment,
      reason: `Overall score ${qaResult.overallScore}% suggests ${direction} in standards`,
      timestamp: new Date().toISOString()
    };

    this.knowledgeUpdates.push(update);
  }

  private async reinforceSuccessPattern(checkpoint: QACheckpoint): Promise<void> {
    // Reinforce patterns that consistently pass
    const patternId = `success-${checkpoint.category}-${checkpoint.id}`;
    const existingPattern = this.learningPatterns.find(p => p.id === patternId);
    
    if (existingPattern) {
      existingPattern.frequency++;
    } else {
      const successPattern: LearningPattern = {
        id: patternId,
        category: checkpoint.category,
        pattern: `Successful implementation: ${checkpoint.name}`,
        frequency: 1,
        severity: 'low',
        recommendation: 'Continue following this successful pattern',
        lastSeen: new Date().toISOString()
      };
      this.learningPatterns.push(successPattern);
    }
  }

  private async applySystemWideLearning(qaResult: QAResult): Promise<void> {
    // Apply learnings across the entire system
    const criticalPatterns = this.learningPatterns.filter(p => 
      p.severity === 'critical' && p.frequency >= 3
    );

    for (const pattern of criticalPatterns) {
      await this.propagateLearning(pattern);
    }
  }

  private async propagateLearning(pattern: LearningPattern): Promise<void> {
    // In a real system, this would update other agents/components
    console.log(`Propagating critical learning pattern: ${pattern.pattern}`);
    console.log(`Recommendation: ${pattern.recommendation}`);
  }

  private async implementPrevention(qaResult: QAResult): Promise<void> {
    // Implement preventive measures based on learning patterns
    const highFrequencyPatterns = this.learningPatterns.filter(p => p.frequency >= 5);
    
    for (const pattern of highFrequencyPatterns) {
      await this.createPreventiveMeasure(pattern);
    }
  }

  private async createPreventiveMeasure(pattern: LearningPattern): Promise<void> {
    // Create preventive measures (in real system, this might update linting rules, CI checks, etc.)
    console.log(`Creating preventive measure for pattern: ${pattern.pattern}`);
    
    // Example: Add to automated checks
    const preventiveMeasure = {
      pattern: pattern.pattern,
      category: pattern.category,
      automatedCheck: pattern.recommendation,
      implementedAt: new Date().toISOString()
    };

    // In a real system, this would be integrated with CI/CD pipeline
  }

  private async loadLearningData(): Promise<void> {
    try {
      const dataPath = path.join(process.cwd(), this.LEARNING_DATA_PATH);
      if (fs.existsSync(dataPath)) {
        const data = fs.readFileSync(dataPath, 'utf8');
        const learningData = JSON.parse(data);
        this.learningPatterns = learningData.patterns || [];
        this.knowledgeUpdates = learningData.updates || [];
      }
    } catch (error) {
      console.warn('Could not load learning data, starting fresh');
      this.learningPatterns = [];
      this.knowledgeUpdates = [];
    }
  }

  private async saveLearningData(): Promise<void> {
    try {
      const dataPath = path.join(process.cwd(), this.LEARNING_DATA_PATH);
      const learningData = {
        patterns: this.learningPatterns,
        updates: this.knowledgeUpdates,
        lastUpdated: new Date().toISOString()
      };
      
      fs.writeFileSync(dataPath, JSON.stringify(learningData, null, 2));
    } catch (error) {
      console.error('Could not save learning data:', error);
    }
  }

  // Public methods for accessing learning insights
  public getLearningInsights(): {
    patterns: LearningPattern[];
    updates: KnowledgeUpdate[];
    criticalPatterns: LearningPattern[];
    recommendations: string[];
  } {
    const criticalPatterns = this.learningPatterns.filter(p => 
      p.severity === 'critical' || p.frequency >= 5
    );

    const recommendations = criticalPatterns.map(p => p.recommendation);

    return {
      patterns: this.learningPatterns,
      updates: this.knowledgeUpdates,
      criticalPatterns,
      recommendations
    };
  }

  public getSystemWideRecommendations(): string[] {
    const highPriorityPatterns = this.learningPatterns
      .filter(p => p.severity === 'critical' || p.frequency >= 3)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    return highPriorityPatterns.map(p => p.recommendation);
  }
}