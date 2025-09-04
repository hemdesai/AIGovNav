/**
 * Swarm Context7 Integration Utility
 * Provides context7 documentation enrichment for swarm agent threads
 */

import { context7Service } from '../services/context7.service.js';

interface SwarmAgent {
  name: string;
  responsibilities: string[];
  context7?: {
    enabled: boolean;
    topics: string[];
    frameworks: string[];
  };
}

interface SwarmConfig {
  swarm_name: string;
  agents: Record<string, SwarmAgent>;
}

export class SwarmContext7Integration {
  
  /**
   * Load and enrich swarm configuration with context7 documentation
   */
  async enrichSwarmConfig(configPath: string): Promise<SwarmConfig | null> {
    try {
      const config = await import(configPath);
      const swarmConfig: SwarmConfig = config.default || config;
      
      // Enrich each agent with context7 documentation if enabled
      for (const [agentKey, agent] of Object.entries(swarmConfig.agents)) {
        if (agent.context7?.enabled) {
          console.log(`Enriching ${agent.name} with context7 documentation...`);
          
          // Fetch documentation for each topic
          const documentationContext = await this.fetchDocumentationForAgent(agent);
          
          if (documentationContext) {
            // Store enriched context for agent to use
            (agent as any).enrichedContext = documentationContext;
            console.log(`✅ Context7 documentation loaded for ${agent.name}`);
          } else {
            console.log(`⚠️  No context7 documentation found for ${agent.name}`);
          }
        }
      }
      
      return swarmConfig;
    } catch (error) {
      console.error('Failed to enrich swarm config with context7:', error);
      return null;
    }
  }

  /**
   * Fetch relevant documentation for a specific agent
   */
  private async fetchDocumentationForAgent(agent: SwarmAgent): Promise<string | null> {
    if (!agent.context7?.enabled) return null;

    const documentationSections: string[] = [];
    
    // Fetch documentation for each configured topic
    for (const topic of agent.context7.topics) {
      try {
        const agentType = this.determineAgentType(agent.name);
        const enrichedContext = await context7Service.enrichAgentContext(agentType, topic);
        
        if (enrichedContext) {
          documentationSections.push(`\n## ${topic}\n${enrichedContext}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch documentation for topic "${topic}":`, error);
      }
    }

    // Fetch framework-specific documentation
    for (const framework of agent.context7.frameworks) {
      try {
        const documentation = await context7Service.fetchDocumentation({
          topic: `${framework} best practices`,
          framework,
          category: 'guide'
        });
        
        if (documentation) {
          documentationSections.push(`\n## ${framework} Documentation\nSource: ${documentation.source}\n${documentation.content}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch documentation for framework "${framework}":`, error);
      }
    }

    return documentationSections.length > 0 
      ? `\n=== CONTEXT7 DOCUMENTATION ===\n${documentationSections.join('\n')}\n=== END CONTEXT7 DOCUMENTATION ===\n`
      : null;
  }

  /**
   * Determine agent type from agent name for context enrichment
   */
  private determineAgentType(agentName: string): 'engineer' | 'designer' {
    const engineerKeywords = ['backend', 'api', 'infrastructure', 'qa', 'architecture'];
    const designerKeywords = ['frontend', 'ui', 'ux', 'design'];
    
    const lowerName = agentName.toLowerCase();
    
    if (engineerKeywords.some(keyword => lowerName.includes(keyword))) {
      return 'engineer';
    } else if (designerKeywords.some(keyword => lowerName.includes(keyword))) {
      return 'designer';
    }
    
    // Default to engineer for system architecture type agents
    return 'engineer';
  }

  /**
   * Generate agent prompt with context7 documentation
   */
  async generateEnrichedAgentPrompt(
    agentKey: string, 
    basePrompt: string, 
    swarmConfig: SwarmConfig
  ): Promise<string> {
    const agent = swarmConfig.agents[agentKey];
    if (!agent || !agent.context7?.enabled) {
      return basePrompt;
    }

    const enrichedContext = (agent as any).enrichedContext;
    if (!enrichedContext) {
      return basePrompt;
    }

    return `${basePrompt}\n\n${enrichedContext}\n\nPlease use the above context7 documentation to inform your responses and ensure you're following the latest best practices.`;
  }

  /**
   * Check if context7 is properly configured for the swarm
   */
  validateContext7Configuration(): boolean {
    if (!context7Service.isAvailable()) {
      console.error('❌ Context7 service is not available. Please check CONTEXT7_API_KEY environment variable.');
      return false;
    }

    console.log('✅ Context7 service is configured and ready');
    return true;
  }

  /**
   * Refresh documentation cache for all agents
   */
  async refreshDocumentationCache(swarmConfig: SwarmConfig): Promise<void> {
    console.log('🔄 Refreshing context7 documentation cache...');
    
    for (const [agentKey, agent] of Object.entries(swarmConfig.agents)) {
      if (agent.context7?.enabled) {
        const documentationContext = await this.fetchDocumentationForAgent(agent);
        if (documentationContext) {
          (agent as any).enrichedContext = documentationContext;
          console.log(`✅ Documentation refreshed for ${agent.name}`);
        }
      }
    }
    
    console.log('🔄 Documentation cache refresh complete');
  }
}

// Export singleton instance
export const swarmContext7Integration = new SwarmContext7Integration();