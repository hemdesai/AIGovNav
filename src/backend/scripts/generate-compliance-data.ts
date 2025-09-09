/**
 * Script to generate sample compliance data
 * Creates compliance checks and sample data for realistic dashboard metrics
 */

import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function generateComplianceData() {
  console.log('📊 Generating sample compliance data...');

  try {
    // Get demo tenant
    const user = await prisma.user.findFirst({
      where: { email: 'demo@aigovnav.com' },
      include: { tenant: true }
    });

    if (!user || !user.tenant) {
      console.error('❌ Demo user/tenant not found.');
      return;
    }

    const tenantId = user.tenant.id;

    // Get all AI systems and controls
    const aiSystems = await prisma.aISystem.findMany({
      where: { tenantId }
    });

    const controls = await prisma.control.findMany({
      where: {
        policy: { tenantId }
      },
      include: {
        policy: true
      }
    });

    if (aiSystems.length === 0 || controls.length === 0) {
      console.error('❌ No AI systems or controls found. Please run initialization scripts first.');
      return;
    }

    console.log(`📋 Found ${aiSystems.length} AI systems and ${controls.length} controls`);

    let checksCreated = 0;

    // Generate compliance checks for each system-control combination
    for (const system of aiSystems) {
      // Only apply relevant controls based on risk level
      const relevantControls = getRelevantControls(controls, system.riskLevel);
      
      for (const control of relevantControls) {
        // Check if compliance check already exists
        const existingCheck = await prisma.complianceCheck.findFirst({
          where: {
            systemId: system.id,
            controlId: control.id
          }
        });

        if (existingCheck) {
          continue; // Skip if already exists
        }

        // Generate realistic compliance status
        const status = generateRealisticComplianceStatus(control.priority, system.riskLevel);
        
        // Create compliance check
        await prisma.complianceCheck.create({
          data: {
            systemId: system.id,
            policyId: control.policy.id,
            controlId: control.id,
            status,
            checkedAt: generateRandomDate(30), // Random date within last 30 days
            checkedBy: user.id,
            findings: generateComplianceNotes(status, control.name),
            evidence: status === 'COMPLIANT' ? {
              evidenceUrl: `/evidence/${system.id}/${control.code}.pdf`,
              checkDate: new Date().toISOString(),
              checker: user.id
            } : null
          }
        });

        checksCreated++;
      }
    }

    // Update control implementation status based on compliance checks
    for (const control of controls) {
      const checks = await prisma.complianceCheck.findMany({
        where: { controlId: control.id }
      });

      if (checks.length > 0) {
        const compliantChecks = checks.filter(c => c.status === 'COMPLIANT').length;
        const implementationRate = compliantChecks / checks.length;
        
        let implementationStatus = 'NOT_IMPLEMENTED';
        if (implementationRate >= 0.8) {
          implementationStatus = 'IMPLEMENTED';
        } else if (implementationRate >= 0.5) {
          implementationStatus = 'IN_PROGRESS';
        } else if (implementationRate > 0) {
          implementationStatus = 'PLANNED';
        }

        await prisma.control.update({
          where: { id: control.id },
          data: {
            implementationStatus: implementationStatus as any,
            implementationDate: implementationStatus === 'IMPLEMENTED' ? new Date() : null,
            lastTested: new Date(),
            testResults: {
              implementationRate: Math.round(implementationRate * 100),
              totalSystems: checks.length,
              compliantSystems: compliantChecks,
              lastTestDate: new Date().toISOString()
            }
          }
        });
      }
    }

    // Generate some additional sample documents
    await generateSampleDocuments(aiSystems, user.id);

    console.log(`✅ Generated ${checksCreated} compliance checks`);
    console.log(`✅ Updated ${controls.length} control statuses`);
    console.log(`✅ Sample compliance data generation complete!`);

    // Show summary statistics
    const complianceStats = await prisma.complianceCheck.groupBy({
      by: ['status'],
      where: {
        system: { tenantId }
      },
      _count: true
    });

    console.log(`\n📊 Compliance Statistics:`);
    complianceStats.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count} checks`);
    });

  } catch (error) {
    console.error('❌ Error generating compliance data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Get relevant controls for a system based on risk level
 */
function getRelevantControls(controls: any[], riskLevel: string | null): any[] {
  if (!riskLevel) {
    // For unclassified systems, only apply basic controls
    return controls.filter(c => c.priority === 'LOW' || c.priority === 'MEDIUM').slice(0, 3);
  }

  switch (riskLevel) {
    case 'PROHIBITED':
      return controls.filter(c => c.code.startsWith('PRO-'));
    case 'HIGH_RISK':
      return controls.filter(c => ['CRITICAL', 'HIGH'].includes(c.priority));
    case 'LIMITED_RISK':
      return controls.filter(c => c.priority !== 'LOW').slice(0, 6);
    case 'MINIMAL_RISK':
      return controls.filter(c => ['MEDIUM', 'LOW'].includes(c.priority)).slice(0, 4);
    default:
      return controls.slice(0, 3);
  }
}

/**
 * Generate realistic compliance status based on control priority and system risk
 */
function generateRealisticComplianceStatus(priority: string, riskLevel: string | null): string {
  const statuses = ['COMPLIANT', 'NON_COMPLIANT', 'PARTIAL', 'PENDING_REVIEW'];
  
  // Higher priority controls are more likely to be compliant
  // Higher risk systems are more likely to have compliance issues
  
  let complianceChance = 0.7; // Base 70% compliance rate
  
  // Adjust based on priority
  switch (priority) {
    case 'CRITICAL':
      complianceChance = 0.85;
      break;
    case 'HIGH':
      complianceChance = 0.75;
      break;
    case 'MEDIUM':
      complianceChance = 0.65;
      break;
    case 'LOW':
      complianceChance = 0.55;
      break;
  }

  // Adjust based on risk level
  switch (riskLevel) {
    case 'HIGH_RISK':
      complianceChance += 0.1; // High-risk systems get more attention
      break;
    case 'LIMITED_RISK':
      complianceChance -= 0.05;
      break;
    case 'MINIMAL_RISK':
      complianceChance -= 0.1;
      break;
    case null:
      complianceChance -= 0.15; // Unclassified systems are less compliant
      break;
  }

  const random = Math.random();
  
  if (random < complianceChance) {
    return 'COMPLIANT';
  } else if (random < complianceChance + 0.15) {
    return 'PARTIAL';
  } else if (random < complianceChance + 0.25) {
    return 'PENDING_REVIEW';
  } else {
    return 'NON_COMPLIANT';
  }
}

/**
 * Generate compliance notes based on status
 */
function generateComplianceNotes(status: string, controlName: string): string {
  switch (status) {
    case 'COMPLIANT':
      return `${controlName} fully implemented and verified. All requirements met.`;
    case 'PARTIAL':
      return `${controlName} partially implemented. Some requirements need completion.`;
    case 'PENDING_REVIEW':
      return `${controlName} implementation pending review. Evidence submitted for evaluation.`;
    case 'NON_COMPLIANT':
      return `${controlName} not implemented or does not meet requirements. Action needed.`;
    default:
      return `${controlName} status unknown.`;
  }
}

/**
 * Generate random date within specified days ago
 */
function generateRandomDate(daysAgo: number): Date {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysAgo);
  const date = new Date(now.getTime() - (randomDays * 24 * 60 * 60 * 1000));
  return date;
}

/**
 * Generate sample documents for systems
 */
async function generateSampleDocuments(aiSystems: any[], userId: string) {
  const documentTypes = ['TECHNICAL_DOCUMENTATION', 'USER_MANUAL', 'RISK_ASSESSMENT'];
  let documentsCreated = 0;

  for (const system of aiSystems.slice(0, 3)) { // Only for first 3 systems
    for (const docType of documentTypes) {
      const existingDoc = await prisma.document.findFirst({
        where: {
          systemId: system.id,
          type: docType
        }
      });

      if (!existingDoc) {
        await prisma.document.create({
          data: {
            systemId: system.id,
            type: docType as any,
            name: `${docType.replace('_', ' ')} - ${system.name}`,
            fileUrl: `/documents/${system.id}/${docType.toLowerCase()}.pdf`,
            version: '1.0',
            uploadedBy: userId,
            requiredForApproval: ['TECHNICAL_DOCUMENTATION', 'RISK_ASSESSMENT'].includes(docType),
            status: Math.random() > 0.3 ? 'APPROVED' : 'DRAFT'
          }
        });
        documentsCreated++;
      }
    }
  }

  console.log(`✅ Generated ${documentsCreated} sample documents`);
}

// Run the script
generateComplianceData();