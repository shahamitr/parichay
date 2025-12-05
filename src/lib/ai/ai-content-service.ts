/**
 * AI Content Service - High-level API for content generation
 */

import { generateContent, generateVariations } from './openai-service';
import {
  getHeadlinePrompt,
  getTaglinePrompt,
  getAboutPrompt,
  getServiceDescriptionPrompt,
  getMetaDescriptionPrompt,
  getSocialMediaPostPrompt,
  getEmailSubjectPrompt,
  getCTAPrompt,
  getSystemPrompt,
  type PromptContext,
} from './content-prompts';

export interface AIContentRequest {
  type: 'headline' | 'tagline' | 'about' | 'service' | 'seo' | 'social' | 'email' | 'cta';
  context: PromptContext;
  variations?: number;
  serviceName?: string;
  platform?: 'facebook' | 'instagram' | 'linkedin' | 'twitter';
  emailPurpose?: string;
  ctaGoal?: string;
}

export interface AIContentResponse {
  variations: string[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Generate AI content based on type
 */
export async function generateAIContent(
  request: AIContentRequest
): Promise<AIContentResponse> {
  const { type, context, variations: count = 5 } = request;

  let prompt: string;

  switch (type) {
    case 'headline':
      prompt = getHeadlinePrompt(context);
      break;
    case 'tagline':
      prompt = getTaglinePrompt(context);
      break;
    case 'about':
      prompt = getAboutPrompt(context);
      break;
    case 'service':
      if (!request.serviceName) throw new Error('Service name required');
      prompt = getServiceDescriptionPrompt(request.serviceName, context);
      break;
    case 'seo':
      prompt = getMetaDescriptionPrompt(context);
      break;
    case 'social':
      if (!request.platform) throw new Error('Platform required');
      prompt = getSocialMediaPostPrompt(request.platform, context);
      break;
    case 'email':
      if (!request.emailPurpose) throw new Error('Email purpose required');
      prompt = getEmailSubjectPrompt(request.emailPurpose, context);
      break;
    case 'cta':
      if (!request.ctaGoal) throw new Error('CTA goal required');
      prompt = getCTAPrompt(request.ctaGoal, context);
      break;
    default:
      throw new Error(`Unknown content type: ${type}`);
  }

  const systemPrompt = getSystemPrompt(type);

  // For single long-form content (about), generate once
  if (type === 'about' && context.length !== 'short') {
    const result = await generateContent({
      prompt,
      systemPrompt,
      maxTokens: 500,
      temperature: 0.7,
    });

    return {
      variations: [result.content],
      usage: result.usage,
    };
  }

  // For short content, generate multiple variations
  const variationsList = await generateVariations(prompt, count, {
    systemPrompt,
    temperature: 0.8,
  });

  return {
    variations: variationsList,
    usage: {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    },
  };
}

/**
 * Generate complete microsite content
 */
export async function generateMicrositeContent(context: PromptContext) {
  const [headlines, taglines, aboutContent] = await Promise.all([
    generateAIContent({ type: 'headline', context, variations: 5 }),
    generateAIContent({ type: 'tagline', context, variations: 10 }),
    generateAIContent({ type: 'about', context }),
  ]);

  return {
    headlines: headlines.variations,
    taglines: taglines.variations,
    about: aboutContent.variations[0],
    totalUsage: {
      promptTokens: headlines.usage.promptTokens + taglines.usage.promptTokens + aboutContent.usage.promptTokens,
      completionTokens: headlines.usage.completionTokens + taglines.usage.completionTokens + aboutContent.usage.completionTokens,
      totalTokens: headlines.usage.totalTokens + taglines.usage.totalTokens + aboutContent.usage.totalTokens,
    },
  };
}

/**
 * Improve existing content
 */
export async function improveContent(
  content: string,
  improvementType: 'clarity' | 'engagement' | 'seo' | 'brevity' | 'professionalism'
): Promise<string> {
  const improvements = {
    clarity: 'Make this content clearer and easier to understand while maintaining its core message',
    engagement: 'Make this content more engaging and compelling while keeping the same information',
    seo: 'Optimize this content for SEO by naturally incorporating relevant keywords',
    brevity: 'Make this content more concise while preserving all key information',
    professionalism: 'Make this content more professional and polished',
  };

  const prompt = `${improvements[improvementType]}:\n\n${content}`;

  const result = await generateContent({
    prompt,
    systemPrompt: 'You are an expert editor who improves content while maintaining its voice and intent.',
    maxTokens: Math.max(500, content.length * 1.5),
    temperature: 0.5,
  });

  return result.content;
}
