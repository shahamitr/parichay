-- Comprehensive Demo Data Script
-- Adds Leads, Short Links, Reviews, and other module data

-- Variable setup (trying to find existing brand/branch, or use defaults)
SET @brandId = COALESCE((SELECT id FROM brands WHERE slug = 'techvision' LIMIT 1), (SELECT id FROM brands LIMIT 1));
SET @branchId = COALESCE((SELECT id FROM branches WHERE brandId = @brandId LIMIT 1), (SELECT id FROM branches LIMIT 1));

-- 1. Insert Leads
INSERT INTO `leads` (`id`, `name`, `email`, `phone`, `message`, `source`, `metadata`, `branchId`, `createdAt`) VALUES
(UUID(), 'Rahul Sharma', 'rahul.s@example.com', '+919876543210', 'Interested in your cloud migration services.', 'direct_visit', '{"company": "Sharma Logistics"}', @branchId, NOW() - INTERVAL 2 HOUR),
(UUID(), 'Priya Patel', 'priya.p@example.com', '+919876543211', 'Do you offer custom AI solutions?', 'qr_code', '{"company": "TechFlow"}', @branchId, NOW() - INTERVAL 1 DAY),
(UUID(), 'Amit Singh', 'amit.singh@example.com', '+919876543212', 'Need a quote for enterprise software.', 'social_share', '{"company": "Singh Enterprises"}', @branchId, NOW() - INTERVAL 2 DAY),
(UUID(), 'Sneha Gupta', 'sneha.g@example.com', '+919876543213', 'Callback request regarding mobile app dev.', 'direct_visit', NULL, @branchId, NOW() - INTERVAL 3 DAY),
(UUID(), 'Vikram Malhotra', 'vikram.m@example.com', '+919876543214', 'Looking for a long-term IT partner.', 'qr_code', '{"company": "Malhotra Group"}', @branchId, NOW() - INTERVAL 5 DAY),
(UUID(), 'Anjali Desai', 'anjali.d@example.com', '+919876543215', 'Inquiry about data analytics dashboard.', 'social_share', NULL, @branchId, NOW() - INTERVAL 1 WEEK),
(UUID(), 'Rohan Mehta', 'rohan.m@example.com', '+919876543216', 'Can we schedule a demo?', 'direct_visit', '{"company": "Mehta Corp"}', @branchId, NOW() - INTERVAL 8 DAY),
(UUID(), 'Kavita Iyer', 'kavita.i@example.com', '+919876543217', 'Pricing for bulk licenses?', 'qr_code', NULL, @branchId, NOW() - INTERVAL 10 DAY),
(UUID(), 'Arjun Reddy', 'arjun.r@example.com', '+919876543218', 'Partnership opportunity.', 'direct_visit', '{"company": "Reddy Systems"}', @branchId, NOW() - INTERVAL 12 DAY),
(UUID(), 'Meera Joshi', 'meera.j@example.com', '+919876543219', 'Support required for existing installation.', 'social_share', NULL, @branchId, NOW() - INTERVAL 15 DAY);

-- 2. Insert Short Links
INSERT INTO `short_links` (`id`, `code`, `targetUrl`, `clicks`, `isActive`, `createdAt`, `branchId`, `brandId`) VALUES
(UUID(), 'summer-sale', 'https://techvision.com/offers/summer-2024', 124, true, NOW() - INTERVAL 30 DAY, @branchId, @brandId),
(UUID(), 'webinar-reg', 'https://zoom.us/webinar/register/123456789', 85, true, NOW() - INTERVAL 15 DAY, @branchId, @brandId),
(UUID(), 'portfolio-pdf', 'https://techvision.com/assets/portfolio-2024.pdf', 342, true, NOW() - INTERVAL 60 DAY, @branchId, @brandId),
(UUID(), 'feedback-form', 'https://forms.google.com/techvision-feedback', 56, true, NOW() - INTERVAL 90 DAY, @branchId, @brandId),
(UUID(), 'meeting-link', 'https://calendly.com/techvision-sales', 12, true, NOW() - INTERVAL 5 DAY, @branchId, @brandId);

-- 3. Insert Reviews (only if few exist)
INSERT INTO `reviews` (`id`, `rating`, `title`, `comment`, `reviewerName`, `reviewerEmail`, `isVerified`, `isPublished`, `source`, `helpfulCount`, `branchId`, `brandId`, `createdAt`, `updatedAt`)
SELECT UUID(), 5, 'Exceptional Service', 'The team went above and beyond to meet our requirements.', 'Suresh Raina', 'suresh@example.com', true, true, 'google', 10, @branchId, @brandId, NOW() - INTERVAL 2 DAY, NOW()
WHERE (SELECT COUNT(*) FROM reviews WHERE branchId = @branchId) < 5;

INSERT INTO `reviews` (`id`, `rating`, `title`, `comment`, `reviewerName`, `reviewerEmail`, `isVerified`, `isPublished`, `source`, `helpfulCount`, `branchId`, `brandId`, `createdAt`, `updatedAt`)
SELECT UUID(), 4, 'Good Value', 'Great service for the price point. Highly recommended.', 'Anita Roy', 'anita@example.com', true, true, 'facebook', 5, @branchId, @brandId, NOW() - INTERVAL 5 DAY, NOW()
WHERE (SELECT COUNT(*) FROM reviews WHERE branchId = @branchId) < 5;

-- 4. Insert Social Proof Badges (if not exist)
INSERT INTO `social_proof_badges` (`id`, `type`, `title`, `description`, `icon`, `color`, `isActive`, `displayOrder`, `branchId`, `brandId`, `createdAt`, `updatedAt`)
SELECT UUID(), 'VERIFIED', 'Verified Business', 'Officially verified by Parichay', 'check-circle', '#3B82F6', true, 1, @branchId, @brandId, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM social_proof_badges WHERE branchId = @branchId AND type = 'VERIFIED');

INSERT INTO `social_proof_badges` (`id`, `type`, `title`, `description`, `icon`, `color`, `isActive`, `displayOrder`, `branchId`, `brandId`, `createdAt`, `updatedAt`)
SELECT UUID(), 'TOP_SELLER', 'Top Rated 2024', 'Among top 10 IT service providers', 'trophy', '#F59E0B', true, 2, @branchId, @brandId, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM social_proof_badges WHERE branchId = @branchId AND type = 'TOP_SELLER');

-- 5. Insert Video Testimonials (if not exist)
INSERT INTO `video_testimonials` (`id`, `title`, `description`, `videoUrl`, `thumbnailUrl`, `customerName`, `customerTitle`, `duration`, `isPublished`, `viewCount`, `order`, `branchId`, `brandId`, `createdAt`, `updatedAt`)
SELECT UUID(), 'Client Success Story', 'How we helped ScaleUp Inc grow 10x.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'John Doe', 'CEO, ScaleUp', 180, true, 1500, 1, @branchId, @brandId, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM video_testimonials WHERE branchId = @branchId);

-- 6. Insert Offers (if not exist)
INSERT INTO `offers` (`id`, `title`, `description`, `code`, `discountType`, `discountValue`, `imageUrl`, `startDate`, `endDate`, `isActive`, `branchId`, `brandId`, `createdAt`, `updatedAt`)
SELECT UUID(), 'Welcome Offer', 'Get 10% off on your first service.', 'WELCOME10', 'PERCENTAGE', 10, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800', NOW(), NOW() + INTERVAL 30 DAY, true, @branchId, @brandId, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM offers WHERE branchId = @branchId);

SELECT 'Comprehensive demo data inserted successfully' as status;
