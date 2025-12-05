-- Insert Subscription Plans
INSERT INTO subscription_plans (id, name, price, duration, features, isActive, createdAt, updatedAt) VALUES
('plan_free', 'Free', 0, 'MONTHLY', '{"maxBranches":1,"customDomain":false,"analytics":false,"qrCodes":true,"leadCapture":false,"prioritySupport":false}', true, NOW(), NOW()),
('plan_starter', 'Starter', 499, 'MONTHLY', '{"maxBranches":3,"customDomain":false,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":false}', true, NOW(), NOW()),
('plan_professional', 'Professional', 999, 'MONTHLY', '{"maxBranches":10,"customDomain":true,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":true}', true, NOW(), NOW()),
('plan_business', 'Business', 1999, 'MONTHLY', '{"maxBranches":50,"customDomain":true,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":true}', true, NOW(), NOW()),
('plan_starter_yearly', 'Starter (Yearly)', 4990, 'YEARLY', '{"maxBranches":3,"customDomain":false,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":false}', true, NOW(), NOW()),
('plan_professional_yearly', 'Professional (Yearly)', 9990, 'YEARLY', '{"maxBranches":10,"customDomain":true,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":true}', true, NOW(), NOW());

-- Verify insertion
SELECT id, name, price, duration FROM subscription_plans;
