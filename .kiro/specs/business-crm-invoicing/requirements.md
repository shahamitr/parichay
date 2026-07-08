# Requirements Document

## Introduction

This document defines the requirements for the Business CRM & Invoicing Module — a premium add-on for the Parichay (Zintro) platform. The module extends the existing lead management system into a full customer relationship management (CRM) solution with professional invoice generation capabilities. It targets SMBs, freelancers, doctors, restaurants, consultants, and local service providers who need day-to-day business operations tools beyond just digital presence.

The module will be gated behind a premium subscription tier (Pro plan at ₹399/month or Business Plus at ₹499/month) and builds upon the existing multi-tenant architecture (Brand → Branch), lead management system, appointment booking, and payment integrations (Stripe + Razorpay).

## Glossary

- **CRM_Module**: The Customer Relationship Management subsystem that manages customer records, interactions, and relationship lifecycle
- **Customer**: A business contact who has been converted from a lead or manually added, representing an ongoing relationship (distinct from a Lead which is a prospect)
- **Invoice_Engine**: The subsystem responsible for creating, managing, and delivering invoices to customers
- **Business_Invoice**: A tax-compliant document issued by a business owner to a customer for goods or services rendered (distinct from platform subscription invoices)
- **GST**: Goods and Services Tax — Indian indirect tax system requiring GSTIN, HSN/SAC codes, and specific invoice formatting
- **Payment_Link**: A shareable URL that allows a customer to pay an invoice online via Stripe or Razorpay
- **Communication_Logger**: The subsystem that records customer interactions across channels (calls, WhatsApp, visits, emails)
- **Reminder_Engine**: The subsystem that schedules and dispatches automated follow-up notifications to business owners
- **Revenue_Dashboard**: The analytics subsystem that aggregates and displays income, expenses, and payment data
- **Premium_Gate**: The access control mechanism that restricts CRM and invoicing features to users on qualifying subscription plans
- **Branch_Owner**: The authenticated user who manages a branch and its associated customers and invoices
- **Line_Item**: An individual entry on an invoice representing a product or service with quantity and price
- **Invoice_Template**: A reusable configuration defining the visual layout and default content of generated invoices

## Requirements

### Requirement 1: Premium Feature Access Control

**User Story:** As a platform operator, I want CRM and invoicing features gated behind premium plans, so that users are motivated to upgrade and the platform generates sustainable revenue.

#### Acceptance Criteria

1. WHEN an unauthenticated user or a user on a Free or Basic plan attempts to access CRM_Module features, THE Premium_Gate SHALL display an upgrade prompt with plan comparison details
2. WHEN a user subscribes to a Pro or Business Plus plan, THE Premium_Gate SHALL grant immediate access to all CRM_Module and Invoice_Engine features for that user's Brand
3. WHILE a subscription is in ACTIVE status, THE Premium_Gate SHALL allow unrestricted access to all premium features within the subscribed Brand
4. WHEN a subscription transitions to EXPIRED or CANCELLED status, THE Premium_Gate SHALL revoke access to premium features while preserving all existing customer and invoice data in read-only mode
5. THE Premium_Gate SHALL enforce feature access at the Brand level, granting access to all Branches within the subscribed Brand
6. IF a subscription payment fails, THEN THE Premium_Gate SHALL provide a 7-day grace period before revoking premium feature access

### Requirement 2: Customer Database Management

**User Story:** As a business owner, I want to maintain a comprehensive customer database separate from leads, so that I can track ongoing relationships and service history.

#### Acceptance Criteria

1. THE CRM_Module SHALL allow the Branch_Owner to create a Customer record with fields: name (required), phone, email, address, company name, tags, custom fields, and notes
2. WHEN a Lead's status changes to CONVERTED, THE CRM_Module SHALL create a Customer record populated with the Lead's existing data and link the Customer to the originating Lead
3. THE CRM_Module SHALL allow the Branch_Owner to create Customer records manually without an associated Lead
4. WHEN a Branch_Owner searches the customer list, THE CRM_Module SHALL support filtering by name, phone, email, tags, creation date, and last interaction date
5. THE CRM_Module SHALL display a customer profile page showing: contact details, interaction history, associated invoices, appointment history, tags, and custom notes
6. THE CRM_Module SHALL support tagging customers with user-defined labels (maximum 20 tags per customer)
7. WHEN a Branch_Owner imports customers via CSV file, THE CRM_Module SHALL validate each row and report errors for invalid entries while importing valid entries
8. THE CRM_Module SHALL allow export of customer data in CSV format with selectable fields
9. THE CRM_Module SHALL enforce data isolation such that customers belonging to one Branch are not visible to users of another Branch (unless they share the same Brand and the user has Brand-level access)
10. WHEN a Customer record is deleted, THE CRM_Module SHALL perform a soft delete, retaining the data for 30 days before permanent removal

### Requirement 3: Customer Interaction Tracking

**User Story:** As a business owner, I want to log every interaction with my customers, so that I have a complete communication history for context in future conversations.

#### Acceptance Criteria

1. THE Communication_Logger SHALL allow the Branch_Owner to log interactions of types: phone call, WhatsApp message, email, in-person visit, SMS, and custom type
2. WHEN an interaction is logged, THE Communication_Logger SHALL record: interaction type, date and time, duration (for calls), summary notes, and the user who logged it
3. THE Communication_Logger SHALL display all interactions for a Customer in reverse chronological order on the customer profile page
4. WHEN a new appointment is booked for a Customer, THE Communication_Logger SHALL automatically create an interaction entry of type "appointment_booked"
5. WHEN an invoice is sent to a Customer, THE Communication_Logger SHALL automatically create an interaction entry of type "invoice_sent"
6. THE Communication_Logger SHALL allow attaching up to 3 files (maximum 5MB each) to an interaction record

### Requirement 4: Invoice Creation and Management

**User Story:** As a business owner, I want to create professional invoices for my customers, so that I can bill them systematically and maintain financial records.

#### Acceptance Criteria

1. THE Invoice_Engine SHALL allow the Branch_Owner to create a Business_Invoice with: customer selection, invoice date, due date, line items (description, quantity, unit price, tax rate), discount, and notes
2. THE Invoice_Engine SHALL auto-generate a sequential invoice number following the pattern: {branch_prefix}-{financial_year}-{sequence} (e.g., ABC-2425-001)
3. WHEN a Business_Invoice is created, THE Invoice_Engine SHALL calculate the subtotal, applicable taxes, discount, and grand total
4. THE Invoice_Engine SHALL support the following statuses for a Business_Invoice: DRAFT, SENT, VIEWED, PARTIALLY_PAID, PAID, OVERDUE, and CANCELLED
5. WHEN a Business_Invoice's due date passes without full payment, THE Invoice_Engine SHALL automatically transition the status to OVERDUE
6. THE Invoice_Engine SHALL allow the Branch_Owner to duplicate an existing invoice to create a new one with the same line items
7. THE Invoice_Engine SHALL allow the Branch_Owner to record partial payments against an invoice, tracking the remaining balance
8. WHEN a Business_Invoice is cancelled, THE Invoice_Engine SHALL retain the record with CANCELLED status and not reuse the invoice number
9. THE Invoice_Engine SHALL support a maximum of 50 line items per Business_Invoice
10. THE Invoice_Engine SHALL allow the Branch_Owner to save frequently used line items as reusable items for quick selection

### Requirement 5: GST Compliance for Indian Invoices

**User Story:** As an Indian business owner, I want my invoices to be GST-compliant, so that I meet regulatory requirements and my customers can claim input tax credit.

#### Acceptance Criteria

1. WHERE GST is enabled for a Branch, THE Invoice_Engine SHALL include fields for: seller GSTIN, buyer GSTIN (optional), HSN/SAC code per line item, place of supply, and tax breakup (CGST + SGST for intra-state, IGST for inter-state)
2. WHERE GST is enabled, THE Invoice_Engine SHALL calculate tax as: CGST at half the GST rate plus SGST at half the GST rate for intra-state transactions
3. WHERE GST is enabled AND the transaction is inter-state, THE Invoice_Engine SHALL calculate tax as IGST at the full GST rate
4. WHERE GST is enabled, THE Invoice_Engine SHALL support standard GST rates: 0%, 5%, 12%, 18%, and 28%
5. WHERE GST is enabled, THE Invoice_Engine SHALL validate that the seller GSTIN follows the 15-character alphanumeric format defined by Indian tax authorities
6. WHERE GST is enabled, THE Invoice_Engine SHALL display the tax breakup summary at the invoice level showing total CGST, SGST, and IGST amounts
7. WHERE GST is not enabled, THE Invoice_Engine SHALL allow simple tax-inclusive or tax-exclusive pricing without GST-specific fields

### Requirement 6: Invoice PDF Generation

**User Story:** As a business owner, I want to generate professional PDF invoices, so that I can share them with customers via email or messaging apps.

#### Acceptance Criteria

1. WHEN the Branch_Owner requests a PDF for a Business_Invoice, THE Invoice_Engine SHALL generate a PDF document containing: business logo, business details, customer details, invoice number, dates, line items, tax breakup, total amount, payment terms, and bank details
2. THE Invoice_Engine SHALL provide at least 3 invoice template styles (Modern, Classic, Minimal) that the Branch_Owner can select from
3. WHEN a PDF is generated, THE Invoice_Engine SHALL store it in cloud storage and provide a downloadable URL valid for 30 days
4. THE Invoice_Engine SHALL include the Branch's logo, business name, address, and contact details in the invoice header
5. THE Invoice_Engine SHALL render all currency amounts in the configured currency format (₹ for INR with Indian number formatting: e.g., ₹1,00,000.00)
6. THE Invoice_Engine SHALL generate the PDF within 5 seconds of the request
7. WHEN the Branch_Owner customizes invoice settings (logo, bank details, terms and conditions, signature), THE Invoice_Engine SHALL persist these settings and apply them to all future invoices for that Branch

### Requirement 7: Invoice Delivery and Payment Links

**User Story:** As a business owner, I want to send invoices to customers with an embedded payment link, so that customers can pay online instantly.

#### Acceptance Criteria

1. WHEN the Branch_Owner sends a Business_Invoice, THE Invoice_Engine SHALL deliver it via email to the customer's registered email address with the PDF attached
2. WHEN the Branch_Owner sends a Business_Invoice, THE Invoice_Engine SHALL generate a Payment_Link that allows the customer to pay the invoice amount online
3. THE Payment_Link SHALL integrate with the existing Razorpay and Stripe payment gateways based on the Branch's configuration
4. WHEN a customer completes payment via the Payment_Link, THE Invoice_Engine SHALL automatically update the Business_Invoice status to PAID and record the payment details
5. THE Invoice_Engine SHALL allow sharing the invoice and Payment_Link via WhatsApp using a pre-formatted message template
6. WHEN a customer opens the Payment_Link, THE Invoice_Engine SHALL display a branded payment page showing the invoice summary and payment options
7. IF a payment via Payment_Link fails, THEN THE Invoice_Engine SHALL notify the Branch_Owner and retain the invoice in its current status
8. THE Payment_Link SHALL expire 90 days after generation or upon full payment, whichever occurs first

### Requirement 8: Automated Follow-up Reminders

**User Story:** As a business owner, I want automated reminders for customer follow-ups and overdue invoices, so that I never miss important interactions.

#### Acceptance Criteria

1. WHEN a Business_Invoice becomes OVERDUE, THE Reminder_Engine SHALL send a payment reminder notification to the Branch_Owner
2. THE Reminder_Engine SHALL allow the Branch_Owner to configure automatic payment reminders to customers: 3 days before due date, on due date, and 7 days after due date
3. WHEN a customer follow-up date is reached, THE Reminder_Engine SHALL send an in-app notification and optional email/SMS to the Branch_Owner
4. THE Reminder_Engine SHALL allow the Branch_Owner to set custom reminders for any Customer with: reminder date, message, and channel (in-app, email, SMS)
5. THE Reminder_Engine SHALL allow the Branch_Owner to enable or disable automatic reminders per Customer or globally
6. WHILE a Business_Invoice remains OVERDUE, THE Reminder_Engine SHALL send recurring reminders at intervals configured by the Branch_Owner (default: every 7 days, maximum 4 reminders)

### Requirement 9: Revenue Tracking Dashboard

**User Story:** As a business owner, I want to see my revenue metrics at a glance, so that I can understand my business performance and cash flow.

#### Acceptance Criteria

1. THE Revenue_Dashboard SHALL display total revenue collected, total outstanding amount, and total overdue amount for the current month and financial year
2. THE Revenue_Dashboard SHALL display a monthly revenue trend chart for the past 12 months
3. THE Revenue_Dashboard SHALL display the count of invoices by status (DRAFT, SENT, PAID, OVERDUE, CANCELLED) for the selected period
4. WHEN the Branch_Owner selects a date range, THE Revenue_Dashboard SHALL filter all metrics to that period
5. THE Revenue_Dashboard SHALL display the top 5 customers by revenue for the selected period
6. THE Revenue_Dashboard SHALL display the average payment collection time (days between invoice sent and payment received) for the selected period
7. THE Revenue_Dashboard SHALL calculate all monetary values in the Branch's configured currency

### Requirement 10: Expense Tracking

**User Story:** As a business owner, I want to record my business expenses, so that I can track profitability alongside revenue.

#### Acceptance Criteria

1. THE CRM_Module SHALL allow the Branch_Owner to record an expense with: amount, date, category, description, vendor name, and optional receipt attachment
2. THE CRM_Module SHALL provide pre-defined expense categories (Rent, Utilities, Supplies, Travel, Marketing, Salary, Other) and allow custom categories
3. WHEN an expense is recorded, THE Revenue_Dashboard SHALL include the expense in profit/loss calculations
4. THE CRM_Module SHALL allow filtering and searching expenses by category, date range, and vendor
5. THE CRM_Module SHALL display monthly expense totals and a category-wise breakdown on the Revenue_Dashboard
6. THE CRM_Module SHALL allow attaching a receipt image (maximum 10MB, formats: JPEG, PNG, PDF) to each expense record

### Requirement 11: Customer Segmentation and Bulk Actions

**User Story:** As a business owner, I want to segment my customers and perform bulk operations, so that I can run targeted campaigns and manage groups efficiently.

#### Acceptance Criteria

1. THE CRM_Module SHALL allow the Branch_Owner to create customer segments based on tags, last interaction date, total invoice value, and creation date
2. WHEN a segment is defined, THE CRM_Module SHALL dynamically compute the matching customer count
3. THE CRM_Module SHALL allow the Branch_Owner to send bulk WhatsApp messages to a customer segment (subject to WhatsApp Business API limits)
4. THE CRM_Module SHALL allow the Branch_Owner to send bulk email messages to a customer segment with a customizable template
5. THE CRM_Module SHALL allow the Branch_Owner to export a customer segment as a CSV file
6. THE CRM_Module SHALL limit bulk messaging to 200 recipients per batch to prevent abuse and respect third-party rate limits

### Requirement 12: Customer Special Date Automation

**User Story:** As a business owner, I want to automatically send greetings on customer birthdays and anniversaries, so that I can maintain personal relationships at scale.

#### Acceptance Criteria

1. THE CRM_Module SHALL allow the Branch_Owner to record birthday and anniversary dates for each Customer
2. WHEN a Customer's birthday or anniversary date arrives, THE Reminder_Engine SHALL send an automated greeting via the configured channel (email, WhatsApp, or SMS)
3. THE CRM_Module SHALL allow the Branch_Owner to configure greeting templates with placeholders: {{customer_name}}, {{business_name}}, {{discount_code}}, and {{date}}
4. WHERE a greeting includes a discount code, THE CRM_Module SHALL auto-generate a unique discount code valid for the configured number of days
5. THE Reminder_Engine SHALL send greetings at a configurable time (default: 9:00 AM in the Branch's timezone)
6. THE CRM_Module SHALL maintain a log of sent greetings to prevent duplicate sends for the same occasion in the same year

### Requirement 13: Invoice Template Customization

**User Story:** As a business owner, I want to customize my invoice appearance, so that invoices reflect my brand identity.

#### Acceptance Criteria

1. THE Invoice_Engine SHALL allow the Branch_Owner to configure: business logo, business name, address, GSTIN, phone, email, bank account details (account number, IFSC, bank name, UPI ID), and signature image
2. THE Invoice_Engine SHALL allow the Branch_Owner to set default payment terms text (e.g., "Payment due within 15 days")
3. THE Invoice_Engine SHALL allow the Branch_Owner to add a footer note that appears on all invoices (e.g., "Thank you for your business!")
4. THE Invoice_Engine SHALL allow the Branch_Owner to select a color accent for the invoice template that matches brand colors
5. WHEN invoice settings are updated, THE Invoice_Engine SHALL apply the new settings to all future invoices without modifying previously generated PDFs

### Requirement 14: Recurring Invoices

**User Story:** As a business owner with subscription-based services, I want to set up recurring invoices, so that regular billing happens automatically.

#### Acceptance Criteria

1. THE Invoice_Engine SHALL allow the Branch_Owner to mark a Business_Invoice as recurring with a frequency: weekly, bi-weekly, monthly, quarterly, or yearly
2. WHEN a recurring invoice's next generation date arrives, THE Invoice_Engine SHALL auto-create a new Business_Invoice with the same line items, customer, and terms
3. THE Invoice_Engine SHALL allow the Branch_Owner to set an end date or a maximum number of occurrences for a recurring invoice
4. THE Invoice_Engine SHALL allow the Branch_Owner to pause or cancel a recurring invoice series
5. WHEN a recurring invoice is auto-generated, THE Invoice_Engine SHALL send a notification to the Branch_Owner for review before auto-sending (configurable: auto-send or require approval)
6. THE Invoice_Engine SHALL display all active recurring invoice schedules in a dedicated list view

### Requirement 15: Review Request Automation

**User Story:** As a business owner, I want to automatically request Google reviews from satisfied customers, so that I can build my online reputation.

#### Acceptance Criteria

1. WHEN a Business_Invoice is marked as PAID, THE CRM_Module SHALL allow an automated review request to be sent to the Customer after a configurable delay (default: 2 days)
2. THE CRM_Module SHALL allow the Branch_Owner to configure a Google Business review link for their branch
3. THE CRM_Module SHALL send the review request via email or WhatsApp with a pre-configured friendly message template
4. THE CRM_Module SHALL track which customers have been sent review requests and their response (clicked link, left review)
5. THE CRM_Module SHALL allow the Branch_Owner to enable or disable review request automation globally or per Customer
6. THE CRM_Module SHALL limit review requests to one per Customer per 90-day period to avoid spamming

