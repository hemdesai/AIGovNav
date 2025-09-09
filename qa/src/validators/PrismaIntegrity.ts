import { QACheckpoint } from '../index.js';
import fs from 'fs';
import path from 'path';

export class PrismaIntegrityValidator {
  private readonly checkpoints: Map<string, (projectPath: string) => Promise<QACheckpoint>>;

  constructor() {
    this.checkpoints = new Map();
    this.initializeCheckpoints();
  }

  private initializeCheckpoints(): void {
    // Schema Validation (5)
    this.checkpoints.set('PRISMA-001', this.checkSchemaExists);
    this.checkpoints.set('PRISMA-002', this.checkSchemaValidity);
    this.checkpoints.set('PRISMA-003', this.checkModelDefinitions);
    this.checkpoints.set('PRISMA-004', this.checkRelationships);
    this.checkpoints.set('PRISMA-005', this.checkIndexes);

    // Migration Management (4)
    this.checkpoints.set('PRISMA-006', this.checkMigrationFolder);
    this.checkpoints.set('PRISMA-007', this.checkMigrationSync);
    this.checkpoints.set('PRISMA-008', this.checkSeedScript);
    this.checkpoints.set('PRISMA-009', this.checkBackupStrategy);

    // Security & Best Practices (5)
    this.checkpoints.set('PRISMA-010', this.checkConnectionSecurity);
    this.checkpoints.set('PRISMA-011', this.checkQuerySafety);
    this.checkpoints.set('PRISMA-012', this.checkDataValidation);
    this.checkpoints.set('PRISMA-013', this.checkSoftDeletes);
    this.checkpoints.set('PRISMA-014', this.checkAuditFields);
  }

  async validate(projectPath: string): Promise<QACheckpoint[]> {
    const results: QACheckpoint[] = [];

    for (const [id, validator] of this.checkpoints) {
      try {
        const result = await validator.call(this, projectPath);
        results.push(result);
      } catch (error) {
        results.push({
          id,
          name: `Prisma Integrity Checkpoint ${id}`,
          category: 'prismaIntegrity',
          priority: 'high',
          status: 'failed',
          message: `Error running checkpoint: ${error}`
        });
      }
    }

    return results;
  }

  private async checkSchemaExists(projectPath: string): Promise<QACheckpoint> {
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    const exists = fs.existsSync(schemaPath);

    return {
      id: 'PRISMA-001',
      name: 'Prisma Schema File',
      category: 'prismaIntegrity',
      priority: 'critical',
      status: exists ? 'passed' : 'failed',
      message: exists
        ? 'Prisma schema file found'
        : 'Prisma schema file missing'
    };
  }

  private async checkSchemaValidity(projectPath: string): Promise<QACheckpoint> {
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      return {
        id: 'PRISMA-002',
        name: 'Schema Validity',
        category: 'prismaIntegrity',
        priority: 'critical',
        status: 'failed',
        message: 'Cannot validate - schema file missing'
      };
    }

    const content = fs.readFileSync(schemaPath, 'utf-8');
    const hasProvider = /provider\s*=\s*["']postgresql["']/i.test(content);
    const hasGenerator = /generator\s+client/i.test(content);

    return {
      id: 'PRISMA-002',
      name: 'Schema Validity',
      category: 'prismaIntegrity',
      priority: 'critical',
      status: hasProvider && hasGenerator ? 'passed' : 'failed',
      message: hasProvider && hasGenerator
        ? 'Prisma schema properly configured'
        : 'Prisma schema configuration incomplete'
    };
  }

  private async checkModelDefinitions(projectPath: string): Promise<QACheckpoint> {
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      return {
        id: 'PRISMA-003',
        name: 'Model Definitions',
        category: 'prismaIntegrity',
        priority: 'high',
        status: 'failed',
        message: 'Cannot check models - schema file missing'
      };
    }

    const content = fs.readFileSync(schemaPath, 'utf-8');
    const requiredModels = ['User', 'AISystem', 'RiskAssessment'];
    const foundModels = requiredModels.filter(model => 
      new RegExp(`model\\s+${model}\\s*{`, 'i').test(content)
    );

    return {
      id: 'PRISMA-003',
      name: 'Model Definitions',
      category: 'prismaIntegrity',
      priority: 'high',
      status: foundModels.length === requiredModels.length ? 'passed' : 'warning',
      message: foundModels.length === requiredModels.length
        ? 'All required models defined'
        : `Missing models: ${requiredModels.filter(m => !foundModels.includes(m)).join(', ')}`
    };
  }

  private async checkRelationships(projectPath: string): Promise<QACheckpoint> {
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      return {
        id: 'PRISMA-004',
        name: 'Model Relationships',
        category: 'prismaIntegrity',
        priority: 'high',
        status: 'failed',
        message: 'Cannot check relationships - schema file missing'
      };
    }

    const content = fs.readFileSync(schemaPath, 'utf-8');
    const hasRelations = /@relation/i.test(content);

    return {
      id: 'PRISMA-004',
      name: 'Model Relationships',
      category: 'prismaIntegrity',
      priority: 'high',
      status: hasRelations ? 'passed' : 'warning',
      message: hasRelations
        ? 'Model relationships defined'
        : 'No model relationships found'
    };
  }

  private async checkIndexes(projectPath: string): Promise<QACheckpoint> {
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      return {
        id: 'PRISMA-005',
        name: 'Database Indexes',
        category: 'prismaIntegrity',
        priority: 'medium',
        status: 'failed',
        message: 'Cannot check indexes - schema file missing'
      };
    }

    const content = fs.readFileSync(schemaPath, 'utf-8');
    const hasIndexes = /@@index|@@unique|@unique/i.test(content);

    return {
      id: 'PRISMA-005',
      name: 'Database Indexes',
      category: 'prismaIntegrity',
      priority: 'medium',
      status: hasIndexes ? 'passed' : 'warning',
      message: hasIndexes
        ? 'Database indexes configured'
        : 'Consider adding indexes for performance'
    };
  }

  private async checkMigrationFolder(projectPath: string): Promise<QACheckpoint> {
    const migrationsPath = path.join(projectPath, 'prisma', 'migrations');
    const exists = fs.existsSync(migrationsPath);

    return {
      id: 'PRISMA-006',
      name: 'Migration Folder',
      category: 'prismaIntegrity',
      priority: 'high',
      status: exists ? 'passed' : 'warning',
      message: exists
        ? 'Migration folder exists'
        : 'No migrations folder - run prisma migrate'
    };
  }

  private async checkMigrationSync(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'PRISMA-007',
      name: 'Migration Sync Status',
      category: 'prismaIntegrity',
      priority: 'high',
      status: 'warning',
      message: 'Migration sync status needs verification'
    };
  }

  private async checkSeedScript(projectPath: string): Promise<QACheckpoint> {
    const seedPath = path.join(projectPath, 'prisma', 'seed.ts');
    const seedJsPath = path.join(projectPath, 'prisma', 'seed.js');
    const exists = fs.existsSync(seedPath) || fs.existsSync(seedJsPath);

    return {
      id: 'PRISMA-008',
      name: 'Seed Script',
      category: 'prismaIntegrity',
      priority: 'low',
      status: exists ? 'passed' : 'warning',
      message: exists
        ? 'Database seed script found'
        : 'Consider adding seed script for development'
    };
  }

  private async checkBackupStrategy(projectPath: string): Promise<QACheckpoint> {
    return {
      id: 'PRISMA-009',
      name: 'Backup Strategy',
      category: 'prismaIntegrity',
      priority: 'medium',
      status: 'warning',
      message: 'Database backup strategy needs documentation'
    };
  }

  private async checkConnectionSecurity(projectPath: string): Promise<QACheckpoint> {
    const envPath = path.join(projectPath, '.env');
    const envExamplePath = path.join(projectPath, '.env.example');
    
    const hasEnvExample = fs.existsSync(envExamplePath);
    
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const hasSSL = /sslmode=require|ssl=true/i.test(content);
      
      return {
        id: 'PRISMA-010',
        name: 'Connection Security',
        category: 'prismaIntegrity',
        priority: 'critical',
        status: hasSSL ? 'passed' : 'warning',
        message: hasSSL
          ? 'Database connection uses SSL'
          : 'Consider enabling SSL for database connection'
      };
    }

    return {
      id: 'PRISMA-010',
      name: 'Connection Security',
      category: 'prismaIntegrity',
      priority: 'critical',
      status: hasEnvExample ? 'warning' : 'failed',
      message: hasEnvExample
        ? 'Check .env.example for connection security'
        : 'No environment configuration found'
    };
  }

  private async checkQuerySafety(projectPath: string): Promise<QACheckpoint> {
    const hasSafeQueries = await this.fileContainsPattern(
      path.join(projectPath, 'src'),
      /prisma\.\$queryRaw|prisma\.\$executeRaw/
    );

    if (!hasSafeQueries) {
      return {
        id: 'PRISMA-011',
        name: 'Query Safety',
        category: 'prismaIntegrity',
        priority: 'high',
        status: 'passed',
        message: 'No raw queries detected - using safe Prisma queries'
      };
    }

    return {
      id: 'PRISMA-011',
      name: 'Query Safety',
      category: 'prismaIntegrity',
      priority: 'high',
      status: 'warning',
      message: 'Raw queries detected - ensure proper parameterization'
    };
  }

  private async checkDataValidation(projectPath: string): Promise<QACheckpoint> {
    const hasValidation = await this.fileContainsPattern(
      projectPath,
      /zod|yup|joi|class-validator|@prisma\/client/
    );

    return {
      id: 'PRISMA-012',
      name: 'Data Validation',
      category: 'prismaIntegrity',
      priority: 'high',
      status: hasValidation ? 'passed' : 'warning',
      message: hasValidation
        ? 'Data validation library detected'
        : 'Consider adding data validation'
    };
  }

  private async checkSoftDeletes(projectPath: string): Promise<QACheckpoint> {
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      return {
        id: 'PRISMA-013',
        name: 'Soft Deletes',
        category: 'prismaIntegrity',
        priority: 'medium',
        status: 'failed',
        message: 'Cannot check soft deletes - schema file missing'
      };
    }

    const content = fs.readFileSync(schemaPath, 'utf-8');
    const hasSoftDeletes = /deletedAt\s+DateTime\?/i.test(content);

    return {
      id: 'PRISMA-013',
      name: 'Soft Deletes',
      category: 'prismaIntegrity',
      priority: 'medium',
      status: hasSoftDeletes ? 'passed' : 'warning',
      message: hasSoftDeletes
        ? 'Soft delete fields found'
        : 'Consider implementing soft deletes for data recovery'
    };
  }

  private async checkAuditFields(projectPath: string): Promise<QACheckpoint> {
    const schemaPath = path.join(projectPath, 'prisma', 'schema.prisma');
    
    if (!fs.existsSync(schemaPath)) {
      return {
        id: 'PRISMA-014',
        name: 'Audit Fields',
        category: 'prismaIntegrity',
        priority: 'high',
        status: 'failed',
        message: 'Cannot check audit fields - schema file missing'
      };
    }

    const content = fs.readFileSync(schemaPath, 'utf-8');
    const hasCreatedAt = /createdAt\s+DateTime\s+@default\(now\(\)\)/i.test(content);
    const hasUpdatedAt = /updatedAt\s+DateTime\s+@updatedAt/i.test(content);

    return {
      id: 'PRISMA-014',
      name: 'Audit Fields',
      category: 'prismaIntegrity',
      priority: 'high',
      status: hasCreatedAt && hasUpdatedAt ? 'passed' : 'warning',
      message: hasCreatedAt && hasUpdatedAt
        ? 'Audit timestamp fields properly configured'
        : 'Missing or incomplete audit timestamp fields'
    };
  }

  private async fileContainsPattern(searchPath: string, pattern: RegExp): Promise<boolean> {
    if (!fs.existsSync(searchPath)) {
      return false;
    }

    const stat = fs.statSync(searchPath);
    
    if (stat.isFile()) {
      const content = fs.readFileSync(searchPath, 'utf-8');
      return pattern.test(content);
    }

    if (stat.isDirectory()) {
      const files = this.getAllFiles(searchPath);
      for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
          const content = fs.readFileSync(file, 'utf-8');
          if (pattern.test(content)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory() && !file.includes('node_modules')) {
        arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
      } else {
        arrayOfFiles.push(filePath);
      }
    });

    return arrayOfFiles;
  }
}