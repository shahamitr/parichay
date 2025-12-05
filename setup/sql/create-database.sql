-- Create database for Parichay
CREATE DATABASE IF NOT EXISTS parichay
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Show databases to verify
SHOW DATABASES;

-- Select the database
USE parichay;

-- Show success message
SELECT 'Database parichay created successfully!' AS message;
