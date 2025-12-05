-- Add subscription plans
INSERT INTO subscription_plans (id, name, price, duration, features, createdAt, updatedAt)
VALUES
  ('plan-basic', 'Basic', 999, 'MONTHLY', '{"maxBranches":3,"customDomain":false,"analytics":true,"qrCodes":true,"leadCapture":true,"templates":5}', NOW(), NOW()),
  ('plan-pro', 'Professional', 1999, 'MONTHLY', '{"maxBranches":10,"customDomain":true,"analytics":true,"qrCodes":true,"leadCapture":true,"templates":15,"prioritySupport":true}', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Add more brands
INSERT INTO brands (id, name, slug, tagline, colorTheme, ownerId, createdAt, updatedAt)
VALUES
  ('brand002', 'Green Earth Organics', 'greenearth', 'Pure. Natural. Organic.', '{"primary":"#10B981","secondary":"#059669","accent":"#F59E0B"}', 'admin001', NOW(), NOW()),
  ('brand003', 'Elite Fitness Studio', 'elitefitness', 'Transform Your Body, Transform Your Life', '{"primary":"#EF4444","secondary":"#DC2626","accent":"#F59E0B"}', 'admin001', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Add more branches
INSERT INTO branches (id, name, slug, brandId, address, contact, socialMedia, businessHours, micrositeConfig, isActive, createdAt, updatedAt)
VALUES
  (
    'branch002',
    'Pune Store',
    'pune',
    'brand002',
    '{"street":"Shop 12, Koregaon Park","city":"Pune","state":"Maharashtra","zipCode":"411001","country":"India"}',
    '{"phone":"+91-20-2567-8900","whatsapp":"+91-9876543212","email":"pune@greenearth.com"}',
    '{"facebook":"https://facebook.com/greenearth","instagram":"https://instagram.com/greenearth"}',
    '{"monday":{"open":"08:00","close":"20:00","closed":false},"tuesday":{"open":"08:00","close":"20:00","closed":false},"wednesday":{"open":"08:00","close":"20:00","closed":false},"thursday":{"open":"08:00","close":"20:00","closed":false},"friday":{"open":"08:00","close":"20:00","closed":false},"saturday":{"open":"08:00","close":"20:00","closed":false},"sunday":{"open":"09:00","close":"18:00","closed":false}}',
    '{"templateId":"organic-fresh","sections":{"hero":{"enabled":true,"title":"Fresh Organic Produce in Pune","subtitle":"100% Certified Organic. Farm to Table in 24 Hours.","backgroundType":"gradient","animationEnabled":true},"about":{"enabled":true,"content":"Green Earth Organics brings you the freshest organic produce directly from certified organic farms."},"services":{"enabled":true,"items":[{"id":"1","name":"Organic Vegetables Box","description":"Weekly subscription of fresh seasonal vegetables","price":599,"category":"vegetables","availability":"available"}]},"contact":{"enabled":true,"showMap":true,"leadForm":{"enabled":true,"fields":["name","email","phone","message"]}}}}',
    1,
    NOW(),
    NOW()
  ),
  (
    'branch003',
    'Delhi Central',
    'delhi-central',
    'brand003',
    '{"street":"Connaught Place, Block A","city":"New Delhi","state":"Delhi","zipCode":"110001","country":"India"}',
    '{"phone":"+91-11-4567-8900","whatsapp":"+91-9876543213","email":"delhi@elitefitness.com"}',
    '{"facebook":"https://facebook.com/elitefitness","instagram":"https://instagram.com/elitefitness"}',
    '{"monday":{"open":"05:00","close":"22:00","closed":false},"tuesday":{"open":"05:00","close":"22:00","closed":false},"wednesday":{"open":"05:00","close":"22:00","closed":false},"thursday":{"open":"05:00","close":"22:00","closed":false},"friday":{"open":"05:00","close":"22:00","closed":false},"saturday":{"open":"06:00","close":"20:00","closed":false},"sunday":{"open":"06:00","close":"20:00","closed":false}}',
    '{"templateId":"fitness-pro","sections":{"hero":{"enabled":true,"title":"Elite Fitness Studio Delhi","subtitle":"Transform Your Body. Transform Your Life.","backgroundType":"gradient","animationEnabled":true},"about":{"enabled":true,"content":"Elite Fitness Studio Delhi Central is a state-of-the-art fitness facility."},"services":{"enabled":true,"items":[{"id":"1","name":"Monthly Gym Membership","description":"Full access to gym equipment and group classes","price":2999,"category":"membership","availability":"available"}]},"contact":{"enabled":true,"showMap":true,"leadForm":{"enabled":true,"fields":["name","email","phone","message"]}}}}',
    1,
    NOW(),
    NOW()
  )
ON DUPLICATE KEY UPDATE name=name;
