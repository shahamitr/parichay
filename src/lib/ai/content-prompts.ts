/**
 * AI Content Generation Prompts
 */

export type ContentTone = 'professional' | 'friendly' | 'persuasive' | 'casual' | 'witty';
export type ContentLength = 'short' | 'medium' | 'long';

export interface PromptContext {
  businessName: string;
  industry?: string;
  keywords?: string[];
  tone?: ContentTone;
  length?: ContentLength;
  targetAudience?: string;
  uniqueSellingPoint?: string;
}

/**
 * Generate headline prompt
 */
export function getHeadlinePrompt(context: PromptContext): string {
  const { businessName, industry, tone = 'professional', keywords = [] } = context;

  return `Create a compelling headline for ${businessName}${industry ? `, a ${industry} business` : ''}.

Tone: ${tone}
${keywords.length > 0 ? `Keywords to include: ${keywords.join(', ')}` : ''}

The headline should be:
- Attention-grabbing and memorable
- Clear about what the business does
- Between 5-10 words
- ${tone === 'professional' ? 'Professional and trustworthy' : ''}
${tone === 'friendly' ? 'Warm and approachable' : ''}
${tone === 'persuasive' ? 'Compelling and action-oriented' : ''}
${tone === 'casual' ? 'Relaxed and conversational' : ''}
${tone === 'witty' ? 'Clever and memorable' : ''}`;
}

/**
 * Generate tagline prompt
 */
export function getTaglinePrompt(context: PromptContext): string {
  const { businessName, industry, tone = 'professional', uniqueSellingPoint } = context;

  return `Create a catchy tagline for ${businessName}${industry ? `, a ${industry} business` : ''}.

${uniqueSellingPoint ? `Unique Selling Point: ${uniqueSellingPoint}` : ''}
Tone: ${tone}

The tagline should be:
- Memorable and concise (3-7 words)
- Communicate the brand's value proposition
- Be easy to remember
- ${tone} in tone`;
}

/**
 * Generate about us prompt
 */
export function getAboutPrompt(context: PromptContext): string {
  const {
    businessName,
    industry,
    tone = 'professional',
    length = 'medium',
    uniqueSellingPoint,
    targetAudience
  } = context;

  const wordCount = length === 'short' ? '50-75' : length === 'medium' ? '100-150' : '200-300';

  return `Write an "About Us" section for ${businessName}${industry ? `, a ${industry} business` : ''}.

${uniqueSellingPoint ? `What makes us unique: ${uniqueSellingPoint}` : ''}
${targetAudience ? `Target audience: ${targetAudience}` : ''}
Tone: ${tone}
Length: ${wordCount} words

The content should:
- Tell the company's story
- Highlight what makes them unique
- Build trust and credibility
- Connect with the target audience
- Be engaging and authentic
- End with a subtle call-to-action`;
}

/**
 * Generate service description prompt
 */
export function getServiceDescriptionPrompt(
  serviceName: string,
  context: PromptContext
): string {
  const { businessName, tone = 'professional', length = 'medium' } = context;
  const wordCount = length === 'short' ? '30-50' : length === 'medium' ? '75-100' : '150-200';

  return `Write a compelling description for the service "${serviceName}" offered by ${businessName}.

Tone: ${tone}
Length: ${wordCount} words

The description should:
- Clearly explain what the service is
- Highlight key benefits (not just features)
- Address customer pain points
- Include a subtle call-to-action
- Be scannable with short paragraphs`;
}

/**
 * Generate SEO meta description prompt
 */
export function getMetaDescriptionPrompt(context: PromptContext): string {
  const { businessName, industry, keywords = [] } = context;

  return `Write an SEO-optimized meta description for ${businessName}${industry ? `, a ${industry} business` : ''}.

${keywords.length > 0 ? `Keywords to include: ${keywords.join(', ')}` : ''}

Requirements:
- Exactly 150-160 characters
- Include primary keyword naturally
- Compelling and click-worthy
- Accurately describe the business
- Include a call-to-action if possible`;
}

/**
 * Generate social media post prompt
 */
export function getSocialMediaPostPrompt(
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter',
  context: PromptContext
): string {
  const { businessName, industry, tone = 'friendly' } = context;

  const platformGuidelines = {
    facebook: 'conversational, engaging, can be longer (100-150 words)',
    instagram: 'visual-focused, use emojis, hashtags, shorter (50-100 words)',
    linkedin: 'professional, thought-leadership, industry insights (100-200 words)',
    twitter: 'concise, punchy, under 280 characters',
  };

  return `Create a ${platform} post for ${businessName}${industry ? `, a ${industry} business` : ''}.

Platform guidelines: ${platformGuidelines[platform]}
Tone: ${tone}

The post should:
- Be engaging and shareable
- Include relevant hashtags (3-5 for Instagram, 1-2 for others)
- Have a clear message or value
- Encourage engagement (likes, comments, shares)
${platform === 'instagram' ? '- Include emoji strategically' : ''}
${platform === 'linkedin' ? '- Provide professional insights' : ''}`;
}

/**
 * Generate email subject line prompt
 */
export function getEmailSubjectPrompt(
  emailPurpose: string,
  context: PromptContext
): string {
  const { businessName, tone = 'professional' } = context;

  return `Create compelling email subject lines for ${businessName}.

Email purpose: ${emailPurpose}
Tone: ${tone}

Requirements:
- 40-60 characters
- Create urgency or curiosity
- Personalized when possible
- Avoid spam trigger words
- Clear value proposition`;
}

/**
 * Generate call-to-action prompt
 */
export function getCTAPrompt(
  ctaGoal: string,
  context: PromptContext
): string {
  const { businessName, tone = 'persuasive' } = context;

  return `Create powerful call-to-action (CTA) buttons for ${businessName}.

Goal: ${ctaGoal}
Tone: ${tone}

Requirements:
- Action-oriented verbs
- Create urgency
- 2-4 words maximum
- Clear benefit
- Compelling and clickable`;
}

/**
 * Get system prompt based on content type
 */
export function getSystemPrompt(contentType: string): string {
  const prompts: Record<string, string> = {
    headline: 'You are an expert headline writer who creates attention-grabbing, memorable headlines that drive engagement.',
    tagline: 'You are a branding expert who creates concise, memorable taglines that capture brand essence.',
    about: 'You are a professional copywriter who writes authentic, engaging "About Us" content that builds trust.',
    service: 'You are a marketing copywriter who writes benefit-focused service descriptions that convert.',
    seo: 'You are an SEO expert who writes optimized meta descriptions that improve click-through rates.',
    social: 'You are a social media expert who creates engaging, shareable content for various platforms.',
    email: 'You are an email marketing expert who writes subject lines that maximize open rates.',
    cta: 'You are a conversion optimization expert who creates compelling calls-to-action.',
  };

  return prompts[contentType] || 'You are a professional copywriter helping businesses create compelling content.';
}
