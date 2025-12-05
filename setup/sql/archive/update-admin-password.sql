UPDATE users
SET passwordHash = '$2b$12$BfGBUPpU2BhadxPKA4VUiutifLrolgFnMdpqlD6XpvwiC8yhHcZtq'
WHERE email = 'admin@parichay.local';

SELECT email, role, LEFT(passwordHash, 30) as hash_check
FROM users
WHERE email = 'admin@parichay.local';
