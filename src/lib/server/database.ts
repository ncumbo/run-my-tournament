import Database from "better-sqlite3";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import bcrypt from "bcryptjs";

// Database path
const DB_DIR = join(process.cwd(), "data");
const DB_PATH = join(DB_DIR, "tournament.db");

// Ensure data directory exists
if (!existsSync(DB_DIR)) {
  mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Database schema
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "admin" | "super_admin";
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface Registration {
  id: number;
  participant_name: string;
  email: string;
  phone?: string;
  company?: string;
  registration_type: "individual" | "foursome";
  amount: number;
  status: "pending" | "confirmed" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  special_requests?: string;
  created_at: string;
  updated_at: string;
  created_by_admin?: number;
}

export interface TournamentSettings {
  id: number;
  key: string;
  value: string;
  updated_at: string;
  updated_by: number;
}

export interface TournamentBracket {
  id: number;
  name: string;
  tournament_date: string;
  status: "draft" | "active" | "completed";
  bracket_type: "championship" | "consolation" | "skills";
  created_at: string;
  created_by: number;
}

export interface TournamentPairing {
  id: number;
  bracket_id: number;
  pairing_number: number;
  tee_time: string;
  hole_assignment: number;
  status: "scheduled" | "in_progress" | "completed";
  created_at: string;
}

export interface PairingPlayer {
  id: number;
  pairing_id: number;
  registration_id: number;
  player_name: string;
  handicap?: number;
  position_in_group: number;
}

export interface TournamentScore {
  id: number;
  pairing_id: number;
  registration_id: number;
  player_name: string;
  hole_number: number;
  strokes: number;
  putts?: number;
  penalties?: number;
  notes?: string;
  recorded_by: number;
  recorded_at: string;
}

export interface Leaderboard {
  id: number;
  bracket_id: number;
  registration_id: number;
  team_name: string;
  total_strokes: number;
  total_score_to_par: number;
  holes_completed: number;
  position: number;
  is_tied: boolean;
  updated_at: string;
}

export interface Sponsor {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  sponsorship_level:
    | "title"
    | "presenting"
    | "gold"
    | "silver"
    | "bronze"
    | "hole"
    | "cart"
    | "beverage";
  amount: number;
  benefits: string;
  logo_url?: string;
  website_url?: string;
  status: "pending" | "confirmed" | "paid" | "cancelled";
  hole_assignment?: number;
  created_at: string;
  created_by: number;
}

export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role:
    | "registration"
    | "scoring"
    | "marshal"
    | "beverage"
    | "food"
    | "setup"
    | "cleanup"
    | "photography";
  assignment_location?: string;
  start_time?: string;
  end_time?: string;
  status: "registered" | "confirmed" | "checked_in" | "completed";
  notes?: string;
  created_at: string;
  created_by?: number;
}

export interface CheckIn {
  id: number;
  registration_id: number;
  player_name: string;
  checked_in_at: string;
  checked_in_by: number;
  cart_number?: string;
  starting_hole: number;
  notes?: string;
}

export interface MediaGallery {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  file_type: "image" | "video";
  file_size: number;
  thumbnail_path?: string;
  tags?: string;
  is_featured: boolean;
  is_public: boolean;
  uploaded_by: number;
  uploaded_at: string;
}

export interface SocialPost {
  id: number;
  platform: "facebook" | "twitter" | "instagram" | "linkedin";
  content: string;
  media_id?: number;
  post_url?: string;
  status: "draft" | "scheduled" | "posted" | "failed";
  scheduled_for?: string;
  posted_at?: string;
  created_by: number;
  created_at: string;
}

// Initialize database tables
function initializeDatabase() {
  // Admin users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'super_admin')) DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      is_active BOOLEAN DEFAULT 1
    )
  `);

  // Registrations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participant_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      registration_type TEXT CHECK(registration_type IN ('individual', 'foursome')) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
      payment_status TEXT CHECK(payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
      special_requests TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by_admin INTEGER,
      FOREIGN KEY (created_by_admin) REFERENCES admin_users(id)
    )
  `);

  // Tournament settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tournament_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    )
  `);

  // Tournament brackets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tournament_brackets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      tournament_date TEXT NOT NULL,
      status TEXT CHECK(status IN ('draft', 'active', 'completed')) DEFAULT 'draft',
      bracket_type TEXT CHECK(bracket_type IN ('championship', 'consolation', 'skills')) DEFAULT 'championship',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `);

  // Tournament pairings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tournament_pairings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bracket_id INTEGER NOT NULL,
      pairing_number INTEGER NOT NULL,
      tee_time TEXT NOT NULL,
      hole_assignment INTEGER NOT NULL,
      status TEXT CHECK(status IN ('scheduled', 'in_progress', 'completed')) DEFAULT 'scheduled',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bracket_id) REFERENCES tournament_brackets(id)
    )
  `);

  // Pairing players table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pairing_players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pairing_id INTEGER NOT NULL,
      registration_id INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      handicap INTEGER,
      position_in_group INTEGER NOT NULL,
      FOREIGN KEY (pairing_id) REFERENCES tournament_pairings(id),
      FOREIGN KEY (registration_id) REFERENCES registrations(id)
    )
  `);

  // Tournament scores table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tournament_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pairing_id INTEGER NOT NULL,
      registration_id INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      hole_number INTEGER NOT NULL,
      strokes INTEGER NOT NULL,
      putts INTEGER,
      penalties INTEGER DEFAULT 0,
      notes TEXT,
      recorded_by INTEGER NOT NULL,
      recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pairing_id) REFERENCES tournament_pairings(id),
      FOREIGN KEY (registration_id) REFERENCES registrations(id),
      FOREIGN KEY (recorded_by) REFERENCES admin_users(id)
    )
  `);

  // Leaderboard table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bracket_id INTEGER NOT NULL,
      registration_id INTEGER NOT NULL,
      team_name TEXT NOT NULL,
      total_strokes INTEGER NOT NULL,
      total_score_to_par INTEGER NOT NULL,
      holes_completed INTEGER NOT NULL,
      position INTEGER NOT NULL,
      is_tied BOOLEAN DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bracket_id) REFERENCES tournament_brackets(id),
      FOREIGN KEY (registration_id) REFERENCES registrations(id)
    )
  `);

  // Sponsors table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sponsors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_person TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      sponsorship_level TEXT CHECK(sponsorship_level IN ('title', 'presenting', 'gold', 'silver', 'bronze', 'hole', 'cart', 'beverage')) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      benefits TEXT NOT NULL,
      logo_url TEXT,
      website_url TEXT,
      status TEXT CHECK(status IN ('pending', 'confirmed', 'paid', 'cancelled')) DEFAULT 'pending',
      hole_assignment INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `);

  // Volunteers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS volunteers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      role TEXT CHECK(role IN ('registration', 'scoring', 'marshal', 'beverage', 'food', 'setup', 'cleanup', 'photography')) NOT NULL,
      assignment_location TEXT,
      start_time TEXT,
      end_time TEXT,
      status TEXT CHECK(status IN ('registered', 'confirmed', 'checked_in', 'completed')) DEFAULT 'registered',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `);

  // Check-in table
  db.exec(`
    CREATE TABLE IF NOT EXISTS check_ins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      registration_id INTEGER NOT NULL,
      player_name TEXT NOT NULL,
      checked_in_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      checked_in_by INTEGER NOT NULL,
      cart_number TEXT,
      starting_hole INTEGER NOT NULL,
      notes TEXT,
      FOREIGN KEY (registration_id) REFERENCES registrations(id),
      FOREIGN KEY (checked_in_by) REFERENCES admin_users(id)
    )
  `);

  // Media gallery table
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT NOT NULL,
      file_type TEXT CHECK(file_type IN ('image', 'video')) NOT NULL,
      file_size INTEGER NOT NULL,
      thumbnail_path TEXT,
      tags TEXT,
      is_featured BOOLEAN DEFAULT 0,
      is_public BOOLEAN DEFAULT 1,
      uploaded_by INTEGER NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (uploaded_by) REFERENCES admin_users(id)
    )
  `);

  // Social posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS social_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform TEXT CHECK(platform IN ('facebook', 'twitter', 'instagram', 'linkedin')) NOT NULL,
      content TEXT NOT NULL,
      media_id INTEGER,
      post_url TEXT,
      status TEXT CHECK(status IN ('draft', 'scheduled', 'posted', 'failed')) DEFAULT 'draft',
      scheduled_for DATETIME,
      posted_at DATETIME,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (media_id) REFERENCES media_gallery(id),
      FOREIGN KEY (created_by) REFERENCES admin_users(id)
    )
  `);

  // Create triggers for updated_at
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_admin_users_updated_at
    AFTER UPDATE ON admin_users
    BEGIN
      UPDATE admin_users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_registrations_updated_at
    AFTER UPDATE ON registrations
    BEGIN
      UPDATE registrations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_tournament_settings_updated_at
    AFTER UPDATE ON tournament_settings
    BEGIN
      UPDATE tournament_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  // Insert default admin user if none exists
  const adminCount = db
    .prepare("SELECT COUNT(*) as count FROM admin_users")
    .get() as { count: number };

  if (adminCount.count === 0) {
    const defaultPasswordHash = bcrypt.hashSync("admin123", 12);
    db.prepare(
      `
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `
    ).run(
      "Tournament Admin",
      "admin@ibm.com",
      defaultPasswordHash,
      "super_admin"
    );

    console.log("Default admin user created: admin@ibm.com / admin123");
  }

  // Insert default tournament settings
  const settingsCount = db
    .prepare("SELECT COUNT(*) as count FROM tournament_settings")
    .get() as { count: number };

  if (settingsCount.count === 0) {
    const defaultSettings = [
      { key: "tournament_title", value: "IBM Charity Golf Tournament" },
      { key: "tournament_date", value: "2026-06-12" },
      { key: "tournament_time", value: "12:00 PM EST" },
      { key: "charity_name", value: "CHARITY TBD" },
      { key: "fundraising_goal", value: "$25,000+" },
      { key: "tournament_format", value: "18-Hole Scramble" },
      { key: "individual_price", value: "150" },
      { key: "foursome_price", value: "550" },
      { key: "registration_deadline", value: "2026-05-15" },
    ];

    const insertSetting = db.prepare(`
      INSERT INTO tournament_settings (key, value, updated_by)
      VALUES (?, ?, ?)
    `);

    for (const setting of defaultSettings) {
      insertSetting.run(setting.key, setting.value, 1); // Default admin user ID
    }

    console.log("Default tournament settings initialized");
  }
}

// Admin User Operations
export const adminOperations = {
  // Create new admin user
  createAdmin: (
    name: string,
    email: string,
    password: string,
    role: "admin" | "super_admin" = "admin"
  ) => {
    const passwordHash = bcrypt.hashSync(password, 12);
    const stmt = db.prepare(`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(name, email, passwordHash, role);
  },

  // Get admin by email
  getAdminByEmail: (email: string): AdminUser | null => {
    const stmt = db.prepare(
      "SELECT * FROM admin_users WHERE email = ? AND is_active = 1"
    );
    return stmt.get(email) as AdminUser | null;
  },

  // Get admin by ID
  getAdminById: (id: number): AdminUser | null => {
    const stmt = db.prepare(
      "SELECT * FROM admin_users WHERE id = ? AND is_active = 1"
    );
    return stmt.get(id) as AdminUser | null;
  },

  // Verify password
  verifyPassword: (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
  },

  // Update last login
  updateLastLogin: (id: number) => {
    const stmt = db.prepare(
      "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?"
    );
    return stmt.run(id);
  },

  // Get all admins
  getAllAdmins: (): AdminUser[] => {
    const stmt = db.prepare(
      "SELECT * FROM admin_users WHERE is_active = 1 ORDER BY created_at DESC"
    );
    return stmt.all() as AdminUser[];
  },

  // Deactivate admin
  deactivateAdmin: (id: number) => {
    const stmt = db.prepare(
      "UPDATE admin_users SET is_active = 0 WHERE id = ?"
    );
    return stmt.run(id);
  },
};

// Registration Operations
export const registrationOperations = {
  // Create new registration
  createRegistration: (data: Partial<Registration>) => {
    const stmt = db.prepare(`
      INSERT INTO registrations (
        participant_name, email, phone, company, registration_type, 
        amount, status, payment_status, special_requests, created_by_admin
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.participant_name,
      data.email,
      data.phone,
      data.company,
      data.registration_type,
      data.amount,
      data.status || "pending",
      data.payment_status || "pending",
      data.special_requests,
      data.created_by_admin
    );
  },

  // Get all registrations
  getAllRegistrations: (): Registration[] => {
    const stmt = db.prepare(
      "SELECT * FROM registrations ORDER BY created_at DESC"
    );
    return stmt.all() as Registration[];
  },

  // Get registration by ID
  getRegistrationById: (id: number): Registration | null => {
    const stmt = db.prepare("SELECT * FROM registrations WHERE id = ?");
    return stmt.get(id) as Registration | null;
  },

  // Update registration status
  updateRegistrationStatus: (id: number, status: Registration["status"]) => {
    const stmt = db.prepare("UPDATE registrations SET status = ? WHERE id = ?");
    return stmt.run(status, id);
  },

  // Update payment status
  updatePaymentStatus: (
    id: number,
    paymentStatus: Registration["payment_status"]
  ) => {
    const stmt = db.prepare(
      "UPDATE registrations SET payment_status = ? WHERE id = ?"
    );
    return stmt.run(paymentStatus, id);
  },

  // Get registration statistics
  getRegistrationStats: () => {
    const totalRegistrations = db
      .prepare("SELECT COUNT(*) as count FROM registrations")
      .get() as { count: number };
    const confirmedRegistrations = db
      .prepare(
        'SELECT COUNT(*) as count FROM registrations WHERE status = "confirmed"'
      )
      .get() as { count: number };
    const totalRevenue = db
      .prepare(
        'SELECT SUM(amount) as total FROM registrations WHERE payment_status = "paid"'
      )
      .get() as { total: number };

    return {
      total: totalRegistrations.count,
      confirmed: confirmedRegistrations.count,
      revenue: totalRevenue.total || 0,
    };
  },
};

// Tournament Settings Operations
export const settingsOperations = {
  // Get setting by key
  getSetting: (key: string): string | null => {
    const stmt = db.prepare(
      "SELECT value FROM tournament_settings WHERE key = ?"
    );
    const result = stmt.get(key) as { value: string } | null;
    return result?.value || null;
  },

  // Get all settings
  getAllSettings: (): Record<string, string> => {
    const stmt = db.prepare("SELECT key, value FROM tournament_settings");
    const results = stmt.all() as { key: string; value: string }[];
    return results.reduce(
      (acc, { key, value }) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );
  },

  // Update setting
  updateSetting: (key: string, value: string, updatedBy: number) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO tournament_settings (key, value, updated_by)
      VALUES (?, ?, ?)
    `);
    return stmt.run(key, value, updatedBy);
  },

  // Update multiple settings
  updateMultipleSettings: (
    settings: Record<string, string>,
    updatedBy: number
  ) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO tournament_settings (key, value, updated_by)
      VALUES (?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, value, updatedBy);
      }
    });

    return transaction();
  },
};

// Tournament Bracket Operations
export const bracketOperations = {
  createBracket: (
    name: string,
    tournamentDate: string,
    bracketType: TournamentBracket["bracket_type"],
    createdBy: number
  ) => {
    const stmt = db.prepare(`
      INSERT INTO tournament_brackets (name, tournament_date, bracket_type, created_by)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(name, tournamentDate, bracketType, createdBy);
  },

  getAllBrackets: (): TournamentBracket[] => {
    const stmt = db.prepare(
      "SELECT * FROM tournament_brackets ORDER BY created_at DESC"
    );
    return stmt.all() as TournamentBracket[];
  },

  updateBracketStatus: (id: number, status: TournamentBracket["status"]) => {
    const stmt = db.prepare(
      "UPDATE tournament_brackets SET status = ? WHERE id = ?"
    );
    return stmt.run(status, id);
  },
};

// Tournament Pairing Operations
export const pairingOperations = {
  createPairing: (
    bracketId: number,
    pairingNumber: number,
    teeTime: string,
    holeAssignment: number
  ) => {
    const stmt = db.prepare(`
      INSERT INTO tournament_pairings (bracket_id, pairing_number, tee_time, hole_assignment)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(bracketId, pairingNumber, teeTime, holeAssignment);
  },

  addPlayerToPairing: (
    pairingId: number,
    registrationId: number,
    playerName: string,
    handicap: number | null,
    position: number
  ) => {
    const stmt = db.prepare(`
      INSERT INTO pairing_players (pairing_id, registration_id, player_name, handicap, position_in_group)
      VALUES (?, ?, ?, ?, ?)
    `);
    return stmt.run(pairingId, registrationId, playerName, handicap, position);
  },

  getPairingsByBracket: (bracketId: number) => {
    const stmt = db.prepare(`
      SELECT p.*, pp.player_name, pp.handicap, pp.position_in_group
      FROM tournament_pairings p
      LEFT JOIN pairing_players pp ON p.id = pp.pairing_id
      WHERE p.bracket_id = ?
      ORDER BY p.pairing_number, pp.position_in_group
    `);
    return stmt.all(bracketId);
  },
};

// Tournament Scoring Operations
export const scoringOperations = {
  recordScore: (
    pairingId: number,
    registrationId: number,
    playerName: string,
    holeNumber: number,
    strokes: number,
    putts: number | null,
    penalties: number,
    notes: string | null,
    recordedBy: number
  ) => {
    const stmt = db.prepare(`
      INSERT INTO tournament_scores (pairing_id, registration_id, player_name, hole_number, strokes, putts, penalties, notes, recorded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      pairingId,
      registrationId,
      playerName,
      holeNumber,
      strokes,
      putts,
      penalties,
      notes,
      recordedBy
    );
  },

  getScoresByPairing: (pairingId: number) => {
    const stmt = db.prepare(
      "SELECT * FROM tournament_scores WHERE pairing_id = ? ORDER BY hole_number"
    );
    return stmt.all(pairingId);
  },

  updateLeaderboard: (
    bracketId: number,
    registrationId: number,
    teamName: string,
    totalStrokes: number,
    totalScoreToPar: number,
    holesCompleted: number
  ) => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO leaderboard
      (bracket_id, registration_id, team_name, total_strokes, total_score_to_par, holes_completed, position, is_tied)
      VALUES (?, ?, ?, ?, ?, ?, 0, 0)
    `);
    return stmt.run(
      bracketId,
      registrationId,
      teamName,
      totalStrokes,
      totalScoreToPar,
      holesCompleted
    );
  },

  getLeaderboard: (bracketId: number): Leaderboard[] => {
    const stmt = db.prepare(
      "SELECT * FROM leaderboard WHERE bracket_id = ? ORDER BY position"
    );
    return stmt.all(bracketId) as Leaderboard[];
  },
};

// Sponsor Operations
export const sponsorOperations = {
  createSponsor: (data: Omit<Sponsor, "id" | "created_at">) => {
    const stmt = db.prepare(`
      INSERT INTO sponsors (name, contact_person, email, phone, sponsorship_level, amount, benefits, logo_url, website_url, status, hole_assignment, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.name,
      data.contact_person,
      data.email,
      data.phone,
      data.sponsorship_level,
      data.amount,
      data.benefits,
      data.logo_url,
      data.website_url,
      data.status,
      data.hole_assignment,
      data.created_by
    );
  },

  getAllSponsors: (): Sponsor[] => {
    const stmt = db.prepare("SELECT * FROM sponsors ORDER BY created_at DESC");
    return stmt.all() as Sponsor[];
  },

  updateSponsorStatus: (id: number, status: Sponsor["status"]) => {
    const stmt = db.prepare("UPDATE sponsors SET status = ? WHERE id = ?");
    return stmt.run(status, id);
  },
};

// Volunteer Operations
export const volunteerOperations = {
  registerVolunteer: (data: Omit<Volunteer, "id" | "created_at">) => {
    const stmt = db.prepare(`
      INSERT INTO volunteers (name, email, phone, role, assignment_location, start_time, end_time, status, notes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.name,
      data.email,
      data.phone,
      data.role,
      data.assignment_location,
      data.start_time,
      data.end_time,
      data.status,
      data.notes,
      data.created_by
    );
  },

  getAllVolunteers: (): Volunteer[] => {
    const stmt = db.prepare(
      "SELECT * FROM volunteers ORDER BY created_at DESC"
    );
    return stmt.all() as Volunteer[];
  },

  updateVolunteerStatus: (id: number, status: Volunteer["status"]) => {
    const stmt = db.prepare("UPDATE volunteers SET status = ? WHERE id = ?");
    return stmt.run(status, id);
  },
};

// Check-in Operations
export const checkinOperations = {
  checkInPlayer: (
    registrationId: number,
    playerName: string,
    checkedInBy: number,
    cartNumber: string | null,
    startingHole: number,
    notes: string | null
  ) => {
    const stmt = db.prepare(`
      INSERT INTO check_ins (registration_id, player_name, checked_in_by, cart_number, starting_hole, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      registrationId,
      playerName,
      checkedInBy,
      cartNumber,
      startingHole,
      notes
    );
  },

  getAllCheckIns: (): CheckIn[] => {
    const stmt = db.prepare(
      "SELECT * FROM check_ins ORDER BY checked_in_at DESC"
    );
    return stmt.all() as CheckIn[];
  },

  getCheckInByRegistration: (registrationId: number): CheckIn | null => {
    const stmt = db.prepare(
      "SELECT * FROM check_ins WHERE registration_id = ?"
    );
    return stmt.get(registrationId) as CheckIn | null;
  },
};

// Media Gallery Operations
export const mediaOperations = {
  uploadMedia: (data: Omit<MediaGallery, "id" | "uploaded_at">) => {
    const stmt = db.prepare(`
      INSERT INTO media_gallery (title, description, file_path, file_type, file_size, thumbnail_path, tags, is_featured, is_public, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.title,
      data.description,
      data.file_path,
      data.file_type,
      data.file_size,
      data.thumbnail_path,
      data.tags,
      data.is_featured,
      data.is_public,
      data.uploaded_by
    );
  },

  getAllMedia: (): MediaGallery[] => {
    const stmt = db.prepare(
      "SELECT * FROM media_gallery ORDER BY uploaded_at DESC"
    );
    return stmt.all() as MediaGallery[];
  },

  getPublicMedia: (): MediaGallery[] => {
    const stmt = db.prepare(
      "SELECT * FROM media_gallery WHERE is_public = 1 ORDER BY uploaded_at DESC"
    );
    return stmt.all() as MediaGallery[];
  },
};

// Social Media Operations
export const socialOperations = {
  createPost: (data: Omit<SocialPost, "id" | "created_at">) => {
    const stmt = db.prepare(`
      INSERT INTO social_posts (platform, content, media_id, post_url, status, scheduled_for, posted_at, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.platform,
      data.content,
      data.media_id,
      data.post_url,
      data.status,
      data.scheduled_for,
      data.posted_at,
      data.created_by
    );
  },

  getAllPosts: (): SocialPost[] => {
    const stmt = db.prepare(
      "SELECT * FROM social_posts ORDER BY created_at DESC"
    );
    return stmt.all() as SocialPost[];
  },

  updatePostStatus: (
    id: number,
    status: SocialPost["status"],
    postUrl?: string,
    postedAt?: string
  ) => {
    const stmt = db.prepare(`
      UPDATE social_posts
      SET status = ?, post_url = COALESCE(?, post_url), posted_at = COALESCE(?, posted_at)
      WHERE id = ?
    `);
    return stmt.run(status, postUrl, postedAt, id);
  },
};

// Initialize the database
initializeDatabase();

export { db };
