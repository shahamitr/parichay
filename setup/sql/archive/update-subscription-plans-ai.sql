-- Update Subscription Plans with AI Generation Limits
-- Run this SQL script to add AI features to your subscription plans

-- Free Plan: 10 AI generations per month
UPDATE "SubscriptionPlan"
SET features = jsonb_set(
  COALESCE(features::jsonb, '{}'::jsonb),
  '{aiGenerations}',
  '10'::jsonb
)
WHERE name = 'Free';

-- Basic Plan: 50 AI generations per month
UPDATE "SubscriptionPlan"
SET features = jsonb_set(
  COALESCE(features::jsonb, '{}'::jsonb),
  '{aiGenerations}',
  '50'::jsonb
)
WHERE name = 'Basic';

-- Pro Plan: 200 AI generations per month
UPDATE "SubscriptionPlan"
SET features = jsonb_set(
  COALESCE(features::jsonb, '{}'::jsonb),
  '{aiGenerations}',
  '200'::jsonb
)
WHERE name = 'Pro';

-- Enterprise Plan: Unlimited AI generations
UPDATE "SubscriptionPlan"
SET features = jsonb_set(
  COALESCE(features::jsonb, '{}'::jsonb),
  '{aiGenerations}',
  '999999'::jsonb
)
WHERE name = 'Enterprise';

-- Verify the updates
SELECT
  name,
  price,
  features->>'aiGenerations' as ai_generations,
  features
FROM "SubscriptionPlan"
ORDER BY price;
