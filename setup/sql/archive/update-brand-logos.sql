-- Update brand logos with placeholder images
UPDATE brands SET logo = 'https://via.placeholder.com/200/3B82F6/FFFFFF?text=TV' WHERE slug = 'demo-techvision';
UPDATE brands SET logo = 'https://via.placeholder.com/200/10B981/FFFFFF?text=SG' WHERE slug = 'demo-spicegarden';
UPDATE brands SET logo = 'https://via.placeholder.com/200/EF4444/FFFFFF?text=HC' WHERE slug = 'demo-healthcareplus';
UPDATE brands SET logo = 'https://via.placeholder.com/200/F59E0B/FFFFFF?text=PP' WHERE slug = 'demo-primeproperties';
UPDATE brands SET logo = 'https://via.placeholder.com/200/8B5CF6/FFFFFF?text=FL' WHERE slug = 'demo-fitlife';

-- Verify the updates
SELECT slug, name, logo FROM brands WHERE slug LIKE 'demo-%';
