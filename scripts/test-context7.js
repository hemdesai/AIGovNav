#!/usr/bin/env node

/**
 * Context7 Integration Test Script
 * Tests the context7 service and swarm integration
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Import our context7 service
import { context7Service } from '../src/services/context7.service.js';
import { swarmContext7Integration } from '../src/utils/swarm-context7-integration.js';

async function testContext7Service() {
  console.log('🧪 Testing Context7 Service Integration\n');
  
  // Test 1: Check if context7 is available
  console.log('1. Checking Context7 availability...');
  const isAvailable = context7Service.isAvailable();
  console.log(`   Status: ${isAvailable ? '✅ Available' : '❌ Not configured'}\n`);
  
  if (!isAvailable) {
    console.log('❌ Context7 API key not found. Please set CONTEXT7_API_KEY in your .env file.');
    return;
  }

  // Test 2: Fetch React documentation
  console.log('2. Testing React documentation fetch...');
  try {
    const reactDocs = await context7Service.getReactDocumentation('useState hook best practices');
    if (reactDocs) {
      console.log(`   ✅ Found documentation: ${reactDocs.source}`);
      console.log(`   📄 Content preview: ${reactDocs.content.substring(0, 100)}...`);
    } else {
      console.log('   ⚠️  No React documentation found');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log();

  // Test 3: Fetch Node.js documentation
  console.log('3. Testing Node.js documentation fetch...');
  try {
    const nodeDocs = await context7Service.getNodeDocumentation('Express.js middleware patterns');
    if (nodeDocs) {
      console.log(`   ✅ Found documentation: ${nodeDocs.source}`);
      console.log(`   📄 Content preview: ${nodeDocs.content.substring(0, 100)}...`);
    } else {
      console.log('   ⚠️  No Node.js documentation found');
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log();

  // Test 4: Test agent context enrichment
  console.log('4. Testing agent context enrichment...');
  try {
    const engineerContext = await context7Service.enrichAgentContext('engineer', 'API endpoint design');
    console.log(`   Engineer context length: ${engineerContext.length} characters`);
    
    const designerContext = await context7Service.enrichAgentContext('designer', 'React component patterns');
    console.log(`   Designer context length: ${designerContext.length} characters`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  console.log();

  // Test 5: Test swarm configuration validation
  console.log('5. Testing swarm configuration validation...');
  const isValid = swarmContext7Integration.validateContext7Configuration();
  console.log(`   Validation result: ${isValid ? '✅ Valid' : '❌ Invalid'}\n`);

  // Test 6: Test swarm config enrichment
  console.log('6. Testing swarm configuration enrichment...');
  try {
    const engineerConfigPath = join(__dirname, '..', 'engineer', 'swarm-config.json');
    const designerConfigPath = join(__dirname, '..', 'designer', 'swarm-config.json');
    
    console.log('   Loading engineer swarm config...');
    const engineerConfig = await swarmContext7Integration.enrichSwarmConfig(engineerConfigPath);
    if (engineerConfig) {
      const enrichedAgents = Object.values(engineerConfig.agents)
        .filter(agent => (agent as any).enrichedContext)
        .length;
      console.log(`   ✅ Engineer swarm: ${enrichedAgents} agents enriched with context7`);
    }

    console.log('   Loading designer swarm config...');
    const designerConfig = await swarmContext7Integration.enrichSwarmConfig(designerConfigPath);
    if (designerConfig) {
      const enrichedAgents = Object.values(designerConfig.agents)
        .filter(agent => (agent as any).enrichedContext)
        .length;
      console.log(`   ✅ Designer swarm: ${enrichedAgents} agents enriched with context7`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n🎉 Context7 integration test complete!');
}

// Run the test
testContext7Service().catch(console.error);