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
      // In real app, make API call to create user
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

      // Assign role using permission system
      roleActions.assignRole(
        userId,
        newUser.role_id,
        parseInt(currentUser?.id || "1")
      );

      // Reset form
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
      // Update user in array
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

      // Update role assignment
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

      // Remove role assignment
      roleActions.removeRole(userId);
    } catch (err) {
      error = "Failed to deactivate user";
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
</script>

<div class="user-management">
  <div class="section-header">
    <div class="header-content">
      <h2>👥 User Management</h2>
      <p>Manage admin users and their roles</p>
    </div>
    {#if canManageUsers}
      <Button variant="primary" onclick={() => (showCreateUserModal = true)}>
        ➕ Add New User
      </Button>
    {/if}
  </div>

  {#if error}
    <div class="error-message">
      <span>⚠️ {error}</span>
      <button on:click={() => (error = "")}>✕</button>
    </div>
  {/if}

  <!-- Users List -->
  <Card variant="default" padding="none">
    <div class="users-table">
      <div class="table-header">
        <span>User</span>
        <span>Email</span>
        <span>Role</span>
        <span>Last Login</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {#if loading}
        <div class="loading-row">
          <span>Loading users...</span>
        </div>
      {:else}
        {#each users as user}
          <div class="table-row" class:inactive={!user.is_active}>
            <div class="user-info">
              <div class="user-avatar">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div class="user-details">
                <strong>{user.name}</strong>
                <span class="user-id">ID: {user.id}</span>
              </div>
            </div>
            <span class="email">{user.email}</span>
            <span class="role">
              <span class="role-badge role-{user.role}">
                {getRoleName(user.role)}
              </span>
            </span>
            <span class="last-login">
              {user.last_login ? formatDate(user.last_login) : "Never"}
            </span>
            <span class="status">
              <span
                class="status-badge status-{user.is_active
                  ? 'active'
                  : 'inactive'}"
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </span>
            <div class="actions">
              {#if canManageUsers && user.is_active}
                <Button
                  variant="ghost"
                  size="tiny"
                  onclick={() => openEditModal(user)}
                >
                  ✏️ Edit
                </Button>
                {#if user.id !== parseInt(currentUser?.id || "0")}
                  <Button
                    variant="ghost"
                    size="tiny"
                    onclick={() => deactivateUser(user.id)}
                  >
                    🚫 Deactivate
                  </Button>
                {/if}
              {/if}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </Card>

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
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .header-content h2 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
  }

  .header-content p {
    margin: 0;
    color: var(--medium-gray);
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

  /* Table Styles */
  .users-table {
    overflow-x: auto;
  }

  .table-header {
    display: grid;
    grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1fr 1.5fr;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--primary-green);
    color: var(--white);
    font-weight: 600;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  .table-row {
    display: grid;
    grid-template-columns: 2fr 2fr 1.5fr 1.5fr 1fr 1.5fr;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid var(--light-gray);
    align-items: center;
    transition: background-color 0.2s ease;
  }

  .table-row:hover {
    background: var(--light-gray);
  }

  .table-row.inactive {
    opacity: 0.6;
    background: #f8f9fa;
  }

  .loading-row {
    padding: 2rem;
    text-align: center;
    color: var(--medium-gray);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-green);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .user-details strong {
    color: var(--text-dark);
  }

  .user-id {
    font-size: 0.75rem;
    color: var(--medium-gray);
  }

  .email {
    color: var(--dark-gray);
    word-break: break-word;
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

  .role-volunteer_coordinator {
    background: #fd7e14;
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

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
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
    box-shadow: var(--shadow-large);
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
    .section-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .table-header {
      display: none;
    }

    .table-row {
      display: block;
      padding: 1.5rem;
      border: 1px solid var(--light-gray);
      border-radius: var(--border-radius);
      margin-bottom: 1rem;
    }

    .table-row > * {
      display: block;
      margin: 0.5rem 0;
    }

    .user-info {
      margin-bottom: 1rem;
    }

    .email::before {
      content: "Email: ";
      font-weight: 600;
      color: var(--text-dark);
    }

    .role::before {
      content: "Role: ";
      font-weight: 600;
      color: var(--text-dark);
    }

    .last-login::before {
      content: "Last Login: ";
      font-weight: 600;
      color: var(--text-dark);
    }

    .status::before {
      content: "Status: ";
      font-weight: 600;
      color: var(--text-dark);
    }

    .actions {
      justify-content: flex-start;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--light-gray);
    }

    .modal-actions {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      margin: 0;
      border-radius: 0;
      height: 100vh;
      max-height: none;
    }

    .user-avatar {
      width: 35px;
      height: 35px;
      font-size: 0.75rem;
    }

    .actions {
      flex-direction: column;
    }
  }
</style>
