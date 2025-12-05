-- Verify demo branches that have complete information
UPDATE branches
SET
  isVerified = true,
  verifiedAt = NOW(),
  completionScore = 95
WHERE slug IN ('mumbai-hq', 'mumbai', 'andheri')
  AND brandId IN (
    SELECT id FROM brands
    WHERE slug IN ('demo-techvision', 'demo-primeproperties', 'demo-healthcareplus')
  );

-- Verify demo brands
UPDATE brands
SET
  isVerified = true,
  verifiedAt = NOW(),
  verificationBadge = 'verified'
WHERE slug IN ('demo-techvision', 'demo-primeproperties', 'demo-healthcareplus');

-- Check results
SELECT
  b.slug as brand_slug,
  br.slug as branch_slug,
  br.name as branch_name,
  br.isVerified,
  br.completionScore,
  CONCAT('http://localhost:3001/', b.slug, '/', br.slug) as url
FROM branches br
JOIN brands b ON br.brandId = b.id
WHERE b.slug IN ('demo-techvision', 'demo-primeproperties', 'demo-healthcareplus');
