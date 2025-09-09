import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    aiSystem: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    },
    $disconnect: vi.fn()
  };
  return { PrismaClient: vi.fn(() => mockPrismaClient) };
});

describe('AI System Intake API', () => {
  let app: express.Application;
  let prisma: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    prisma = new PrismaClient();
    
    // Mock intake route handler
    app.post('/api/intake', async (req, res) => {
      try {
        const system = await prisma.aiSystem.create({
          data: req.body
        });
        res.status(201).json(system);
      } catch (error) {
        res.status(400).json({ error: 'Invalid request' });
      }
    });

    app.get('/api/intake', async (req, res) => {
      const systems = await prisma.aiSystem.findMany();
      res.json(systems);
    });
  });

  describe('POST /api/intake', () => {
    it('should create a new AI system', async () => {
      const mockSystem = {
        id: '1',
        name: 'Test AI System',
        description: 'Test description',
        riskLevel: 'limited',
        purpose: 'Testing',
        owner: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      prisma.aiSystem.create.mockResolvedValue(mockSystem);

      const response = await request(app)
        .post('/api/intake')
        .send({
          name: 'Test AI System',
          description: 'Test description',
          riskLevel: 'limited',
          purpose: 'Testing',
          owner: 'test@example.com'
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: 'Test AI System',
        riskLevel: 'limited'
      });
    });

    it('should validate EU AI Act risk levels', async () => {
      const response = await request(app)
        .post('/api/intake')
        .send({
          name: 'Test AI System',
          riskLevel: 'invalid-level',
          purpose: 'Testing'
        });

      expect(response.status).toBe(400);
    });

    it('should enforce required fields', async () => {
      const response = await request(app)
        .post('/api/intake')
        .send({
          description: 'Missing required name field'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/intake', () => {
    it('should return all AI systems', async () => {
      const mockSystems = [
        { id: '1', name: 'System 1', riskLevel: 'high' },
        { id: '2', name: 'System 2', riskLevel: 'limited' }
      ];

      prisma.aiSystem.findMany.mockResolvedValue(mockSystems);

      const response = await request(app).get('/api/intake');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('System 1');
    });
  });

  describe('Risk Classification', () => {
    it('should correctly classify high-risk AI systems', () => {
      const highRiskCategories = [
        'biometric identification',
        'critical infrastructure',
        'education and training',
        'employment',
        'law enforcement',
        'migration and border control',
        'justice and democratic processes'
      ];

      highRiskCategories.forEach(category => {
        const riskLevel = classifyRisk(category);
        expect(riskLevel).toBe('high');
      });
    });

    it('should identify unacceptable risk systems', () => {
      const unacceptableUseCases = [
        'social scoring by governments',
        'real-time remote biometric identification in public spaces',
        'subliminal manipulation',
        'exploitation of vulnerabilities'
      ];

      unacceptableUseCases.forEach(useCase => {
        const riskLevel = classifyRisk(useCase);
        expect(riskLevel).toBe('unacceptable');
      });
    });
  });
});

// Helper function for risk classification
function classifyRisk(category: string): string {
  const highRiskKeywords = [
    'biometric', 'infrastructure', 'education', 
    'employment', 'law enforcement', 'border', 'justice'
  ];
  
  const unacceptableKeywords = [
    'social scoring', 'subliminal', 'exploitation', 
    'real-time remote biometric'
  ];

  const lowerCategory = category.toLowerCase();
  
  if (unacceptableKeywords.some(keyword => lowerCategory.includes(keyword))) {
    return 'unacceptable';
  }
  
  if (highRiskKeywords.some(keyword => lowerCategory.includes(keyword))) {
    return 'high';
  }
  
  return 'limited';
}