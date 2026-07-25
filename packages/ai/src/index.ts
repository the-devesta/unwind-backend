import { z } from 'zod';

export type AIProviderName = 'OPENAI' | 'GEMINI' | 'GROQ';

export interface GenerateRequest {
  prompt: string;
  systemPrompt?: string;
  providerPriority?: AIProviderName[];
  workspaceId: string;
  feature: 'QUOTATION' | 'CONTRACT' | 'INVOICE' | 'RISK_ANALYSIS' | 'SUMMARY';
}

export interface GenerateResponse {
  content: string;
  provider: AIProviderName;
  model: string;
  latencyMs: number;
}

export interface AIProvider {
  name: AIProviderName;
  generateText(request: GenerateRequest): Promise<GenerateResponse>;
  generateStructured<T>(request: GenerateRequest, schema: z.ZodType<T>): Promise<{ data: T; meta: GenerateResponse }>;
}

/**
 * AIRouter manages key rotation, provider health, and automatic fallback
 */
export class AIRouter {
  private providers: Map<AIProviderName, AIProvider> = new Map();

  registerProvider(provider: AIProvider) {
    this.providers.set(provider.name, provider);
  }

  async generate(request: GenerateRequest): Promise<GenerateResponse> {
    const priority = request.providerPriority || ['OPENAI', 'GEMINI', 'GROQ'];

    for (const name of priority) {
      const provider = this.providers.get(name);
      if (!provider) continue;

      try {
        return await provider.generateText(request);
      } catch (error) {
        console.warn(`[AIRouter] Provider ${name} failed, attempting fallback...`, error);
      }
    }

    throw new Error('All AI providers failed to process the request.');
  }
}
