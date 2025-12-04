import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";

// Permission and Role Types
export interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  is_system_role: boolean;
  created_at: string;
}

export interface UserRole {
  user_id: number;
  role_id: string;
  assigned_by: number;
  assigned_at: string;
  expires_at?: string;
}

// Define all available permissions
export const PERMISSIONS: Permission[] = [
  // Content Management Permissions
  {
    id: "cms.pages.view",
    name: "View Pages",
    category: "Content Management",
    description: "View website pages and content",
    resource: "cms",
    action: "view",
  },
  {
    id: "cms.pages.edit",
    name: "Edit Pages",
    category: "Content Management",
    description: "Edit website pages and content",
    resource: "cms",
    action: "edit",
  },
  {
    id: "cms.media.upload",
    name: "Upload Media",
    category: "Content Management",
    description: "Upload and manage media files",
    resource: "media",
    action: "upload",
  },
  {
    id: "cms.themes.customize",
    name: "Customize Themes",
    category: "Content Management",
    description: "Customize website themes and branding",
    resource: "themes",
    action: "customize",
  },

  // Tournament Management Permissions
  {
    id: "tournaments.view",
    name: "View Tournaments",
    category: "Tournament Management",
    description: "View tournament information",
    resource: "tournaments",
    action: "view",
  },
  {
    id: "tournaments.create",
    name: "Create Tournaments",
    category: "Tournament Management",
    description: "Create new tournaments",
    resource: "tournaments",
    action: "create",
  },
  {
    id: "tournaments.edit",
    name: "Edit Tournaments",
    category: "Tournament Management",
    description: "Edit tournament settings and details",
    resource: "tournaments",
    action: "edit",
  },
  {
    id: "players.view",
    name: "View Players",
    category: "Tournament Management",
    description: "View player registrations and profiles",
    resource: "players",
    action: "view",
  },
  {
    id: "players.manage",
    name: "Manage Players",
    category: "Tournament Management",
    description: "Add, edit, and manage player registrations",
    resource: "players",
    action: "manage",
  },
  {
    id: "teams.view",
    name: "View Teams",
    category: "Tournament Management",
    description: "View team formations and assignments",
    resource: "teams",
    action: "view",
  },
  {
    id: "teams.manage",
    name: "Manage Teams",
    category: "Tournament Management",
    description: "Create and manage team formations",
    resource: "teams",
    action: "manage",
  },

  // Financial Management Permissions
  {
    id: "payments.view",
    name: "View Payments",
    category: "Financial Management",
    description: "View payment transactions and status",
    resource: "payments",
    action: "view",
  },
  {
    id: "payments.process",
    name: "Process Payments",
    category: "Financial Management",
    description: "Process payments and handle transactions",
    resource: "payments",
    action: "process",
  },
  {
    id: "expenses.view",
    name: "View Expenses",
    category: "Financial Management",
    description: "View tournament expenses and budgets",
    resource: "expenses",
    action: "view",
  },
  {
    id: "expenses.manage",
    name: "Manage Expenses",
    category: "Financial Management",
    description: "Add and manage tournament expenses",
    resource: "expenses",
    action: "manage",
  },
  {
    id: "reports.financial",
    name: "Financial Reports",
    category: "Financial Management",
    description: "Generate and view financial reports",
    resource: "reports",
    action: "view",
  },

  // Task Management Permissions
  {
    id: "tasks.view",
    name: "View Tasks",
    category: "Task Management",
    description: "View tasks and project status",
    resource: "tasks",
    action: "view",
  },
  {
    id: "tasks.create",
    name: "Create Tasks",
    category: "Task Management",
    description: "Create new tasks and projects",
    resource: "tasks",
    action: "create",
  },
  {
    id: "tasks.assign",
    name: "Assign Tasks",
    category: "Task Management",
    description: "Assign tasks to team members",
    resource: "tasks",
    action: "assign",
  },
  {
    id: "tasks.manage",
    name: "Manage Tasks",
    category: "Task Management",
    description: "Edit, complete, and manage all tasks",
    resource: "tasks",
    action: "manage",
  },

  // Communication Permissions
  {
    id: "communications.send",
    name: "Send Communications",
    category: "Communications",
    description: "Send emails, SMS, and notifications",
    resource: "communications",
    action: "send",
  },
  {
    id: "communications.campaigns",
    name: "Manage Campaigns",
    category: "Communications",
    description: "Create and manage communication campaigns",
    resource: "communications",
    action: "manage",
  },

  // Analytics Permissions
  {
    id: "analytics.view",
    name: "View Analytics",
    category: "Analytics",
    description: "View performance metrics and reports",
    resource: "analytics",
    action: "view",
  },

  // System Administration Permissions
  {
    id: "users.view",
    name: "View Users",
    category: "User Management",
    description: "View admin users and their information",
    resource: "users",
    action: "view",
  },
  {
    id: "users.manage",
    name: "Manage Users",
    category: "User Management",
    description: "Create, edit, and manage admin users",
    resource: "users",
    action: "manage",
  },
  {
    id: "roles.manage",
    name: "Manage Roles",
    category: "User Management",
    description: "Create and manage user roles and permissions",
    resource: "roles",
    action: "manage",
  },
  {
    id: "settings.view",
    name: "View Settings",
    category: "System Administration",
    description: "View system configuration settings",
    resource: "settings",
    action: "view",
  },
  {
    id: "settings.manage",
    name: "Manage Settings",
    category: "System Administration",
    description: "Modify system configuration and settings",
    resource: "settings",
    action: "manage",
  },
];

// Define default roles with their permissions
export const DEFAULT_ROLES: Role[] = [
  {
    id: "super_admin",
    name: "Super Administrator",
    description: "Full system access with all permissions",
    permissions: PERMISSIONS.map((p) => p.id), // All permissions
    is_system_role: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "tournament_director",
    name: "Tournament Director",
    description: "Complete tournament management access",
    permissions: [
      "tournaments.view",
      "tournaments.create",
      "tournaments.edit",
      "players.view",
      "players.manage",
      "teams.view",
      "teams.manage",
      "payments.view",
      "expenses.view",
      "reports.financial",
      "tasks.view",
      "tasks.create",
      "tasks.assign",
      "tasks.manage",
      "communications.send",
      "communications.campaigns",
      "analytics.view",
    ],
    is_system_role: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "content_editor",
    name: "Content Editor",
    description: "Website content management access",
    permissions: [
      "cms.pages.view",
      "cms.pages.edit",
      "cms.media.upload",
      "cms.themes.customize",
      "tournaments.view",
      "analytics.view",
    ],
    is_system_role: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "financial_manager",
    name: "Financial Manager",
    description: "Financial data and payment management access",
    permissions: [
      "tournaments.view",
      "players.view",
      "payments.view",
      "payments.process",
      "expenses.view",
      "expenses.manage",
      "reports.financial",
      "analytics.view",
    ],
    is_system_role: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "volunteer_coordinator",
    name: "Volunteer Coordinator",
    description: "Task management and communication access",
    permissions: [
      "tournaments.view",
      "players.view",
      "tasks.view",
      "tasks.create",
      "tasks.assign",
      "tasks.manage",
      "communications.send",
      "communications.campaigns",
    ],
    is_system_role: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "registration_manager",
    name: "Registration Manager",
    description: "Player and team registration management",
    permissions: [
      "tournaments.view",
      "players.view",
      "players.manage",
      "teams.view",
      "teams.manage",
      "payments.view",
      "communications.send",
    ],
    is_system_role: true,
    created_at: new Date().toISOString(),
  },
];

// Permission store
export const permissions = writable<Permission[]>(PERMISSIONS);
export const roles = writable<Role[]>(DEFAULT_ROLES);
export const userRoles = writable<UserRole[]>([]);

// Permission checking utilities
export const permissionChecker = derived(
  [permissions, roles, userRoles],
  ([$permissions, $roles, $userRoles]) => {
    return {
      // Check if user has specific permission
      hasPermission: (userId: number, permissionId: string): boolean => {
        const userRole = $userRoles.find((ur) => ur.user_id === userId);
        if (!userRole) return false;

        const role = $roles.find((r) => r.id === userRole.role_id);
        if (!role) return false;

        return role.permissions.includes(permissionId);
      },

      // Check if user has any permission from a list
      hasAnyPermission: (userId: number, permissionIds: string[]): boolean => {
        const userRole = $userRoles.find((ur) => ur.user_id === userId);
        if (!userRole) return false;
        const role = $roles.find((r) => r.id === userRole.role_id);
        if (!role) return false;
        return permissionIds.some((permId) =>
          role.permissions.includes(permId)
        );
      },

      // Check if user has all permissions from a list
      hasAllPermissions: (userId: number, permissionIds: string[]): boolean => {
        const userRole = $userRoles.find((ur) => ur.user_id === userId);
        if (!userRole) return false;
        const role = $roles.find((r) => r.id === userRole.role_id);
        if (!role) return false;
        return permissionIds.every((permId) =>
          role.permissions.includes(permId)
        );
      },

      // Get all permissions for a user
      getUserPermissions: (userId: number): Permission[] => {
        const userRole = $userRoles.find((ur) => ur.user_id === userId);
        if (!userRole) return [];

        const role = $roles.find((r) => r.id === userRole.role_id);
        if (!role) return [];

        return $permissions.filter((p) => role.permissions.includes(p.id));
      },

      // Get user's role
      getUserRole: (userId: number): Role | null => {
        const userRole = $userRoles.find((ur) => ur.user_id === userId);
        if (!userRole) return null;

        return $roles.find((r) => r.id === userRole.role_id) || null;
      },

      // Check if user can access a resource/action combination
      canAccess: (
        userId: number,
        resource: string,
        action: string
      ): boolean => {
        const userRole = $userRoles.find((ur) => ur.user_id === userId);
        if (!userRole) return false;
        const role = $roles.find((r) => r.id === userRole.role_id);
        if (!role) return false;
        const userPermissions = $permissions.filter((p) =>
          role.permissions.includes(p.id)
        );
        return userPermissions.some(
          (p: Permission) => p.resource === resource && p.action === action
        );
      },
    };
  }
);

// Role management actions
export const roleActions = {
  // Assign role to user
  assignRole: (userId: number, roleId: string, assignedBy: number) => {
    userRoles.update((roles) => {
      // Remove existing role for user
      const filtered = roles.filter((r) => r.user_id !== userId);

      // Add new role assignment
      filtered.push({
        user_id: userId,
        role_id: roleId,
        assigned_by: assignedBy,
        assigned_at: new Date().toISOString(),
      });

      // Store in localStorage if available
      if (browser) {
        localStorage.setItem("userRoles", JSON.stringify(filtered));
      }

      return filtered;
    });
  },

  // Remove role from user
  removeRole: (userId: number) => {
    userRoles.update((roles) => {
      const filtered = roles.filter((r) => r.user_id !== userId);

      if (browser) {
        localStorage.setItem("userRoles", JSON.stringify(filtered));
      }

      return filtered;
    });
  },

  // Create custom role
  createRole: (role: Omit<Role, "id" | "created_at">) => {
    roles.update((roles) => {
      const newRole: Role = {
        ...role,
        id: `custom_${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      const updated = [...roles, newRole];

      if (browser) {
        localStorage.setItem("roles", JSON.stringify(updated));
      }

      return updated;
    });
  },

  // Load user roles from localStorage
  loadUserRoles: () => {
    if (!browser) return;

    try {
      const stored = localStorage.getItem("userRoles");
      if (stored) {
        userRoles.set(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load user roles:", error);
    }
  },

  // Initialize with admin user role (for demo)
  initializeDefaultRoles: (adminUserId: number = 1) => {
    roleActions.loadUserRoles();

    // Check if admin already has a role
    const currentRoles = browser
      ? JSON.parse(localStorage.getItem("userRoles") || "[]")
      : [];

    const adminHasRole = currentRoles.some(
      (r: UserRole) => r.user_id === adminUserId
    );

    if (!adminHasRole) {
      // Assign super_admin role to the first admin user
      roleActions.assignRole(adminUserId, "super_admin", adminUserId);
    }
  },
};
