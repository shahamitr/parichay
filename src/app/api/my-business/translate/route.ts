/**
 * Multi-Language Profile Content
 * POST /api/my-business/translate — Translate business content using OpenAI
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { z } from 'zod';
import OpenAI from 'openai';

const SUPPORTED_LANGUAGES = {
  hi: 'Hindi',
  gu: 'Gujarati',
  mr: 'Marathi',
} as const;

type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

const translateSchema = z.object({
  targetLanguage: z.enum(['hi', 'gu', 'mr']),
  fields: z.array(z.enum(['about', 'services', 'tagline'])).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check OpenAI configuration
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { targetLanguage, fields } = translateSchema.parse(body);

    // Get brand and branch
    const brand = await prisma.brand.findFirst({
      where: {
        OR: [{ ownerId: user.id }, { users: { some: { id: user.id } } }],
      },
      include: {
        branches: { where: { isActive: true }, take: 1 },
      },
    });

    if (!brand || !brand.branches[0]) {
      return NextResponse.json({ error: 'No business found' }, { status: 404 });
    }

    const branch = brand.branches[0];
    const micrositeConfig = (branch.micrositeConfig as any) || {};
    const sections = micrositeConfig.sections || {};

    // Collect content to translate
    const contentToTranslate: Record<string, string | string[]> = {};

    if (fields.includes('tagline') && brand.tagline) {
      contentToTranslate.tagline = brand.tagline;
    }

    if (fields.includes('about') && sections.about?.content) {
      contentToTranslate.about = sections.about.content;
    }

    if (fields.includes('services') && sections.services?.items) {
      contentToTranslate.services = sections.services.items.map(
        (item: any) => `${item.name}: ${item.description || ''}`
      );
    }

    if (Object.keys(contentToTranslate).length === 0) {
      return NextResponse.json(
        { error: 'No content found to translate. Please add content to your profile first.' },
        { status: 400 }
      );
    }

    // Translate using OpenAI
    const openai = new OpenAI({ apiKey });
    const langName = SUPPORTED_LANGUAGES[targetLanguage];

    const prompt = buildTranslationPrompt(contentToTranslate, langName);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator specializing in Indian languages. Translate business content accurately to ${langName}. Maintain the tone and formatting. Return JSON only.`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const translatedContent = JSON.parse(completion.choices[0].message.content || '{}');

    // Save translated content in micrositeConfig
    const sectionKey = `sections_${targetLanguage}`;
    const updatedConfig = {
      ...micrositeConfig,
      [sectionKey]: {
        ...micrositeConfig[sectionKey],
        ...translatedContent,
        updatedAt: new Date().toISOString(),
      },
      languagesEnabled: [
        ...new Set([...(micrositeConfig.languagesEnabled || ['en']), targetLanguage]),
      ],
    };

    await prisma.branch.update({
      where: { id: branch.id },
      data: { micrositeConfig: updatedConfig },
    });

    return NextResponse.json({
      success: true,
      targetLanguage,
      languageName: langName,
      translated: translatedContent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}

function buildTranslationPrompt(content: Record<string, string | string[]>, language: string): string {
  let prompt = `Translate the following business content to ${language}. Return as a JSON object with the same keys.\n\n`;

  for (const [key, value] of Object.entries(content)) {
    if (Array.isArray(value)) {
      prompt += `"${key}": [\n`;
      value.forEach((item, idx) => {
        prompt += `  ${idx + 1}. "${item}"\n`;
      });
      prompt += `]\n\n`;
    } else {
      prompt += `"${key}": "${value}"\n\n`;
    }
  }

  prompt += `\nReturn a JSON object with translated values. For arrays, return them as arrays of strings.`;
  return prompt;
}
