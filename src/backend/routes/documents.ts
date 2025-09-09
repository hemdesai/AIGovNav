/**
 * Document Template API Routes
 * Handles EU AI Act documentation templates and generation
 */

import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/v1/documents/templates
 * List all document templates
 */
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const {
      category,
      isPreBuilt,
      language = 'en',
      page = '1',
      limit = '20'
    } = req.query;

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

    const where: any = { tenantId: user.tenantId };

    if (category) where.category = category;
    if (isPreBuilt === 'true') where.isPreBuilt = true;
    if (language !== 'all') where.language = language;

    const [templates, total] = await Promise.all([
      prisma.documentTemplate.findMany({
        where,
        include: {
          _count: {
            select: {
              documents: true
            }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.documentTemplate.count({ where })
    ]);

    res.json({
      success: true,
      data: templates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error listing document templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document templates'
    });
  }
});

/**
 * GET /api/v1/documents/templates/:id
 * Get template details
 */
router.get('/templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

    const template = await prisma.documentTemplate.findFirst({
      where: {
        id,
        tenantId: user.tenantId
      },
      include: {
        documents: {
          select: {
            id: true,
            name: true,
            status: true,
            uploadedAt: true,
            system: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            uploadedAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Document template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Error fetching document template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document template'
    });
  }
});

/**
 * POST /api/v1/documents/templates/:id/generate
 * Generate document from template
 */
router.post('/templates/:id/generate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { systemId, variables, name } = req.body;

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

    // Get template
    const template = await prisma.documentTemplate.findFirst({
      where: {
        id,
        tenantId: user.tenantId
      }
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Document template not found'
      });
    }

    // Get AI system
    const aiSystem = await prisma.aISystem.findFirst({
      where: {
        id: systemId,
        tenantId: user.tenantId
      }
    });

    if (!aiSystem) {
      return res.status(404).json({
        success: false,
        error: 'AI system not found'
      });
    }

    // Generate document content from template
    const generatedContent = generateDocumentFromTemplate(template, aiSystem, variables || {});

    // Create document record
    const document = await prisma.document.create({
      data: {
        systemId: aiSystem.id,
        templateId: template.id,
        type: mapCategoryToDocumentType(template.category),
        name: name || `${template.name} - ${aiSystem.name}`,
        fileUrl: `/generated/${Date.now()}_${aiSystem.id}_${template.id}.json`, // Placeholder - would normally upload to storage
        version: '1.0',
        uploadedBy: user.id,
        requiredForApproval: isRequiredForApproval(template.category),
        status: 'DRAFT'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        document,
        generatedContent,
        template: {
          id: template.id,
          name: template.name,
          category: template.category
        }
      },
      message: 'Document generated successfully from template'
    });
  } catch (error) {
    console.error('Error generating document from template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate document from template'
    });
  }
});

/**
 * GET /api/v1/documents/templates/categories/stats
 * Get template usage statistics by category
 */
router.get('/templates/categories/stats', async (req: Request, res: Response) => {
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

    // Get template statistics
    const templateStats = await prisma.documentTemplate.groupBy({
      by: ['category'],
      where: {
        tenantId: user.tenantId
      },
      _count: true
    });

    // Get usage statistics (documents generated from templates)
    const usageStats = await prisma.document.groupBy({
      by: ['type'],
      where: {
        system: {
          tenantId: user.tenantId
        },
        templateId: {
          not: null
        }
      },
      _count: true
    });

    res.json({
      success: true,
      data: {
        templates: templateStats,
        usage: usageStats
      }
    });
  } catch (error) {
    console.error('Error fetching template statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch template statistics'
    });
  }
});

/**
 * POST /api/v1/documents/bulk-import-templates
 * Bulk import pre-built document templates
 */
router.post('/bulk-import-templates', async (req: Request, res: Response) => {
  try {
    const { templates } = req.body;

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

    const createdTemplates = [];

    for (const templateData of templates) {
      const template = await prisma.documentTemplate.create({
        data: {
          ...templateData,
          tenantId: user.tenantId,
          isPreBuilt: true
        }
      });

      createdTemplates.push(template);
    }

    res.status(201).json({
      success: true,
      data: createdTemplates,
      message: `Successfully imported ${createdTemplates.length} document templates`
    });
  } catch (error) {
    console.error('Error importing document templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import document templates'
    });
  }
});

// Helper functions

/**
 * Generate document content from template and AI system data
 */
function generateDocumentFromTemplate(template: any, aiSystem: any, variables: any): any {
  const templateContent = template.templateContent as any;
  
  // Basic template variable substitution
  const processedContent = {
    ...templateContent,
    metadata: {
      generatedAt: new Date().toISOString(),
      templateId: template.id,
      templateName: template.name,
      systemId: aiSystem.id,
      systemName: aiSystem.name,
      aiActArticle: template.euActRequirement
    }
  };

  // Replace variables in content
  if (templateContent.sections) {
    processedContent.sections = templateContent.sections.map((section: any) => ({
      ...section,
      content: replaceTemplateVariables(section.content, aiSystem, variables)
    }));
  }

  return processedContent;
}

/**
 * Replace template variables in content
 */
function replaceTemplateVariables(content: string, aiSystem: any, variables: any): string {
  let processedContent = content;

  // System variables
  processedContent = processedContent.replace(/\{\{system\.name\}\}/g, aiSystem.name || '');
  processedContent = processedContent.replace(/\{\{system\.description\}\}/g, aiSystem.description || '');
  processedContent = processedContent.replace(/\{\{system\.purpose\}\}/g, aiSystem.purpose || '');
  processedContent = processedContent.replace(/\{\{system\.riskLevel\}\}/g, aiSystem.riskLevel || 'UNCLASSIFIED');
  processedContent = processedContent.replace(/\{\{system\.actorRole\}\}/g, aiSystem.actorRole || '');

  // Date variables
  processedContent = processedContent.replace(/\{\{date\.today\}\}/g, new Date().toLocaleDateString());
  processedContent = processedContent.replace(/\{\{date\.year\}\}/g, new Date().getFullYear().toString());

  // Custom variables
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    processedContent = processedContent.replace(regex, variables[key] || '');
  });

  return processedContent;
}

/**
 * Map template category to document type
 */
function mapCategoryToDocumentType(category: string): string {
  const mapping: { [key: string]: string } = {
    'TECHNICAL_DOCUMENTATION': 'TECHNICAL_SPEC',
    'INSTRUCTIONS_FOR_USE': 'USER_MANUAL',
    'RISK_MANAGEMENT': 'RISK_ASSESSMENT',
    'CONFORMITY_DECLARATION': 'CONFORMITY_CERTIFICATE',
    'EU_DATABASE_REGISTRATION': 'REGISTRATION_FORM',
    'TRAINING_DATA_SUMMARY': 'DATA_SHEET',
    'GPAI_MODEL_CARD': 'MODEL_CARD',
    'IMPACT_ASSESSMENT': 'IMPACT_REPORT',
    'AUDIT_REPORT': 'AUDIT_REPORT'
  };

  return mapping[category] || 'OTHER';
}

/**
 * Determine if document type is required for approval
 */
function isRequiredForApproval(category: string): boolean {
  const requiredCategories = [
    'TECHNICAL_DOCUMENTATION',
    'CONFORMITY_DECLARATION',
    'RISK_MANAGEMENT',
    'IMPACT_ASSESSMENT'
  ];

  return requiredCategories.includes(category);
}

export default router;