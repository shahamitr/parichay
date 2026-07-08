# Requirements Document

## Introduction

This specification covers two interconnected workstreams for the Parichay/Zintro platform:

1. A structured feature gap analysis comparing Parichay against market competitors in the digital business card and microsite builder space, producing an actionable gap report with prioritized recommendations.
2. A deployment migration plan to move the current standalone Docker-based deployment onto AWS Amplify, including authentication migration from JWT to Cognito, database connectivity, CI/CD pipeline setup, and monitoring integration.

The gap analysis findings directly inform the Amplify deployment plan by identifying which new features require specific AWS services or architectural changes.

## Glossary

- **Gap_Analysis_Engine**: The subsystem responsible for collecting, comparing, and scoring feature sets across Parichay and competitor platforms.
- **Competitor_Registry**: The data store holding normalized competitor profiles, feature matrices, and metadata for comparison.
- **Gap_Report_Generator**: The component that produces structured gap analysis reports with scoring, prioritization, and recommendations.
- **Amplify_Deployment_Planner**: The subsystem that generates and validates AWS Amplify deployment configurations, migration scripts, and infrastructure-as-code artifacts.
- **Auth_Migration_Module**: The component responsible for planning and executing the migration from JWT-based authentication to AWS Cognito.
- **Infra_Config_Validator**: The component that validates generated AWS infrastructure configurations against Amplify constraints and best practices.
- **Parichay**: The Parichay/Zintro multi-brand, multi-branch microsite builder platform under analysis.
- **Competitor**: Any third-party platform in the digital business card or microsite builder market used for comparison (e.g., Linktree, Popl, HiHello, Blinq, Carrd, About.me).
- **Feature_Category**: A grouping of related features used for structured comparison (e.g., "Microsite Builder", "Analytics", "CRM", "E-Commerce").
- **Gap_Score**: A numeric value (0-100) representing the degree to which Parichay covers a feature relative to competitors, where 100 means full parity and 0 means the feature is absent.
- **Migration_Runbook**: A step-by-step operational document for executing the AWS Amplify deployment migration.

## Requirements

### Requirement 1: Competitor Data Collection and Registry

**User Story:** As a product strategist, I want to maintain a structured registry of competitor platforms and their features, so that I can perform accurate and repeatable gap analyses.

#### Acceptance Criteria

1. THE Gap_Analysis_Engine SHALL support registration of competitor platforms with the following attributes: name, URL, pricing tiers, target market, and launch date.
2. WHEN a new competitor is registered, THE Competitor_Registry SHALL validate that the competitor name is unique and all required attributes are provided.
3. THE Competitor_Registry SHALL organize features into predefined Feature_Category groups including: Microsite Builder, Contact Sharing, QR Codes, Analytics, CRM and Lead Management, Appointment Booking, Payment and Subscriptions, Live Chat, White-Label and Multi-Tenant, AI Features, E-Commerce, Mobile Apps, Multi-Language, Compliance, and API and Integrations.
4. WHEN a competitor feature entry is added, THE Competitor_Registry SHALL record the feature name, Feature_Category, availability status (available, beta, planned, absent), and supporting evidence URL.
5. IF a duplicate competitor entry is submitted, THEN THE Competitor_Registry SHALL reject the entry and return a descriptive error identifying the conflict.

### Requirement 2: Parichay Feature Inventory Extraction

**User Story:** As a product strategist, I want to automatically extract the current Parichay feature inventory from the codebase and documentation, so that the gap analysis uses accurate and up-to-date data.

#### Acceptance Criteria

1. THE Gap_Analysis_Engine SHALL extract the current Parichay feature set from the feature checklist documentation, Prisma schema models, and API route definitions.
2. THE Gap_Analysis_Engine SHALL classify each extracted Parichay feature into the same Feature_Category taxonomy used for competitors.
3. WHEN a Parichay feature is extracted, THE Gap_Analysis_Engine SHALL assign a maturity status of "production", "beta", or "planned" based on the enterprise roadmap documentation.
4. THE Gap_Analysis_Engine SHALL map the 20 current production features and the 8 planned enterprise roadmap items into the unified Feature_Category taxonomy.
5. IF a Parichay feature cannot be classified into an existing Feature_Category, THEN THE Gap_Analysis_Engine SHALL flag the feature for manual review and assign it to an "Uncategorized" group.

### Requirement 3: Feature Gap Scoring and Comparison

**User Story:** As a product strategist, I want to see a quantitative comparison of Parichay features against each competitor, so that I can identify specific areas where Parichay leads or lags.

#### Acceptance Criteria

1. THE Gap_Analysis_Engine SHALL compute a Gap_Score (0-100) for each Feature_Category by comparing Parichay feature coverage against the union of all competitor features in that category.
2. THE Gap_Analysis_Engine SHALL compute an overall weighted Gap_Score across all Feature_Category groups, using configurable category weights.
3. WHEN computing Gap_Scores, THE Gap_Analysis_Engine SHALL weight features by market importance using three tiers: critical (weight 3), important (weight 2), and nice-to-have (weight 1).
4. THE Gap_Analysis_Engine SHALL identify features where Parichay leads all registered competitors and label these as "Competitive Advantages".
5. THE Gap_Analysis_Engine SHALL identify features present in two or more competitors but absent in Parichay and label these as "Critical Gaps".
6. WHEN a Feature_Category Gap_Score falls below 50, THE Gap_Analysis_Engine SHALL flag that category as "High Priority" for remediation.

### Requirement 4: Gap Report Generation

**User Story:** As a product strategist, I want a comprehensive gap analysis report with visualizations and prioritized recommendations, so that I can present findings to stakeholders and plan the product roadmap.

#### Acceptance Criteria

1. THE Gap_Report_Generator SHALL produce a structured report containing: executive summary, competitor overview, feature-by-feature comparison matrix, Gap_Score breakdown by Feature_Category, competitive advantages list, critical gaps list, and prioritized recommendations.
2. THE Gap_Report_Generator SHALL rank gap remediation recommendations by a composite priority score combining: market demand (how many competitors offer the feature), implementation effort estimate (small, medium, large), and revenue impact potential (low, medium, high).
3. WHEN generating the report, THE Gap_Report_Generator SHALL include a comparison matrix showing Parichay and each competitor as columns, Feature_Category items as rows, and availability status as cell values.
4. THE Gap_Report_Generator SHALL output the report in Markdown format suitable for inclusion in the project documentation directory.
5. IF no competitors are registered in the Competitor_Registry, THEN THE Gap_Report_Generator SHALL return an error indicating that at least one competitor must be registered before generating a report.

### Requirement 5: Competitor Identification for Digital Business Card Market

**User Story:** As a product strategist, I want the gap analysis to cover the key competitors in the digital business card and microsite builder market, so that the comparison is comprehensive and market-relevant.

#### Acceptance Criteria

1. THE Competitor_Registry SHALL include profiles for the following competitor categories: personal link-in-bio platforms (e.g., Linktree, Beacons), digital business card platforms (e.g., Popl, HiHello, Blinq, Mobilo), microsite and landing page builders (e.g., Carrd, About.me, Strikingly), and enterprise digital identity platforms (e.g., Kado, Haystack).
2. THE Gap_Analysis_Engine SHALL compare Parichay against a minimum of 8 competitor platforms spanning at least 3 of the 4 competitor categories.
3. WHEN comparing against link-in-bio platforms, THE Gap_Analysis_Engine SHALL evaluate features including: custom link pages, social media aggregation, monetization tools, and audience analytics.
4. WHEN comparing against digital business card platforms, THE Gap_Analysis_Engine SHALL evaluate features including: NFC card support, contact sharing protocols (vCard, Apple Wallet, Google Wallet), team management, and CRM integrations.
5. WHEN comparing against enterprise platforms, THE Gap_Analysis_Engine SHALL evaluate features including: SSO and directory integration, compliance certifications, API access, and bulk provisioning.

### Requirement 6: AWS Amplify Deployment Configuration

**User Story:** As a DevOps engineer, I want a validated AWS Amplify deployment configuration for the Parichay Next.js application, so that I can deploy the platform on managed AWS infrastructure with CI/CD.

#### Acceptance Criteria

1. THE Amplify_Deployment_Planner SHALL generate an amplify.yml build specification compatible with Next.js 14 SSR deployment, including Prisma client generation in the preBuild phase.
2. THE Amplify_Deployment_Planner SHALL define environment variable mappings for all required services: DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET, AWS S3 credentials, SMTP credentials, payment gateway keys, and AI service API keys.
3. WHEN generating the build specification, THE Amplify_Deployment_Planner SHALL configure build caching for node_modules and .next/cache directories to optimize build times within the 1000 build-minutes-per-month free tier limit.
4. THE Amplify_Deployment_Planner SHALL generate branch-based deployment rules mapping the "main" branch to production and "staging" branch to a staging environment.
5. IF the Next.js configuration uses standalone output mode, THEN THE Amplify_Deployment_Planner SHALL configure the Amplify build artifacts to include the standalone output directory.

### Requirement 7: Authentication Migration from JWT to Cognito

**User Story:** As a DevOps engineer, I want a migration plan from the current JWT-based authentication to AWS Cognito, so that the platform uses Amplify-native authentication with minimal disruption to existing users.

#### Acceptance Criteria

1. THE Auth_Migration_Module SHALL produce a migration plan that maps the current User model fields (email, passwordHash, role, mfaEnabled, mfaSecret, emailVerified) to equivalent Cognito user pool attributes.
2. THE Auth_Migration_Module SHALL define a Cognito user pool configuration supporting the four existing UserRole values: SUPER_ADMIN, BRAND_MANAGER, BRANCH_ADMIN, and EXECUTIVE as custom attributes or Cognito groups.
3. THE Auth_Migration_Module SHALL plan for MFA migration by mapping the current Speakeasy TOTP secrets to Cognito TOTP MFA configuration.
4. WHEN planning the migration, THE Auth_Migration_Module SHALL define a dual-auth transition period where both JWT and Cognito tokens are accepted, to avoid forcing all users to re-authenticate simultaneously.
5. THE Auth_Migration_Module SHALL produce a user data migration script specification that bulk-imports existing users into the Cognito user pool while preserving email verification status.
6. IF a user has backup codes stored in the current system, THEN THE Auth_Migration_Module SHALL plan for backup code regeneration in Cognito and define a user notification workflow.

### Requirement 8: Database Connectivity and Prisma Integration on Amplify

**User Story:** As a DevOps engineer, I want the Prisma ORM to connect reliably to Amazon RDS MySQL from the Amplify-hosted application, so that database operations work correctly in the managed hosting environment.

#### Acceptance Criteria

1. THE Amplify_Deployment_Planner SHALL define VPC configuration requirements for Amplify to access Amazon RDS MySQL within a private subnet.
2. THE Amplify_Deployment_Planner SHALL specify security group rules allowing inbound MySQL traffic (port 3306) from the Amplify compute environment to the RDS instance.
3. WHEN configuring database connectivity, THE Amplify_Deployment_Planner SHALL specify connection pooling parameters appropriate for serverless-style compute, including connection limits and idle timeout values.
4. THE Amplify_Deployment_Planner SHALL include Prisma migration execution (prisma migrate deploy) as a post-deployment step in the CI/CD pipeline.
5. IF the RDS instance is in a different VPC than the Amplify compute environment, THEN THE Amplify_Deployment_Planner SHALL define VPC peering or PrivateLink configuration requirements.

### Requirement 9: CI/CD Pipeline Definition for Amplify

**User Story:** As a DevOps engineer, I want an automated CI/CD pipeline on AWS Amplify with staging and production environments, so that code changes are tested and deployed reliably.

#### Acceptance Criteria

1. THE Amplify_Deployment_Planner SHALL define a pipeline with at least three stages: build (compile and generate Prisma client), test (run linting and type checking), and deploy (push to Amplify hosting).
2. THE Amplify_Deployment_Planner SHALL configure preview deployments for pull requests, enabling reviewers to test changes on isolated URLs before merging.
3. WHEN a deployment to the production environment fails, THE Amplify_Deployment_Planner SHALL define an automatic rollback procedure to the last successful deployment.
4. THE Amplify_Deployment_Planner SHALL configure deployment notifications via Amazon SNS or webhook to alert the team on build success, failure, or rollback events.
5. THE Amplify_Deployment_Planner SHALL define environment variable isolation between staging and production environments, preventing production credentials from being used in staging builds.

### Requirement 10: Monitoring and Observability on AWS

**User Story:** As a DevOps engineer, I want integrated monitoring and alerting for the Amplify-deployed application, so that I can detect and respond to issues quickly.

#### Acceptance Criteria

1. THE Amplify_Deployment_Planner SHALL define CloudWatch metric collection for: application response times, error rates, Amplify build durations, and deployment success rates.
2. THE Amplify_Deployment_Planner SHALL define CloudWatch alarms for: response time exceeding 1000ms for 5 consecutive minutes, error rate exceeding 5% for 2 consecutive minutes, and RDS CPU utilization exceeding 80% for 15 minutes.
3. WHEN an alarm triggers, THE Amplify_Deployment_Planner SHALL configure SNS notifications to a designated operations email address and an optional Slack webhook.
4. THE Amplify_Deployment_Planner SHALL define a plan for integrating the existing Sentry error tracking with the Amplify deployment, preserving source map uploads for production builds.
5. THE Amplify_Deployment_Planner SHALL specify CloudWatch Logs configuration for application logs, with a 30-day retention policy for production and 7-day retention for staging.

### Requirement 11: Storage and CDN Compatibility

**User Story:** As a DevOps engineer, I want the existing S3 and CloudFront storage setup to work seamlessly with the Amplify deployment, so that media uploads and CDN delivery continue without interruption.

#### Acceptance Criteria

1. THE Amplify_Deployment_Planner SHALL verify that the existing AWS S3 bucket (parichay-uploads) and CloudFront distribution are compatible with the Amplify deployment and define any required IAM policy adjustments.
2. THE Amplify_Deployment_Planner SHALL configure the Amplify service role with the minimum IAM permissions required to read from and write to the existing S3 bucket.
3. WHEN the application is deployed on Amplify, THE Amplify_Deployment_Planner SHALL ensure that the Next.js Image optimization component continues to serve images from the configured CloudFront domain and remote patterns.
4. THE Amplify_Deployment_Planner SHALL define a static asset caching strategy using Amplify custom headers, with a minimum cache TTL of 1 year for hashed static assets and 1 hour for HTML pages.
5. IF the existing CloudFront distribution requires origin changes to point to the Amplify-hosted application, THEN THE Amplify_Deployment_Planner SHALL document the required CloudFront origin and behavior updates.

### Requirement 12: Cost Estimation and Free Tier Optimization

**User Story:** As a product owner, I want a detailed cost estimate for the Amplify deployment that maximizes free tier usage, so that I can budget accurately and minimize infrastructure costs during early growth.

#### Acceptance Criteria

1. THE Amplify_Deployment_Planner SHALL produce a monthly cost estimate covering: Amplify hosting (build minutes, storage, bandwidth), RDS MySQL (instance hours, storage), ElastiCache Redis (node hours), S3 (storage, requests), SES (email volume), and CloudWatch (metrics, logs, alarms).
2. THE Amplify_Deployment_Planner SHALL identify which services fall within the AWS Free Tier and calculate the monthly free tier headroom for each service.
3. WHEN the estimated usage for any service exceeds 80% of the free tier limit, THE Amplify_Deployment_Planner SHALL flag that service with a cost warning and suggest optimization strategies.
4. THE Amplify_Deployment_Planner SHALL define cost monitoring using AWS Budgets with alert thresholds at 50%, 80%, and 100% of the estimated monthly budget.
5. THE Amplify_Deployment_Planner SHALL provide cost projections for three growth scenarios: 100 users (MVP), 1000 users (early growth), and 10000 users (scale-up), aligned with the existing deployment strategy phases.
