/**
 * AI Intake API Routes
 * Handles AI system intake submissions, risk classification, and registry management
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authenticateUser, authorizeRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { RiskClassificationService } from '../services/riskClassification';
import { AuditLogService } from '../services/auditLog';
import { buildRiskLevelWhere } from '../utils/riskLevelUtils';

const router = Router();
const prisma = new PrismaClient();
const riskClassifier = new RiskClassificationService();
const auditLogger = new AuditLogService();

// Validation schemas
const IntakeCreateSchema = z.object({
  systemName: z.string().min(1).max(255),
  systemDescription: z.string().min(10),
  systemPurpose: z.string().min(10),
  actorRole: z.enum(['deployer', 'provider', 'distributor', 'importer', 'manufacturer']),
  isGPAI: z.boolean(),
  usesGPAI: z.boolean(),
  providesEssentialService: z.boolean(),
  categories: z.array(z.string()),
  geographicScope: z.enum(['global', 'eu', 'national', 'regional', 'local']),
  targetUsers: z.string(),
  dataTypes: z.array(z.string()),
  automationLevel: z.enum(['none', 'assistive', 'partial', 'conditional', 'high', 'full']),
  transparencyMeasures: z.string().optional(),
  humanOversight: z.string().optional(),
  performanceMetrics: z.string().optional(),
  biasControls: z.string().optional(),
  intendedUse: z.string(),
  foreseenMisuse: z.string().optional(),
  technicalDocumentation: z.string().optional()
});

const IntakeUpdateSchema = IntakeCreateSchema.partial();

const ClassificationRequestSchema = z.object({
  forceReclassification: z.boolean().optional().default(false)
});

/**
 * POST /api/v1/intake
 * Create a new AI system intake submission
 */
router.post(
  '/',
  async (req: Request, res: Response) => {
    try {
      // For development: Create or get demo user/tenant
      let tenant = await prisma.tenant.findFirst({
        where: { name: 'Demo Tenant' }
      });
      
      if (!tenant) {
        tenant = await prisma.tenant.create({
          data: {
            name: 'Demo Tenant',
            domain: 'demo.aigovnav.com'
          }
        });
      }

      let user = await prisma.user.findFirst({
        where: { email: 'demo@aigovnav.com' }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: 'demo@aigovnav.com',
            name: 'Demo User',
            tenantId: tenant.id
          }
        });
      }

      const userId = user.id;
      const tenantId = tenant.id;
      const intakeData = req.body;

      // Create the intake submission
      const intake = await prisma.aISystem.create({
        data: {
          name: intakeData.name,
          description: intakeData.description,
          purpose: intakeData.purpose,
          actorRole: intakeData.actorRole.toUpperCase(),
          dataResidency: intakeData.dataResidency || 'EU',
          controllerStatus: intakeData.controllerStatus || 'CONTROLLER',
          gpaiFlag: intakeData.isGPAI || false,
          usesGPAI: intakeData.usesGPAI || false,
          providesEssentialService: intakeData.providesEssentialService || false,
          modelType: intakeData.modelType || 'Unknown',
          deploymentContext: intakeData.deploymentContext || 'Production',
          department: intakeData.department || 'AI Development',
          
          // Intake form fields
          intendedUse: intakeData.intendedUse,
          categories: intakeData.categories || [],
          geographicScope: intakeData.geographicScope,
          targetUsers: intakeData.targetUsers,
          dataTypes: intakeData.dataTypes || [],
          automationLevel: intakeData.automationLevel,
          
          // Risk management fields
          transparencyMeasures: intakeData.transparencyMeasures,
          humanOversight: intakeData.humanOversight,
          performanceMetrics: intakeData.performanceMetrics,
          biasControls: intakeData.biasControls,
          foreseenMisuse: intakeData.foreseenMisuse,
          technicalDocumentation: intakeData.technicalDocumentation,
          
          tenantId,
          creatorId: userId,
          ownerId: userId,
          status: 'DRAFT'
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });

      // Log the action (skipped for development)
      console.log(`✅ AI System created: ${intake.name} (ID: ${intake.id})`);

      // Automatically trigger risk classification
      try {
        console.log(`🔍 Starting automatic risk classification for system ${intake.id}`);
        const classification = await riskClassifier.classifySystem(intake);

        // Create risk assessment record
        await prisma.riskAssessment.create({
          data: {
            systemId: intake.id,
            classification: classification.riskLevel,
            rationale: classification.rationale,
            confidence: classification.confidenceScore,
            euActArticles: classification.euActArticles || [],
            annexCategories: classification.annexIIICategories || [],
            assessedBy: 'SYSTEM'
          }
        });

        // Update the AI system with new risk level and status
        const updatedIntake = await prisma.aISystem.update({
          where: { id: intake.id },
          data: {
            riskLevel: classification.riskLevel,
            status: 'UNDER_REVIEW'
          },
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                name: true
              }
            },
            riskAssessments: {
              orderBy: {
                assessedAt: 'desc'
              },
              take: 1
            }
          }
        });

        console.log(`✅ AI System classified: ${classification.riskLevel} risk (ID: ${intake.id})`);

        res.status(201).json({
          success: true,
          data: {
            ...updatedIntake,
            classification: {
              riskLevel: classification.riskLevel,
              confidenceScore: classification.confidenceScore,
              rationale: classification.rationale,
              mitigationRequired: classification.mitigationRequired,
              recommendations: classification.recommendations
            }
          },
          message: `AI system intake created and classified as ${classification.riskLevel} risk`
        });
      } catch (classificationError) {
        console.error('Classification error (non-blocking):', classificationError);
        // If classification fails, still return success for intake creation
        res.status(201).json({
          success: true,
          data: intake,
          message: 'AI system intake created successfully (classification pending)'
        });
      }
    } catch (error) {
      console.error('Error creating intake:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create intake submission'
      });
    }
  }
);

/**
 * GET /api/v1/intake/dashboard
 * Get dashboard statistics
 */
router.get(
  '/dashboard',
  async (req: Request, res: Response) => {
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

      // Get total systems count
      const totalSystems = await prisma.aISystem.count({
        where: { tenantId }
      });

      // Get systems by risk level
      const riskLevelStats = await prisma.aISystem.groupBy({
        by: ['riskLevel'],
        where: { tenantId },
        _count: true
      });

      // Convert to the expected format
      const byRiskLevel = {
        unacceptable: 0,
        high: 0,
        limited: 0,
        minimal: 0,
        unclassified: 0
      };

      riskLevelStats.forEach(stat => {
        switch (stat.riskLevel) {
          case 'PROHIBITED':
            byRiskLevel.unacceptable = stat._count;
            break;
          case 'HIGH_RISK':
            byRiskLevel.high = stat._count;
            break;
          case 'LIMITED_RISK':
            byRiskLevel.limited = stat._count;
            break;
          case 'MINIMAL_RISK':
            byRiskLevel.minimal = stat._count;
            break;
          case null:
            byRiskLevel.unclassified = stat._count;
            break;
        }
      });

      // Get recent activity (last 5 systems)
      const recentSystems = await prisma.aISystem.findMany({
        where: { tenantId },
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          riskAssessments: {
            orderBy: { assessedAt: 'desc' },
            take: 1
          }
        }
      });

      const recentActivity = recentSystems.map(system => ({
        id: system.id,
        action: system.riskLevel ? 'System Classified' : 'Intake Submitted',
        system: system.name,
        timestamp: formatTimeAgo(system.updatedAt)
      }));

      // Get pending tasks (systems needing review)
      const pendingSystems = await prisma.aISystem.findMany({
        where: {
          tenantId,
          status: 'UNDER_REVIEW'
        },
        take: 5
      });

      const pendingTasks = pendingSystems.map(system => ({
        id: system.id,
        title: `Review ${system.name}`,
        type: 'Assessment',
        dueDate: 'Today' // Simplified for now
      }));

      // Calculate compliance stats
      const compliantSystems = await prisma.aISystem.count({
        where: {
          tenantId,
          status: { in: ['APPROVED', 'IN_PRODUCTION'] }
        }
      });

      const pendingReview = await prisma.aISystem.count({
        where: {
          tenantId,
          status: 'UNDER_REVIEW'
        }
      });

      const complianceRate = totalSystems > 0 
        ? Math.round((compliantSystems / totalSystems) * 100)
        : 0;

      res.json({
        success: true,
        data: {
          totalSystems,
          byRiskLevel,
          recentActivity,
          pendingTasks,
          compliance: {
            compliantSystems,
            pendingReview,
            complianceRate
          }
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard data'
      });
    }
  }
);

/**
 * GET /api/v1/intake/:id
 * Get intake details by ID
 */
router.get(
  '/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // For development: Get demo user/tenant
      const user = await prisma.user.findFirst({
        where: { email: 'demo@aigovnav.com' }
      });
      
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Demo user not found'
        });
      }

      const userId = user.id;
      const tenantId = user.tenantId;

      const intake = await prisma.aISystem.findFirst({
        where: {
          id,
          tenantId
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          riskAssessments: {
            orderBy: {
              assessedAt: 'desc'
            },
            take: 1
          },
          complianceChecks: {
            where: {
              status: 'COMPLIANT'
            }
          }
        }
      });

      if (!intake) {
        return res.status(404).json({
          success: false,
          error: 'Intake not found or access denied'
        });
      }

      res.json({
        success: true,
        data: intake
      });
    } catch (error) {
      console.error('Error fetching intake:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch intake details'
      });
    }
  }
);

/**
 * PUT /api/v1/intake/:id
 * Update intake submission
 */
router.put(
  '/:id',
  authenticateUser,
  validateRequest(IntakeUpdateSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const tenantId = (req as any).user.tenantId;
      const updates = req.body;

      // Check if user has permission to update
      const existing = await prisma.aISystem.findFirst({
        where: {
          id,
          tenantId,
          // Only owner or admin can update
          OR: [
            { ownerId: userId },
            { tenant: { users: { some: { id: userId, roles: { has: 'admin' } } } } }
          ]
        }
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Intake not found or access denied'
        });
      }

      // Update the intake
      const updated = await prisma.aISystem.update({
        where: { id },
        data: {
          ...updates,
          metadata: {
            ...(existing.metadata as any),
            lastModifiedAt: new Date().toISOString(),
            lastModifiedBy: userId,
            version: ((existing.metadata as any)?.version || 1) + 1
          }
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      });

      // Log the action
      await auditLogger.log({
        tenantId,
        userId,
        action: 'AI_SYSTEM_UPDATED',
        entityType: 'AISystem',
        entityId: id,
        metadata: {
          changes: updates
        }
      });

      res.json({
        success: true,
        data: updated,
        message: 'Intake updated successfully'
      });
    } catch (error) {
      console.error('Error updating intake:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update intake'
      });
    }
  }
);

/**
 * POST /api/v1/intake/:id/classify
 * Run EU AI Act risk classification on the intake
 */
router.post(
  '/:id/classify',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { forceReclassification } = req.body || {};

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

      const userId = user.id;
      const tenantId = user.tenantId;

      // Fetch the AI system
      const aiSystem = await prisma.aISystem.findFirst({
        where: {
          id,
          tenantId
        },
        include: {
          riskAssessments: {
            orderBy: {
              assessedAt: 'desc'
            },
            take: 1
          }
        }
      });

      if (!aiSystem) {
        return res.status(404).json({
          success: false,
          error: 'AI system not found'
        });
      }

      // Check if already classified and not forcing reclassification
      if (aiSystem.riskLevel !== null && !forceReclassification) {
        return res.status(400).json({
          success: false,
          error: 'System already classified. Set forceReclassification=true to override.'
        });
      }

      // Run the risk classification
      const classification = await riskClassifier.classifySystem(aiSystem);

      // Create risk assessment record
      const riskAssessment = await prisma.riskAssessment.create({
        data: {
          systemId: id,
          classification: classification.riskLevel,
          rationale: classification.rationale,
          confidence: classification.confidenceScore,
          euActArticles: classification.euActArticles || [],
          annexCategories: classification.annexIIICategories || [],
          assessedBy: 'SYSTEM'
        }
      });

      // Update the AI system with new risk level
      await prisma.aISystem.update({
        where: { id },
        data: {
          riskLevel: classification.riskLevel,
          status: 'UNDER_REVIEW'
        }
      });

      // Log the classification (skipped for development)
      console.log(`✅ AI System classified: ${classification.riskLevel} risk (ID: ${id})`);

      res.json({
        success: true,
        data: {
          aiSystemId: id,
          classification,
          riskAssessment
        },
        message: `System classified as ${classification.riskLevel} risk`
      });
    } catch (error) {
      console.error('Error classifying system:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to classify AI system'
      });
    }
  }
);

/**
 * GET /api/v1/intake
 * List all intakes with filtering
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
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

      const userId = user.id;
      const tenantId = user.tenantId;
      const { 
        status, 
        riskLevel, 
        actorRole,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const where: any = {
        tenantId,
        // For development: show all systems for demo user
        ...(status && { status }),
        ...buildRiskLevelWhere(riskLevel),
        ...(actorRole && { actorRole })
      };

      const [intakes, total] = await Promise.all([
        prisma.aISystem.findMany({
          where,
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                name: true
              }
            },
            _count: {
              select: {
                riskAssessments: true,
                complianceChecks: true
              }
            }
          },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
          orderBy: {
            [sortBy as string]: sortOrder
          }
        }),
        prisma.aISystem.count({ where })
      ]);

      res.json({
        success: true,
        data: intakes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error listing intakes:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list intakes'
      });
    }
  }
);

// Helper function for time formatting
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}

export default router;