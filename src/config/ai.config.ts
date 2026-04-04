// AI Configuration for AIBLTY Code
// Domain: developer tools | Focus: code generation, debugging, code review, documentation

export const AI_CONFIG = {
  // Model endpoints
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.sianlk.com',
  models: {
    primary: 'gpt-4o',
    fast: 'gpt-4o-mini',
    embedding: 'text-embedding-3-large',
    vision: 'gpt-4o',
    audio: 'whisper-1',
  },

  // App-specific AI domain
  domain: 'developer tools',
  focus: 'code generation, debugging, code review, documentation',

  // Feature flags
  features: {
    streamingEnabled: true,
    voiceEnabled: true,
    visionEnabled: true,
    agentsEnabled: true,
    ragEnabled: true,
  },

  // Rate limiting (client-side)
  rateLimit: {
    requestsPerMinute: 60,
    tokensPerRequest: 4096,
    maxRetries: 3,
    retryDelay: 1000,
  },

  // Workforce config
  workforce: {
    orchestratorEnabled: true,
    maxConcurrentAgents: 5,
    agentTimeout: 30000,
  },
};

export type AIModel = keyof typeof AI_CONFIG.models;
export default AI_CONFIG;
