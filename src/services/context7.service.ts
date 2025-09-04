/**
 * Context7 MCP Integration Service
 * Provides real-time documentation fetching for agent threads
 */

interface Context7Config {
  apiKey: string;
  baseUrl: string;
  timeout: number;
}

interface DocumentationQuery {
  topic: string;
  framework?: string;
  version?: string;
  category?: 'api' | 'guide' | 'reference' | 'examples';
}

interface DocumentationResponse {
  content: string;
  source: string;
  lastUpdated: string;
  version: string;
  relevanceScore: number;
}

export class Context7Service {
  private config: Context7Config;

  constructor() {
    this.config = {
      apiKey: process.env.CONTEXT7_API_KEY || '',
      baseUrl: process.env.CONTEXT7_BASE_URL || 'https://api.context7.com/v1',
      timeout: 5000
    };

    if (!this.config.apiKey) {
      console.warn('Context7 API key not configured. Documentation features will be limited.');
    }
  }

  /**
   * Fetch the latest documentation for a given topic
   */
  async fetchDocumentation(query: DocumentationQuery): Promise<DocumentationResponse | null> {
    if (!this.config.apiKey) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/docs/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: query.topic,
          framework: query.framework,
          version: query.version,
          category: query.category,
          includeLatest: true
        }),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`Context7 API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.results?.[0] || null;
    } catch (error) {
      console.error('Context7 documentation fetch failed:', error);
      return null;
    }
  }

  /**
   * Get documentation for React/TypeScript patterns
   */
  async getReactDocumentation(pattern: string): Promise<DocumentationResponse | null> {
    return this.fetchDocumentation({
      topic: pattern,
      framework: 'react',
      category: 'guide'
    });
  }

  /**
   * Get documentation for Node.js/Express patterns
   */
  async getNodeDocumentation(pattern: string): Promise<DocumentationResponse | null> {
    return this.fetchDocumentation({
      topic: pattern,
      framework: 'nodejs',
      category: 'api'
    });
  }

  /**
   * Get EU AI Act compliance documentation
   */
  async getComplianceDocumentation(topic: string): Promise<DocumentationResponse | null> {
    return this.fetchDocumentation({
      topic: `EU AI Act ${topic}`,
      category: 'reference'
    });
  }

  /**
   * Get latest API documentation for specific endpoints
   */
  async getAPIDocumentation(endpoint: string): Promise<DocumentationResponse | null> {
    return this.fetchDocumentation({
      topic: `API ${endpoint}`,
      category: 'api'
    });
  }

  /**
   * Check if Context7 is available
   */
  isAvailable(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Get documentation context for agent prompts
   */
  async enrichAgentContext(agentType: 'engineer' | 'designer', task: string): Promise<string> {
    if (!this.isAvailable()) {
      return '';
    }

    let documentation: DocumentationResponse | null = null;

    if (agentType === 'engineer') {
      // For engineer agents, focus on backend/API documentation
      if (task.includes('API') || task.includes('endpoint')) {
        documentation = await this.getAPIDocumentation(task);
      } else if (task.includes('database') || task.includes('prisma')) {
        documentation = await this.getNodeDocumentation(`prisma ${task}`);
      } else if (task.includes('auth') || task.includes('security')) {
        documentation = await this.getNodeDocumentation(`authentication ${task}`);
      } else {
        documentation = await this.getNodeDocumentation(task);
      }
    } else if (agentType === 'designer') {
      // For designer agents, focus on frontend/UI documentation
      if (task.includes('component') || task.includes('react')) {
        documentation = await this.getReactDocumentation(task);
      } else if (task.includes('tailwind') || task.includes('css')) {
        documentation = await this.getReactDocumentation(`tailwind ${task}`);
      } else if (task.includes('accessibility') || task.includes('a11y')) {
        documentation = await this.getReactDocumentation(`accessibility ${task}`);
      } else {
        documentation = await this.getReactDocumentation(task);
      }
    }

    if (documentation) {
      return `\n\n--- Latest Documentation Context ---\nSource: ${documentation.source}\nLast Updated: ${documentation.lastUpdated}\nVersion: ${documentation.version}\n\n${documentation.content}\n--- End Documentation Context ---\n`;
    }

    return '';
  }
}

// Export singleton instance
export const context7Service = new Context7Service();