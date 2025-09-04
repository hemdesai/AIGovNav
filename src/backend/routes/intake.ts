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
  authenticateUser,
  authorizeRole(['submitter', 'reviewer', 'admin']),
  validateRequest(IntakeCreateSchema),
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const tenantId = (req as any).user.tenantId;
      const intakeData = req.body;

      // Create the intake submission
      const intake = await prisma.aISystem.create({
        data: {
          ...intakeData,
          tenantId,
          ownerId: userId,
          status: 'draft',
          lifecycleStage: 'design',
          // Initial risk level will be set after classification
          riskLevel: 'unclassified',
          metadata: {
            submittedAt: new Date().toISOString(),
            submittedBy: userId,
            version: 1
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
        action: 'AI_SYSTEM_CREATED',
        entityType: 'AISystem',
        entityId: intake.id,
        metadata: {
          systemName: intake.systemName
        }
      });

      res.status(201).json({
        success: true,
        data: intake,
        message: 'AI system intake created successfully'
      });
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
 * GET /api/v1/intake/:id
 * Get intake details by ID
 */
router.get(
  '/:id',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const tenantId = (req as any).user.tenantId;

      const intake = await prisma.aISystem.findFirst({
        where: {
          id,
          tenantId,
          // Users can only see their own submissions unless they're reviewers/admins
          ...(!(req as any).user.roles.includes('reviewer') && 
             !(req as any).user.roles.includes('admin') && {
            ownerId: userId
          })
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
          complianceRecords: {
            where: {
              status: 'active'
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
  authenticateUser,
  authorizeRole(['reviewer', 'admin']),
  validateRequest(ClassificationRequestSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const tenantId = (req as any).user.tenantId;
      const { forceReclassification } = req.body;

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
      if (aiSystem.riskLevel !== 'unclassified' && !forceReclassification) {
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
          aiSystemId: id,
          tenantId,
          assessorId: userId,
          assessedAt: new Date(),
          riskLevel: classification.riskLevel,
          confidenceScore: classification.confidenceScore,
          annexIIICategories: classification.annexIIICategories,
          rationale: classification.rationale,
          mitigationRequired: classification.mitigationRequired,
          recommendations: classification.recommendations,
          metadata: {
            classificationVersion: '1.0',
            euAiActVersion: '2024',
            automatedClassification: true
          }
        }
      });

      // Update the AI system with new risk level
      await prisma.aISystem.update({
        where: { id },
        data: {
          riskLevel: classification.riskLevel,
          status: 'classified'
        }
      });

      // Log the classification
      await auditLogger.log({
        tenantId,
        userId,
        action: 'AI_SYSTEM_CLASSIFIED',
        entityType: 'AISystem',
        entityId: id,
        metadata: {
          riskLevel: classification.riskLevel,
          confidenceScore: classification.confidenceScore
        }
      });

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
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const tenantId = (req as any).user.tenantId;
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
        // Non-admins can only see their own submissions
        ...(!(req as any).user.roles.includes('admin') && {
          ownerId: userId
        }),
        ...(status && { status }),
        ...(riskLevel && { riskLevel }),
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
                complianceRecords: true
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

export default router;