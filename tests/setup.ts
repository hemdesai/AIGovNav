import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.NODE_ENV = 'test';

// Global test utilities
global.testUtils = {
  generateMockUser: () => ({
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    email: `test-${Date.now()}@aigovnav.com`,
    role: 'compliance_officer',
    createdAt: new Date(),
    updatedAt: new Date()
  }),
  
  generateMockAISystem: () => ({
    id: 'system-' + Math.random().toString(36).substr(2, 9),
    name: 'Test AI System',
    description: 'Test system for unit testing',
    riskLevel: 'limited',
    purpose: 'Testing',
    owner: 'test@aigovnav.com',
    createdAt: new Date(),
    updatedAt: new Date()
  }),

  generateMockRiskAssessment: () => ({
    id: 'assessment-' + Math.random().toString(36).substr(2, 9),
    systemId: 'system-123',
    riskLevel: 'high',
    mitigationMeasures: ['measure1', 'measure2'],
    assessedBy: 'test@aigovnav.com',
    assessedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  })
};

// Mock fetch for API tests
global.fetch = vi.fn();

// Mock window.matchMedia for component tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Suppress console errors in tests unless explicitly needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Warning: useLayoutEffect'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});