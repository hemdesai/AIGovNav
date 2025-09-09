/**
 * Script to initialize EU AI Act Document Templates
 * Loads pre-built documentation templates into the database
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function initializeDocumentTemplates() {
  console.log('📄 Initializing EU AI Act Document Templates...');

  try {
    // Load pre-built templates from JSON
    const templatesPath = path.join(__dirname, '../data/prebuilt-document-templates.json');
    const templatesData = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

    console.log(`📋 Loading ${templatesData.length} pre-built document templates...`);

    // Get demo tenant
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' },
      include: { tenant: true }
    });

    if (!user || !user.tenant) {
      console.error('❌ Demo user/tenant not found. Please run the application first to create demo data.');
      return;
    }

    const tenant = user.tenant;

    let createdCount = 0;
    let skippedCount = 0;

    for (const templateData of templatesData) {
      // Check if template already exists
      const existingTemplate = await prisma.documentTemplate.findFirst({
        where: {
          name: templateData.name,
          tenantId: tenant.id
        }
      });

      if (existingTemplate) {
        console.log(`⏭️  Skipping existing template: ${templateData.name}`);
        skippedCount++;
        continue;
      }

      // Create document template
      const template = await prisma.documentTemplate.create({
        data: {
          name: templateData.name,
          category: templateData.category,
          euActRequirement: templateData.euActRequirement,
          description: templateData.description,
          templateContent: templateData.templateContent,
          variables: templateData.variables,
          sections: templateData.templateContent.sections || [],
          tenantId: tenant.id,
          isPreBuilt: true,
          language: 'en'
        }
      });

      console.log(`✅ Created document template: ${template.name}`);
      createdCount++;
    }

    // Create additional specialized templates
    console.log('📄 Creating additional specialized templates...');

    const additionalTemplates = [
      {
        name: 'Annex VIII Compliance Checklist',
        category: 'TECHNICAL_DOCUMENTATION',
        euActRequirement: 'Annex VIII',
        description: 'Comprehensive checklist ensuring all Annex VIII requirements are met',
        isPreBuilt: true,
        language: 'en',
        templateContent: {
          title: 'Annex VIII Compliance Checklist - {{system.name}}',
          sections: [
            {
              id: '1',
              title: 'Annex VIII Requirements Checklist',
              content: '## Annex VIII Documentation Requirements\n\n### Section 1 - General Information\n- [ ] 1(a) General description of AI system\n- [ ] 1(b) Detailed description of elements and processes\n- [ ] 1(c) Provider identification and contact details\n\n### Section 2 - Technical Specifications\n- [ ] 2(a) AI system functioning description\n- [ ] 2(b) Main design choices and trade-offs\n- [ ] 2(c) System architecture and integration\n\n### Section 3 - Data Requirements\n- [ ] 3(a) Training, validation, testing datasets\n- [ ] 3(b) Data governance and management\n\n**Completion Status:** {{completionStatus}}'
            }
          ]
        }
      },
      {
        name: 'CE Marking Documentation Package',
        category: 'CONFORMITY_DECLARATION',
        euActRequirement: 'Article 49',
        description: 'Complete CE marking documentation package template',
        isPreBuilt: true,
        language: 'en',
        templateContent: {
          title: 'CE Marking Documentation - {{system.name}}',
          sections: [
            {
              id: '1',
              title: 'CE Marking Requirements',
              content: '## CE Marking Documentation Package\n\n### Required Documents\n1. EU Declaration of Conformity\n2. Technical Documentation (Annex IV)\n3. Conformity Assessment Certificate\n4. CE Marking Application\n\n### CE Marking Specifications\n- Height: minimum 5mm\n- Proportions: as specified in regulation\n- Visibility: clearly visible and legible\n- Placement: on AI system or accompanying documents\n\n**CE Marking Applied:** {{ceMarkingApplied}}\n**Date Applied:** {{date.today}}'
            }
          ]
        }
      }
    ];

    for (const templateData of additionalTemplates) {
      const existingTemplate = await prisma.documentTemplate.findFirst({
        where: {
          name: templateData.name,
          tenantId: tenant.id
        }
      });

      if (!existingTemplate) {
        await prisma.documentTemplate.create({
          data: {
            ...templateData,
            tenantId: tenant.id,
            sections: templateData.templateContent?.sections || []
          }
        });
        console.log(`✅ Created additional template: ${templateData.name}`);
        createdCount++;
      } else {
        console.log(`⏭️  Skipping existing template: ${templateData.name}`);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Document Templates initialization complete!`);
    console.log(`📊 Summary:`);
    console.log(`   ✅ Created: ${createdCount} templates`);
    console.log(`   ⏭️  Skipped: ${skippedCount} existing templates`);
    console.log(`   📋 Total available: ${createdCount + skippedCount} templates`);

    // Show template breakdown by category
    const templatesBreakdown = await prisma.documentTemplate.groupBy({
      by: ['category'],
      where: {
        tenantId: tenant.id,
        isPreBuilt: true
      },
      _count: true
    });

    console.log(`\n📈 Template breakdown by category:`);
    templatesBreakdown.forEach(breakdown => {
      console.log(`   ${breakdown.category}: ${breakdown._count} templates`);
    });

  } catch (error) {
    console.error('❌ Error initializing Document Templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initializeDocumentTemplates();