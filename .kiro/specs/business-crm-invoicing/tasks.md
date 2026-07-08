# Implementation Plan: Business CRM & Invoicing Module

## Overview

This plan implements the Business CRM & Invoicing Module for Parichay, covering database schema extensions, premium access gating, customer management, invoice engine with GST compliance, PDF generation, payment links, automated reminders, revenue analytics, expense tracking, customer segmentation, and recurring invoices. The implementation uses TypeScript with Next.js App Router, Prisma ORM, and the existing platform architecture.

## Tasks

- [x] 1. Database schema and core types
  - [x] 1.1 Create Prisma schema migration for CRM and invoicing models
    - Add all new models: Customer, CustomerInteraction, BusinessInvoice, InvoicePayment, InvoicePaymentLink, RecurringInvoice, InvoiceSettings, ReusableLineItem, Expense, ExpenseCategory, CustomerReminder, ReminderConfig, GreetingTemplate, GreetingLog, CustomerSegment, ReviewRequest, ReviewRequestConfig, InvoiceSequence
    - Add enums: InteractionType, BusinessInvoiceStatus, PaymentLinkStatus, RecurringFrequency, PaymentGateway
    - Add Branch model relations for all new models
    - Add Lead model extension with Customer reverse relation
    - Run migration to generate SQL
    - _Requirements: 2.1, 2.2, 2.9, 2.10, 3.1, 3.2, 4.1, 4.2, 4.4, 4.7, 5.1, 7.2, 8.4, 10.1, 10.2, 11.1, 12.1, 12.6, 13.1, 14.1, 15.1_

  - [x] 1.2 Create TypeScript type definitions for CRM, Invoice, and Revenue modules
    - Create `src/types/crm.ts` with Customer, Interaction, Segment, and Review types
    - Create `src/types/invoice.ts` with BusinessInvoice, LineItem, Payment, PaymentLink, RecurringInvoice types
    - Create `src/types/revenue.ts` with RevenueDashboardData, DateRange, MonthlyTrend types
    - _Requirements: 2.1, 4.1, 9.1_


- [x] 2. Premium Gate and access control
  - [x] 2.1 Implement Premium Gate middleware
    - Create `src/lib/premium-gate.ts` with `checkPremiumAccess` and `withPremiumGate` functions
    - Implement subscription status checking against Brand-level subscription
    - Implement 7-day grace period logic for failed payments
    - Implement read-only mode for expired/cancelled subscriptions
    - Enforce access at Brand level granting access to all Branches
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 2.2 Write property test for Premium Gate access control
    - **Property 1: Premium Gate Access Control**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.6**
    - Generate arbitrary subscription states (plan, status, payment failure date)
    - Assert access is granted only for Pro/Business Plus with ACTIVE or grace period status

- [~] 3. Checkpoint - Ensure schema and gate are working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Customer database management
  - [x] 4.1 Implement Customer Service with CRUD operations
    - Create `src/lib/crm/customer-service.ts` with create, update, soft-delete, getById, and list methods
    - Implement filtering by name, phone, email, tags, creation date, and last interaction date
    - Implement pagination and sorting
    - Enforce maximum 20 tags per customer
    - Implement soft delete with `deletedAt` field (30-day retention)
    - Implement branch-level data isolation (never return customers from other branches)
    - _Requirements: 2.1, 2.3, 2.4, 2.6, 2.9, 2.10_

  - [ ]* 4.2 Write property tests for customer filtering and data isolation
    - **Property 3: Customer Search Filter Correctness**
    - **Property 6: Branch Data Isolation**
    - **Validates: Requirements 2.4, 2.9**

  - [-] 4.3 Implement Lead-to-Customer conversion
    - Add `convertFromLead` method to customer service
    - Populate Customer record with Lead's existing data (name, phone, email)
    - Link Customer to originating Lead via `leadId` field
    - _Requirements: 2.2_

  - [ ]* 4.4 Write property test for Lead-to-Customer data preservation
    - **Property 2: Lead-to-Customer Data Preservation**
    - **Validates: Requirements 2.2**

  - [-] 4.5 Implement CSV import and export for customers
    - Create `importFromCSV` method using Papa Parse streaming
    - Validate each row and report errors for invalid entries while importing valid ones
    - Create `exportToCSV` method with selectable fields
    - _Requirements: 2.7, 2.8_

  - [ ]* 4.6 Write property tests for CSV import/export
    - **Property 4: CSV Import Valid/Invalid Split**
    - **Property 5: CSV Export Field Selection**
    - **Validates: Requirements 2.7, 2.8**

  - [~] 4.7 Create CRM API route handlers
    - Create `src/app/api/crm/customers/route.ts` (GET list, POST create)
    - Create `src/app/api/crm/customers/[id]/route.ts` (GET, PUT, DELETE)
    - Create `src/app/api/crm/customers/import/route.ts` (POST CSV import)
    - Create `src/app/api/crm/customers/export/route.ts` (GET CSV export)
    - Apply Premium Gate middleware to all routes
    - _Requirements: 2.1, 2.3, 2.4, 2.7, 2.8, 2.9_

- [ ] 5. Customer interaction tracking
  - [~] 5.1 Implement Interaction Service
    - Create `src/lib/crm/interaction-service.ts` with create, list, and attachment handling
    - Support all interaction types: phone call, WhatsApp, email, in-person, SMS, custom
    - Record: type, date/time, duration (calls), summary, logged by user
    - Enforce max 3 file attachments (5MB each)
    - Auto-create interaction entries for appointment bookings and invoice sends
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [~] 5.2 Create Interaction API route handlers
    - Create `src/app/api/crm/customers/[id]/interactions/route.ts` (GET, POST)
    - Display interactions in reverse chronological order
    - Apply Premium Gate middleware
    - _Requirements: 3.1, 3.3_

- [ ] 6. Invoice engine core
  - [x] 6.1 Implement Invoice Number Generator
    - Create `src/lib/invoices/invoice-number-generator.ts`
    - Generate sequential numbers following pattern: {prefix}-{financialYear}-{sequence}
    - Handle concurrent creation with database unique constraint + retry (max 3 retries)
    - Never reuse cancelled invoice numbers
    - _Requirements: 4.2, 4.8_

  - [ ]* 6.2 Write property test for sequential invoice numbering
    - **Property 8: Sequential Invoice Numbering**
    - **Validates: Requirements 4.2, 4.8**

  - [x] 6.3 Implement GST Calculator
    - Create `src/lib/invoices/gst-calculator.ts`
    - Implement `calculateGST` for intra-state (CGST + SGST) and inter-state (IGST) calculations
    - Support standard GST rates: 0%, 5%, 12%, 18%, 28%
    - Implement `validateGSTIN` for 15-character alphanumeric validation
    - Implement `getStateFromGSTIN` helper
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 6.4 Write property tests for GST calculations and GSTIN validation
    - **Property 10: GST Intra-State vs Inter-State Calculation**
    - **Property 11: GSTIN Format Validation**
    - **Validates: Requirements 5.2, 5.3, 5.5, 5.6**

  - [-] 6.5 Implement Invoice Service with CRUD and calculations
    - Create `src/lib/invoices/invoice-service.ts`
    - Implement create, update, cancel, duplicate, and list methods
    - Calculate subtotal, discount, tax, and grand total
    - Support max 50 line items per invoice
    - Implement status transitions: DRAFT → SENT → VIEWED → PAID/OVERDUE/CANCELLED
    - Implement partial payment recording with balance tracking
    - Implement reusable line items (save/retrieve frequently used items)
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10_

  - [ ]* 6.6 Write property tests for invoice totals, partial payments, and duplication
    - **Property 7: Invoice Total Arithmetic**
    - **Property 9: Invoice Partial Payment Balance Tracking**
    - **Property 23: Overdue Invoice Detection**
    - **Property 24: Invoice Duplication**
    - **Validates: Requirements 4.3, 4.5, 4.6, 4.7**

  - [~] 6.7 Create Invoice API route handlers
    - Create `src/app/api/business-invoices/route.ts` (GET list, POST create)
    - Create `src/app/api/business-invoices/[id]/route.ts` (GET, PUT, DELETE)
    - Create `src/app/api/business-invoices/[id]/payments/route.ts` (POST record payment)
    - Create `src/app/api/business-invoices/[id]/duplicate/route.ts` (POST duplicate)
    - Create `src/app/api/business-invoices/items/route.ts` (GET, POST reusable items)
    - Apply Premium Gate middleware to all routes
    - _Requirements: 4.1, 4.6, 4.7, 4.10_

- [~] 7. Checkpoint - Ensure invoice engine tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Invoice PDF generation and template customization
  - [~] 8.1 Implement Invoice Settings Service
    - Create settings CRUD within `src/lib/invoices/invoice-service.ts` (or separate file)
    - Manage: logo, business details, bank details, GSTIN, signature, payment terms, footer, color accent, template style, invoice prefix
    - Apply settings to all future invoices without modifying previously generated PDFs
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [~] 8.2 Implement PDF Generator Service
    - Create `src/lib/invoices/business-pdf-generator.ts` using PDFKit
    - Generate PDF with: business logo, details, customer details, invoice number, dates, line items, tax breakup, total, payment terms, bank details
    - Implement 3 template styles: Modern, Classic, Minimal
    - Implement INR Indian number formatting (₹1,00,000.00 pattern)
    - Upload generated PDF to S3/cloud storage with 30-day URL validity
    - Ensure generation within 5 seconds
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [ ]* 8.3 Write property test for INR formatting
    - **Property 12: INR Indian Number Formatting**
    - **Validates: Requirements 6.5**

  - [~] 8.4 Create PDF and Settings API route handlers
    - Create `src/app/api/business-invoices/[id]/pdf/route.ts` (GET generate/download)
    - Create `src/app/api/business-invoices/settings/route.ts` (GET, PUT)
    - Apply Premium Gate middleware
    - _Requirements: 6.1, 6.3, 13.1_

- [ ] 9. Invoice delivery and payment links
  - [~] 9.1 Implement Payment Link Service
    - Create `src/lib/invoices/payment-link-service.ts`
    - Generate payment links integrating with Razorpay and Stripe based on Branch config
    - Implement link expiry logic: 90 days or upon full payment
    - Implement payment processing via webhook (auto-update invoice status to PAID)
    - Handle failed payments: notify owner, retain current invoice status
    - _Requirements: 7.2, 7.3, 7.4, 7.6, 7.7, 7.8_

  - [ ]* 9.2 Write property tests for payment link expiry and failed payment handling
    - **Property 13: Payment Link Expiry Logic**
    - **Property 14: Failed Payment Status Preservation**
    - **Validates: Requirements 7.2, 7.7, 7.8**

  - [~] 9.3 Implement Invoice Send functionality
    - Add `send` method to invoice service
    - Send email with PDF attachment to customer's email
    - Generate and include Payment Link
    - Support WhatsApp sharing with pre-formatted message template
    - Auto-create interaction entry of type "invoice_sent"
    - _Requirements: 7.1, 7.2, 7.5, 3.5_

  - [~] 9.4 Create Payment Link API routes and public payment page
    - Create `src/app/api/business-invoices/[id]/send/route.ts` (POST send)
    - Create `src/app/api/public/pay/[linkId]/route.ts` (GET payment page data)
    - Create `src/app/pay/[linkId]/page.tsx` (public branded payment page)
    - Display invoice summary and payment options on payment page
    - _Requirements: 7.1, 7.5, 7.6_

- [ ] 10. Recurring invoices
  - [~] 10.1 Implement Recurring Invoice Service
    - Create `src/lib/invoices/recurring-invoice-service.ts`
    - Support frequencies: weekly, bi-weekly, monthly, quarterly, yearly
    - Auto-create new invoice with same line items on next generation date
    - Enforce end date and max occurrence limits
    - Support pause/cancel of recurring series
    - Support configurable auto-send or require-approval mode
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ]* 10.2 Write property test for recurring invoice generation limits
    - **Property 21: Recurring Invoice Generation with Limits**
    - **Validates: Requirements 14.2, 14.3**

  - [~] 10.3 Create Recurring Invoice API and cron job
    - Create `src/app/api/business-invoices/recurring/route.ts` (GET list, POST create, PUT update)
    - Create `src/app/api/cron/recurring-invoices/route.ts` (cron handler)
    - Send notification to Branch Owner for review when auto-generated
    - _Requirements: 14.5, 14.6_

- [~] 11. Checkpoint - Ensure invoicing pipeline tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Automated reminders and overdue detection
  - [~] 12.1 Implement Reminder Engine Service
    - Create `src/lib/reminders/reminder-service.ts`
    - Process overdue invoice reminders: 3 days before, on due date, 7 days after (configurable)
    - Send recurring overdue reminders at configured intervals (default 7 days, max 4 reminders)
    - Process custom customer follow-up reminders (in-app, email, SMS)
    - Allow Branch Owner to enable/disable automatic reminders per Customer or globally
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [~] 12.2 Implement Overdue Invoice Detection cron
    - Create `src/app/api/cron/overdue-invoices/route.ts`
    - Transition SENT/VIEWED invoices past due date to OVERDUE status
    - Notify Branch Owner of newly overdue invoices
    - _Requirements: 4.5, 8.1_

  - [~] 12.3 Create Invoice Reminders cron job
    - Create `src/app/api/cron/invoice-reminders/route.ts`
    - Send payment reminders to customers based on configured schedule
    - Send in-app notifications and optional email/SMS to Branch Owner for follow-ups
    - _Requirements: 8.2, 8.3_

- [ ] 13. Customer special date greetings
  - [~] 13.1 Implement Greeting Service
    - Add greeting processing to `src/lib/reminders/reminder-service.ts`
    - Send automated greetings on birthdays and anniversaries via configured channel
    - Support greeting templates with placeholders: {{customer_name}}, {{business_name}}, {{discount_code}}, {{date}}
    - Auto-generate unique discount codes when configured
    - Send at configurable time (default 9:00 AM in Branch timezone)
    - Prevent duplicate sends for same occasion in same year via GreetingLog
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

  - [ ]* 13.2 Write property tests for greeting placeholder substitution and duplicate prevention
    - **Property 19: Greeting Template Placeholder Substitution**
    - **Property 20: Duplicate Greeting Prevention**
    - **Validates: Requirements 12.3, 12.6**

  - [~] 13.3 Create Customer Greetings cron job
    - Create `src/app/api/cron/customer-greetings/route.ts`
    - Query customers with birthdays/anniversaries matching today
    - Process and send greetings, log results
    - _Requirements: 12.2, 12.5_

- [ ] 14. Expense tracking
  - [~] 14.1 Implement Expense Service
    - Create `src/lib/expenses/expense-service.ts`
    - Record expenses with: amount, date, category, description, vendor, receipt attachment
    - Provide pre-defined categories (Rent, Utilities, Supplies, Travel, Marketing, Salary, Other) and custom categories
    - Support filtering by category, date range, and vendor
    - Support receipt attachment (max 10MB, JPEG/PNG/PDF)
    - Calculate monthly totals and category-wise breakdown
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

  - [ ]* 14.2 Write property test for expense filtering and aggregation
    - **Property 16: Expense Filtering and Aggregation**
    - **Validates: Requirements 10.4, 10.5**

  - [~] 14.3 Create Expense API route handlers
    - Create `src/app/api/crm/expenses/route.ts` (GET list, POST create)
    - Create `src/app/api/crm/expenses/[id]/route.ts` (GET, PUT, DELETE)
    - Apply Premium Gate middleware
    - _Requirements: 10.1, 10.4_

- [ ] 15. Revenue tracking dashboard
  - [~] 15.1 Implement Revenue Analytics Service
    - Create `src/lib/revenue/analytics-service.ts`
    - Calculate total revenue, total outstanding, total overdue for current month and financial year
    - Generate monthly revenue trend chart data for past 12 months
    - Calculate invoice count by status for selected period
    - Compute top 5 customers by revenue
    - Calculate average payment collection time (days between sent and paid)
    - Include expenses in profit/loss calculations
    - Filter all metrics by date range
    - All monetary values in Branch's configured currency
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 10.3, 10.5_

  - [ ]* 15.2 Write property tests for revenue aggregation and profit calculation
    - **Property 15: Revenue Dashboard Aggregation**
    - **Property 17: Profit Calculation**
    - **Validates: Requirements 9.1, 9.3, 9.4, 9.5, 10.3**

  - [~] 15.3 Create Revenue Dashboard API route handler
    - Create `src/app/api/revenue/dashboard/route.ts` (GET metrics with date range filter)
    - Create `src/app/api/revenue/export/route.ts` (GET export report)
    - Apply Premium Gate middleware
    - _Requirements: 9.1, 9.4_

- [~] 16. Checkpoint - Ensure analytics and expense tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Customer segmentation and bulk actions
  - [~] 17.1 Implement Segment Service
    - Create `src/lib/crm/segment-service.ts`
    - Create segments based on: tags, last interaction date, total invoice value, creation date
    - Dynamically compute matching customer count for any criteria
    - Export segment as CSV
    - _Requirements: 11.1, 11.2, 11.5_

  - [ ]* 17.2 Write property test for segment criteria matching
    - **Property 18: Customer Segment Criteria Matching**
    - **Validates: Requirements 11.1, 11.2**

  - [~] 17.3 Implement Bulk Messaging
    - Add bulk WhatsApp and email messaging to segment service
    - Support customizable email templates
    - Limit bulk messaging to 200 recipients per batch
    - _Requirements: 11.3, 11.4, 11.6_

  - [~] 17.4 Create Segment API route handlers
    - Create `src/app/api/crm/customers/segments/route.ts` (GET list, POST create)
    - Apply Premium Gate middleware
    - _Requirements: 11.1, 11.5_

- [ ] 18. Review request automation
  - [~] 18.1 Implement Review Request Service
    - Create `src/lib/crm/review-request-service.ts`
    - Schedule review request after invoice is marked PAID (configurable delay, default 2 days)
    - Send via email or WhatsApp with pre-configured message template
    - Track request status: PENDING, SENT, CLICKED, REVIEWED
    - Enforce cooldown: max 1 request per customer per 90-day period
    - Allow enabling/disabling per customer or globally
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [ ]* 18.2 Write property test for review request cooldown
    - **Property 22: Review Request Cooldown**
    - **Validates: Requirements 15.6**

  - [~] 18.3 Create Review Request API route handlers
    - Create `src/app/api/crm/review-requests/route.ts` (GET, POST)
    - Apply Premium Gate middleware
    - _Requirements: 15.1, 15.5_

- [ ] 19. Frontend - CRM pages and components
  - [~] 19.1 Create CRM customer list page and components
    - Create `src/app/business-owner/crm/page.tsx` (customer list with search, filter, pagination)
    - Create `src/components/crm/CustomerList.tsx`
    - Create `src/components/crm/CustomerForm.tsx` (create/edit customer modal)
    - Include upgrade prompt for non-premium users
    - _Requirements: 2.1, 2.4, 1.1_

  - [~] 19.2 Create Customer profile page
    - Create `src/app/business-owner/crm/[id]/page.tsx`
    - Create `src/components/crm/CustomerProfile.tsx` (contact details, tags, custom notes)
    - Create `src/components/crm/InteractionLog.tsx` (reverse chronological interaction list)
    - Create `src/components/crm/InteractionForm.tsx` (log new interaction)
    - Display associated invoices and appointment history
    - _Requirements: 2.5, 3.1, 3.3_

  - [~] 19.3 Create Customer import and segment pages
    - Create `src/app/business-owner/crm/import/page.tsx`
    - Create `src/components/crm/CustomerImport.tsx` (CSV upload with validation feedback)
    - Create `src/app/business-owner/crm/segments/page.tsx`
    - Create `src/components/crm/SegmentBuilder.tsx` (criteria builder UI)
    - Create `src/components/crm/BulkActions.tsx` (bulk messaging UI)
    - _Requirements: 2.7, 11.1, 11.3, 11.4_

- [ ] 20. Frontend - Invoice pages and components
  - [~] 20.1 Create Invoice list and creation pages
    - Create `src/app/business-owner/invoices/page.tsx` (invoice list with status filters)
    - Create `src/app/business-owner/invoices/new/page.tsx` (invoice creation form)
    - Create `src/components/invoices/InvoiceList.tsx`
    - Create `src/components/invoices/InvoiceForm.tsx` (customer, dates, line items, discount, notes)
    - Create `src/components/invoices/LineItemEditor.tsx` (add/remove/edit line items, max 50)
    - Create `src/components/invoices/GSTFields.tsx` (GSTIN, HSN/SAC, place of supply)
    - _Requirements: 4.1, 4.9, 5.1_

  - [~] 20.2 Create Invoice detail and preview pages
    - Create `src/app/business-owner/invoices/[id]/page.tsx` (invoice detail with actions)
    - Create `src/components/invoices/InvoicePreview.tsx` (visual preview before PDF)
    - Create `src/components/invoices/PaymentRecorder.tsx` (record partial/full payments)
    - Add send, duplicate, cancel, and download PDF actions
    - _Requirements: 4.4, 4.6, 4.7, 6.1, 7.1_

  - [~] 20.3 Create Invoice settings and recurring invoice pages
    - Create `src/app/business-owner/invoices/settings/page.tsx`
    - Create `src/components/invoices/InvoiceSettings.tsx` (logo, bank details, template, colors)
    - Create `src/app/business-owner/invoices/recurring/page.tsx`
    - Create `src/components/invoices/RecurringInvoiceForm.tsx` (frequency, end date, auto-send)
    - _Requirements: 13.1, 13.4, 14.1, 14.4, 14.6_

- [ ] 21. Frontend - Expense and revenue dashboard pages
  - [~] 21.1 Create Expense tracking page
    - Create `src/app/business-owner/expenses/page.tsx`
    - Create `src/components/expenses/ExpenseList.tsx` (filterable list with search)
    - Create `src/components/expenses/ExpenseForm.tsx` (amount, date, category, vendor, receipt upload)
    - Create `src/components/expenses/ExpenseSummary.tsx` (monthly totals, category breakdown)
    - _Requirements: 10.1, 10.2, 10.4, 10.5, 10.6_

  - [~] 21.2 Create Revenue Dashboard page
    - Create `src/app/business-owner/revenue/page.tsx`
    - Create `src/components/revenue/RevenueDashboard.tsx` (summary cards: revenue, outstanding, overdue)
    - Create `src/components/revenue/RevenueChart.tsx` (monthly trend chart, 12 months)
    - Create `src/components/revenue/InvoiceStatusChart.tsx` (invoice count by status)
    - Create `src/components/revenue/TopCustomers.tsx` (top 5 customers by revenue)
    - Add date range filter controls
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [~] 22. Checkpoint - Ensure all frontend pages render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 23. Integration wiring and final assembly
  - [~] 23.1 Wire Premium Gate into all CRM/Invoice routes
    - Apply `withPremiumGate` middleware to every API route created
    - Ensure upgrade prompt is returned for unauthorized access attempts
    - Verify read-only mode for expired subscriptions (data accessible but not modifiable)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [~] 23.2 Wire interaction auto-logging hooks
    - Connect appointment booking to auto-create interaction (type: APPOINTMENT_BOOKED)
    - Connect invoice send to auto-create interaction (type: INVOICE_SENT)
    - Connect payment received to auto-create interaction (type: PAYMENT_RECEIVED)
    - _Requirements: 3.4, 3.5_

  - [~] 23.3 Wire payment webhook handlers for invoice payments
    - Integrate Razorpay webhook to process invoice payment confirmations
    - Integrate Stripe webhook to process invoice payment confirmations
    - Auto-update invoice status on successful payment
    - Notify Branch Owner on failed payment
    - _Requirements: 7.3, 7.4, 7.7_

  - [~] 23.4 Wire review request trigger on invoice payment
    - When invoice transitions to PAID, schedule review request based on config
    - Respect cooldown period and per-customer enable/disable settings
    - _Requirements: 15.1, 15.5, 15.6_

  - [ ]* 23.5 Write integration tests for end-to-end flows
    - Test invoice creation → send → payment → PAID flow
    - Test customer creation → interaction logging → segment matching flow
    - Test recurring invoice generation → reminder → overdue detection flow
    - _Requirements: 4.1, 7.4, 8.1, 14.2_

- [~] 24. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (Properties 1–24 from the design)
- Unit tests validate specific examples and edge cases
- The project uses TypeScript, Next.js App Router, Prisma ORM, PDFKit, fast-check, and vitest
- All API routes use Premium Gate middleware for access control
- Data isolation is enforced at the Branch level throughout

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "4.1", "6.1", "6.3"] },
    { "id": 2, "tasks": ["2.2", "4.2", "4.3", "4.5", "6.2", "6.4", "6.5"] },
    { "id": 3, "tasks": ["4.4", "4.6", "4.7", "5.1", "6.6", "6.7"] },
    { "id": 4, "tasks": ["5.2", "8.1", "8.2", "9.1", "10.1", "14.1"] },
    { "id": 5, "tasks": ["8.3", "8.4", "9.2", "9.3", "10.2", "10.3", "14.2", "14.3"] },
    { "id": 6, "tasks": ["9.4", "12.1", "12.2", "12.3", "13.1", "15.1"] },
    { "id": 7, "tasks": ["13.2", "13.3", "15.2", "15.3", "17.1"] },
    { "id": 8, "tasks": ["17.2", "17.3", "17.4", "18.1"] },
    { "id": 9, "tasks": ["18.2", "18.3", "19.1", "19.2", "19.3", "20.1"] },
    { "id": 10, "tasks": ["20.2", "20.3", "21.1", "21.2"] },
    { "id": 11, "tasks": ["23.1", "23.2", "23.3", "23.4"] },
    { "id": 12, "tasks": ["23.5"] }
  ]
}
```
