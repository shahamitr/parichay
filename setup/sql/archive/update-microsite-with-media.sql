-- Update TechVision Mumbai with gallery and videos
UPDATE branches
SET micrositeConfig = JSON_SET(
  micrositeConfig,
  '$.sections.gallery', JSON_OBJECT(
    'enabled', true,
    'images', JSON_ARRAY(
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800'
    )
  ),
  '$.sections.videos', JSON_OBJECT(
    'enabled', true,
    'items', JSON_ARRAY(
      JSON_OBJECT(
        'id', 'video-1',
        'title', 'Company Overview',
        'url', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400'
      ),
      JSON_OBJECT(
        'id', 'video-2',
        'title', 'Our Services',
        'url', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400'
      )
    )
  )
)
WHERE slug = 'mumbai-hq' AND brandId = (SELECT id FROM brands WHERE slug = 'demo-techvision');

-- Update Prime Properties Mumbai with gallery and videos
UPDATE branches
SET micrositeConfig = JSON_SET(
  micrositeConfig,
  '$.sections.gallery', JSON_OBJECT(
    'enabled', true,
    'images', JSON_ARRAY(
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
    )
  ),
  '$.sections.videos', JSON_OBJECT(
    'enabled', true,
    'items', JSON_ARRAY(
      JSON_OBJECT(
        'id', 'video-1',
        'title', 'Property Tour - Luxury Apartments',
        'url', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'
      ),
      JSON_OBJECT(
        'id', 'video-2',
        'title', 'Commercial Spaces Overview',
        'url', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
      )
    )
  )
)
WHERE slug = 'mumbai' AND brandId = (SELECT id FROM brands WHERE slug = 'demo-primeproperties');

-- Update HealthCare Plus Andheri with gallery and videos
UPDATE branches
SET micrositeConfig = JSON_SET(
  micrositeConfig,
  '$.sections.gallery', JSON_OBJECT(
    'enabled', true,
    'images', JSON_ARRAY(
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800',
      'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800'
    )
  ),
  '$.sections.videos', JSON_OBJECT(
    'enabled', true,
    'items', JSON_ARRAY(
      JSON_OBJECT(
        'id', 'video-1',
        'title', 'Our Facilities',
        'url', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
      ),
      JSON_OBJECT(
        'id', 'video-2',
        'title', 'Meet Our Doctors',
        'url', 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        'thumbnail', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400'
      )
    )
  )
)
WHERE slug = 'andheri' AND brandId = (SELECT id FROM brands WHERE slug = 'demo-healthcareplus');

-- Verify updates
SELECT
  b.slug as brand_slug,
  br.slug as branch_slug,
  JSON_EXTRACT(br.micrositeConfig, '$.sections.gallery.enabled') as gallery_enabled,
  JSON_LENGTH(JSON_EXTRACT(br.micrositeConfig, '$.sections.gallery.images')) as gallery_count,
  JSON_EXTRACT(br.micrositeConfig, '$.sections.videos.enabled') as videos_enabled,
  JSON_LENGTH(JSON_EXTRACT(br.micrositeConfig, '$.sections.videos.items')) as videos_count
FROM branches br
JOIN brands b ON br.brandId = b.id
WHERE b.slug IN ('demo-techvision', 'demo-primeproperties', 'demo-healthcareplus');
