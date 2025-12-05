-- Add business profile fields to branches table
ALTER TABLE `branches`
ADD COLUMN `businessProfile` JSON NULL COMMENT 'Business owner and verification details';

-- Add business profile fields to brands table
ALTER TABLE `brands`
ADD COLUMN `businessProfile` JSON NULL COMMENT 'Business registration and verification details';

-- Example structure for businessProfile JSON:
-- {
--   "owner": {
--     "name": "John Doe",
--     "designation": "Founder & CEO",
--     "photo": "https://...",
--     "email": "john@example.com",
--     "phone": "+91-9876543210"
--   },
--   "registration": {
--     "gstNumber": "29ABCDE1234F1Z5",
--     "panNumber": "ABCDE1234F",
--     "msmeNumber": "UDYAM-XX-00-0000000",
--     "udyamNumber": "UDYAM-XX-00-0000000",
--     "cinNumber": "U12345MH2020PTC123456",
--     "registrationDate": "2020-01-15"
--   },
--   "verification": {
--     "gstVerified": true,
--     "panVerified": true,
--     "msmeVerified": true,
--     "udyamVerified": true,
--     "verifiedAt": "2024-01-15T10:30:00Z"
--   },
--   "businessDetails": {
--     "legalName": "Example Pvt Ltd",
--     "tradeName": "Example Business",
--     "businessType": "Private Limited",
--     "yearEstablished": 2020,
--     "employeeCount": "10-50",
--     "annualTurnover": "1-5 Crore"
--   }
-- }
