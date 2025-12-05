-- Demo Data for Social & Network Layer and Premium Features
-- Run this after the migration

-- Get the first brand and branch IDs (adjust as needed)
SET @brandId = (SELECT id FROM brands WHERE slug = 'demo-techvision' LIMIT 1);
SET @branchId = (SELECT id FROM branches WHERE slug = 'mumbai-hq' AND brandId = @brandId LIMIT 1);

-- Insert Demo Reviews
INSERT INTO `reviews` (`id`, `rating`, `title`, `comment`, `reviewerName`, `reviewerEmail`, `reviewerAvatar`, `isVerified`, `isPublished`, `source`, `helpfulCount`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('review-001', 5, 'Excellent Service!', 'TechVision has been instrumental in transforming our digital presence. Their team is professional, responsive, and delivers beyond expectations. Highly recommended!', 'Rajesh Kumar', 'rajesh@example.com', NULL, true, true, 'direct', 12, @branchId, @brandId, NOW() - INTERVAL 30 DAY, NOW()),
('review-002', 5, 'Best in the Industry', 'We have worked with many IT companies, but TechVision stands out. Their innovative solutions and customer-first approach make them the best choice.', 'Priya Sharma', 'priya@example.com', NULL, true, true, 'google', 8, @branchId, @brandId, NOW() - INTERVAL 25 DAY, NOW()),
('review-003', 4, 'Great Experience', 'Professional team with good technical knowledge. The project was delivered on time with minor revisions. Would work with them again.', 'Amit Patel', 'amit@example.com', NULL, true, true, 'direct', 5, @branchId, @brandId, NOW() - INTERVAL 20 DAY, NOW()),
('review-004', 5, 'Transformed Our Business', 'The digital transformation project exceeded our expectations. ROI was visible within 3 months. Thank you TechVision!', 'Sneha Reddy', 'sneha@example.com', NULL, true, true, 'direct', 15, @branchId, @brandId, NOW() - INTERVAL 15 DAY, NOW()),
('review-005', 4, 'Reliable Partner', 'TechVision has been our technology partner for 2 years now. Consistent quality and excellent support.', 'Vikram Singh', 'vikram@example.com', NULL, false, true, 'facebook', 3, @branchId, @brandId, NOW() - INTERVAL 10 DAY, NOW()),
('review-006', 5, 'Outstanding Support', 'Their 24/7 support team is amazing. Any issue gets resolved within hours. True professionals!', 'Meera Joshi', NULL, NULL, false, false, 'direct', 0, @branchId, @brandId, NOW() - INTERVAL 2 DAY, NOW());

-- Insert Video Testimonials
INSERT INTO `video_testimonials` (`id`, `title`, `description`, `videoUrl`, `thumbnailUrl`, `customerName`, `customerTitle`, `customerAvatar`, `duration`, `isPublished`, `viewCount`, `order`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('vt-001', 'How TechVision Transformed Our Operations', 'CEO of GlobalTech shares how TechVision helped streamline their operations and increase efficiency by 40%.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Arjun Mehta', 'CEO, GlobalTech Solutions', NULL, 180, true, 1250, 1, @branchId, @brandId, NOW() - INTERVAL 60 DAY, NOW()),
('vt-002', 'Digital Transformation Success Story', 'Watch how we helped a traditional business go digital and increase their revenue by 3x.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'Kavita Nair', 'Founder, RetailMax', NULL, 240, true, 890, 2, @branchId, @brandId, NOW() - INTERVAL 45 DAY, NOW()),
('vt-003', 'Why We Chose TechVision', 'A startup founder explains why TechVision was the right choice for their MVP development.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, 'Rohan Desai', 'CTO, StartupHub', NULL, 120, true, 567, 3, @branchId, @brandId, NOW() - INTERVAL 30 DAY, NOW());

-- Insert Social Proof Badges
INSERT INTO `social_proof_badges` (`id`, `type`, `title`, `description`, `icon`, `color`, `isActive`, `displayOrder`, `expiresAt`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('badge-001', 'VERIFIED', 'Verified Business', 'Officially verified by Parichay', 'check-circle', '#3B82F6', true, 1, NULL, @branchId, @brandId, NOW(), NOW()),
('badge-002', 'TOP_SELLER', 'Top Rated 2024', 'Among top 10 IT service providers in Mumbai', 'trophy', '#F59E0B', true, 2, '2024-12-31 23:59:59', @branchId, @brandId, NOW(), NOW()),
('badge-003', 'TRUSTED', 'Trusted Partner', '500+ satisfied clients', 'shield', '#10B981', true, 3, NULL, @branchId, @brandId, NOW(), NOW()),
('badge-004', 'CERTIFIED', 'ISO 27001 Certified', 'Information Security Management', 'award', '#8B5CF6', true, 4, NULL, @branchId, @brandId, NOW(), NOW()),
('badge-005', 'YEARS_IN_BUSINESS', '10+ Years', 'Serving clients since 2014', 'calendar', '#6366F1', true, 5, NULL, @branchId, @brandId, NOW(), NOW());

-- Insert Portfolio Items
INSERT INTO `portfolio_items` (`id`, `title`, `description`, `category`, `imageUrl`, `videoUrl`, `projectUrl`, `clientName`, `completedAt`, `tags`, `order`, `isPublished`, `viewCount`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('portfolio-001', 'E-Commerce Platform Redesign', 'Complete redesign and development of a multi-vendor e-commerce platform with 50,000+ products.', 'Web Development', 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800', NULL, 'https://example.com', 'RetailMax India', '2024-06-15', '["React", "Node.js", "MongoDB", "AWS"]', 1, true, 450, @branchId, @brandId, NOW() - INTERVAL 90 DAY, NOW()),
('portfolio-002', 'Healthcare Management System', 'Custom HMS for a chain of 20 hospitals with patient management, billing, and analytics.', 'Enterprise Software', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800', NULL, NULL, 'MediCare Group', '2024-04-20', '["Java", "Spring Boot", "PostgreSQL", "Docker"]', 2, true, 320, @branchId, @brandId, NOW() - INTERVAL 120 DAY, NOW()),
('portfolio-003', 'Mobile Banking App', 'Secure mobile banking application with biometric authentication and real-time transactions.', 'Mobile App', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', NULL, NULL, 'FinanceFirst Bank', '2024-02-10', '["Flutter", "Firebase", "Kotlin", "Swift"]', 3, true, 580, @branchId, @brandId, NOW() - INTERVAL 150 DAY, NOW()),
('portfolio-004', 'AI-Powered Analytics Dashboard', 'Real-time business intelligence dashboard with predictive analytics and ML models.', 'Data Analytics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', NULL, 'https://example.com', 'DataDriven Corp', '2024-08-01', '["Python", "TensorFlow", "React", "D3.js"]', 4, true, 290, @branchId, @brandId, NOW() - INTERVAL 60 DAY, NOW()),
('portfolio-005', 'Supply Chain Management System', 'End-to-end supply chain solution with IoT integration and blockchain tracking.', 'Enterprise Software', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', NULL, NULL, 'LogiTech Solutions', '2024-05-25', '["Blockchain", "IoT", "Node.js", "React"]', 5, true, 210, @branchId, @brandId, NOW() - INTERVAL 100 DAY, NOW());

-- Insert Offers
INSERT INTO `offers` (`id`, `title`, `description`, `code`, `discountType`, `discountValue`, `minPurchase`, `maxDiscount`, `imageUrl`, `startDate`, `endDate`, `isActive`, `usageLimit`, `usageCount`, `terms`, `branchId`, `brandId`, `createdAt`, `updatedAt`) VALUES
('offer-001', 'New Year Special - 25% Off', 'Get 25% off on all web development projects. Start your digital journey with us!', 'NEWYEAR25', 'PERCENTAGE', 25, 50000, 25000, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800', NOW(), NOW() + INTERVAL 30 DAY, true, 50, 12, 'Valid for new projects only. Cannot be combined with other offers.', @branchId, @brandId, NOW(), NOW()),
('offer-002', 'Free Consultation', 'Book a free 1-hour consultation session with our experts. Limited slots available!', NULL, 'PERCENTAGE', 100, NULL, NULL, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', NOW(), NOW() + INTERVAL 60 DAY, true, 20, 5, 'One session per company. Prior appointment required.', @branchId, @brandId, NOW(), NOW()),
('offer-003', 'Startup Package - ₹10,000 Off', 'Special discount for startups on our MVP development package.', 'STARTUP10K', 'FIXED_AMOUNT', 10000, 100000, NULL, 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', NOW(), NOW() + INTERVAL 45 DAY, true, 30, 8, 'Valid for registered startups only. DPIIT registration required.', @branchId, @brandId, NOW(), NOW()),
('offer-004', 'Maintenance Package - Buy 1 Get 1', 'Purchase annual maintenance and get 1 month free!', 'MAINTAIN2024', 'BUY_ONE_GET_ONE', 1, NULL, NULL, NULL, NOW(), NOW() + INTERVAL 90 DAY, true, NULL, 3, 'Applicable on annual maintenance contracts only.', @branchId, @brandId, NOW(), NOW());

-- Update branch micrositeConfig to include new sections
UPDATE branches
SET micrositeConfig = JSON_SET(
  micrositeConfig,
  '$.sections.socialProof', JSON_OBJECT(
    'enabled', true,
    'badges', JSON_ARRAY(
      JSON_OBJECT('id', 'badge-001', 'type', 'verified', 'label', 'Verified Business'),
      JSON_OBJECT('id', 'badge-002', 'type', 'top_seller', 'label', 'Top Rated 2024'),
      JSON_OBJECT('id', 'badge-003', 'type', 'trusted', 'label', '500+ Clients')
    ),
    'shareButtons', JSON_OBJECT(
      'enabled', true,
      'platforms', JSON_ARRAY('whatsapp', 'linkedin', 'twitter', 'facebook', 'copy')
    )
  ),
  '$.sections.reviews', JSON_OBJECT(
    'enabled', true,
    'allowPublicReviews', true,
    'moderationEnabled', true,
    'displayCount', 5
  ),
  '$.sections.videoTestimonials', JSON_OBJECT(
    'enabled', true
  ),
  '$.sections.portfolio', JSON_OBJECT(
    'enabled', true,
    'layout', 'grid',
    'categories', JSON_ARRAY('Web Development', 'Mobile App', 'Enterprise Software', 'Data Analytics')
  ),
  '$.sections.offers', JSON_OBJECT(
    'enabled', true
  ),
  '$.themeSettings', JSON_OBJECT(
    'mode', 'light',
    'borderRadius', 'medium',
    'animations', true,
    'glassmorphism', false
  )
)
WHERE id = @branchId;

SELECT 'Demo data inserted successfully!' AS status;
