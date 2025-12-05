import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// Database path for customer/platform data
const DB_DIR = join(process.cwd(), "data");
const CUSTOMER_DB_PATH = join(DB_DIR, "platform.db");

// Ensure data directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

// Initialize customer database
const customerDb = new Database(CUSTOMER_DB_PATH);

// Enable foreign keys
customerDb.pragma("foreign_keys = ON");

// Customer database interfaces
export interface CustomerUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image_url?: string;
  handicap?: number;
  golf_experience: string;
  dietary_restrictions?: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  email_verified: boolean;
  email_verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface Organization {
  id: string;
  owner_id: string;
  name: string;
  subdomain?: string;
  custom_domain?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color?: string;
  font_family?: string;
  ad_revenue_share_enabled: boolean;
  subscription_tier: string;
  billing_status: string;
  stripe_customer_id?: string;
  stripe_connect_account_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Tournament {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  event_date: string;
  location_name?: string;
  location_address?: string;
  location_city?: string;
  location_state?: string;
  location_zip?: string;
  individual_price: number;
  team_price?: number;
  max_participants?: number;
  registration_deadline?: string;
  hero_image_url?: string;
  description?: string;
  theme_template: string;
  custom_css?: string;
  charity_name?: string;
  charity_description?: string;
  sponsors_enabled: boolean;
  leaderboard_enabled: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistration {
  id: string;
  user_id: string;
  tournament_id: string;
  registration_type: string;
  team_id?: string;
  amount_paid: number;
  payment_status: string;
  registration_status: string;
  stripe_payment_intent_id?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  organization_id: string;
  role_type: string;
  permissions: string;
  is_active: boolean;
  granted_at: string;
}

export interface BillingSubscription {
  id: string;
  organization_id: string;
  stripe_subscription_id: string;
  tier: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

// Initialize customer database tables
function initializeCustomerDatabase() {
  // Customer users table
  customerDb.exec(`
    CREATE TABLE IF NOT EXISTS customer_users (
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
    )
  `);

  // Organizations table
  customerDb.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
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
    )
  `);

  // Tournaments table
  customerDb.exec(`
    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
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
      custom_css TEXT,
      charity_name TEXT,
      charity_description TEXT,
      sponsors_enabled BOOLEAN DEFAULT 1,
      leaderboard_enabled BOOLEAN DEFAULT 1,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      UNIQUE(organization_id, slug)
    )
  `);

  // Tournament registrations table
  customerDb.exec(`
    CREATE TABLE IF NOT EXISTS tournament_registrations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tournament_id TEXT NOT NULL,
      registration_type TEXT NOT NULL,
      team_id TEXT,
      amount_paid DECIMAL(8,2) NOT NULL,
      payment_status TEXT DEFAULT 'pending',
      registration_status TEXT DEFAULT 'pending',
      stripe_payment_intent_id TEXT,
      special_requests TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES customer_users(id),
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
      UNIQUE(user_id, tournament_id)
    )
  `);

  // User roles table
  customerDb.exec(`
    CREATE TABLE IF NOT EXISTS user_roles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      organization_id TEXT NOT NULL,
      role_type TEXT NOT NULL,
      permissions TEXT DEFAULT '[]',
      is_active BOOLEAN DEFAULT 1,
      granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES customer_users(id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `);

  // Billing subscriptions table
  customerDb.exec(`
    CREATE TABLE IF NOT EXISTS billing_subscriptions (
      id TEXT PRIMARY KEY,
      organization_id TEXT NOT NULL,
      stripe_subscription_id TEXT UNIQUE NOT NULL,
      tier TEXT NOT NULL,
      status TEXT NOT NULL,
      current_period_start DATETIME NOT NULL,
      current_period_end DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for performance
  customerDb.exec(`
    CREATE INDEX IF NOT EXISTS idx_customer_users_email ON customer_users(email);
    CREATE INDEX IF NOT EXISTS idx_organizations_subdomain ON organizations(subdomain);
    CREATE INDEX IF NOT EXISTS idx_organizations_custom_domain ON organizations(custom_domain);
    CREATE INDEX IF NOT EXISTS idx_tournaments_org_status ON tournaments(organization_id, status);
    CREATE INDEX IF NOT EXISTS idx_tournament_registrations_tournament ON tournament_registrations(tournament_id);
    CREATE INDEX IF NOT EXISTS idx_user_roles_user_org ON user_roles(user_id, organization_id);
  `);

  // Create triggers for updated_at
  customerDb.exec(`
    CREATE TRIGGER IF NOT EXISTS update_customer_users_updated_at
    AFTER UPDATE ON customer_users
    BEGIN
      UPDATE customer_users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  customerDb.exec(`
    CREATE TRIGGER IF NOT EXISTS update_organizations_updated_at
    AFTER UPDATE ON organizations
    BEGIN
      UPDATE organizations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  customerDb.exec(`
    CREATE TRIGGER IF NOT EXISTS update_tournaments_updated_at
    AFTER UPDATE ON tournaments
    BEGIN
      UPDATE tournaments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);
}

// Helper function to generate UUID
function generateId(): string {
  return randomBytes(16).toString("hex");
}

// Helper function to generate subdomain
function generateSubdomain(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30);

  // Check if subdomain exists
  const existing = customerDb
    .prepare("SELECT COUNT(*) as count FROM organizations WHERE subdomain = ?")
    .get(`${base}`) as { count: number };

  if (existing.count === 0) {
    return base;
  }

  // Try with numbers
  for (let i = 1; i <= 100; i++) {
    const candidate = `${base}-${i}`;
    const existingWithNumber = customerDb
      .prepare(
        "SELECT COUNT(*) as count FROM organizations WHERE subdomain = ?"
      )
      .get(candidate) as { count: number };
    if (existingWithNumber.count === 0) {
      return candidate;
    }
  }

  // Fallback to random
  return `${base}-${Math.random().toString(36).substring(2, 8)}`;
}

// Customer User Operations
export const customerUserOperations = {
  // Create new customer user
  createUser: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string
  ) => {
    const id = generateId();
    const passwordHash = bcrypt.hashSync(password, 12);
    const emailVerificationToken = randomBytes(32).toString("hex");

    const stmt = customerDb.prepare(`
      INSERT INTO customer_users (
        id, email, password_hash, first_name, last_name, phone, email_verification_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      emailVerificationToken
    );
    return { id, emailVerificationToken, ...result };
  },

  // Get user by email
  getUserByEmail: (email: string): CustomerUser | null => {
    const stmt = customerDb.prepare(
      "SELECT * FROM customer_users WHERE email = ? AND is_active = 1"
    );
    return stmt.get(email) as CustomerUser | null;
  },

  // Get user by ID
  getUserById: (id: string): CustomerUser | null => {
    const stmt = customerDb.prepare(
      "SELECT * FROM customer_users WHERE id = ? AND is_active = 1"
    );
    return stmt.get(id) as CustomerUser | null;
  },

  // Verify password
  verifyPassword: (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  },

  // Update last login
  updateLastLogin: (id: string) => {
    const stmt = customerDb.prepare(
      "UPDATE customer_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"
    );
    return stmt.run(id);
  },

  // Verify email
  verifyEmail: (token: string) => {
    const stmt = customerDb.prepare(`
      UPDATE customer_users 
      SET email_verified = 1, email_verification_token = NULL 
      WHERE email_verification_token = ?
    `);
    return stmt.run(token);
  },

  // Set password reset token
  setPasswordResetToken: (email: string, token: string, expires: string) => {
    const stmt = customerDb.prepare(`
      UPDATE customer_users 
      SET password_reset_token = ?, password_reset_expires = ? 
      WHERE email = ?
    `);
    return stmt.run(token, expires, email);
  },

  // Reset password
  resetPassword: (token: string, newPassword: string) => {
    const passwordHash = bcrypt.hashSync(newPassword, 12);
    const stmt = customerDb.prepare(`
      UPDATE customer_users 
      SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL
      WHERE password_reset_token = ? AND password_reset_expires > datetime('now')
    `);
    return stmt.run(passwordHash, token);
  },

  // Update profile
  updateProfile: (id: string, updates: Partial<CustomerUser>) => {
    const allowedFields = [
      "first_name",
      "last_name",
      "phone",
      "profile_image_url",
      "handicap",
      "golf_experience",
      "dietary_restrictions",
      "email_notifications",
      "marketing_emails",
    ];
    const fields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key)
    );

    if (fields.length === 0) return null;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field as keyof CustomerUser]);

    const stmt = customerDb.prepare(
      `UPDATE customer_users SET ${setClause} WHERE id = ?`
    );
    return stmt.run(...values, id);
  },
};

// Organization Operations
export const organizationOperations = {
  // Create organization
  createOrganization: (
    ownerId: string,
    name: string,
    primaryColor?: string
  ) => {
    const id = generateId();
    const subdomain = generateSubdomain(name);

    const stmt = customerDb.prepare(`
      INSERT INTO organizations (id, owner_id, name, subdomain, primary_color)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      ownerId,
      name,
      subdomain,
      primaryColor || "#198038"
    );
    return { id, subdomain, ...result };
  },

  // Get organization by ID
  getOrganizationById: (id: string): Organization | null => {
    const stmt = customerDb.prepare(
      "SELECT * FROM organizations WHERE id = ? AND status = 'active'"
    );
    return stmt.get(id) as Organization | null;
  },

  // Get organization by subdomain
  getOrganizationBySubdomain: (subdomain: string): Organization | null => {
    const stmt = customerDb.prepare(
      "SELECT * FROM organizations WHERE subdomain = ? AND status = 'active'"
    );
    return stmt.get(subdomain) as Organization | null;
  },

  // Get organization by custom domain
  getOrganizationByDomain: (domain: string): Organization | null => {
    const stmt = customerDb.prepare(
      "SELECT * FROM organizations WHERE custom_domain = ? AND status = 'active'"
    );
    return stmt.get(domain) as Organization | null;
  },

  // Update organization
  updateOrganization: (id: string, updates: Partial<Organization>) => {
    const allowedFields = [
      "name",
      "logo_url",
      "primary_color",
      "secondary_color",
      "font_family",
      "custom_domain",
    ];
    const fields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key)
    );

    if (fields.length === 0) return null;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field as keyof Organization]);

    const stmt = customerDb.prepare(
      `UPDATE organizations SET ${setClause} WHERE id = ?`
    );
    return stmt.run(...values, id);
  },

  // Get user's organizations
  getUserOrganizations: (userId: string): Organization[] => {
    const stmt = customerDb.prepare(`
      SELECT o.* FROM organizations o
      JOIN user_roles ur ON o.id = ur.organization_id
      WHERE ur.user_id = ? AND ur.is_active = 1 AND o.status = 'active'
      ORDER BY o.created_at DESC
    `);
    return stmt.all(userId) as Organization[];
  },
};

// Tournament Operations
export const tournamentOperations = {
  // Create tournament
  createTournament: (
    data: Omit<Tournament, "id" | "created_at" | "updated_at">
  ) => {
    const id = generateId();
    const stmt = customerDb.prepare(`
      INSERT INTO tournaments (
        id, organization_id, name, slug, event_date, location_name, location_address,
        location_city, location_state, location_zip, individual_price, team_price,
        max_participants, registration_deadline, hero_image_url, description,
        theme_template, charity_name, charity_description, sponsors_enabled,
        leaderboard_enabled, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      data.organization_id,
      data.name,
      data.slug,
      data.event_date,
      data.location_name,
      data.location_address,
      data.location_city,
      data.location_state,
      data.location_zip,
      data.individual_price,
      data.team_price,
      data.max_participants,
      data.registration_deadline,
      data.hero_image_url,
      data.description,
      data.theme_template,
      data.charity_name,
      data.charity_description,
      data.sponsors_enabled,
      data.leaderboard_enabled,
      data.status
    );

    return { id, ...result };
  },

  // Get tournament by ID
  getTournamentById: (id: string): Tournament | null => {
    const stmt = customerDb.prepare("SELECT * FROM tournaments WHERE id = ?");
    return stmt.get(id) as Tournament | null;
  },

  // Get tournament by organization and slug
  getTournamentBySlug: (
    organizationId: string,
    slug: string
  ): Tournament | null => {
    const stmt = customerDb.prepare(
      "SELECT * FROM tournaments WHERE organization_id = ? AND slug = ?"
    );
    return stmt.get(organizationId, slug) as Tournament | null;
  },

  // Get organization tournaments
  getOrganizationTournaments: (organizationId: string): Tournament[] => {
    const stmt = customerDb.prepare(
      "SELECT * FROM tournaments WHERE organization_id = ? ORDER BY created_at DESC"
    );
    return stmt.all(organizationId) as Tournament[];
  },

  // Update tournament
  updateTournament: (id: string, updates: Partial<Tournament>) => {
    const allowedFields = [
      "name",
      "slug",
      "event_date",
      "location_name",
      "location_address",
      "location_city",
      "location_state",
      "location_zip",
      "individual_price",
      "team_price",
      "max_participants",
      "registration_deadline",
      "hero_image_url",
      "description",
      "theme_template",
      "custom_css",
      "charity_name",
      "charity_description",
      "sponsors_enabled",
      "leaderboard_enabled",
      "status",
    ];
    const fields = Object.keys(updates).filter((key) =>
      allowedFields.includes(key)
    );

    if (fields.length === 0) return null;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => updates[field as keyof Tournament]);

    const stmt = customerDb.prepare(
      `UPDATE tournaments SET ${setClause} WHERE id = ?`
    );
    return stmt.run(...values, id);
  },
};

// User Role Operations
export const userRoleOperations = {
  // Grant role
  grantRole: (
    userId: string,
    organizationId: string,
    roleType: string,
    permissions: string[] = []
  ) => {
    const id = generateId();
    const stmt = customerDb.prepare(`
      INSERT INTO user_roles (id, user_id, organization_id, role_type, permissions)
      VALUES (?, ?, ?, ?, ?)
    `);

    return stmt.run(
      id,
      userId,
      organizationId,
      roleType,
      JSON.stringify(permissions)
    );
  },

  // Get user roles
  getUserRoles: (userId: string): UserRole[] => {
    const stmt = customerDb.prepare(`
      SELECT * FROM user_roles
      WHERE user_id = ? AND is_active = 1
      ORDER BY granted_at DESC
    `);
    return stmt.all(userId) as UserRole[];
  },

  // Check user permission
  hasPermission: (
    userId: string,
    organizationId: string,
    permission: string
  ): boolean => {
    const stmt = customerDb.prepare(`
      SELECT permissions FROM user_roles
      WHERE user_id = ? AND organization_id = ? AND is_active = 1
    `);

    const roles = stmt.all(userId, organizationId) as { permissions: string }[];

    for (const role of roles) {
      try {
        const permissions = JSON.parse(role.permissions);
        if (permissions.includes(permission) || permissions.includes("*")) {
          return true;
        }
      } catch (e) {
        continue;
      }
    }

    return false;
  },
};

// Initialize the customer database
initializeCustomerDatabase();

export { customerDb };
