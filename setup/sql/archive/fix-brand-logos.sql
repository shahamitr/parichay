-- Update brand logos with working placeholder images
UPDATE brands SET logo = 'https://placehold.co/200x200/3B82F6/FFFFFF/png?text=TV' WHERE slug = 'demo-techvision';
UPDATE brands SET logo = 'https://placehold.co/200x200/10B981/FFFFFF/png?text=SG' WHERE slug = 'demo-spicegarden';
UPDATE brands SET logo = 'https://placehold.co/200x200/EF4444/FFFFFF/png?text=HC' WHERE slug = 'demo-healthcareplus';
UPDATE brands SET logo = 'https://placehold.co/200x200/F59E0B/FFFFFF/png?text=PP' WHERE slug = 'demo-primeproperties';
UPDATE brands SET logo = 'https://placehold.co/200x200/8B5CF6/FFFFFF/png?text=FL' WHERE slug = 'demo-fitlife';

-- Verify the updates
SELECT slug, name, logo FROM brands WHERE slug LIKE 'demo-%';
