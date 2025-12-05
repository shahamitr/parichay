# Security Audit and Penetration Testing Guide

## Overview

This document outlines security testing procedures for the OneTouch BizCard platform to ensure it meets security best practices and is protected against common vulnerabilities.

## Security Audit Checklist

### 1. Authentication and Authorization

#### Tests to Perform

- [ ] **Password Security**
  - Verify minimum password length (8+ characters)
  - Test password complexity requirements
  - Verify password hashing (bcrypt with salt)
  - Test password reset flow
  - Verify password reset token expiration

- [ ] **JWT Token Security**
  - Verify token signing algorithm (HS256 or RS256)
  - Test token expiration
  - Verify token refresh mechanism
  - Test token revocation
  - Check for token leakage in logs

- [ ] **Session Management**
  - Verify session timeout
  - Test concurrent session handling
  - Verify session invalidation on logout
  - Test session fixation attacks

- [ ] **Role-Based Access Control (RBAC)**
  - Test Super Admin permissions
  - Test Brand Manager permissions
  - Test Branch Admin permissions
  - Verify horizontal privilege escalation protection
  - Verify vertical privilege escalation protection

#### Test Commands

```bash
# Test authentication endpoints
curl -X POST https://onetouchbizcard.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"weak"}'

# Test JWT validation
curl -X GET https://onetouchbizcard.in/api/brands \
  -H "Authorization: Bearer INVALID_TOKEN"

# Test role-based access
curl -X DELETE https://onetouchbizcard.in/api/brands/123 \
  -H "Authorization: Bearer BRANCH_ADMIN_TOKEN"
```

### 2. Input Validation and Sanitization

#### Tests to Perform

- [ ] **SQL Injection**
  - Test all form inputs with SQL injection payloads
  - Verify Prisma ORM prevents SQL injection
  - Test search functionality
  - Test filter parameters

- [ ] **Cross-Site Scripting (XSS)**
  - Test stored XSS in user-generated content
  - Test reflected XSS in URL parameters
  - Test DOM-based XSS
  - Verify Content Security Policy (CSP) headers

- [ ] **Command Injection**
  - Test file upload functionality
  - Test any system command execution
  - Verify input sanitization

- [ ] **Path Traversal**
  - Test file download endpoints
  - Test file upload paths
  - Verify path sanitization

#### Test Payloads

```bash
# SQL Injection test
curl "https://onetouchbizcard.in/api/brands?search=' OR '1'='1"

# XSS test
curl -X POST https://onetouchbizcard.in/api/brands \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>"}'

# Path traversal test
curl "https://onetouchbizcard.in/api/files/../../etc/passwd"
```

### 3. API Security

#### Tests to Perform

- [ ] **Rate Limiting**
  - Test API rate limits
  - Verify rate limit headers
  - Test rate limit bypass attempts
  - Verify different limits for authenticated vs unauthenticated

- [ ] **CORS Configuration**
  - Verify CORS headers
  - Test cross-origin requests
  - Verify allowed origins
  - Test preflight requests

- [ ] **API Authentication**
  - Test API without authentication
  - Test with expired tokens
  - Test with invalid tokens
  - Verify API key security (if applicable)

- [ ] **Input Validation**
  - Test with missing required fields
  - Test with invalid data types
  - Test with oversized payloads
  - Test with special characters

#### Test Commands

```bash
# Test rate limiting
for i in {1..150}; do
  curl https://onetouchbizcard.in/api/health &
done
wait

# Test CORS
curl -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://onetouchbizcard.in/api/brands

# Test oversized payload
curl -X POST https://onetouchbizcard.in/api/brands \
  -H "Content-Type: application/json" \
  -d "$(python -c 'print("{\"name\":\"" + "A"*1000000 + "\"}")')"
```

### 4. Data Protection

#### Tests to Perform

- [ ] **Encryption in Transit**
  - Verify HTTPS enforcement
  - Test SSL/TLS configuration
  - Verify certificate validity
  - Test for weak ciphers

- [ ] **Encryption at Rest**
  - Verify database encryption
  - Verify file storage encryption
  - Verify backup encryption
  - Test password storage (hashing)

- [ ] **Sensitive Data Exposure**
  - Check for secrets in logs
  - Check for secrets in error messages
  - Verify API responses don't leak sensitive data
  - Check for sensitive data in URLs

- [ ] **Data Validation**
  - Test email validation
  - Test phone number validation
  - Test URL validation
  - Test file type validation

#### Test Commands

```bash
# Test HTTPS enforcement
curl -I http://onetouchbizcard.in

# Test SSL/TLS configuration
nmap --script ssl-enum-ciphers -p 443 onetouchbizcard.in

# Test for sensitive data in responses
curl https://onetouchbizcard.in/api/users/me | grep -i "password\|secret\|token"
```

### 5. File Upload Security

#### Tests to Perform

- [ ] **File Type Validation**
  - Test uploading executable files
  - Test uploading files with double extensions
  - Test MIME type validation
  - Verify file extension whitelist

- [ ] **File Size Limits**
  - Test uploading oversized files
  - Verify file size limits are enforced
  - Test multiple file uploads

- [ ] **File Content Validation**
  - Test uploading malicious files
  - Verify image file validation
  - Test for file content type mismatch

- [ ] **File Storage Security**
  - Verify files are stored securely
  - Test direct file access
  - Verify file permissions
  - Test for path traversal in file names

#### Test Commands

```bash
# Test file upload with executable
curl -X POST https://onetouchbizcard.in/api/upload \
  -F "file=@malicious.exe"

# Test oversized file
dd if=/dev/zero of=large.jpg bs=1M count=100
curl -X POST https://onetouchbizcard.in/api/upload \
  -F "file=@large.jpg"

# Test file with malicious name
curl -X POST https://onetouchbizcard.in/api/upload \
  -F "file=@../../etc/passwd.jpg"
```

### 6. Payment Security

#### Tests to Perform

- [ ] **Payment Gateway Integration**
  - Verify webhook signature validation
  - Test webhook replay attacks
  - Verify payment amount validation
  - Test for payment manipulation

- [ ] **PCI DSS Compliance**
  - Verify no credit card data is stored
  - Verify payment data is tokenized
  - Test for credit card number in logs
  - Verify secure payment form

- [ ] **Transaction Security**
  - Test for race conditions in payments
  - Verify idempotency keys
  - Test for double charging
  - Verify refund security

#### Test Commands

```bash
# Test webhook without signature
curl -X POST https://onetouchbizcard.in/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded"}'

# Test webhook replay
curl -X POST https://onetouchbizcard.in/api/webhooks/stripe \
  -H "Stripe-Signature: VALID_SIGNATURE" \
  -d @webhook_payload.json
```

### 7. Infrastructure Security

#### Tests to Perform

- [ ] **Server Configuration**
  - Verify security headers
  - Test for information disclosure
  - Verify error handling
  - Test for directory listing

- [ ] **Database Security**
  - Verify database access controls
  - Test for default credentials
  - Verify connection encryption
  - Test for SQL injection

- [ ] **Redis Security**
  - Verify Redis authentication
  - Test for unauthorized access
  - Verify Redis encryption
  - Test for command injection

- [ ] **Dependency Security**
  - Run npm audit
  - Check for outdated packages
  - Verify no known vulnerabilities
  - Test for supply chain attacks

#### Test Commands

```bash
# Test security headers
curl -I https://onetouchbizcard.in

# Test for information disclosure
curl https://onetouchbizcard.in/.git/config
curl https://onetouchbizcard.in/.env

# Run dependency audit
npm audit
npm outdated
```

## Automated Security Testing

### Running Security Audit

```bash
# Run comprehensive security audit
./scripts/security-audit.sh

# Run dependency vulnerability scan
npm audit

# Run OWASP ZAP scan (if installed)
zap-cli quick-scan https://onetouchbizcard.in
```

### Continuous Security Monitoring

Set up automated security scans in CI/CD:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run security audit script
        run: ./scripts/security-audit.sh

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Penetration Testing

### Manual Penetration Testing

Conduct manual penetration testing quarterly:

1. **Reconnaissance**
   - Gather information about the target
   - Identify technologies used
   - Map attack surface

2. **Scanning**
   - Port scanning
   - Vulnerability scanning
   - Service enumeration

3. **Exploitation**
   - Attempt to exploit vulnerabilities
   - Test authentication bypass
   - Test privilege escalation

4. **Post-Exploitation**
   - Assess impact
   - Document findings
   - Verify data access

5. **Reporting**
   - Document all findings
   - Provide remediation steps
   - Prioritize vulnerabilities

### Third-Party Penetration Testing

Consider hiring professional penetration testers:

- **Frequency:** Annually or before major releases
- **Scope:** Full application and infrastructure
- **Deliverables:** Detailed report with findings and recommendations

## Security Headers

Verify these security headers are present:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Test with:

```bash
curl -I https://onetouchbizcard.in | grep -E "Strict-Transport|X-Frame|X-Content|X-XSS|Content-Security|Referrer|Permissions"
```

## Common Vulnerabilities to Test

### OWASP Top 10 (2021)

1. **A01:2021 – Broken Access Control**
   - Test horizontal/vertical privilege escalation
   - Test IDOR (Insecure Direct Object References)

2. **A02:2021 – Cryptographic Failures**
   - Test for weak encryption
   - Test for sensitive data exposure

3. **A03:2021 – Injection**
   - Test SQL injection
   - Test NoSQL injection
   - Test command injection

4. **A04:2021 – Insecure Design**
   - Review architecture for security flaws
   - Test business logic vulnerabilities

5. **A05:2021 – Security Misconfiguration**
   - Test for default credentials
   - Test for unnecessary features enabled

6. **A06:2021 – Vulnerable and Outdated Components**
   - Run npm audit
   - Check for outdated dependencies

7. **A07:2021 – Identification and Authentication Failures**
   - Test authentication bypass
   - Test session management

8. **A08:2021 – Software and Data Integrity Failures**
   - Test for insecure deserialization
   - Verify code signing

9. **A09:2021 – Security Logging and Monitoring Failures**
   - Verify logging is enabled
   - Test for sensitive data in logs

10. **A10:2021 – Server-Side Request Forgery (SSRF)**
    - Test for SSRF vulnerabilities
    - Verify URL validation

## Remediation Priorities

### Critical (Fix Immediately)
- SQL injection vulnerabilities
- Authentication bypass
- Remote code execution
- Sensitive data exposure

### High (Fix Within 7 Days)
- XSS vulnerabilities
- CSRF vulnerabilities
- Privilege escalation
- Insecure file uploads

### Medium (Fix Within 30 Days)
- Missing security headers
- Weak password policies
- Information disclosure
- Outdated dependencies

### Low (Fix When Possible)
- Minor configuration issues
- Non-critical information disclosure
- Low-impact vulnerabilities

## Post-Audit Actions

After completing the security audit:

1. **Document Findings**
   - Create detailed report
   - Include evidence and reproduction steps
   - Prioritize vulnerabilities

2. **Create Remediation Plan**
   - Assign owners to each finding
   - Set deadlines based on severity
   - Track progress

3. **Implement Fixes**
   - Fix critical issues first
   - Test fixes thoroughly
   - Document changes

4. **Verify Fixes**
   - Re-test all vulnerabilities
   - Conduct regression testing
   - Update security documentation

5. **Update Security Practices**
   - Update secure coding guidelines
   - Provide security training
   - Improve security processes

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
