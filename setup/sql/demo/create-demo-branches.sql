-- Create branch for Prime Properties
INSERT INTO branches (
  id, name, slug, brandId, address, contact, socialMedia, businessHours,
  micrositeConfig, isActive, createdAt, updatedAt
)
SELECT
  'branch-primeproperties-001',
  'Prime Properties Mumbai',
  'mumbai',
  b.id,
  '{"street":"123 Marine Drive","city":"Mumbai","state":"Maharashtra","zipCode":"400001","country":"India"}',
  '{"phone":"+91-22-12345678","whatsapp":"+91-9876543210","email":"mumbai@primeproperties.com"}',
  '{"facebook":"https://facebook.com/primeproperties","instagram":"https://instagram.com/primeproperties","linkedin":"https://linkedin.com/company/primeproperties"}',
  '{"monday":{"open":"09:00","close":"18:00","closed":false},"tuesday":{"open":"09:00","close":"18:00","closed":false},"wednesday":{"open":"09:00","close":"18:00","closed":false},"thursday":{"open":"09:00","close":"18:00","closed":false},"friday":{"open":"09:00","close":"18:00","closed":false},"saturday":{"open":"10:00","close":"16:00","closed":false},"sunday":{"open":"00:00","close":"00:00","closed":true}}',
  '{"templateId":"modern-business","sections":{"hero":{"enabled":true,"title":"Prime Properties Mumbai","subtitle":"Your trusted real estate partner","backgroundType":"gradient","animationEnabled":true},"about":{"enabled":true,"content":"Prime Properties Group is a leading real estate company specializing in premium residential and commercial properties."},"services":{"enabled":true,"items":[{"id":"1","name":"Residential Properties","description":"Luxury apartments and villas","price":5000000,"category":"residential","availability":"available"},{"id":"2","name":"Commercial Spaces","description":"Office spaces and retail outlets","price":10000000,"category":"commercial","availability":"available"}]},"contact":{"enabled":true,"showMap":true,"leadForm":{"enabled":true,"fields":["name","email","phone","message"]}}},"seoSettings":{"title":"Prime Properties Mumbai | Real Estate","description":"Leading real estate company in Mumbai","keywords":["real estate","properties","Mumbai"]}}',
  1,
  NOW(),
  NOW()
FROM brands b WHERE b.slug = 'demo-primeproperties';

-- Create branch for HealthCare Plus
INSERT INTO branches (
  id, name, slug, brandId, address, contact, socialMedia, businessHours,
  micrositeConfig, isActive, createdAt, updatedAt
)
SELECT
  'branch-healthcareplus-001',
  'HealthCare Plus Andheri',
  'andheri',
  b.id,
  '{"street":"456 SV Road, Andheri West","city":"Mumbai","state":"Maharashtra","zipCode":"400058","country":"India"}',
  '{"phone":"+91-22-87654321","whatsapp":"+91-9123456789","email":"andheri@healthcareplus.com"}',
  '{"facebook":"https://facebook.com/healthcareplus","instagram":"https://instagram.com/healthcareplus","linkedin":"https://linkedin.com/company/healthcareplus"}',
  '{"monday":{"open":"08:00","close":"20:00","closed":false},"tuesday":{"open":"08:00","close":"20:00","closed":false},"wednesday":{"open":"08:00","close":"20:00","closed":false},"thursday":{"open":"08:00","close":"20:00","closed":false},"friday":{"open":"08:00","close":"20:00","closed":false},"saturday":{"open":"08:00","close":"14:00","closed":false},"sunday":{"open":"09:00","close":"13:00","closed":false}}',
  '{"templateId":"modern-healthcare","sections":{"hero":{"enabled":true,"title":"HealthCare Plus Andheri","subtitle":"Quality healthcare for your family","backgroundType":"gradient","animationEnabled":true},"about":{"enabled":true,"content":"HealthCare Plus Clinic provides comprehensive medical services with experienced doctors and modern facilities."},"services":{"enabled":true,"items":[{"id":"1","name":"General Consultation","description":"Expert medical consultation","price":500,"category":"consultation","availability":"available"},{"id":"2","name":"Diagnostic Services","description":"Complete diagnostic tests","price":1500,"category":"diagnostics","availability":"available"},{"id":"3","name":"Vaccination","description":"All types of vaccinations","price":800,"category":"preventive","availability":"available"}]},"contact":{"enabled":true,"showMap":true,"leadForm":{"enabled":true,"fields":["name","email","phone","message"]}}},"seoSettings":{"title":"HealthCare Plus Andheri | Medical Clinic","description":"Quality healthcare services in Andheri","keywords":["healthcare","clinic","doctor","Andheri"]}}',
  1,
  NOW(),
  NOW()
FROM brands b WHERE b.slug = 'demo-healthcareplus';

-- Verify the branches were created
SELECT
  b.slug as brand_slug,
  br.slug as branch_slug,
  br.name as branch_name,
  CONCAT('http://localhost:3001/', b.slug, '/', br.slug) as url
FROM branches br
JOIN brands b ON br.brandId = b.id
WHERE b.slug IN ('demo-primeproperties', 'demo-healthcareplus');
