/**
 * Audit Log Service
 * Provides immutable audit logging with hash-chain integrity
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface AuditLogEntry {
  tenantId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: any;
}

export class AuditLogService {
  /**
   * Create an audit log entry with hash-chain integrity
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      // Get the previous log entry for hash chaining
      const previousLog = await prisma.auditLog.findFirst({
        where: { tenantId: entry.tenantId },
        orderBy: { timestamp: 'desc' }
      });

      // Calculate hash for integrity
      const hash = this.calculateHash({
        ...entry,
        timestamp: new Date().toISOString(),
        previousHash: previousLog?.hash || 'genesis'
      });

      // Create the audit log entry
      await prisma.auditLog.create({
        data: {
          tenantId: entry.tenantId,
          userId: entry.userId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          timestamp: new Date(),
          metadata: entry.metadata || {},
          hash,
          previousHash: previousLog?.hash || 'genesis'
        }
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Audit logs should not break the main flow
      // Log to external system or file as fallback
    }
  }

  /**
   * Calculate SHA-256 hash for audit log integrity
   */
  private calculateHash(data: any): string {
    const content = JSON.stringify(data);
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Verify audit log integrity
   */
  async verifyIntegrity(tenantId: string, startDate?: Date, endDate?: Date): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const logs = await prisma.auditLog.findMany({
      where: {
        tenantId,
        ...(startDate && endDate && {
          timestamp: {
            gte: startDate,
            lte: endDate
          }
        })
      },
      orderBy: { timestamp: 'asc' }
    });

    const errors: string[] = [];
    let previousHash = 'genesis';

    for (const log of logs) {
      // Check hash chain
      if (log.previousHash !== previousHash) {
        errors.push(`Hash chain broken at log ${log.id}`);
      }

      // Recalculate and verify hash
      const calculatedHash = this.calculateHash({
        tenantId: log.tenantId,
        userId: log.userId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        metadata: log.metadata,
        timestamp: log.timestamp.toISOString(),
        previousHash: log.previousHash
      });

      if (calculatedHash !== log.hash) {
        errors.push(`Hash mismatch at log ${log.id}`);
      }

      previousHash = log.hash;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default AuditLogService;