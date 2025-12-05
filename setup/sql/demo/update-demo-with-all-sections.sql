-- Update TechVision Mumbai with all sections
UPDATE branches
SET micrositeConfig = JSON_SET(
  micrositeConfig,
  '$deos', JSON_OBJECT(
    'enabled', true,
    'videos', JSON_ARRAY(
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
      'https://www.youtube.com/embed/jNQXAC9IVRw'
    )
  ),
  '$.sections.feedback', JSON_OBJECT('enabled', true),
  '$.sections.payment', JSON_OBJECT(
    'enabled', true,
    'upiId', 'techvision@upi',
    'qrCode', '/images/payment-qr.png',
    'bankDetails', JSON_OBJECT(
      'accountName', 'TechVision Solutions Pvt Ltd',
      'accountNumber', '1234567890',
      'ifscCode', 'HDFC0001234',
      'bankName', 'HDFC Bank',
      'branch', 'Mumbai Central'
    ),
    'acceptedMethods', JSON_ARRAY('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet')
  )
)
WHERE slug = 'mumbai' AND brandId = 'brand001';

-- Update Green Earth Pune with all sections
UPDATE branches
SET micrositeConfig = JSON_SET(
  micrositeConfig,
  '$.sections.videos', JSON_OBJECT(
    'enabled', true,
    'videos', JSON_ARRAY('https://www.youtube.com/embed/dQw4w9WgXcQ')
  ),
  '$.sections.feedback', JSON_OBJECT('enabled', true),
  '$.sections.payment', JSON_OBJECT(
    'enabled', true,
    'upiId', 'greenearth@upi',
    'acceptedMethods', JSON_ARRAY('UPI', 'Cash on Delivery')
  )
)
WHERE slug = 'pune' AND brandId = 'brand002';

-- Update Elite Fitness Delhi with all sections
UPDATE branches
SET micrositeConfig = JSON_SET(
  micrositeConfig,
  '$.sections.videos', JSON_OBJECT(
    'enabled', true,
    'videos', JSON_ARRAY('https://www.youtube.com/embed/dQw4w9WgXcQ')
  ),
  '$.sections.feedback', JSON_OBJECT('enabled', true),
  '$.sections.payment', JSON_OBJECT(
    'enabled', true,
    'upiId', 'elitefitness@upi',
    'bankDetails', JSON_OBJECT(
      'accountName', 'Elite Fitness Studio',
      'accountNumber', '9876543210',
      'ifscCode', 'ICIC0001234',
      'bankName', 'ICICI Bank',
      'branch', 'Connaught Place'
    ),
    'acceptedMethods', JSON_ARRAY('UPI', 'Card', 'Cash')
  )
)
WHERE slug = 'delhi-central' AND brandId = 'brand003';
