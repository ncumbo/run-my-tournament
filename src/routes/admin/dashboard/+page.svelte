<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    PageHero,
    Card,
    Button,
    TabNavigation,
    UserManagement,
  } from "$lib/components";
  import { auth, authActions } from "$lib/stores/auth";
  import { permissionChecker, roleActions } from "$lib/stores/permissions";

  // ===========================
  // STATE MANAGEMENT
  // ===========================

  // Tab management
  let activeTab = "preview";
  let websitePreviewTab = "home"; // Default tab for website preview
  let selectedManagementSection = "users";
  let hasInitialized = false;

  // ===========================
  // COMPUTED VALUES
  // ===========================

  // Authentication state
  $: isAuthenticated = $auth.isAuthenticated;
  $: user = $auth.user;
  $: canManageUsers = user
    ? $permissionChecker.hasPermission(parseInt(user.id), "users.manage")
    : false;

  // Filter available management sections by permissions
  $: availableSections = managementSections.filter((section) =>
    user
      ? $permissionChecker.hasPermission(parseInt(user.id), section.permission)
      : false
  );

  // ===========================
  // DATA CONFIGURATION
  // ===========================

  // Mock data for preview dashboard
  const tournamentStats = [
    {
      number: "52",
      label: "Total Registrations",
      change: "+8",
      changeType: "positive",
      icon: "🎯",
    },
    {
      number: "$8,450",
      label: "Revenue Generated",
      change: "+$750",
      changeType: "positive",
      icon: "💰",
    },
    {
      number: "146",
      label: "Days Until Tournament",
      change: "-1",
      changeType: "neutral",
      icon: "📅",
    },
    {
      number: "13",
      label: "Teams Formed",
      change: "+2",
      changeType: "positive",
      icon: "👥",
    },
  ];

  const recentActivity = [
    {
      type: "registration",
      message: "New individual registration: Alex Chen",
      time: "5 minutes ago",
      icon: "🎯",
    },
    {
      type: "payment",
      message: "Payment confirmed: Team Thunder ($550)",
      time: "12 minutes ago",
      icon: "💳",
    },
    {
      type: "team",
      message: "New team formed: Eagle Masters",
      time: "1 hour ago",
      icon: "⛳",
    },
    {
      type: "system",
      message: "Weekly backup completed successfully",
      time: "2 hours ago",
      icon: "💾",
    },
  ];

  // Management sections configuration
  const managementSections = [
    {
      id: "users",
      title: "👥 User Management",
      description: "Manage admin users and permissions",
      permission: "users.view",
    },
    {
      id: "registrations",
      title: "🎯 Registration Management",
      description: "View and manage tournament registrations",
      permission: "players.view",
    },
    {
      id: "financial",
      title: "💰 Financial Management",
      description: "Payments, revenue, and financial reports",
      permission: "payments.view",
    },
    {
      id: "content",
      title: "🎨 Content Management",
      description: "Website content and media management",
      permission: "cms.pages.view",
    },
    {
      id: "analytics",
      title: "📊 Analytics & Reports",
      description: "Performance metrics and data export",
      permission: "analytics.view",
    },
    {
      id: "settings",
      title: "⚙️ System Settings",
      description: "Tournament and system configuration",
      permission: "settings.view",
    },
  ];

  // Website preview tabs configuration
  const websiteTabs = [
    { id: "home", label: "Home", href: "/?preview=true" },
    { id: "register", label: "Register", href: "/register?preview=true" },
    {
      id: "tournament-details",
      label: "Tournament Details",
      href: "/tournament-details?preview=true",
    },
    { id: "about", label: "About", href: "/about?preview=true" },
    {
      id: "sponsorship",
      label: "Sponsorship",
      href: "/sponsorship?preview=true",
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      href: "/leaderboard?preview=true",
    },
    { id: "contact", label: "Contact", href: "/contact?preview=true" },
    { id: "volunteer", label: "Volunteer", href: "/volunteer?preview=true" },
    { id: "history", label: "History", href: "/history?preview=true" },
  ];

  // ===========================
  // EVENT HANDLERS
  // ===========================

  function switchToManagement(section) {
    activeTab = "management";
    selectedManagementSection = section;
  }

  function switchToWebsitePreview() {
    activeTab = "website";
  }

  function switchToPreview() {
    activeTab = "preview";
  }

  // ===========================
  // LIFECYCLE & EFFECTS
  // ===========================

  // Redirect if not authenticated
  $: if (
    hasInitialized &&
    typeof window !== "undefined" &&
    !$auth.isLoading &&
    !isAuthenticated
  ) {
    goto("/admin/login");
  }

  onMount(() => {
    // Initialize role system
    roleActions.initializeDefaultRoles();

    setTimeout(() => {
      hasInitialized = true;
    }, 100);
  });
</script>

<svelte:head>
  <title>Admin Dashboard - IBM Charity Golf Tournament</title>
  <meta name="description" content="Modern tournament management dashboard" />
</svelte:head>

{#if isAuthenticated}
  <div class="admin-dashboard">
    <!-- ===========================
         HEADER SECTION
         =========================== -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-info">
          <h1>Admin Dashboard</h1>
          <p class="welcome-text">
            Welcome back, <strong>{user?.name}</strong>
            <span class="user-role">({user?.role})</span>
          </p>
        </div>
        <div class="header-actions">
          {#if activeTab !== "website"}
            <Button
              variant="outline"
              size="small"
              onclick={switchToWebsitePreview}
            >
              🌐 View Website
            </Button>
          {/if}
        </div>
      </div>
    </header>

    <!-- ===========================
         MAIN CONTENT AREA
         =========================== -->
    <main class="tab-content">
      <!-- DASHBOARD OVERVIEW TAB -->
      {#if activeTab === "preview"}
        <div class="preview-tab">
          <section class="overview-section">
            <div class="section-header">
              <h2>🏆 Tournament Overview</h2>
              <p>Real-time tournament statistics and activity</p>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
              {#each tournamentStats as stat}
                <Card variant="default" padding="medium" hoverable={true}>
                  <div class="stat-card">
                    <div class="stat-icon">{stat.icon}</div>
                    <div class="stat-content">
                      <div class="stat-number">{stat.number}</div>
                      <div class="stat-label">{stat.label}</div>
                      <div class="stat-change stat-change-{stat.changeType}">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                </Card>
              {/each}
            </div>

            <!-- Quick Actions -->
            <Card variant="default" padding="large">
              <h3>⚡ Quick Actions</h3>
              <div class="quick-actions">
                <Button
                  variant="primary"
                  onclick={() => switchToManagement("registrations")}
                >
                  ➕ Add Registration
                </Button>
                <Button
                  variant="outline"
                  onclick={() => switchToManagement("financial")}
                >
                  💰 View Payments
                </Button>
                <Button
                  variant="outline"
                  onclick={() => switchToManagement("analytics")}
                >
                  📊 Export Data
                </Button>
                <Button
                  variant="secondary"
                  onclick={() => window.open("/register", "_blank")}
                >
                  🌐 Public Registration
                </Button>
              </div>
            </Card>

            <br />

            <!-- Recent Activity Feed -->
            <Card variant="default" padding="large">
              <div class="activity-header">
                <h3>📈 Recent Activity</h3>
                <Button variant="ghost" size="small">View All</Button>
              </div>
              <div class="activity-feed">
                {#each recentActivity as activity}
                  <div class="activity-item">
                    <div class="activity-icon">{activity.icon}</div>
                    <div class="activity-content">
                      <p class="activity-message">{activity.message}</p>
                      <span class="activity-time">{activity.time}</span>
                    </div>
                  </div>
                {/each}
              </div>
            </Card>
          </section>
        </div>

        <!-- MANAGEMENT TAB -->
      {:else if activeTab === "management"}
        <div class="management-tab">
          <div class="management-layout">
            <!-- Management Navigation Sidebar -->
            <aside class="management-nav">
              <div class="management-header">
                <Button
                  variant="outline"
                  size="small"
                  onclick={switchToPreview}
                  class="back-to-overview-btn"
                >
                  ← Back to the portal overview
                </Button>
                <h3>Management Portal</h3>
              </div>

              <nav class="nav-list">
                {#each availableSections as section}
                  <button
                    class="nav-item"
                    class:active={selectedManagementSection === section.id}
                    on:click={() => (selectedManagementSection = section.id)}
                  >
                    <span class="nav-title">{section.title}</span>
                    <span class="nav-description">{section.description}</span>
                  </button>
                {/each}
              </nav>
            </aside>

            <!-- Management Content Area -->
            <section class="management-content">
              {#if selectedManagementSection === "users"}
                <UserManagement />
              {:else if selectedManagementSection === "registrations"}
                <Card variant="default" padding="large">
                  <div class="placeholder-content">
                    <h2>🎯 Registration Management</h2>
                    <p>Comprehensive registration management interface</p>
                    <div class="feature-list">
                      <div class="feature-item">📝 View all registrations</div>
                      <div class="feature-item">
                        ✏️ Edit registration details
                      </div>
                      <div class="feature-item">💳 Manage payment status</div>
                      <div class="feature-item">👥 Team formation tools</div>
                      <div class="feature-item">📧 Communication tools</div>
                    </div>
                    <Button variant="primary" disabled>🚧 Coming Soon</Button>
                  </div>
                </Card>
              {:else if selectedManagementSection === "financial"}
                <Card variant="default" padding="large">
                  <div class="placeholder-content">
                    <h2>💰 Financial Management</h2>
                    <p>Complete financial oversight and reporting</p>
                    <div class="feature-list">
                      <div class="feature-item">💳 Payment processing</div>
                      <div class="feature-item">📊 Revenue analytics</div>
                      <div class="feature-item">🧾 Transaction history</div>
                      <div class="feature-item">💸 Refund management</div>
                      <div class="feature-item">📈 Financial reports</div>
                    </div>
                    <Button variant="primary" disabled>🚧 Coming Soon</Button>
                  </div>
                </Card>
              {:else if selectedManagementSection === "analytics"}
                <Card variant="default" padding="large">
                  <div class="placeholder-content">
                    <h2>📊 Analytics & Reports</h2>
                    <p>Data export and comprehensive reporting</p>
                    <div class="feature-list">
                      <div class="feature-item">
                        📥 Data export (CSV, JSON, Excel)
                      </div>
                      <div class="feature-item">📈 Performance metrics</div>
                      <div class="feature-item">🎯 Registration analytics</div>
                      <div class="feature-item">💰 Revenue tracking</div>
                      <div class="feature-item">📋 Custom reports</div>
                    </div>
                    <Button variant="primary" disabled>🚧 Coming Soon</Button>
                  </div>
                </Card>
              {:else}
                <Card variant="default" padding="large">
                  <div class="placeholder-content">
                    <h2>🔧 Feature Development</h2>
                    <p>This management section is under development</p>
                    <Button
                      variant="outline"
                      onclick={() => (selectedManagementSection = "users")}
                    >
                      👥 Go to User Management
                    </Button>
                  </div>
                </Card>
              {/if}
            </section>
          </div>
        </div>

        <!-- WEBSITE PREVIEW TAB -->
      {:else if activeTab === "website"}
        <div class="website-preview-tab">
          <!-- Website Preview Header -->
          <div class="website-preview-header">
            <Button
              variant="outline"
              size="small"
              onclick={switchToPreview}
              class="back-to-admin-btn"
            >
              ← Back to Admin Dashboard
            </Button>
            <h2>🌐 Website Preview</h2>
          </div>

          <!-- Website Navigation Tabs -->
          <div class="website-nav-tabs">
            {#each websiteTabs as tab}
              <button
                class="website-nav-tab"
                class:active={websitePreviewTab === tab.id}
                on:click={() => (websitePreviewTab = tab.id)}
              >
                {tab.label}
              </button>
            {/each}
          </div>

          <!-- Website Content Frame -->
          <div class="website-content-frame">
            <iframe
              src={websiteTabs.find((tab) => tab.id === websitePreviewTab)
                ?.href || "/?preview=true"}
              title="Website Preview"
              class="website-iframe"
            ></iframe>
          </div>
        </div>
      {/if}
    </main>
  </div>
{:else}
  <PageHero
    title="Access Denied"
    subtitle="Please log in to access the admin dashboard"
  >
    <svelte:fragment slot="actions">
      <Button href="/admin/login" variant="primary" size="large">
        Go to Login
      </Button>
    </svelte:fragment>
  </PageHero>
{/if}

<style>
  /* ===========================
     LAYOUT & GENERAL STYLES
     =========================== */
  .admin-dashboard {
    min-height: 100vh;
    background: var(--light-gray, #f8f9fa);
    display: flex;
    flex-direction: column;
  }

  /* ===========================
     HEADER STYLES
     =========================== */
  .dashboard-header {
    background: var(--white);
    border-bottom: 2px solid var(--light-gray);
    padding: 1.5rem 0;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-info h1 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
    font-size: 2rem;
  }

  .welcome-text {
    margin: 0;
    color: var(--medium-gray);
    font-size: 1.1rem;
  }

  .user-role {
    color: var(--primary-green);
    font-weight: 600;
    text-transform: capitalize;
  }

  /* ===========================
     TAB CONTENT STYLES
     =========================== */
  .tab-content {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
  }

  /* ===========================
     DASHBOARD OVERVIEW STYLES
     =========================== */
  .section-header {
    margin-bottom: 2rem;
  }

  .section-header h2 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
  }

  .section-header p {
    margin: 0;
    color: var(--medium-gray);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--medium-gray);
    margin-bottom: 0.5rem;
  }

  .stat-change {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
  }

  .stat-change-positive {
    background: #d4edda;
    color: #155724;
  }

  .stat-change-neutral {
    background: var(--light-gray);
    color: var(--medium-gray);
  }

  .quick-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .activity-header h3 {
    margin: 0;
    color: var(--text-dark);
  }

  .activity-feed {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    transition: var(--transition);
  }

  .activity-item:hover {
    background: var(--white);
    box-shadow: var(--shadow);
  }

  .activity-item .activity-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .activity-content {
    flex: 1;
  }

  .activity-message {
    margin: 0 0 0.25rem 0;
    color: var(--text-dark);
    font-weight: 500;
  }

  .activity-time {
    font-size: 0.8rem;
    color: var(--medium-gray);
  }

  /* ===========================
     MANAGEMENT STYLES
     =========================== */
  .management-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    min-height: 600px;
  }

  .management-nav {
    background: var(--white);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    height: fit-content;
    box-shadow: var(--shadow);
  }

  .management-header {
    margin-bottom: 1.5rem;
  }

  .management-header h3 {
    margin: 1rem 0 0 0;
    color: var(--text-dark);
    font-size: 1.25rem;
  }

  :global(.back-to-overview-btn) {
    width: 100%;
    justify-content: flex-start;
    margin-bottom: 0.5rem;
  }

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 1rem;
    background: none;
    border: 2px solid transparent;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    text-align: left;
    width: 100%;
  }

  .nav-item:hover {
    background: var(--light-gray);
    border-color: var(--primary-green);
  }

  .nav-item.active {
    background: var(--primary-green);
    color: var(--white);
    border-color: var(--primary-green);
  }

  .nav-title {
    font-weight: 600;
    font-size: 1rem;
  }

  .nav-description {
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .management-content {
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    min-height: 600px;
  }

  .placeholder-content {
    text-align: center;
    padding: 3rem 2rem;
  }

  .placeholder-content h2 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .placeholder-content p {
    margin: 0 0 2rem 0;
    color: var(--medium-gray);
    font-size: 1.1rem;
  }

  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .feature-item {
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    color: var(--text-dark);
    font-weight: 500;
  }

  /* ===========================
     WEBSITE PREVIEW STYLES
     =========================== */
  .website-preview-tab {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
  }

  .website-preview-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--light-gray);
  }

  .website-preview-header h2 {
    margin: 0;
    color: var(--text-dark);
    font-size: 1.5rem;
  }

  :global(.back-to-admin-btn) {
    background: var(--primary-green) !important;
    color: var(--white) !important;
    border-color: var(--primary-green) !important;
  }

  :global(.back-to-admin-btn:hover) {
    background: var(--light-green) !important;
    border-color: var(--light-green) !important;
  }

  .website-nav-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
    overflow-x: auto;
    border-bottom: 1px solid var(--light-gray);
  }

  .website-nav-tab {
    padding: 0.75rem 1.25rem;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-weight: 500;
    color: var(--medium-gray);
    transition: var(--transition);
    white-space: nowrap;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  .website-nav-tab:hover {
    background: var(--light-gray);
    color: var(--text-dark);
  }

  .website-nav-tab.active {
    color: var(--primary-green);
    border-bottom-color: var(--primary-green);
    background: var(--white);
  }

  .website-content-frame {
    flex: 1;
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .website-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  /* ===========================
     RESPONSIVE STYLES
     =========================== */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
      padding: 0 1rem;
    }

    .tab-content {
      padding: 1rem;
    }

    .stats-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .stat-card {
      flex-direction: column;
      text-align: center;
      gap: 0.75rem;
    }

    .quick-actions {
      flex-direction: column;
    }

    .management-layout {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .management-nav {
      order: 2;
    }

    .management-content {
      order: 1;
    }

    .nav-list {
      flex-direction: row;
      overflow-x: auto;
      gap: 0.75rem;
      padding-bottom: 0.5rem;
    }

    .nav-item {
      flex-shrink: 0;
      min-width: 200px;
    }

    .activity-item {
      flex-direction: column;
      text-align: center;
      gap: 0.75rem;
    }

    .website-preview-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .website-nav-tabs {
      padding: 0;
    }

    .website-nav-tab {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .header-info h1 {
      font-size: 1.5rem;
    }

    .welcome-text {
      font-size: 1rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .placeholder-content {
      padding: 2rem 1rem;
    }

    .feature-list {
      grid-template-columns: 1fr;
    }

    .nav-item {
      min-width: 160px;
    }
  }
</style>
