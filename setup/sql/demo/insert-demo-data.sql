-- Insert demo brand
INSERT INTO brands (id, name, slug, tagline, colorTheme, ownerId, createdAt, updatedAt)
VALUES (
  'brand001',
  'TechVision Solutions',
  'techvision',
  'Innovating Tomorrow, Today',
  '{"primary":"#2563EB","secondary":"#1E40AF","accent":"#F59E0B"}',
  'admin001',
  NOW(),
  NOW()
);

-- Insert demo branch
INSERT INTO branches (
  id, name, slug, brandId, address, contact, socialMedia, businessHours,
  micrositeConfig, isActive, createdAt, updatedAt
)
VALUES (
  'branch001',
  'Mumbai Office',
  'mumbai',
  'brand001',
  '{"street":"Tower A, Cyber City","city":"Mumbai","state":"Maharashtra","zipCode":"400051","country":"India"}',
  '{"phone":"+91-22-4567-8900","whatsapp":"+91-9876543210","email":"mumbai@techvision.com"}',
  '{"facebook":"https://facebook.com/techvision","instagram":"https://instagram.com/techvision","linkedin":"https://linkedin.com/company/techvision"}',
  '{"monday":{"open":"09:00","close":"18:00","closed":false},"tuesday":{"open":"09:00","close":"18:00","closed":false},"wednesday":{"open":"09:00","close":"18:00","closed":false},"thursday":{"open":"09:00","close":"18:00","closed":false},"friday":{"open":"09:00","close":"18:00","closed":false},"saturday":{"open":"10:00","close":"14:00","closed":false},"sunday":{"open":"00:00","close":"00:00","closed":true}}',
  '{"templateId":"modern-tech","sections":{"hero":{"enabled":true,"title":"Welcome to TechVision Solutions Mumbai","subtitle":"Leading IT solutions provider in Mumbai","backgroundType":"gradient","animationEnabled":true},"about":{"enabled":true,"content":"TechVision Solutions is a premier IT services company with over 15 years of experience."},"services":{"enabled":true,"items":[{"id":"1","name":"Cloud Migration Services","description":"Seamlessly migrate your infrastructure to cloud","price":150000,"category":"cloud","availability":"available"},{"id":"2","name":"AI/ML Solutions","description":"Custom AI and machine learning solutions","price":250000,"category":"ai","availability":"available"}]},"contact":{"enabled":true,"showMap":true,"leadForm":{"enabled":true,"fields":["name","email","phone","message"]}}},"seoSettings":{"title":"TechVision Solutions Mumbai | IT Services","description":"Leading IT solutions provider in Mumbai","keywords":["IT services","cloud migration","AI solutions"]}}',
  1,
  NOW(),
  NOW()
);
