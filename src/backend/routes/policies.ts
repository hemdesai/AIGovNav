/**
 * Policy Packs API Routes
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Functional policy pack data (EU AI Act High-Risk Requirements)
const FUNCTIONAL_POLICY_PACK = {
  id: '1',
  title: 'EU AI Act High-Risk Requirements',
  description: 'Complete policy framework for high-risk AI systems under EU AI Act',
  version: '2.0',
  category: 'Compliance',
  applicableRiskLevels: ['HIGH_RISK'],
  controls: 42,
  lastUpdated: '2024-01-15',
  status: 'active',
  isFunctional: true,
  controls_detail: [
    { id: 'HR-001', title: 'Risk Management System', article: 'Article 9', required: true, implemented: false },
    { id: 'HR-002', title: 'Data Governance', article: 'Article 10', required: true, implemented: false },
    { id: 'HR-003', title: 'Technical Documentation', article: 'Article 11', required: true, implemented: false },
    { id: 'HR-004', title: 'Record-keeping', article: 'Article 12', required: true, implemented: false },
    { id: 'HR-005', title: 'Transparency Provisions', article: 'Article 13', required: true, implemented: false },
    { id: 'HR-006', title: 'Human Oversight', article: 'Article 14', required: true, implemented: false },
    { id: 'HR-007', title: 'Accuracy and Robustness', article: 'Article 15', required: true, implemented: false }
  ]
};

/**
 * GET /api/v1/policies/packs
 * Get all policy packs
 */
router.get('/packs', async (req: Request, res: Response) => {
  try {
    // Get demo user
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // Count high-risk systems
    const highRiskSystemsCount = await prisma.aISystem.count({
      where: {
        tenantId: user.tenantId,
        riskLevel: 'HIGH_RISK'
      }
    });

    // Count systems with applied policies (mock for now)
    const appliedSystemsCount = await prisma.aISystem.count({
      where: {
        tenantId: user.tenantId,
        riskLevel: 'HIGH_RISK',
        status: 'APPROVED'
      }
    });

    // Calculate real compliance based on actual system data
    const compliance = highRiskSystemsCount > 0 
      ? Math.round((appliedSystemsCount / highRiskSystemsCount) * 100)
      : 0;

    // Return functional pack with real data
    const functionalPack = {
      ...FUNCTIONAL_POLICY_PACK,
      compliance,
      appliedSystems: appliedSystemsCount,
      totalApplicableSystems: highRiskSystemsCount
    };

    // Mock data for other packs
    const otherPacks = [
      {
        id: '2',
        title: 'Data Governance and Management',
        description: 'Policies for data quality, management, and governance (Article 10)',
        version: '1.5',
        category: 'Data Management',
        applicableRiskLevels: ['HIGH_RISK', 'LIMITED_RISK'],
        controls: 28,
        lastUpdated: '2024-01-10',
        status: 'active',
        compliance: 92,
        isFunctional: false
      },
      {
        id: '3',
        title: 'Human Oversight Framework',
        description: 'Implementation guidelines for human oversight requirements (Article 14)',
        version: '1.2',
        category: 'Governance',
        applicableRiskLevels: ['HIGH_RISK'],
        controls: 15,
        lastUpdated: '2024-01-08',
        status: 'active',
        compliance: 78,
        isFunctional: false
      },
      {
        id: '4',
        title: 'Transparency and User Information',
        description: 'Policies for transparency obligations and user notifications (Article 13)',
        version: '1.0',
        category: 'Transparency',
        applicableRiskLevels: ['HIGH_RISK', 'LIMITED_RISK'],
        controls: 20,
        lastUpdated: '2024-01-05',
        status: 'active',
        compliance: 88,
        isFunctional: false
      },
      {
        id: '5',
        title: 'Risk Management System',
        description: 'Comprehensive risk management framework (Article 9)',
        version: '2.1',
        category: 'Risk Management',
        applicableRiskLevels: ['HIGH_RISK'],
        controls: 35,
        lastUpdated: '2024-01-20',
        status: 'active',
        compliance: 90,
        isFunctional: false
      },
      {
        id: '6',
        title: 'GPAI Model Obligations',
        description: 'Specific requirements for General-Purpose AI models (Chapter V)',
        version: '1.0',
        category: 'GPAI',
        applicableRiskLevels: ['HIGH_RISK', 'LIMITED_RISK'],
        controls: 25,
        lastUpdated: '2023-12-20',
        status: 'draft',
        compliance: 65,
        isFunctional: false
      }
    ];

    res.json({
      success: true,
      data: [functionalPack, ...otherPacks]
    });
  } catch (error) {
    console.error('Error fetching policy packs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch policy packs'
    });
  }
});

/**
 * POST /api/v1/policies/apply
 * Apply a policy pack to AI systems
 */
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { policyPackId, systemIds } = req.body;
    
    if (policyPackId !== '1') {
      return res.status(400).json({
        success: false,
        error: 'Only the EU AI Act High-Risk Requirements pack is functional in this demo'
      });
    }

    // Get demo user
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // Apply policy to systems (update their status)
    const updatedSystems = await prisma.aISystem.updateMany({
      where: {
        id: { in: systemIds },
        tenantId: user.tenantId,
        riskLevel: 'HIGH_RISK'
      },
      data: {
        status: 'APPROVED',
        metadata: {
          policyPackApplied: '1',
          policyPackAppliedAt: new Date().toISOString()
        }
      }
    });

    res.json({
      success: true,
      data: {
        appliedCount: updatedSystems.count,
        policyPackId
      },
      message: `Policy pack applied to ${updatedSystems.count} system(s)`
    });
  } catch (error) {
    console.error('Error applying policy pack:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to apply policy pack'
    });
  }
});

/**
 * GET /api/v1/policies/systems/:policyPackId
 * Get systems eligible for a policy pack
 */
router.get('/systems/:policyPackId', async (req: Request, res: Response) => {
  try {
    const { policyPackId } = req.params;
    
    // Get demo user
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Demo user not found'
      });
    }

    // For the functional pack, return actual high-risk systems
    if (policyPackId === '1') {
      const systems = await prisma.aISystem.findMany({
        where: {
          tenantId: user.tenantId,
          riskLevel: 'HIGH_RISK'
        },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true
        }
      });

      res.json({
        success: true,
        data: systems
      });
    } else {
      res.json({
        success: true,
        data: []
      });
    }
  } catch (error) {
    console.error('Error fetching eligible systems:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch eligible systems'
    });
  }
});

export default router;