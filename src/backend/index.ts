// Backend entry point for AI Governance Navigator
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import intakeRoutes from './routes/intake.js';
import policyRoutes from './routes/policies.js';
import documentRoutes from './routes/documents.js';
import complianceRoutes from './routes/compliance.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175', 
    'http://localhost:5176',
    'http://localhost:5177'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '0.1.0'
  });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'AI Governance Navigator API',
    version: '0.1.0',
    endpoints: {
      health: '/api/health',
      intake: '/api/v1/intake',
      registry: '/api/v1/registry',
      policies: '/api/v1/policy-pack'
    }
  });
});

// API Routes
app.use('/api/v1/intake', intakeRoutes);
app.use('/api/v1/policies', policyRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/compliance', complianceRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});