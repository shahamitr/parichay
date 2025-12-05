// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key-for-jwt-testing'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
