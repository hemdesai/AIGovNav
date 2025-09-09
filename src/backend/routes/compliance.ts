/**
 * Compliance Dashboard API Routes
 * Provides real-time compliance metrics and analytics
 */

import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/compliance/dashboard
 * Get comprehensive compliance dashboard metrics
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // Get demo user for development
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    const tenantId = user.tenantId;

    // Get all AI systems for analysis
    const aiSystems = await prisma.aISystem.findMany({
      where: { tenantId },
      include: {
        riskAssessments: true,
        complianceChecks: {
          include: {
            control: true,
            policy: true
          }
        }
      }
    });

    // Get all policies with controls
    const policies = await prisma.policy.findMany({
      where: { tenantId },
      include: {
        controls: {
          include: {
            complianceChecks: true
          }
        }
      }
    });

    // Calculate compliance metrics
    const metrics = calculateComplianceMetrics(aiSystems, policies);

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compliance dashboard'
    });
  }
});

/**
 * GET /api/v1/compliance/risk-heatmap
 * Get risk distribution heat map data
 */
router.get('/risk-heatmap', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // Get risk distribution by category and department
    const riskDistribution = await prisma.aISystem.groupBy({
      by: ['riskLevel', 'department'],
      where: {
        tenantId: user.tenantId,
        riskLevel: { not: null }
      },
      _count: true
    });

    // Format for heat map visualization
    const heatmapData = formatRiskHeatmap(riskDistribution);

    res.json({
      success: true,
      data: heatmapData
    });
  } catch (error) {
    console.error('Error fetching risk heatmap:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch risk heatmap'
    });
  }
});

/**
 * GET /api/v1/compliance/policy-coverage
 * Get policy coverage analysis
 */
router.get('/policy-coverage', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // Get policy coverage metrics
    const policyCoverage = await prisma.policy.findMany({
      where: { 
        tenantId: user.tenantId,
        isActive: true
      },
      include: {
        controls: {
          include: {
            complianceChecks: {
              where: {
                system: {
                  tenantId: user.tenantId
                }
              }
            }
          }
        }
      }
    });

    // Calculate coverage metrics
    const coverageMetrics = calculatePolicyCoverage(policyCoverage);

    res.json({
      success: true,
      data: coverageMetrics
    });
  } catch (error) {
    console.error('Error fetching policy coverage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch policy coverage'
    });
  }
});

/**
 * GET /api/v1/compliance/control-effectiveness
 * Get control implementation effectiveness metrics
 */
router.get('/control-effectiveness', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // Get control effectiveness data
    const controls = await prisma.control.findMany({
      where: {
        policy: {
          tenantId: user.tenantId
        }
      },
      include: {
        complianceChecks: {
          where: {
            system: {
              tenantId: user.tenantId
            }
          }
        },
        policy: {
          select: {
            name: true,
            category: true
          }
        }
      }
    });

    // Calculate effectiveness metrics
    const effectivenessMetrics = calculateControlEffectiveness(controls);

    res.json({
      success: true,
      data: effectivenessMetrics
    });
  } catch (error) {
    console.error('Error fetching control effectiveness:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch control effectiveness'
    });
  }
});

/**
 * GET /api/v1/compliance/trends
 * Get compliance trends over time
 */
router.get('/trends', async (req: Request, res: Response) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);
    
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // Get historical data for trends
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const historicalData = await getComplianceTrends(user.tenantId, startDate);

    res.json({
      success: true,
      data: historicalData
    });
  } catch (error) {
    console.error('Error fetching compliance trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compliance trends'
    });
  }
});

/**
 * GET /api/v1/compliance/action-items
 * Get prioritized compliance action items
 */
router.get('/action-items', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // Get prioritized action items
    const actionItems = await generateActionItems(user.tenantId);

    res.json({
      success: true,
      data: actionItems
    });
  } catch (error) {
    console.error('Error fetching action items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch action items'
    });
  }
});

// Helper functions

/**
 * Calculate comprehensive compliance metrics
 */
function calculateComplianceMetrics(aiSystems: any[], policies: any[]) {
  const totalSystems = aiSystems.length;
  
  // Risk distribution
  const riskDistribution = aiSystems.reduce((acc, system) => {
    const risk = system.riskLevel || 'UNCLASSIFIED';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {});

  // Compliance status distribution
  const statusDistribution = aiSystems.reduce((acc, system) => {
    acc[system.status] = (acc[system.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate overall compliance score
  const compliantSystems = aiSystems.filter(s => 
    ['APPROVED', 'IN_PRODUCTION'].includes(s.status)
  ).length;
  
  const complianceScore = totalSystems > 0 
    ? Math.round((compliantSystems / totalSystems) * 100)
    : 0;

  // Policy coverage analysis
  const policyCoverageScore = calculateOverallPolicyCoverage(policies, aiSystems);

  // Risk severity scoring
  const riskSeverityScore = calculateRiskSeverityScore(riskDistribution, totalSystems);

  // Control implementation rate
  const controlImplementationRate = calculateControlImplementationRate(policies);

  // Recent activity
  const recentActivity = aiSystems
    .filter(s => s.riskAssessments.length > 0)
    .slice(0, 5)
    .map(system => ({
      id: system.id,
      name: system.name,
      action: 'Risk Assessment Completed',
      timestamp: system.riskAssessments[0].assessedAt,
      riskLevel: system.riskLevel
    }));

  // High priority issues
  const highPriorityIssues = identifyHighPriorityIssues(aiSystems, policies);

  return {
    summary: {
      totalSystems,
      complianceScore,
      policyCoverageScore,
      riskSeverityScore,
      controlImplementationRate
    },
    riskDistribution: {
      PROHIBITED: riskDistribution.PROHIBITED || 0,
      HIGH_RISK: riskDistribution.HIGH_RISK || 0,
      LIMITED_RISK: riskDistribution.LIMITED_RISK || 0,
      MINIMAL_RISK: riskDistribution.MINIMAL_RISK || 0,
      UNCLASSIFIED: riskDistribution.UNCLASSIFIED || 0
    },
    statusDistribution,
    recentActivity,
    highPriorityIssues,
    policyBreakdown: policies.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      controlCount: p.controls.length,
      implementationRate: calculatePolicyImplementationRate(p),
      lastUpdated: p.updatedAt
    })),
    alerts: generateComplianceAlerts(aiSystems, policies)
  };
}

/**
 * Format risk distribution for heat map visualization
 */
function formatRiskHeatmap(riskData: any[]) {
  const departments = [...new Set(riskData.map(d => d.department))];
  const riskLevels = ['PROHIBITED', 'HIGH_RISK', 'LIMITED_RISK', 'MINIMAL_RISK'];
  
  const heatmapMatrix = departments.map(dept => ({
    department: dept,
    risks: riskLevels.map(risk => ({
      level: risk,
      count: riskData.find(d => d.department === dept && d.riskLevel === risk)?._count || 0,
      intensity: calculateRiskIntensity(risk, riskData.find(d => d.department === dept && d.riskLevel === risk)?._count || 0)
    }))
  }));

  return {
    matrix: heatmapMatrix,
    totals: {
      departments: departments.length,
      systems: riskData.reduce((sum, d) => sum + d._count, 0)
    }
  };
}

/**
 * Calculate policy coverage metrics
 */
function calculatePolicyCoverage(policies: any[]) {
  return policies.map(policy => {
    const totalControls = policy.controls.length;
    const implementedControls = policy.controls.filter((control: any) => 
      control.complianceChecks.some((check: any) => check.status === 'COMPLIANT')
    ).length;

    const coveragePercentage = totalControls > 0 
      ? Math.round((implementedControls / totalControls) * 100)
      : 0;

    return {
      policyId: policy.id,
      policyName: policy.name,
      category: policy.category,
      euActArticle: policy.euActArticle,
      totalControls,
      implementedControls,
      coveragePercentage,
      status: policy.status,
      gaps: totalControls - implementedControls,
      priority: calculatePolicyPriority(policy.category, coveragePercentage)
    };
  }).sort((a, b) => b.priority - a.priority);
}

/**
 * Calculate control implementation effectiveness
 */
function calculateControlEffectiveness(controls: any[]) {
  return controls.map(control => {
    const totalChecks = control.complianceChecks.length;
    const compliantChecks = control.complianceChecks.filter((check: any) => 
      check.status === 'COMPLIANT'
    ).length;

    const effectiveness = totalChecks > 0 
      ? Math.round((compliantChecks / totalChecks) * 100)
      : 0;

    return {
      controlId: control.id,
      controlName: control.name,
      code: control.code,
      policyName: control.policy.name,
      category: control.policy.category,
      priority: control.priority,
      totalImplementations: totalChecks,
      compliantImplementations: compliantChecks,
      effectivenessScore: effectiveness,
      implementationStatus: control.implementationStatus,
      controlType: control.controlType
    };
  }).sort((a, b) => {
    // Sort by priority, then by effectiveness score
    const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) ||
           a.effectivenessScore - b.effectivenessScore;
  });
}

/**
 * Generate prioritized action items
 */
async function generateActionItems(tenantId: string) {
  const actionItems = [];

  // Get systems without risk assessments
  const unassessedSystems = await prisma.aISystem.findMany({
    where: {
      tenantId,
      riskLevel: null
    }
  });

  unassessedSystems.forEach(system => {
    actionItems.push({
      id: `assess-${system.id}`,
      title: `Complete risk assessment for ${system.name}`,
      description: 'AI system requires risk classification per EU AI Act',
      priority: 'HIGH',
      type: 'ASSESSMENT',
      systemId: system.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      estimatedEffort: 'MEDIUM',
      complianceImpact: 'HIGH'
    });
  });

  // Get high-risk systems without proper documentation
  const highRiskSystems = await prisma.aISystem.findMany({
    where: {
      tenantId,
      riskLevel: 'HIGH_RISK',
      documents: {
        none: {
          type: 'TECHNICAL_SPEC'
        }
      }
    },
    include: {
      documents: true
    }
  });

  highRiskSystems.forEach(system => {
    actionItems.push({
      id: `doc-${system.id}`,
      title: `Complete technical documentation for ${system.name}`,
      description: 'High-risk system requires Article 11 technical documentation',
      priority: 'CRITICAL',
      type: 'DOCUMENTATION',
      systemId: system.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      estimatedEffort: 'HIGH',
      complianceImpact: 'CRITICAL'
    });
  });

  // Get controls with low implementation rates
  const underperformingControls = await prisma.control.findMany({
    where: {
      policy: { tenantId },
      priority: { in: ['CRITICAL', 'HIGH'] },
      implementationStatus: 'NOT_IMPLEMENTED'
    },
    include: {
      policy: true,
      complianceChecks: true
    }
  });

  underperformingControls.forEach(control => {
    actionItems.push({
      id: `control-${control.id}`,
      title: `Implement ${control.name}`,
      description: `${control.priority} priority control for ${control.policy.name}`,
      priority: control.priority,
      type: 'CONTROL_IMPLEMENTATION',
      controlId: control.id,
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      estimatedEffort: control.implementationEffort || 'MEDIUM',
      complianceImpact: control.priority
    });
  });

  return actionItems
    .sort((a, b) => {
      const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
    })
    .slice(0, 10); // Return top 10 action items
}

/**
 * Get compliance trends over time
 */
async function getComplianceTrends(tenantId: string, startDate: Date) {
  // Get historical risk assessments
  const riskAssessments = await prisma.riskAssessment.findMany({
    where: {
      system: { tenantId },
      assessedAt: { gte: startDate }
    },
    orderBy: { assessedAt: 'asc' },
    include: {
      system: true
    }
  });

  // Get historical compliance checks
  const complianceChecks = await prisma.complianceCheck.findMany({
    where: {
      system: { tenantId },
      checkedAt: { gte: startDate }
    },
    orderBy: { checkedAt: 'asc' }
  });

  // Generate daily trend data
  const trends = generateDailyTrends(riskAssessments, complianceChecks, startDate);

  return {
    riskTrends: trends.risk,
    complianceTrends: trends.compliance,
    summary: {
      totalAssessments: riskAssessments.length,
      totalChecks: complianceChecks.length,
      period: `${Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
    }
  };
}

// Additional helper functions (simplified for brevity)

function calculateOverallPolicyCoverage(policies: any[], aiSystems: any[]): number {
  if (policies.length === 0) return 0;
  
  const totalPolicies = policies.filter(p => p.isActive).length;
  const implementedPolicies = policies.filter(p => 
    p.controls.some((c: any) => c.complianceChecks.length > 0)
  ).length;

  return totalPolicies > 0 ? Math.round((implementedPolicies / totalPolicies) * 100) : 0;
}

function calculateRiskSeverityScore(riskDistribution: any, totalSystems: number): number {
  if (totalSystems === 0) return 100;

  const weights = { PROHIBITED: 0, HIGH_RISK: 20, LIMITED_RISK: 60, MINIMAL_RISK: 90, UNCLASSIFIED: 50 };
  let weightedScore = 0;

  Object.entries(riskDistribution).forEach(([risk, count]) => {
    const weight = weights[risk as keyof typeof weights] || 50;
    weightedScore += (count as number) * weight;
  });

  return Math.round(weightedScore / totalSystems);
}

function calculateControlImplementationRate(policies: any[]): number {
  const totalControls = policies.reduce((sum, p) => sum + p.controls.length, 0);
  if (totalControls === 0) return 100;

  const implementedControls = policies.reduce((sum, p) => 
    sum + p.controls.filter((c: any) => c.implementationStatus !== 'NOT_IMPLEMENTED').length, 0
  );

  return Math.round((implementedControls / totalControls) * 100);
}

function calculatePolicyImplementationRate(policy: any): number {
  if (policy.controls.length === 0) return 0;
  
  const implementedControls = policy.controls.filter((c: any) => 
    c.complianceChecks.some((check: any) => check.status === 'COMPLIANT')
  ).length;

  return Math.round((implementedControls / policy.controls.length) * 100);
}

function identifyHighPriorityIssues(aiSystems: any[], policies: any[]) {
  const issues = [];

  // Prohibited systems
  const prohibitedSystems = aiSystems.filter(s => s.riskLevel === 'PROHIBITED');
  if (prohibitedSystems.length > 0) {
    issues.push({
      type: 'CRITICAL',
      title: 'Prohibited AI Systems Detected',
      description: `${prohibitedSystems.length} system(s) classified as prohibited`,
      count: prohibitedSystems.length,
      action: 'Immediate cessation required'
    });
  }

  // High-risk systems without assessments
  const unassessedHighRisk = aiSystems.filter(s => 
    s.riskLevel === 'HIGH_RISK' && s.riskAssessments.length === 0
  );
  
  if (unassessedHighRisk.length > 0) {
    issues.push({
      type: 'HIGH',
      title: 'High-Risk Systems Need Assessment',
      description: `${unassessedHighRisk.length} high-risk system(s) missing risk assessment`,
      count: unassessedHighRisk.length,
      action: 'Complete risk assessments'
    });
  }

  return issues;
}

function generateComplianceAlerts(aiSystems: any[], policies: any[]) {
  const alerts = [];

  // Systems approaching go-live without approval
  const nearGoLive = aiSystems.filter(s => 
    s.expectedGoLive && 
    new Date(s.expectedGoLive) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) &&
    s.status !== 'APPROVED'
  );

  if (nearGoLive.length > 0) {
    alerts.push({
      severity: 'WARNING',
      title: 'Systems Approaching Go-Live',
      message: `${nearGoLive.length} system(s) scheduled for deployment within 30 days without approval`,
      actionRequired: true
    });
  }

  return alerts;
}

function calculateRiskIntensity(riskLevel: string, count: number): number {
  const maxIntensity = { PROHIBITED: 100, HIGH_RISK: 80, LIMITED_RISK: 40, MINIMAL_RISK: 20 };
  const baseIntensity = maxIntensity[riskLevel as keyof typeof maxIntensity] || 10;
  return Math.min(baseIntensity + (count * 5), 100);
}

function calculatePolicyPriority(category: string, coverage: number): number {
  const categoryWeights = {
    PROHIBITED_AI: 100,
    HIGH_RISK_AI: 90,
    RISK_MANAGEMENT: 80,
    HUMAN_OVERSIGHT: 75,
    DATA_GOVERNANCE: 70,
    TECHNICAL_DOCUMENTATION: 65,
    CYBERSECURITY: 60,
    TRANSPARENCY: 55,
    RECORD_KEEPING: 50
  };
  
  const baseWeight = categoryWeights[category as keyof typeof categoryWeights] || 40;
  const coveragePenalty = (100 - coverage) / 2; // Higher penalty for lower coverage
  
  return Math.round(baseWeight + coveragePenalty);
}

function generateDailyTrends(riskAssessments: any[], complianceChecks: any[], startDate: Date) {
  const days = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const riskTrends = [];
  const complianceTrends = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayAssessments = riskAssessments.filter(r => 
      new Date(r.assessedAt).toDateString() === date.toDateString()
    );
    
    const dayChecks = complianceChecks.filter(c =>
      new Date(c.checkedAt).toDateString() === date.toDateString()
    );

    riskTrends.push({
      date: date.toISOString().split('T')[0],
      assessments: dayAssessments.length,
      highRisk: dayAssessments.filter(r => r.classification === 'HIGH_RISK').length
    });

    complianceTrends.push({
      date: date.toISOString().split('T')[0],
      checks: dayChecks.length,
      compliant: dayChecks.filter(c => c.status === 'COMPLIANT').length
    });
  }

  return { risk: riskTrends, compliance: complianceTrends };
}

export default router;