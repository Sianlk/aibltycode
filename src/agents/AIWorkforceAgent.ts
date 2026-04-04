// AI Workforce Agent — AIBLTY Code
// Autonomous AI worker for developer tools

import { aiComplete, AIMessage } from '../services/ai';

export type AgentStatus = 'idle' | 'thinking' | 'working' | 'done' | 'error';

export interface AgentTask {
  id: string;
  type: string;
  input: string;
  context?: Record<string, string>;
}

export interface AgentResult {
  taskId: string;
  output: string;
  confidence: number;
  reasoning: string;
  actions: string[];
}

const PERSONAS = {
  analyst: {
    name: 'AIBLTY Code Analyst',
    role: `Expert developer tools analyst. Capabilities: code generation, debugging, code review, documentation.`,
  },
  advisor: {
    name: 'AIBLTY Code Advisor',
    role: `Senior developer tools advisor providing strategic recommendations.`,
  },
  automator: {
    name: 'AIBLTY Code Automator',
    role: `Autonomous developer tools task executor and workflow manager.`,
  },
};

export class AIWorkforceAgent {
  private persona: keyof typeof PERSONAS;
  private history: AIMessage[] = [];
  private _status: AgentStatus = 'idle';

  constructor(persona: keyof typeof PERSONAS = 'analyst') {
    this.persona = persona;
  }

  get status(): AgentStatus { return this._status; }

  async executeTask(task: AgentTask): Promise<AgentResult> {
    this._status = 'thinking';
    const p = PERSONAS[this.persona];
    const systemPrompt = `You are ${p.name}.\nRole: ${p.role}\n\nRespond with JSON: {"output":"...","confidence":0.9,"reasoning":"...","actions":["..."]}`; 
    const userPrompt = `Task: ${task.type}\nInput: ${task.input}`;
    this._status = 'working';
    const response = await aiComplete([
      { role: 'system', content: systemPrompt },
      ...this.history,
      { role: 'user', content: userPrompt },
    ]);
    this.history.push({ role: 'user', content: userPrompt }, { role: 'assistant', content: response.content });
    if (this.history.length > 20) this.history = this.history.slice(-20);
    this._status = 'done';
    try {
      return { taskId: task.id, ...JSON.parse(response.content) };
    } catch {
      return { taskId: task.id, output: response.content, confidence: 0.7, reasoning: 'Direct response', actions: ['Processed'] };
    }
  }

  reset() { this.history = []; this._status = 'idle'; }
}

export const createAgent = (p: keyof typeof PERSONAS = 'analyst') => new AIWorkforceAgent(p);
export default AIWorkforceAgent;
