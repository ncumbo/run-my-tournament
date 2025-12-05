# Pinpoint Golf - Complete Platform Plan

## Vision

Transform the golf tournament site into "Pinpoint Golf" - a free, ad-supported SaaS platform where users can create and host professional golf tournament websites.

## Business Model

- **Free Platform**: No subscription fees for tournament directors
- **Ad Revenue**: Strategic advertising on tournament sites
- **Revenue Sharing**: Optional 70/30 split with tournament organizers
- **Premium Features**: Custom domains, advanced analytics (optional paid)

## User System Architecture

### Unified User Accounts

Single account system where users can be both **participants** (play in tournaments) and **tournament directors** (host tournaments):

```typescript
interface User {
  id: string;
  email: string;
  personalInfo: { firstName: string; lastName: string; phone?: string };
  golfProfile: { handicap?: number; experience: string };
  roles: UserRole[]; // Can have multiple roles
}

interface UserRole {
  type: "participant" | "tournament_director";
  organizationId?: string; // Only for directors
  permissions: Permission[];
}
```

### Role Transitions

- **Participant → Director**: Simple upgrade request creates organization + director role
- **Seamless Switching**: Dashboard shows all available roles
- **Dual Identity**: Can participate in tournaments while directing others

## Database Schema

### Core Tables

```sql
-- Unified user system
users (id, email, password_hash, first_name, last_name, golf_profile, settings)
user_roles (user_id, role_type, organization_id, permissions)

-- Multi-tenant organizations
organizations (id, owner_id, name, subdomain, custom_domain, settings)
tournaments (id, organization_id, name, event_date, pricing, theme_settings)

-- Registrations link users to tournaments
tournament_registrations (id, user_id, tournament_id, amount_paid, status)
tournament_teams (id, tournament_id, team_name, captain_user_id)

-- Revenue tracking
ad_revenue (tournament_id, revenue_date, amount, platform_share, customer_share)
```

## Application Structure

### 1. Marketing Site (pinpointgolf.com)

- **Homepage**: Platform showcase + demo viewer
- **Demo Tabs**:
  - Home (tournament overview, registration preview)
  - Registration (player/sponsor/volunteer signup)
  - About (charity info, event details)
- **Footer**: Quick links (About, Registration, Contact, History)
- **CTA**: "Create Free Tournament Site"

### 2. Admin Portal (admin.pinpointgolf.com)

- **Unified Dashboard**: Switch between participant/director roles
- **Tournament Builder**: Drag-and-drop site creation
- **Registration Management**: View participants, payments
- **Site Customization**: Themes, branding, content editing
- **Analytics**: Traffic, conversions, revenue

### 3. Tournament Sites ({name}.pinpointgolf.com)

- **Dynamic Generation**: Sites created from templates
- **Custom Branding**: Colors, logos, content
- **Integrated Ads**: Non-intrusive, contextual placements
- **Payment Processing**: Direct Stripe integration

## Technical Implementation

### Multi-Tenant Architecture

- **Row-Level Security**: PostgreSQL RLS for data isolation
- **Dynamic Routing**: Subdomain-based site resolution
- **Shared Services**: Payment, email, analytics
- **Template Engine**: Configurable themes and layouts

### API Structure

```
Platform APIs (admin.pinpointgolf.com/api):
├── /auth/* - User authentication & role management
├── /organizations/* - Tournament organization CRUD
├── /tournaments/* - Tournament management
└── /analytics/* - Platform-wide analytics

Tournament APIs ({tournament}.pinpointgolf.com/api):
├── /tournament - Public tournament data
├── /register - Registration submissions
└── /pages/* - Dynamic content
```

### Performance & Scaling

- **CDN Caching**: Static assets + generated pages
- **Redis Cache**: User sessions, tournament configs
- **Database Optimization**: Read replicas, connection pooling
- **Ad Integration**: Google AdSense + direct partnerships

## User Journey

### New Tournament Director

1. **Discovery**: Visit pinpointgolf.com
2. **Signup**: Create user account
3. **Upgrade Request**: Request director role
4. **Auto-Approval**: Organization created instantly
5. **Tournament Setup**: 3-step wizard (info, pricing, branding)
6. **Site Generation**: Professional tournament site created
7. **Launch**: Share registration link, track performance

### Tournament Participant

1. **Find Tournament**: Browse directory or direct link
2. **Quick Registration**: Login fills form automatically
3. **Team Formation**: Create/join teams easily
4. **Payment**: Secure Stripe processing
5. **Tournament History**: Track performance across all events

## Revenue Strategy

### Ad Placements

- **Header Banners**: Golf equipment sponsors
- **Sidebar Ads**: Local business promotions
- **Footer Sponsors**: Tournament partners
- **Contextual Ads**: Relevant to golf/location

### Growth Drivers

- **Participant→Director**: Every player is potential organizer
- **Network Effects**: More tournaments = more value
- **Local Business**: Connect tournaments with sponsors
- **Tournament Discovery**: Platform-wide event directory

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

- [x] Convert current site to demo template
- [ ] Create marketing homepage with demo viewer
- [ ] Build user signup/login system
- [ ] Basic tournament creation wizard

### Phase 2: Core Platform (Weeks 3-4)

- [ ] Multi-tenant database setup
- [ ] Dynamic site generation
- [ ] Registration system integration
- [ ] Payment processing (Stripe)

### Phase 3: Revenue & Growth (Weeks 5-6)

- [ ] Ad placement system
- [ ] Revenue sharing dashboard
- [ ] Tournament directory
- [ ] Advanced customization tools

## Success Metrics

### Platform Growth

- Tournament sites created per month
- Active tournament directors
- Total participant registrations
- Geographic expansion

### Revenue Targets

- Month 1: $500+ in ad revenue
- Month 3: $2000+ monthly recurring revenue
- Month 6: $10000+ monthly recurring revenue
- Year 1: $100000+ annual recurring revenue

## Competitive Advantages

1. **Zero Barriers**: Completely free removes biggest obstacle
2. **Dual User Value**: Participants become directors
3. **Local Focus**: Strong community connections
4. **Professional Quality**: High-end tournament sites
5. **Revenue Sharing**: Directors can make money

This consolidated plan provides everything needed to transform the current golf tournament site into a scalable SaaS platform that serves both tournament participants and directors while generating sustainable revenue through strategic advertising.
