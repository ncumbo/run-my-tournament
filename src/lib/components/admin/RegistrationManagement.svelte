<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Card, Input } from "$lib/components";

  // State management
  let activeView = "list";
  let searchTerm = "";
  let filterStatus = "all";
  let filterType = "all";
  let selectedRegistrations = new Set();
  let editingRegistration = null;

  // Mock registration data
  let registrations = [
    {
      id: 1,
      registrationDate: "2024-03-15",
      type: "team",
      teamName: "Eagle Masters",
      captain: "John Smith",
      email: "john.smith@email.com",
      phone: "555-0123",
      players: [
        { name: "John Smith", email: "john.smith@email.com", handicap: 12 },
        { name: "Mike Johnson", email: "mike.j@email.com", handicap: 8 },
        { name: "Dave Wilson", email: "dave.w@email.com", handicap: 15 },
        { name: "Tom Brown", email: "tom.b@email.com", handicap: 10 },
      ],
      paymentStatus: "paid",
      amount: 550,
      notes: "Returning team from last year",
    },
    {
      id: 2,
      registrationDate: "2024-03-18",
      type: "individual",
      teamName: null,
      captain: "Sarah Davis",
      email: "sarah.davis@email.com",
      phone: "555-0456",
      players: [
        { name: "Sarah Davis", email: "sarah.davis@email.com", handicap: 14 },
      ],
      paymentStatus: "pending",
      amount: 125,
      notes: "Looking to join a team",
    },
  ];

  // Computed values
  $: filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch =
      searchTerm === "" ||
      registration.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.teamName &&
        registration.teamName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || registration.paymentStatus === filterStatus;
    const matchesType =
      filterType === "all" || registration.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  $: registrationStats = {
    total: registrations.length,
    paid: registrations.filter((r) => r.paymentStatus === "paid").length,
    pending: registrations.filter((r) => r.paymentStatus === "pending").length,
    totalRevenue: registrations
      .filter((r) => r.paymentStatus === "paid")
      .reduce((sum, r) => sum + r.amount, 0),
  };

  // Event handlers
  function editRegistration(registration) {
    editingRegistration = { ...registration };
    activeView = "edit";
  }

  function saveRegistration() {
    const index = registrations.findIndex(
      (r) => r.id === editingRegistration.id
    );
    if (index !== -1) {
      registrations[index] = { ...editingRegistration };
      registrations = registrations;
    }
    activeView = "list";
    editingRegistration = null;
  }

  function deleteRegistration(regId) {
    if (confirm("Are you sure you want to delete this registration?")) {
      registrations = registrations.filter((r) => r.id !== regId);
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "paid":
        return "status-paid";
      case "pending":
        return "status-pending";
      case "incomplete":
        return "status-incomplete";
      default:
        return "status-default";
    }
  }

  onMount(() => {
    console.log("Registration Management loaded");
  });
</script>

<div class="registration-management">
  <!-- Header with Stats -->
  <div class="management-header">
    <div class="header-info">
      <h2>🎯 Registration Management</h2>
      <p>Manage tournament registrations, teams, and communications</p>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-number">{registrationStats.total}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{registrationStats.paid}</span>
        <span class="stat-label">Paid</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{registrationStats.pending}</span>
        <span class="stat-label">Pending</span>
      </div>
      <div class="stat-item">
        <span class="stat-number"
          >${registrationStats.totalRevenue.toLocaleString()}</span
        >
        <span class="stat-label">Revenue</span>
      </div>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="view-tabs">
    <button
      class="tab-btn"
      class:active={activeView === "list"}
      on:click={() => (activeView = "list")}
    >
      📋 Registrations
    </button>
    <button
      class="tab-btn"
      class:active={activeView === "teams"}
      on:click={() => (activeView = "teams")}
    >
      👥 Team Formation
    </button>
    <button
      class="tab-btn"
      class:active={activeView === "communication"}
      on:click={() => (activeView = "communication")}
    >
      📧 Communications
    </button>
  </div>

  <!-- Main Content Area -->
  {#if activeView === "list"}
    <!-- Registration List View -->
    <div class="list-view">
      <!-- Filters and Search -->
      <div class="filters-section">
        <div class="search-box">
          <Input
            placeholder="Search by name, email, or team..."
            bind:value={searchTerm}
          />
        </div>

        <div class="filter-controls">
          <select bind:value={filterStatus} class="filter-select">
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending Payment</option>
            <option value="incomplete">Incomplete</option>
          </select>

          <select bind:value={filterType} class="filter-select">
            <option value="all">All Types</option>
            <option value="team">Teams</option>
            <option value="individual">Individuals</option>
          </select>
        </div>
      </div>

      <!-- Registration Table -->
      <Card variant="default" padding="none">
        <div class="table-container">
          <table class="registration-table">
            <thead>
              <tr>
                <th>Registration Date</th>
                <th>Name/Team</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Players</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredRegistrations as registration (registration.id)}
                <tr class="registration-row">
                  <td
                    >{new Date(
                      registration.registrationDate
                    ).toLocaleDateString()}</td
                  >
                  <td class="name-cell">
                    <div>
                      <div class="primary-name">
                        {registration.teamName || registration.captain}
                      </div>
                      {#if registration.teamName}
                        <div class="secondary-name">
                          Captain: {registration.captain}
                        </div>
                      {/if}
                    </div>
                  </td>
                  <td class="contact-cell">
                    <div>{registration.email}</div>
                    <div class="phone">{registration.phone}</div>
                  </td>
                  <td>
                    <span class="type-badge type-{registration.type}">
                      {registration.type}
                    </span>
                  </td>
                  <td>{registration.players.length}/4</td>
                  <td>${registration.amount}</td>
                  <td>
                    <span
                      class="status-badge {getStatusColor(
                        registration.paymentStatus
                      )}"
                    >
                      {registration.paymentStatus}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <Button
                      variant="ghost"
                      size="small"
                      onclick={() => editRegistration(registration)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onclick={() => deleteRegistration(registration.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  {:else if activeView === "edit"}
    <!-- Edit Registration View -->
    <div class="edit-view">
      <Card variant="default" padding="large">
        <div class="edit-header">
          <h3>Edit Registration</h3>
          <div class="edit-actions">
            <Button variant="outline" onclick={() => (activeView = "list")}
              >Cancel</Button
            >
            <Button variant="primary" onclick={saveRegistration}
              >Save Changes</Button
            >
          </div>
        </div>

        {#if editingRegistration}
          <div class="edit-form">
            <div class="form-section">
              <h4>Basic Information</h4>
              <div class="form-grid">
                <div class="form-field">
                  <label>Registration Type</label>
                  <select bind:value={editingRegistration.type}>
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                  </select>
                </div>

                {#if editingRegistration.type === "team"}
                  <div class="form-field">
                    <label>Team Name</label>
                    <Input bind:value={editingRegistration.teamName} />
                  </div>
                {/if}

                <div class="form-field">
                  <label>Captain/Player Name</label>
                  <Input bind:value={editingRegistration.captain} />
                </div>

                <div class="form-field">
                  <label>Email</label>
                  <Input type="email" bind:value={editingRegistration.email} />
                </div>

                <div class="form-field">
                  <label>Phone</label>
                  <Input bind:value={editingRegistration.phone} />
                </div>

                <div class="form-field">
                  <label>Payment Status</label>
                  <select bind:value={editingRegistration.paymentStatus}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </div>

                <div class="form-field">
                  <label>Amount</label>
                  <Input
                    type="number"
                    bind:value={editingRegistration.amount}
                  />
                </div>
              </div>
            </div>

            <div class="form-section">
              <h4>Notes</h4>
              <textarea
                bind:value={editingRegistration.notes}
                placeholder="Registration notes..."
                rows="4"
              ></textarea>
            </div>
          </div>
        {/if}
      </Card>
    </div>
  {:else if activeView === "teams"}
    <!-- Team Formation View -->
    <Card variant="default" padding="large">
      <h3>👥 Team Formation Management</h3>
      <p>Team formation tools will be implemented here.</p>
      <div class="placeholder-actions">
        <Button variant="primary">Auto-Match Players</Button>
        <Button variant="outline">Create New Team</Button>
        <Button variant="outline">Export Team List</Button>
      </div>
    </Card>
  {:else if activeView === "communication"}
    <!-- Communication View -->
    <Card variant="default" padding="large">
      <h3>📧 Communication Center</h3>
      <p>Email templates and communication tools will be implemented here.</p>
      <div class="placeholder-actions">
        <Button variant="primary">Send Payment Reminders</Button>
        <Button variant="outline">Tournament Announcement</Button>
        <Button variant="outline">Custom Email</Button>
      </div>
    </Card>
  {/if}
</div>

<style>
  .registration-management {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

  .view-tabs {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid var(--light-gray);
    margin-bottom: 1.5rem;
  }

  .tab-btn {
    padding: 0.75rem 1.25rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-weight: 500;
    color: var(--medium-gray);
    transition: var(--transition);
  }

  .tab-btn:hover {
    color: var(--text-dark);
    background: var(--light-gray);
  }

  .tab-btn.active {
    color: var(--primary-green);
    border-bottom-color: var(--primary-green);
  }

  .filters-section {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .search-box {
    flex: 1;
    min-width: 300px;
  }

  .filter-controls {
    display: flex;
    gap: 0.5rem;
  }

  .filter-select {
    padding: 0.5rem;
    border: 1px solid var(--light-gray);
    border-radius: var(--border-radius);
    background: var(--white);
  }

  .table-container {
    overflow-x: auto;
  }

  .registration-table {
    width: 100%;
    border-collapse: collapse;
  }

  .registration-table th,
  .registration-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--light-gray);
  }

  .registration-table th {
    background: var(--light-gray);
    font-weight: 600;
    color: var(--text-dark);
  }

  .registration-row:hover {
    background: var(--light-gray);
  }

  .name-cell .primary-name {
    font-weight: 600;
    color: var(--text-dark);
  }

  .name-cell .secondary-name {
    font-size: 0.8rem;
    color: var(--medium-gray);
  }

  .contact-cell .phone {
    font-size: 0.8rem;
    color: var(--medium-gray);
  }

  .type-badge {
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .type-team {
    background: #e3f2fd;
    color: #1976d2;
  }

  .type-individual {
    background: #f3e5f5;
    color: #7b1fa2;
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .status-paid {
    background: #d4edda;
    color: #155724;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-incomplete {
    background: #f8d7da;
    color: #721c24;
  }

  .actions-cell {
    display: flex;
    gap: 0.5rem;
  }

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .edit-header h3 {
    margin: 0;
    color: var(--text-dark);
  }

  .edit-actions {
    display: flex;
    gap: 1rem;
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-section h4 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
    border-bottom: 1px solid var(--light-gray);
    padding-bottom: 0.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-field label {
    font-weight: 600;
    color: var(--text-dark);
  }

  .form-field select {
    padding: 0.75rem;
    border: 1px solid var(--light-gray);
    border-radius: var(--border-radius);
    background: var(--white);
  }

  textarea {
    padding: 0.75rem;
    border: 1px solid var(--light-gray);
    border-radius: var(--border-radius);
    resize: vertical;
    font-family: inherit;
  }

  .placeholder-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .filters-section {
      flex-direction: column;
      align-items: stretch;
    }

    .search-box {
      min-width: auto;
    }

    .filter-controls {
      justify-content: space-between;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .placeholder-actions {
      flex-direction: column;
    }
  }
</style>
