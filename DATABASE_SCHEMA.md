# Pinpoint Golf Platform - Complete Multi-Tenant Database Schema

## Platform Overview

Pinpoint Golf is a multi-tenant SaaS platform that enables tournament organizers to create professional golf tournament websites with integrated registration, payment processing, and management tools.

## Core Platform Tables

### Customer Authentication & Organizations

```sql
-- Customer users (tournament organizers and participants)
CREATE TABLE customer_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    profile_image_url TEXT,
    handicap REAL,
    golf_experience TEXT DEFAULT 'intermediate',
    dietary_restrictions TEXT,
    email_notifications BOOLEAN DEFAULT 1,
    marketing_emails BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login_at DATETIME
);

-- Tournament organizations (multi-tenant isolation)
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE,
    custom_domain TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#198038',
    secondary_color TEXT DEFAULT '#0f62fe',
    font_family TEXT DEFAULT 'IBM Plex Sans',
    ad_revenue_share_enabled BOOLEAN DEFAULT 0,
    subscription_tier TEXT DEFAULT 'free',
    billing_status TEXT DEFAULT 'active',
    stripe_customer_id TEXT,
    stripe_connect_account_id TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES customer_users(id)
);

-- User roles within organizations
CREATE TABLE user_roles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    role_type TEXT NOT NULL, -- owner, admin, manager, viewer
    permissions TEXT DEFAULT '[]', -- JSON array of permissions
    is_active BOOLEAN DEFAULT 1,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customer_users(id),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

### Tournament Management

```sql
-- Individual tournaments
CREATE TABLE tournaments (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- URL-friendly identifier
    event_date DATE NOT NULL,
    location_name TEXT,
    location_address TEXT,
    location_city TEXT,
    location_state TEXT,
    location_zip TEXT,
    individual_price DECIMAL(8,2) NOT NULL,
    team_price DECIMAL(8,2),
    max_participants INTEGER,
    registration_deadline DATE,
    hero_image_url TEXT,
    description TEXT,
    theme_template TEXT DEFAULT 'classic',
    custom_css TEXT, -- Custom styling
    charity_name TEXT,
    charity_description TEXT,
    sponsors_enabled BOOLEAN DEFAULT 1,
    leaderboard_enabled BOOLEAN DEFAULT 1,
    status TEXT DEFAULT 'draft', -- draft, published, active, completed, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(organization_id, slug)
);

-- Tournament registrations
CREATE TABLE tournament_registrations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tournament_id TEXT NOT NULL,
    registration_type TEXT NOT NULL, -- individual, team
    team_id TEXT,
    amount_paid DECIMAL(8,2) NOT NULL,
    payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
    registration_status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled
    stripe_payment_intent_id TEXT,
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES customer_users(id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    UNIQUE(user_id, tournament_id)
);
```

### Payment & Billing System

```sql
-- Subscription management
CREATE TABLE billing_subscriptions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    tier TEXT NOT NULL, -- free, pro, enterprise
    status TEXT NOT NULL, -- active, cancelled, past_due, unpaid
    current_period_start DATETIME NOT NULL,
    current_period_end DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Payment transactions
CREATE TABLE payment_transactions (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    tournament_id TEXT,
    registration_id TEXT,
    stripe_payment_intent_id TEXT,
    amount DECIMAL(8,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL, -- pending, succeeded, failed, cancelled
    payment_method TEXT, -- card, bank_transfer, etc.
    stripe_fee DECIMAL(8,2) DEFAULT 0,
    platform_fee DECIMAL(8,2) DEFAULT 0,
    net_amount DECIMAL(8,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
    FOREIGN KEY (registration_id) REFERENCES tournament_registrations(id)
);
```

### Analytics & Tracking

```sql
-- Tournament analytics (daily aggregates)
CREATE TABLE tournament_analytics (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    registrations_started INTEGER DEFAULT 0,
    registrations_completed INTEGER DEFAULT 0,
    registration_revenue DECIMAL(10,2) DEFAULT 0.00,
    conversion_rate DECIMAL(5,4) DEFAULT 0.0000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(tournament_id, date)
);

-- Email campaign tracking
CREATE TABLE email_campaigns (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    tournament_id TEXT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    sent_to_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft', -- draft, scheduled, sending, sent
    scheduled_for DATETIME,
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE SET NULL
);
```

### Content Management

```sql
-- Site customization templates
CREATE TABLE site_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    preview_image_url TEXT,
    css_content TEXT,
    html_structure TEXT,
    is_premium BOOLEAN DEFAULT 0,
    category TEXT DEFAULT 'standard', -- standard, premium, custom
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Custom domains and DNS management
CREATE TABLE custom_domains (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    domain_name TEXT UNIQUE NOT NULL,
    verification_token TEXT,
    verification_status TEXT DEFAULT 'pending', -- pending, verified, failed
    ssl_status TEXT DEFAULT 'pending', -- pending, active, failed
    dns_configured BOOLEAN DEFAULT 0,
    cloudflare_zone_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

### Advanced Features

```sql
-- Sponsor management
CREATE TABLE tournament_sponsors (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description TEXT,
    sponsorship_level TEXT NOT NULL, -- title, gold, silver, bronze, hole
    amount DECIMAL(8,2),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE
);

-- Tournament leaderboard
CREATE TABLE tournament_leaderboard (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL,
    registration_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    total_strokes INTEGER,
    score_to_par INTEGER,
    holes_completed INTEGER DEFAULT 0,
    position INTEGER,
    is_tied BOOLEAN DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (registration_id) REFERENCES tournament_registrations(id)
);

-- Tournament teams
CREATE TABLE tournament_teams (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    captain_registration_id TEXT NOT NULL,
    max_members INTEGER DEFAULT 4,
    current_members INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (captain_registration_id) REFERENCES tournament_registrations(id),
    UNIQUE(tournament_id, team_name)
);
```

### API & Integration Management

```sql
-- API keys for third-party integrations
CREATE TABLE api_keys (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    permissions TEXT DEFAULT '[]', -- JSON array of allowed operations
    last_used_at DATETIME,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Webhook endpoints
CREATE TABLE webhook_endpoints (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT NOT NULL, -- JSON array of event types
    secret_key TEXT,
    is_active BOOLEAN DEFAULT 1,
    last_triggered_at DATETIME,
    failure_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

## Performance Indexes

```sql
-- Customer users
CREATE INDEX idx_customer_users_email ON customer_users(email);
CREATE INDEX idx_customer_users_verification ON customer_users(email_verification_token);
CREATE INDEX idx_customer_users_reset ON customer_users(password_reset_token);

-- Organizations
CREATE INDEX idx_organizations_subdomain ON organizations(subdomain);
CREATE INDEX idx_organizations_custom_domain ON organizations(custom_domain);
CREATE INDEX idx_organizations_owner ON organizations(owner_id);

-- Tournaments
CREATE INDEX idx_tournaments_org_status ON tournaments(organization_id, status);
CREATE INDEX idx_tournaments_slug ON tournaments(organization_id, slug);
CREATE INDEX idx_tournaments_date ON tournaments(event_date);

-- Registrations
CREATE INDEX idx_registrations_tournament ON tournament_registrations(tournament_id);
CREATE INDEX idx_registrations_user ON tournament_registrations(user_id);
CREATE INDEX idx_registrations_payment_status ON tournament_registrations(payment_status);

-- Analytics
CREATE INDEX idx_analytics_tournament_date ON tournament_analytics(tournament_id, date);
CREATE INDEX idx_analytics_org_date ON tournament_analytics(organization_id, date);

-- User roles
CREATE INDEX idx_user_roles_user_org ON user_roles(user_id, organization_id);
CREATE INDEX idx_user_roles_org ON user_roles(organization_id, is_active);
```

## Multi-Tenant Security Considerations

1. **Row-Level Security**: Implement application-level checks to ensure users can only access data within their organization
2. **API Rate Limiting**: Per-organization rate limits to prevent abuse
3. **Data Encryption**: Sensitive data (payment info, personal details) encrypted at rest
4. **Audit Logging**: Track all data modifications with user attribution
5. **Backup Strategy**: Per-tenant backup and restore capabilities

## Subscription Tiers

### Free Tier

- 1 active tournament
- Basic templates
- Up to 100 registrations
- Standard support

### Pro Tier ($29/month)

- Unlimited tournaments
- Premium templates
- Custom branding
- Analytics dashboard
- Email marketing tools
- Priority support

### Enterprise Tier ($99/month)

- All Pro features
- Custom domains
- Advanced analytics
- API access
- Webhook integrations
- White-label options
- Dedicated support

This schema provides a robust foundation for a scalable, multi-tenant golf tournament management platform with comprehensive features for payment processing, analytics, customization, and third-party integrations.
