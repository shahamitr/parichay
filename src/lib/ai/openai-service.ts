/**
 * OpenAI Service for AI Content Generation
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIGenerationOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
  systemPrompt?: string;
}

export interface AIGenerationResult {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

/**
 * Generate content using OpenAI
 */
export async function generateContent(
  options: AIGenerationOptions
): Promise<AIGenerationResult> {
  const {
    prompt,
    maxTokens = 500,
    temperature = 0.7,
    model = 'gpt-4o-mini',
    systemPrompt = 'You are a professional copywriter helping businesses create compelling content.',
  } = options;

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: maxTokens,
      temperature,
    });

    const content = response.choices[0]?.message?.content || '';

    return {
      content,
      usage: {
        promptTokens: response.usage?.prompt_tokens || 0,
        completionTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0,
      },
      model: response.model,
    };
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw new Error('Failed to generate content with AI');
  }
}

/**
 * Generate multiple variations
 */
export async function generateVariations(
  prompt: string,
  count: number = 5,
  options?: Partial<AIGenerationOptions>
): Promise<string[]> {
  const variationsPrompt = `${prompt}\n\nGenerate ${count} different variations. Return only the variations, one per line, without numbering.`;

  const result = await generateContent({
    prompt: variationsPrompt,
    maxTokens: 300 * count,
    temperature: 0.8,
    ...options,
  });

  // Split by newlines and filter empty lines
  return result.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.match(/^\d+[\.\)]/))
    .slice(0, count);
}

/**
 * Check if AI is available
 */
export function isAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Estimate token count (rough approximation)
 */
export function estimateTokens(text: string): number {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
