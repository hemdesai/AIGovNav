/**
 * Script to initialize the EU AI Act Policy Pack
 * Loads pre-built policies and controls into the database
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function initializePolicyPack() {
  console.log('🚀 Initializing EU AI Act Policy Pack...');

  try {
    // Load pre-built policies from JSON
    const policiesPath = path.join(__dirname, '../data/prebuilt-policies.json');
    const policiesData = JSON.parse(fs.readFileSync(policiesPath, 'utf8'));

    console.log(`📋 Loading ${policiesData.length} pre-built policies...`);

    // Get demo tenant (should exist from previous app usage)
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' },
      include: { tenant: true }
    });

    if (!user || !user.tenant) {
      console.error('❌ Demo user/tenant not found. Please run the application first to create demo data.');
      return;
    }

    const tenant = user.tenant;

    if (!tenant) {
      console.error('❌ Demo tenant not found. Please run the application first to create demo data.');
      return;
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const policyData of policiesData) {
      // Check if policy already exists
      const existingPolicy = await prisma.policy.findFirst({
        where: {
          name: policyData.name,
          tenantId: tenant.id
        }
      });

      if (existingPolicy) {
        console.log(`⏭️  Skipping existing policy: ${policyData.name}`);
        skippedCount++;
        continue;
      }

      // Create policy with controls
      const policy = await prisma.policy.create({
        data: {
          name: policyData.name,
          category: policyData.category,
          euActArticle: policyData.euActArticle,
          description: policyData.description,
          purpose: policyData.purpose,
          scope: policyData.scope,
          content: policyData.content,
          responsibilities: policyData.responsibilities,
          procedures: policyData.procedures,
          tenantId: tenant.id,
          isPreBuilt: true,
          isTemplate: true,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          controls: {
            create: policyData.controls?.map((control: any) => ({
              code: control.code,
              name: control.name,
              description: control.description,
              category: control.category,
              implementationGuide: control.implementationGuide,
              evidenceRequirements: control.evidenceRequirements || [],
              controlType: control.controlType || 'MANUAL',
              priority: control.priority || 'MEDIUM',
              implementationEffort: control.implementationEffort || 'MEDIUM'
            })) || []
          }
        },
        include: {
          controls: true
        }
      });

      console.log(`✅ Created policy: ${policy.name} (${policy.controls.length} controls)`);
      createdCount++;
    }

    // Create additional policy templates for comprehensive coverage
    console.log('📄 Creating additional documentation and workflow templates...');

    const additionalPolicies = [
      {
        name: 'Conformity Assessment Procedure',
        category: 'CONFORMITY_ASSESSMENT',
        euActArticle: 'Article 43',
        description: 'Standardized conformity assessment procedure for high-risk AI systems',
        purpose: 'To ensure systematic conformity assessment of high-risk AI systems before market placement',
        scope: 'All high-risk AI systems requiring conformity assessment',
        isPreBuilt: true,
        isTemplate: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        content: {
          sections: [
            {
              title: 'Assessment Stages',
              content: '1. Pre-assessment\n2. Technical documentation review\n3. Testing and validation\n4. Risk assessment\n5. Declaration of conformity'
            }
          ]
        }
      },
      {
        name: 'Fundamental Rights Impact Assessment',
        category: 'RISK_MANAGEMENT',
        euActArticle: 'Article 27',
        description: 'Framework for assessing impact on fundamental rights',
        purpose: 'To identify and mitigate potential impacts on fundamental rights from AI system deployment',
        scope: 'High-risk AI systems deployed in public spaces or affecting fundamental rights',
        isPreBuilt: true,
        isTemplate: true,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        content: {
          sections: [
            {
              title: 'Impact Areas',
              content: '1. Privacy and data protection\n2. Non-discrimination\n3. Freedom of expression\n4. Human dignity\n5. Rights of the child'
            }
          ]
        }
      }
    ];

    for (const policyData of additionalPolicies) {
      const existingPolicy = await prisma.policy.findFirst({
        where: {
          name: policyData.name,
          tenantId: tenant.id
        }
      });

      if (!existingPolicy) {
        await prisma.policy.create({
          data: {
            ...policyData,
            tenantId: tenant.id
          }
        });
        console.log(`✅ Created additional policy: ${policyData.name}`);
        createdCount++;
      } else {
        console.log(`⏭️  Skipping existing policy: ${policyData.name}`);
        skippedCount++;
      }
    }

    console.log(`\n🎉 Policy Pack initialization complete!`);
    console.log(`📊 Summary:`);
    console.log(`   ✅ Created: ${createdCount} policies`);
    console.log(`   ⏭️  Skipped: ${skippedCount} existing policies`);
    console.log(`   📋 Total available: ${createdCount + skippedCount} policies`);

    // Show policy breakdown by category
    const policiesBreakdown = await prisma.policy.groupBy({
      by: ['category'],
      where: {
        tenantId: tenant.id,
        isPreBuilt: true
      },
      _count: true
    });

    console.log(`\n📈 Policy breakdown by category:`);
    policiesBreakdown.forEach(breakdown => {
      console.log(`   ${breakdown.category}: ${breakdown._count} policies`);
    });

  } catch (error) {
    console.error('❌ Error initializing Policy Pack:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initializePolicyPack();