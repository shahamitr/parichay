-- ============================================================================
-- PARICHAY - MASTER PRODUCTION SETUP SQL (CONSOLIDATED)
-- ============================================================================
-- This script provides a unified initialization for the Parichay platform.
-- It combines essential schema data and a comprehensive demo environment.
--
-- TARGET DATABASE: MySQL 8.0+
-- DATE: 2024-04-23
-- ============================================================================

-- USE parichay; -- Uncomment if running manually on existing DB

-- SECTION 1: ESSENTIAL PLATFORM DATA
-- ----------------------------------------------------------------------------

-- 1.1 Subscription Plans
INSERT INTO `subscription_plans` (`id`, `name`, `price`, `duration`, `features`, `isActive`, `createdAt`, `updatedAt`) VALUES
('plan_free', 'Free', 0, 'MONTHLY', '{"maxBranches":1,"customDomain":false,"analytics":false,"qrCodes":true,"leadCapture":false,"prioritySupport":false}', 1, NOW(), NOW()),
('plan_starter', 'Starter', 499, 'MONTHLY', '{"maxBranches":3,"customDomain":false,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":false}', 1, NOW(), NOW()),
('plan_professional', 'Professional', 999, 'MONTHLY', '{"maxBranches":10,"customDomain":true,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":true}', 1, NOW(), NOW()),
('plan_business', 'Business', 1999, 'MONTHLY', '{"maxBranches":50,"customDomain":true,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":true}', 1, NOW(), NOW()),
('plan_starter_yearly', 'Starter (Yearly)', 4990, 'YEARLY', '{"maxBranches":3,"customDomain":false,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":false}', 1, NOW(), NOW()),
('plan_professional_yearly', 'Professional (Yearly)', 9990, 'YEARLY', '{"maxBranches":10,"customDomain":true,"analytics":true,"qrCodes":true,"leadCapture":true,"prioritySupport":true}', 1, NOW(), NOW());

-- 1.2 Super Admin User (Password: Admin@123)
INSERT INTO `users` (`id`, `email`, `passwordHash`, `firstName`, `lastName`, `role`, `phone`, `isActive`, `emailVerified`, `createdAt`, `updatedAt`) VALUES
('admin-user-001', 'admin@parichay.io', '$2a$12$LQv3c1yqBwEHxv5hSe7WOeIgwjCHkVfqhqER.qmxLeoFBs9AQk5jW', 'Super', 'Admin', 'SUPER_ADMIN', '+91-9999999999', 1, 1, NOW(), NOW());

-- 1.3 Default Platform Tenant
INSERT INTO `tenants` (`id`, `name`, `slug`, `brandName`, `supportEmail`, `plan`, `clientLimit`, `isActive`, `createdAt`, `updatedAt`) VALUES
('default-tenant', 'Parichay Platform', 'parichay', 'Parichay.io', 'support@parichay.io', 'PLATFORM', 999999, 1, NOW(), NOW());

-- 1.4 Industry Categories
INSERT INTO `industry_categories` (`id`, `name`, `slug`, `description`, `icon`, `enabled`, `features`, `benefits`, `useCases`, `colorScheme`, `createdAt`, `updatedAt`) VALUES
('tech-startup', 'Technology & Startups', 'tech-startup', 'Perfect for tech companies, software startups, and digital agencies', 'laptop', 1, '["Custom Software Showcase", "Team Profiles", "Product Demos", "Investor Relations"]', '["Professional Tech Branding", "Developer-Friendly Features", "Integration Capabilities"]', '["SaaS Companies", "Mobile App Developers", "Digital Agencies", "Tech Consultants"]', '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}', NOW(), NOW()),
('restaurant-food', 'Restaurant & Food Service', 'restaurant-food', 'Ideal for restaurants, cafes, food trucks, and catering services', 'utensils', 1, '["Digital Menu", "Online Reservations", "Food Gallery", "Customer Reviews"]', '["Increase Online Orders", "Showcase Menu Items", "Build Customer Loyalty"]', '["Restaurants", "Cafes", "Food Trucks", "Catering Services"]', '{"primary": "#EF4444", "secondary": "#DC2626", "accent": "#F59E0B"}', NOW(), NOW()),
('fitness-wellness', 'Fitness & Wellness', 'fitness-wellness', 'Great for gyms, yoga studios, personal trainers, and wellness centers', 'dumbbell', 1, '["Class Schedules", "Trainer Profiles", "Membership Plans", "Progress Tracking"]', '["Attract New Members", "Showcase Facilities", "Build Community"]', '["Gyms", "Yoga Studios", "Personal Trainers", "Wellness Centers"]', '{"primary": "#10B981", "secondary": "#059669", "accent": "#F59E0B"}', NOW(), NOW()),
('real-estate', 'Real Estate', 'real-estate', 'Perfect for real estate agents, property developers, and agencies', 'home', 1, '["Property Listings", "Virtual Tours", "Agent Profiles", "Market Analysis"]', '["Showcase Properties", "Generate Leads", "Build Trust"]', '["Real Estate Agents", "Property Developers", "Real Estate Agencies"]', '{"primary": "#8B5CF6", "secondary": "#7C3AED", "accent": "#F59E0B"}', NOW(), NOW());

-- 1.5 Platform Configuration
INSERT INTO `platform_config` (`id`, `key`, `value`, `description`, `updatedAt`) VALUES
('landing-hero', 'landing_hero', '{"title": "Create Your Digital Business Card in Minutes", "subtitle": "Build professional microsites that showcase your business and capture leads effortlessly", "ctaText": "Get Started Free", "backgroundImage": null}', 'Landing page hero section configuration', NOW()),
('platform-settings', 'platform_settings', '{"siteName": "Parichay.io", "tagline": "Your Smart Digital Introduction", "supportEmail": "support@parichay.io", "allowRegistration": true, "maintenanceMode": false}', 'General platform settings', NOW());

-- SECTION 2: COMPREHENSIVE DEMO ENVIRONMENT
-- ----------------------------------------------------------------------------

-- 2.1 Demo Executives (Password: Demo@123)
INSERT INTO `users` (`id`, `email`, `passwordHash`, `firstName`, `lastName`, `role`, `phone`, `isActive`, `emailVerified`, `industryCategory`, `onboardingCompletedAt`, `createdAt`, `updatedAt`, `tenantId`) VALUES
('exec-001', 'john.smith@demo.parichay.io', '$2a$12$LQv3c1yqBwEHxv5hSe7WOeIgwjCHkVfqhqER.qmxLeoFBs9AQk5jW', 'John', 'Smith', 'EXECUTIVE', '+91-98765-43210', 1, 1, 'tech-startup', NOW(), NOW(), NOW(), 'default-tenant'),
('exec-002', 'sarah.johnson@demo.parichay.io', '$2a$12$LQv3c1yqBwEHxv5hSe7WOeIgwjCHkVfqhqER.qmxLeoFBs9AQk5jW', 'Sarah', 'Johnson', 'EXECUTIVE', '+91-98765-43211', 1, 1, 'restaurant-food', NOW(), NOW(), NOW(), 'default-tenant');

-- 2.2 Demo Brands
INSERT INTO `brands` (`id`, `name`, `slug`, `logo`, `tagline`, `colorTheme`, `layoutId`, `isVerified`, `verifiedAt`, `verificationBadge`, `ownerId`, `createdAt`, `updatedAt`, `tenantId`) VALUES
('brand-techvision', 'TechVision Solutions', 'techvision', 'https://ui-avatars.com/api/?name=TechVision+Solutions&size=200&background=3B82F6&color=FFFFFF&bold=true', 'Innovating Tomorrow, Today', '{"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#F59E0B"}', 'modern-business', 1, NOW(), 'verified', 'exec-001', NOW(), NOW(), 'default-tenant'),
('brand-spicegarden', 'Spice Garden Restaurant', 'spicegarden', 'https://ui-avatars.com/api/?name=Spice+Garden&size=200&background=EF4444&color=FFFFFF&bold=true', 'Authentic Flavors, Memorable Moments', '{"primary": "#EF4444", "secondary": "#DC2626", "accent": "#F59E0B"}', 'modern-business', 1, NOW(), 'premium', 'exec-002', NOW(), NOW(), 'default-tenant');

-- 2.3 Demo Branches
INSERT INTO `branches` (`id`, `name`, `slug`, `brandId`, `isActive`, `onboardedBy`, `onboardedAt`, `address`, `contact`, `socialMedia`, `businessHours`, `micrositeConfig`, `isVerified`, `verifiedAt`, `completionScore`, `createdAt`, `updatedAt`) VALUES
('branch-techvision-mumbai', 'TechVision Mumbai HQ', 'mumbai-hq', 'brand-techvision', 1, 'exec-001', NOW(),
'{"street": "123 Business Park, Andheri East", "city": "Mumbai", "state": "Maharashtra", "zipCode": "400069", "country": "India"}',
'{"phone": "+91-22-1234-5678", "whatsapp": "+91-98765-00001", "email": "mumbai@techvision.demo"}',
'{"facebook": "https://facebook.com/techvision"}',
'{"monday": {"open": "09:00 AM", "close": "06:00 PM", "closed": false}}',
'{"templateId": "modern-business", "sections": {"hero": {"enabled": true, "title": "Welcome to TechVision Solutions", "subtitle": "Your Digital Partner"}}}', 1, NOW(), 95, NOW(), NOW()),
('branch-spicegarden-delhi', 'Spice Garden Delhi', 'delhi-main', 'brand-spicegarden', 1, 'exec-002', NOW(),
'{"street": "Connaught Place", "city": "New Delhi", "state": "Delhi", "zipCode": "110001", "country": "India"}',
'{"phone": "+91-11-9876-5432", "whatsapp": "+91-98765-00002", "email": "delhi@spicegarden.demo"}',
'{"instagram": "https://instagram.com/spicegarden"}',
'{"monday": {"open": "11:00 AM", "close": "11:00 PM", "closed": false}}',
'{"templateId": "modern-business", "sections": {"hero": {"enabled": true, "title": "Spice Garden Delhi", "subtitle": "Authentic Cuisine"}}}', 1, NOW(), 88, NOW(), NOW());

-- 2.4 Modular Demo Assets (Leads, Reviews, Links)
INSERT INTO `leads` (`id`, `name`, `email`, `phone`, `message`, `source`, `status`, `branchId`, `createdAt`, `updatedAt`) VALUES
('lead-001', 'Rahul Sharma', 'rahul@example.com', '+919876543210', 'Inquiry for AI services.', 'qr_code', 'NEW', 'branch-techvision-mumbai', NOW(), NOW()),
('lead-002', 'Priya Singh', 'priya@example.com', '+919876543211', 'Menu request.', 'direct_visit', 'NEW', 'branch-spicegarden-delhi', NOW(), NOW());

INSERT INTO `short_links` (`id`, `code`, `targetUrl`, `clicks`, `isActive`, `createdAt`, `branchId`, `brandId`) VALUES
('link-001', 'tv-offers', 'https://techvision.com/offers', 150, 1, NOW(), 'branch-techvision-mumbai', 'brand-techvision'),
('link-002', 'sg-menu', 'https://spicegarden.com/menu', 420, 1, NOW(), 'branch-spicegarden-delhi', 'brand-spicegarden');

INSERT INTO `reviews` (`id`, `rating`, `title`, `comment`, `reviewerName`, `isVerified`, `isPublished`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('rev-001', 5, 'Top Notch', 'Incredible technology and support.', 'Amit Kumar', 1, 1, 'branch-techvision-mumbai', 'brand-techvision', NOW(), NOW()),
('rev-002', 4, 'Great Food', 'Best butter chicken in town.', 'Sneha Kapur', 1, 1, 'branch-spicegarden-delhi', 'brand-spicegarden', NOW(), NOW());

-- 2.5 Social Proof & Testimonials
INSERT INTO `social_proof_badges` (`id`, `type`, `title`, `description`, `isActive`, `displayOrder`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('badge-001', 'VERIFIED', 'Verified Node', 'Officially authenticated business.', 1, 1, 'branch-techvision-mumbai', 'brand-techvision', NOW(), NOW());

INSERT INTO `video_testimonials` (`id`, `title`, `customerName`, `videoUrl`, `isPublished`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('vid-001', 'Corporate Success', 'Rajesh Gupta', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 1, 'branch-techvision-mumbai', 'brand-techvision', NOW(), NOW());

-- ============================================================================
-- SETUP COMPLETE - SYSTEM SYNCHRONIZED
-- ============================================================================
