
<script lang="ts">
  import { onMount } from "svelte";
  import { Button, Card, Input } from "$lib/components";

  // ===========================
  // STATE MANAGEMENT
  // ===========================
  
  let activeView = "list"; // list, edit, teams, communication
  let searchTerm = "";
  let filterStatus = "all"; // all, paid, pending, incomplete
  let filterType = "all"; // all, individual, team
  let selectedRegistrations = new Set();
  let editingRegistration = null;
  let showTeamModal = false;
  let showCommunicationModal = false;

  // ===========================
  // MOCK DATA
  // ===========================
  
  // Mock registration data - in real app, this would come from API/database
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
        { name: "Tom Brown", email: "tom.b@email.com", handicap: 10 }
      ],
      paymentStatus: "paid",
      amount: 550,
      notes: "Returning team from last year"
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
        { name: "Sarah Davis", email: "sarah.davis@email.com", handicap: 14 }
      ],
      paymentStatus: "pending",
      amount: 125,
      notes: "Looking to join a team"
    },
    {
      id: 3,
      registrationDate: "2024-03-20",
      type: "team",
      teamName: "Thunder Bolts",
      captain: "Alex Chen",
      email: "alex.chen@email.com",
      phone: "555-0789",
      players: [
        { name: "Alex Chen", email: "alex.chen@email.com", handicap: 6 },
        { name: "Lisa Wong", email: "lisa.w@email.com", handicap: 18 },
        { name: "Mark Rodriguez", email: "mark.r@email.com", handicap: 12 }
      ],
      paymentStatus: "incomplete",
      amount: 412.50,
      notes: "Still looking for 4th player"
    }
  ];

  // Mock team formation data
  let availableIndividuals = registrations.filter(r => r.type === "individual");
  let incompleteTeams = registrations.filter(r => r.type === "team" && r.players.length < 4);

  // ===========================
  // COMPUTED VALUES
  // ===========================
  
  $: filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = searchTerm === "" || 
      registration.captain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (registration.teamName && registration.teamName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === "all" || registration.paymentStatus === filterStatus;
    const matchesType = filterType === "all" || registration.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  $: registrationStats = {
    total: registrations.length,
    paid: registrations.filter(r => r.paymentStatus === "paid").length,
    pending: registrations.filter(r => r.paymentStatus === "pending").length,
    incomplete: registrations.filter(r => r.paymentStatus === "incomplete").length,
    teams: registrations.filter(r => r.type === "team").length,
    individuals: registrations.filter(r => r.type === "individual").length,
    totalRevenue: registrations.filter(r => r.paymentStatus === "paid").reduce((sum, r) => sum + r.amount, 0)
  };

  // ===========================
  // EVENT HANDLERS
  // ===========================
  
  function handleSelectAll() {
    if (selectedRegistrations.size === filteredRegistrations.length) {
      selectedRegistrations.clear();
    } else {
      filteredRegistrations.forEach(reg => selectedRegistrations.add(reg.id));
    }
    selectedRegistrations = selectedRegistrations;
  }

  function toggleRegistrationSelection(regId) {
    if (selectedRegistrations.has(regId)) {
      selectedRegistrations.delete(regId);
    } else {
      selectedRegistrations.add(regId);
    }
    selectedRegistrations = selectedRegistrations;
  }

  function editRegistration(registration) {
    editingRegistration = { ...registration };
    activeView = "edit";
  }

  function saveRegistration() {
    const index = registrations.findIndex(r => r.id === editingRegistration.id);
    if (index !== -1) {
      registrations[index] = { ...editingRegistration };
      registrations = registrations;
    }
    activeView = "list";
    editingRegistration = null;
  }

  function deleteRegistration(regId) {
    if (confirm("Are you sure you want to delete this registration?")) {
      registrations = registrations.filter(r => r.id !== regId);
    }
  }

  function bulkAction(action) {
    const selectedIds = Array.from(selectedRegistrations);
    
    switch (action) {
      case "delete":
        if (confirm(`Delete ${selectedIds.length} registrations?`)) {
          registrations = registrations.filter(r => !selectedIds.includes(r.id));
          selectedRegistrations.clear();
          selectedRegistrations = selectedRegistrations;
        }
        break;
      case "mark-paid":
        registrations.forEach(r => {
          if (selectedIds.includes(r.id)) {
            r.paymentStatus = "paid";
          }
        });
        registrations = registrations;
        break;
      case "email":
        showCommunicationModal = true;
        break;
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case "paid": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "incomplete": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  }

  onMount(() => {
    // In real app, fetch registrations from API here
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
        <span class="stat-number">${registrationStats.totalRevenue.toLocaleString()}</span>
        <span class="stat-label">Revenue</span>
      </div>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="view-tabs">
    <button 
      class="tab-btn" 
      class:active={activeView === "list"}
      on:click={() => activeView = "list"}
    >
      📋 Registrations
    </button>
    <button 
      class="tab-btn" 
      class:active={activeView === "teams"}
      on:click={() => activeView = "teams"}
    >
      👥 Team Formation
    </button>
    <button 
      class="tab-btn" 
      class:active={activeView === "communication"}
      on:click={() => activeView = "communication"}
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

        <!-- Bulk Actions -->
        {#if selectedRegistrations.size > 0}
          <div class="bulk-actions">
            <span class="selected-count">{selectedRegistrations.size} selected</span>
            <Button variant="outline" size="small" onclick={() => bulkAction("mark-paid")}>
              Mark as Paid
            </Button>
            <Button variant="outline" size="small" onclick={() => bulkAction("email")}>
              Send Email
            </Button>
            <Button variant="outline" size="small" onclick={() => bulkAction("delete")}>
              Delete
            </Button>
          </div>
        {/if}
      </div>

      <!-- Registration Table -->
      <Card variant="default" padding="none">
        <div class="table-container">
          <table class="registration-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedRegistrations.size === filteredRegistrations.length && filteredRegistrations.length > 0}
                    on:change={handleSelectAll}
                  />
                </th>
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
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedRegistrations.has(registration.id)}
                      on:change={() => toggleRegistrationSelection(registration.id)}
                    />
                  </td>
                  <td>{new Date(registration.registrationDate).toLocaleDateString()}</td>
                  <td class="name-cell">
                    <div>
                      <div class="primary-name">
                        {registration.teamName || registration.captain}
                      </div>
                      {#if registration.teamName}
                        <div class="secondary-name">Captain: {registration.captain}</div>
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
                    <span class="status-badge {getStatusColor(registration.paymentStatus)}">
                      {registration.paymentStatus}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <Button variant="ghost" size="small" onclick={() => editRegistration(registration)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="small" onclick={() => deleteRegistration(registration.id)}>
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
            <Button variant="outline" onclick={() => activeView = "list"}>Cancel</Button>
            <Button variant="primary" onclick={saveRegistration}>Save Changes</Button>
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
                    