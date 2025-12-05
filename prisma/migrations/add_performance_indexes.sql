-- Add indexes for better query performance

-- Brand indexes
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_custom_domain ON brands(custom_domain);
CREATE INDEX IF NOT EXISTS idx_brands_owner_id ON brands(owner_id);

-- Branch indexes
CREATE INDEX IF NOT EXISTS idx_branches_brand_id ON branches(brand_id);
CREATE INDEX IF NOT EXISTS idx_branches_slug ON branches(slug);
CREATE INDEX IF NOT EXISTS idx_branches_brand_slug ON branches(brand_id, slug);
CREATE INDEX IF NOT EXISTS idx_branches_is_active ON branches(is_active);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_brand_id ON users(brand_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Lead indexes
CREATE INDEX IF NOT EXISTS idx_leads_branch_id ON leads(branch_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_branch_id ON analytics_events(branch_id);
CREATE INDEX IF NOT EXISTS idx_analytics_brand_id ON analytics_events(brand_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- QR Code indexes
CREATE INDEX IF NOT EXISTS idx_qrcodes_branch_id ON qr_codes(branch_id);
CREATE INDEX IF NOT EXISTS idx_qrcodes_brand_id ON qr_codes(brand_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_branches_brand_active ON branches(brand_id, is_active);
CREATE INDEX IF NOT EXISTS idx_analytics_branch_type_date ON analytics_events(branch_id, event_type, created_at);
