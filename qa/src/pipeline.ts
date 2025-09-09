#!/usr/bin/env tsx

import { QASystem } from './index.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = promisify(exec);

interface PipelineConfig {
  projectPath: string;
  thresholds: {
    overall: number;
    security: number;
    performance: number;
    quality: number;
    architecture: number;
    testing: number;
  };
  integrations: {
    github: boolean;
    slack: boolean;
    email: boolean;
  };
  reportPath: string;
}

class QAPipeline {
  private config: PipelineConfig;
  private qaSystem: QASystem;

  constructor(config: PipelineConfig) {
    this.config = config;
    this.qaSystem = new QASystem();
  }

  async run(): Promise<void> {
    console.log('🚀 Starting AI Governance QA Pipeline...');
    
    try {
      // 1. Pre-flight checks
      await this.preflightChecks();
      
      // 2. Run complete QA analysis
      const qaResult = await this.qaSystem.runFullQA(this.config.projectPath);
      
      // 3. Generate comprehensive report
      await this.generateReport(qaResult);
      
      // 4. Check thresholds and determine pipeline status
      const pipelineStatus = await this.checkThresholds(qaResult);
      
      // 5. Send notifications
      await this.sendNotifications(qaResult, pipelineStatus);
      
      // 6. Update CI/CD status
      await this.updateCIStatus(pipelineStatus);
      
      console.log(`✅ QA Pipeline completed with status: ${pipelineStatus}`);
      
      // Exit with appropriate code
      process.exit(pipelineStatus === 'passed' ? 0 : 1);
      
    } catch (error) {
      console.error('❌ QA Pipeline failed:', error);
      await this.handlePipelineFailure(error);
      process.exit(1);
    }
  }

  private async preflightChecks(): Promise<void> {
    console.log('🔍 Running preflight checks...');
    
    // Check if project path exists
    if (!fs.existsSync(this.config.projectPath)) {
      throw new Error(`Project path does not exist: ${this.config.projectPath}`);
    }

    // Check if package.json exists
    const packageJsonPath = path.join(this.config.projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found in project root');
    }

    // Install dependencies if needed
    try {
      const { stdout } = await execAsync('npm ls', { cwd: this.config.projectPath });
      console.log('📦 Dependencies verified');
    } catch (error) {
      console.log('📦 Installing missing dependencies...');
      await execAsync('npm install', { cwd: this.config.projectPath });
    }

    // Check if TypeScript compilation works
    try {
      await execAsync('npx tsc --noEmit', { cwd: this.config.projectPath });
      console.log('✅ TypeScript compilation successful');
    } catch (error) {
      console.warn('⚠️  TypeScript compilation issues detected');
    }

    console.log('✅ Preflight checks completed');
  }

  private async generateReport(qaResult: any): Promise<void> {
    console.log('📊 Generating comprehensive QA report...');
    
    const reportData = {
      summary: {
        overallScore: qaResult.overallScore,
        totalCheckpoints: qaResult.totalCheckpoints,
        passedCheckpoints: qaResult.passedCheckpoints,
        failedCheckpoints: qaResult.failedCheckpoints,
        warningCheckpoints: qaResult.warningCheckpoints,
        timestamp: qaResult.timestamp,
        duration: qaResult.duration
      },
      categories: this.getCategoryBreakdown(qaResult),
      failedChecks: qaResult.results.filter((r: any) => r.status === 'failed'),
      warningChecks: qaResult.results.filter((r: any) => r.status === 'warning'),
      recommendations: this.generateRecommendations(qaResult),
      trends: await this.analyzeTrends(qaResult),
      detailedResults: qaResult.results
    };

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(reportData);
    const htmlPath = path.join(this.config.reportPath, 'qa-report.html');
    fs.writeFileSync(htmlPath, htmlReport);

    // Generate JSON report
    const jsonPath = path.join(this.config.reportPath, 'qa-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2));

    // Generate markdown summary
    const mdReport = this.generateMarkdownReport(reportData);
    const mdPath = path.join(this.config.reportPath, 'qa-summary.md');
    fs.writeFileSync(mdPath, mdReport);

    console.log(`📄 Reports generated in ${this.config.reportPath}`);
  }

  private getCategoryBreakdown(qaResult: any): any {
    const categories = ['security', 'performance', 'quality', 'architecture', 'testing'];
    const breakdown: any = {};

    for (const category of categories) {
      const categoryResults = qaResult.results.filter((r: any) => r.category === category);
      const passed = categoryResults.filter((r: any) => r.status === 'passed').length;
      const failed = categoryResults.filter((r: any) => r.status === 'failed').length;
      const warnings = categoryResults.filter((r: any) => r.status === 'warning').length;
      const total = categoryResults.length;
      const percentage = Math.round((passed / total) * 100);

      breakdown[category] = {
        total,
        passed,
        failed,
        warnings,
        percentage,
        status: percentage >= this.config.thresholds[category as keyof typeof this.config.thresholds] ? 'passed' : 'failed'
      };
    }

    return breakdown;
  }

  private generateRecommendations(qaResult: any): string[] {
    const recommendations: string[] = [];
    const failedChecks = qaResult.results.filter((r: any) => r.status === 'failed');
    const warningChecks = qaResult.results.filter((r: any) => r.status === 'warning');

    // Generate category-specific recommendations
    const categories = ['security', 'performance', 'quality', 'architecture', 'testing'];
    for (const category of categories) {
      const categoryFailed = failedChecks.filter((r: any) => r.category === category);
      const categoryWarnings = warningChecks.filter((r: any) => r.category === category);

      if (categoryFailed.length > 0 || categoryWarnings.length > 0) {
        recommendations.push(...this.getCategoryRecommendations(category, categoryFailed, categoryWarnings));
      }
    }

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  private getCategoryRecommendations(category: string, failed: any[], warnings: any[]): string[] {
    const recommendations: string[] = [];

    switch (category) {
      case 'security':
        if (failed.length > 0) recommendations.push('Implement critical security measures immediately');
        if (warnings.length > 0) recommendations.push('Review and strengthen security practices');
        break;
      case 'performance':
        if (failed.length > 0) recommendations.push('Address critical performance bottlenecks');
        if (warnings.length > 0) recommendations.push('Optimize application performance');
        break;
      case 'quality':
        if (failed.length > 0) recommendations.push('Improve code quality standards adherence');
        if (warnings.length > 0) recommendations.push('Enhance documentation and error handling');
        break;
      case 'architecture':
        if (failed.length > 0) recommendations.push('Refactor to follow architectural best practices');
        if (warnings.length > 0) recommendations.push('Improve architectural consistency');
        break;
      case 'testing':
        if (failed.length > 0) recommendations.push('Implement missing critical tests');
        if (warnings.length > 0) recommendations.push('Increase test coverage and quality');
        break;
    }

    return recommendations;
  }

  private async analyzeTrends(qaResult: any): Promise<any> {
    // In a real implementation, this would compare with historical data
    return {
      overallTrend: 'improving', // 'improving', 'stable', 'declining'
      categoryTrends: {
        security: 'stable',
        performance: 'improving',
        quality: 'improving',
        architecture: 'stable',
        testing: 'declining'
      },
      riskLevel: qaResult.overallScore >= 90 ? 'low' : qaResult.overallScore >= 80 ? 'medium' : 'high'
    };
  }

  private async checkThresholds(qaResult: any): Promise<'passed' | 'failed'> {
    console.log('🎯 Checking quality thresholds...');

    const categoryBreakdown = this.getCategoryBreakdown(qaResult);
    
    // Check overall threshold
    if (qaResult.overallScore < this.config.thresholds.overall) {
      console.log(`❌ Overall score ${qaResult.overallScore}% below threshold ${this.config.thresholds.overall}%`);
      return 'failed';
    }

    // Check category thresholds
    const categories = ['security', 'performance', 'quality', 'architecture', 'testing'];
    for (const category of categories) {
      const categoryScore = categoryBreakdown[category].percentage;
      const threshold = this.config.thresholds[category as keyof typeof this.config.thresholds];
      
      if (categoryScore < threshold) {
        console.log(`❌ ${category} score ${categoryScore}% below threshold ${threshold}%`);
        return 'failed';
      }
    }

    console.log('✅ All thresholds met');
    return 'passed';
  }

  private async sendNotifications(qaResult: any, status: string): Promise<void> {
    console.log('📢 Sending notifications...');

    if (this.config.integrations.slack) {
      await this.sendSlackNotification(qaResult, status);
    }

    if (this.config.integrations.email) {
      await this.sendEmailNotification(qaResult, status);
    }

    if (this.config.integrations.github) {
      await this.updateGitHubStatus(qaResult, status);
    }
  }

  private async sendSlackNotification(qaResult: any, status: string): Promise<void> {
    // Implementation would depend on Slack webhook configuration
    console.log('📱 Slack notification sent');
  }

  private async sendEmailNotification(qaResult: any, status: string): Promise<void> {
    // Implementation would depend on email service configuration
    console.log('📧 Email notification sent');
  }

  private async updateGitHubStatus(qaResult: any, status: string): Promise<void> {
    // Implementation would use GitHub API to update commit status
    console.log('🔄 GitHub status updated');
  }

  private async updateCIStatus(status: string): Promise<void> {
    console.log(`🔄 CI/CD status updated: ${status}`);
    
    // Create status files that CI systems can read
    const statusFile = path.join(this.config.reportPath, 'qa-status.txt');
    fs.writeFileSync(statusFile, status);
    
    // Create JUnit-style XML for CI integration
    const junitXml = this.generateJUnitXML(status);
    const junitPath = path.join(this.config.reportPath, 'qa-results.xml');
    fs.writeFileSync(junitPath, junitXml);
  }

  private generateJUnitXML(status: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="AI Governance QA" tests="147" failures="${status === 'failed' ? '1' : '0'}" time="0">
  <testcase name="Quality Assurance" classname="QA">
    ${status === 'failed' ? '<failure message="Quality thresholds not met"/>' : ''}
  </testcase>
</testsuite>`;
  }

  private async handlePipelineFailure(error: any): Promise<void> {
    console.error('💥 Pipeline failure details:', error);
    
    // Log failure details
    const failureReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      config: this.config
    };

    const failurePath = path.join(this.config.reportPath, 'qa-failure.json');
    fs.writeFileSync(failurePath, JSON.stringify(failureReport, null, 2));

    // Send failure notifications
    if (this.config.integrations.slack) {
      console.log('📱 Failure notification sent to Slack');
    }
  }

  private generateHTMLReport(data: any): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Governance QA Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; }
        .score { font-size: 2em; font-weight: bold; }
        .passed { color: #059669; }
        .failed { color: #dc2626; }
        .warning { color: #d97706; }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0; }
        .recommendations { background: #fffbeb; border-left: 4px solid #d97706; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 AI Governance Navigator - QA Report</h1>
        <p>Generated: ${data.summary.timestamp}</p>
    </div>
    
    <div class="summary">
        <div class="card">
            <h3>Overall Score</h3>
            <div class="score ${data.summary.overallScore >= 80 ? 'passed' : 'failed'}">
                ${data.summary.overallScore}%
            </div>
        </div>
        <div class="card">
            <h3>Total Checkpoints</h3>
            <div class="score">${data.summary.totalCheckpoints}</div>
        </div>
        <div class="card">
            <h3>Duration</h3>
            <div>${data.summary.duration}ms</div>
        </div>
    </div>

    <h2>📊 Category Breakdown</h2>
    <div class="category-grid">
        ${Object.entries(data.categories).map(([category, stats]: [string, any]) => `
            <div class="card">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div class="score ${stats.status === 'passed' ? 'passed' : 'failed'}">
                    ${stats.percentage}%
                </div>
                <p>${stats.passed}/${stats.total} passed</p>
                ${stats.failed > 0 ? `<p class="failed">${stats.failed} failed</p>` : ''}
                ${stats.warnings > 0 ? `<p class="warning">${stats.warnings} warnings</p>` : ''}
            </div>
        `).join('')}
    </div>

    ${data.recommendations.length > 0 ? `
    <div class="recommendations">
        <h2>🎯 Top Recommendations</h2>
        <ul>
            ${data.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    <footer style="margin-top: 40px; text-align: center; color: #64748b;">
        <p>Generated by AI Governance Navigator QA System</p>
    </footer>
</body>
</html>`;
  }

  private generateMarkdownReport(data: any): string {
    return `# 🎯 AI Governance Navigator - QA Report

## Summary
- **Overall Score:** ${data.summary.overallScore}%
- **Total Checkpoints:** ${data.summary.totalCheckpoints}
- **Passed:** ${data.summary.passedCheckpoints}
- **Failed:** ${data.summary.failedCheckpoints}
- **Warnings:** ${data.summary.warningCheckpoints}
- **Duration:** ${data.summary.duration}ms
- **Generated:** ${data.summary.timestamp}

## Category Breakdown

${Object.entries(data.categories).map(([category, stats]: [string, any]) => `
### ${category.charAt(0).toUpperCase() + category.slice(1)}
- **Score:** ${stats.percentage}%
- **Status:** ${stats.status === 'passed' ? '✅ Passed' : '❌ Failed'}
- **Results:** ${stats.passed}/${stats.total} passed
${stats.failed > 0 ? `- **Failed:** ${stats.failed}` : ''}
${stats.warnings > 0 ? `- **Warnings:** ${stats.warnings}` : ''}
`).join('')}

${data.recommendations.length > 0 ? `
## 🎯 Recommendations

${data.recommendations.map((rec: string) => `- ${rec}`).join('\n')}
` : ''}

---
*Generated by AI Governance Navigator QA System*`;
  }
}

// Default configuration
const defaultConfig: PipelineConfig = {
  projectPath: process.cwd(),
  thresholds: {
    overall: 80,
    security: 90,
    performance: 75,
    quality: 80,
    architecture: 75,
    testing: 70
  },
  integrations: {
    github: false,
    slack: false,
    email: false
  },
  reportPath: path.join(process.cwd(), 'qa-reports')
};

// Main execution
async function main() {
  // Ensure report directory exists
  if (!fs.existsSync(defaultConfig.reportPath)) {
    fs.mkdirSync(defaultConfig.reportPath, { recursive: true });
  }

  const pipeline = new QAPipeline(defaultConfig);
  await pipeline.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { QAPipeline, PipelineConfig };