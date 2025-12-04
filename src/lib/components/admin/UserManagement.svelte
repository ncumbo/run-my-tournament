<script lang="ts">
  import { onMount } from "svelte";
  import { Card, Button, Input, Form } from "$lib/components";
  import { auth } from "$lib/stores/auth";
  import {
    roles,
    userRoles,
    roleActions,
    permissionChecker,
    type Role,
    type UserRole,
  } from "$lib/stores/permissions";

  // User management state
  let users: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    last_login?: string;
    is_active: boolean;
  }> = [];

  let showCreateUserModal = false;
  let showEditUserModal = false;
  let selectedUser: any = null;
  let loading = false;
  let error = "";
  let searchTerm = "";
  let filterRole = "all";
  let filterStatus = "all";

  // Form state
  let newUser = {
    name: "",
    email: "",
    password: "",
    role_id: "registration_manager",
  };

  let editUser = {
    id: 0,
    name: "",
    email: "",
    role_id: "",
  };

  $: currentUser = $auth.user;
  $: canManageUsers = currentUser
    ? $permissionChecker.hasPermission(parseInt(currentUser.id), "users.manage")
    : false;
  $: canManageRoles = currentUser
    ? $permissionChecker.hasPermission(parseInt(currentUser.id), "roles.manage")
    : false;

  // Filtered users
  $: filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && user.is_active) ||
      (filterStatus === "inactive" && !user.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // User statistics
  $: userStats = {
    total: users.length,
    active: users.filter((u) => u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
    admins: users.filter((u) => u.role === "super_admin").length,
    directors: users.filter((u) => u.role === "tournament_director").length,
    managers: users.filter((u) => u.role === "registration_manager").length,
  };

  onMount(() => {
    loadUsers();
    roleActions.loadUserRoles();
  });

  async function loadUsers() {
    loading = true;
    try {
      // Mock data for demo - in real app, fetch from API
      users = [
        {
          id: 1,
          name: "Tournament Admin",
          email: "admin@ibm.com",
          role: "super_admin",
          created_at: "2024-01-01T00:00:00Z",
          last_login: "2024-03-15T10:30:00Z",
          is_active: true,
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.johnson@ibm.com",
          role: "tournament_director",
          created_at: "2024-02-15T00:00:00Z",
          last_login: "2024-03-14T14:22:00Z",
          is_active: true,
        },
        {
          id: 3,
          name: "Mike Chen",
          email: "mike.chen@ibm.com",
          role: "registration_manager",
          created_at: "2024-03-01T00:00:00Z",
          last_login: "2024-03-13T09:15:00Z",
          is_active: true,
        },
        {
          id: 4,
          name: "Lisa Wong",
          email: "lisa.wong@ibm.com",
          role: "content_editor",
          created_at: "2024-03-05T00:00:00Z",
          last_login: "2024-03-10T16:45:00Z",
          is_active: false,
        },
      ];
    } catch (err) {
      error = "Failed to load users";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function createUser() {
    if (!newUser.name || !newUser.email || !newUser.password) {
      error = "All fields are required";
      return;
    }

    loading = true;
    error = "";

    try {
      const userId = users.length + 1;

      users = [
        ...users,
        {
          id: userId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role_id,
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ];

      roleActions.assignRole(
        userId,
        newUser.role_id,
        parseInt(currentUser?.id || "1")
      );

      newUser = {
        name: "",
        email: "",
        password: "",
        role_id: "registration_manager",
      };
      showCreateUserModal = false;
    } catch (err) {
      error = "Failed to create user";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function updateUser() {
    loading = true;
    error = "";

    try {
      users = users.map((user) =>
        user.id === editUser.id
          ? {
              ...user,
              name: editUser.name,
              email: editUser.email,
              role: editUser.role_id,
            }
          : user
      );

      roleActions.assignRole(
        editUser.id,
        editUser.role_id,
        parseInt(currentUser?.id || "1")
      );

      showEditUserModal = false;
      selectedUser = null;
    } catch (err) {
      error = "Failed to update user";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function deactivateUser(userId: number) {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    loading = true;
    try {
      users = users.map((user) =>
        user.id === userId ? { ...user, is_active: false } : user
      );

      roleActions.removeRole(userId);
    } catch (err) {
      error = "Failed to deactivate user";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  async function activateUser(userId: number) {
    loading = true;
    try {
      users = users.map((user) =>
        user.id === userId ? { ...user, is_active: true } : user
      );
    } catch (err) {
      error = "Failed to activate user";
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function openEditModal(user: any) {
    selectedUser = user;
    editUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role,
    };
    showEditUserModal = true;
  }

  function getRoleName(roleId: string): string {
    const role = $roles.find((r) => r.id === roleId);
    return role?.name || roleId;
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function clearFilters() {
    searchTerm = "";
    filterRole = "all";
    filterStatus = "all";
  }
</script>

<div class="user-management">
  <!-- Header with Stats -->
  <div class="management-header">
    <div class="header-info">
      <h2>👥 User Management</h2>
      <p>
        Manage admin users, roles, and permissions for the tournament system
      </p>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-number">{userStats.total}</span>
        <span class="stat-label">Total Users</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{userStats.active}</span>
        <span class="stat-label">Active</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{userStats.inactive}</span>
        <span class="stat-label">Inactive</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{userStats.admins + userStats.directors}</span
        >
        <span class="stat-label">Admins</span>
      </div>
    </div>
  </div>

  {#if error}
    <div class="error-message">
      <span>⚠️ {error}</span>
      <button on:click={() => (error = "")}>✕</button>
    </div>
  {/if}

  <!-- Controls Section -->
  <div class="controls-section">
    <div class="search-filters">
      <div class="search-box">
        <Input
          placeholder="Search by name or email..."
          bind:value={searchTerm}
        />
      </div>

      <div class="filter-controls">
        <select bind:value={filterRole} class="filter-select">
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="tournament_director">Tournament Director</option>
          <option value="registration_manager">Registration Manager</option>
          <option value="content_editor">Content Editor</option>
          <option value="financial_manager">Financial Manager</option>
        </select>

        <select bind:value={filterStatus} class="filter-select">
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        {#if searchTerm || filterRole !== "all" || filterStatus !== "all"}
          <Button variant="outline" size="small" onclick={clearFilters}>
            Clear Filters
          </Button>
        {/if}
      </div>
    </div>

    {#if canManageUsers}
      <Button variant="primary" onclick={() => (showCreateUserModal = true)}>
        ➕ Add New User
      </Button>
    {/if}
  </div>

  <!-- Users Grid -->
  <div class="users-grid">
    {#if loading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    {:else if filteredUsers.length === 0}
      <div class="empty-state">
        <div class="empty-icon">👥</div>
        <h3>No users found</h3>
        <p>
          {searchTerm || filterRole !== "all" || filterStatus !== "all"
            ? "Try adjusting your search or filters"
            : "No users have been created yet"}
        </p>
        {#if canManageUsers && !searchTerm && filterRole === "all" && filterStatus === "all"}
          <Button
            variant="primary"
            onclick={() => (showCreateUserModal = true)}
          >
            Create First User
          </Button>
        {/if}
      </div>
    {:else}
      {#each filteredUsers as user (user.id)}
        <Card variant="default" padding="large" hoverable={true}>
          <div class="user-card">
            <div class="user-header">
              <div class="user-avatar" class:inactive={!user.is_active}>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div class="user-info">
                <h4>{user.name}</h4>
                <p class="user-email">{user.email}</p>
                <div class="user-meta">
                  <span class="role-badge role-{user.role}">
                    {getRoleName(user.role)}
                  </span>
                  <span
                    class="status-badge status-{user.is_active
                      ? 'active'
                      : 'inactive'}"
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div class="user-details">
              <div class="detail-row">
                <span class="detail-label">User ID:</span>
                <span class="detail-value">#{user.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Created:</span>
                <span class="detail-value">{formatDate(user.created_at)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Last Login:</span>
                <span class="detail-value">
                  {user.last_login ? formatDate(user.last_login) : "Never"}
                </span>
              </div>
            </div>

            {#if canManageUsers}
              <div class="user-actions">
                <Button
                  variant="outline"
                  size="small"
                  onclick={() => openEditModal(user)}
                >
                  ✏️ Edit
                </Button>

                {#if user.is_active}
                  {#if user.id !== parseInt(currentUser?.id || "0")}
                    <Button
                      variant="outline"
                      size="small"
                      onclick={() => deactivateUser(user.id)}
                    >
                      🚫 Deactivate
                    </Button>
                  {/if}
                {:else}
                  <Button
                    variant="primary"
                    size="small"
                    onclick={() => activateUser(user.id)}
                  >
                    ✅ Activate
                  </Button>
                {/if}
              </div>
            {/if}
          </div>
        </Card>
      {/each}
    {/if}
  </div>

  <!-- Create User Modal -->
  {#if showCreateUserModal}
    <div class="modal-overlay" on:click={() => (showCreateUserModal = false)}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Create New User</h3>
          <button
            class="close-btn"
            on:click={() => (showCreateUserModal = false)}>✕</button
          >
        </div>

        <Form onsubmit={createUser}>
          <Input
            label="Full Name"
            bind:value={newUser.name}
            required
            placeholder="Enter user's full name"
          />

          <Input
            label="Email Address"
            type="email"
            bind:value={newUser.email}
            required
            placeholder="user@ibm.com"
          />

          <Input
            label="Password"
            type="password"
            bind:value={newUser.password}
            required
            placeholder="Enter temporary password"
          />

          <div class="form-group">
            <label for="role">Role</label>
            <select id="role" bind:value={newUser.role_id} required>
              {#each $roles as role}
                <option value={role.id}>{role.name}</option>
              {/each}
            </select>
          </div>

          <div class="modal-actions">
            <Button
              type="button"
              variant="outline"
              onclick={() => (showCreateUserModal = false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  {/if}

  <!-- Edit User Modal -->
  {#if showEditUserModal && selectedUser}
    <div class="modal-overlay" on:click={() => (showEditUserModal = false)}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Edit User: {selectedUser.name}</h3>
          <button class="close-btn" on:click={() => (showEditUserModal = false)}
            >✕</button
          >
        </div>

        <Form onsubmit={updateUser}>
          <Input
            label="Full Name"
            bind:value={editUser.name}
            required
            placeholder="Enter user's full name"
          />

          <Input
            label="Email Address"
            type="email"
            bind:value={editUser.email}
            required
            placeholder="user@ibm.com"
          />

          <div class="form-group">
            <label for="edit-role">Role</label>
            <select id="edit-role" bind:value={editUser.role_id} required>
              {#each $roles as role}
                <option value={role.id}>{role.name}</option>
              {/each}
            </select>
          </div>

          <div class="modal-actions">
            <Button
              type="button"
              variant="outline"
              onclick={() => (showEditUserModal = false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  {/if}
</div>

<style>
  .user-management {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem;
  }

  .management-header {
    margin-bottom: 1rem;
  }

  .header-info h2 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
  }

  .header-info p {
    margin: 0;
    color: var(--medium-gray);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .stat-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-green);
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--medium-gray);
    text-transform: uppercase;
  }

  .error-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8d7da;
    color: #721c24;
    border-radius: var(--border-radius);
    border: 1px solid #f5c6cb;
  }

  .error-message button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0.25rem;
  }

  .controls-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .search-filters {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex: 1;
    flex-wrap: wrap;
  }

  .search-box {
    flex: 1;
    min-width: 300px;
  }

  .filter-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .filter-select {
    padding: 0.5rem;
    border: 1px solid var(--light-gray);
    border-radius: var(--border-radius);
    background: var(--white);
  }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .loading-state,
  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--light-gray);
    border-top: 4px solid var(--primary-green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
    color: var(--medium-gray);
  }

  .user-card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .user-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--primary-green);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .user-avatar.inactive {
    background: var(--medium-gray);
  }

  .user-info {
    flex: 1;
  }

  .user-info h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text-dark);
    font-size: 1.1rem;
  }

  .user-email {
    margin: 0 0 0.75rem 0;
    color: var(--medium-gray);
    font-size: 0.9rem;
  }

  .user-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .role-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: var(--border-radius);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .role-super_admin {
    background: #dc3545;
    color: var(--white);
  }

  .role-tournament_director {
    background: var(--primary-green);
    color: var(--white);
  }

  .role-registration_manager {
    background: #17a2b8;
    color: var(--white);
  }

  .role-content_editor {
    background: #ffc107;
    color: var(--text-dark);
  }

  .role-financial_manager {
    background: #6f42c1;
    color: var(--white);
  }

  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-active {
    background: #d4edda;
    color: #155724;
  }

  .status-inactive {
    background: #f8d7da;
    color: #721c24;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.9rem;
  }

  .detail-value {
    color: var(--medium-gray);
    font-size: 0.9rem;
  }

  .user-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--light-gray);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid var(--light-gray);
  }

  .modal-header h3 {
    margin: 0;
    color: var(--text-dark);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--medium-gray);
    transition: color 0.2s ease;
  }

  .close-btn:hover {
    color: var(--text-dark);
  }

  .modal-content :global(.form) {
    padding: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .form-group label {
    font-weight: 600;
    color: var(--text-dark);
  }

  .form-group select {
    padding: 0.75rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: border-color 0.2s ease;
  }

  .form-group select:focus {
    outline: none;
    border-color: var(--primary-green);
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--light-gray);
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .user-management {
      padding: 1rem;
    }

    .controls-section {
      flex-direction: column;
      align-items: stretch;
    }

    .search-filters {
      flex-direction: column;
      gap: 1rem;
    }

    .search-box {
      min-width: auto;
    }

    .users-grid {
      grid-template-columns: 1fr;
    }

    .user-header {
      flex-direction: column;
      text-align: center;
      gap: 1rem;
    }

    .user-actions {
      flex-direction: column;
    }

    .modal-actions {
      flex-direction: column;
    }
  }
</style>
