<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { customerAuth, customerAuthActions } from "$lib/stores/customerAuth";
  import { Button, Card } from "$lib/components";

  let showWelcome = false;

  // Reactive auth state
  $: ({ isAuthenticated, user, organization } = $customerAuth);

  onMount(() => {
    // Check for welcome parameter first
    const urlParams = $page.url.searchParams;
    if (urlParams.get("welcome") === "true") {
      showWelcome = true;
    }

    // Simple authentication check without refresh for now
    // This prevents the infinite spinner
    if (!isAuthenticated || !user) {
      console.log("Not authenticated, redirecting to login");
      goto("/login");
      return;
    }
  });

  function dismissWelcome() {
    showWelcome = false;
    // Update URL without the welcome parameter
    const url = new URL($page.url);
    url.searchParams.delete("welcome");
    window.history.replaceState({}, "", url);
  }

  function handleLogout() {
    customerAuthActions.logout();
    goto("/");
  }
</script>

<svelte:head>
  <title>Dashboard - Pinpoint Golf</title>
  <meta
    name="description"
    content="Manage your golf tournaments with Pinpoint Golf dashboard."
  />
</svelte:head>

{#if isAuthenticated && user}
  <div class="dashboard-container">
    <!-- Welcome Message -->
    {#if showWelcome}
      <div class="welcome-banner">
        <div class="welcome-content">
          <h2>🎉 Welcome to Pinpoint Golf, {user.first_name}!</h2>
          <p>
            Your account has been created successfully. You're now ready to
            create your first tournament!
          </p>
          <div class="welcome-actions">
            <Button
              variant="primary"
              onclick={() => goto("/dashboard/tournaments/create")}
            >
              Create Your First Tournament
            </Button>
            <Button variant="outline" onclick={dismissWelcome}>
              Explore Dashboard
            </Button>
          </div>
        </div>
        <button
          class="welcome-close"
          onclick={dismissWelcome}
          aria-label="Dismiss welcome message"
        >
          ✕
        </button>
      </div>
    {/if}

    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-info">
          <h1>Dashboard</h1>
          <p>
            Welcome back, {user.first_name}! Manage your tournaments and track
            your success.
          </p>
        </div>
        <div class="header-actions">
          <Button
            variant="primary"
            onclick={() => goto("/dashboard/tournaments/create")}
          >
            + New Tournament
          </Button>
          <Button variant="outline" onclick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <Card variant="default" padding="large">
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <h3>0</h3>
            <p>Active Tournaments</p>
          </div>
        </div>
      </Card>

      <Card variant="default" padding="large">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>0</h3>
            <p>Total Registrations</p>
          </div>
        </div>
      </Card>

      <Card variant="default" padding="large">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>$0</h3>
            <p>Revenue Generated</p>
          </div>
        </div>
      </Card>

      <Card variant="default" padding="large">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>0</h3>
            <p>Page Views</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Main Content -->
    <div class="dashboard-main">
      <!-- Recent Tournaments -->
      <div class="section">
        <Card variant="elevated" padding="large">
          <div class="section-header">
            <h2>Your Tournaments</h2>
            <Button
              variant="outline"
              size="small"
              onclick={() => goto("/dashboard/tournaments")}
            >
              View All
            </Button>
          </div>

          <div class="empty-state">
            <div class="empty-icon">🏌️‍♂️</div>
            <h3>No tournaments yet</h3>
            <p>
              Create your first tournament to get started with Pinpoint Golf.
            </p>
            <Button
              variant="primary"
              onclick={() => goto("/dashboard/tournaments/create")}
            >
              Create Tournament
            </Button>
          </div>
        </Card>
      </div>

      <!-- Getting Started -->
      <div class="section">
        <Card variant="default" padding="large">
          <h2>Getting Started</h2>
          <div class="checklist">
            <div class="checklist-item">
              <div class="checklist-icon">✅</div>
              <div class="checklist-content">
                <h4>Account Created</h4>
                <p>Your Pinpoint Golf account is ready to go</p>
              </div>
            </div>

            <div class="checklist-item">
              <div class="checklist-icon">⏳</div>
              <div class="checklist-content">
                <h4>Create Your First Tournament</h4>
                <p>Set up your tournament details, pricing, and location</p>
              </div>
            </div>

            <div class="checklist-item">
              <div class="checklist-icon">⏳</div>
              <div class="checklist-content">
                <h4>Customize Your Site</h4>
                <p>Add your branding, colors, and tournament information</p>
              </div>
            </div>

            <div class="checklist-item">
              <div class="checklist-icon">⏳</div>
              <div class="checklist-content">
                <h4>Share Your Tournament</h4>
                <p>Get your custom URL and start promoting your tournament</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Organization Info -->
    {#if organization}
      <div class="organization-info">
        <Card variant="default" padding="large">
          <h3>Organization Details</h3>
          <div class="org-details">
            <div class="org-detail">
              <strong>Name:</strong>
              {organization.name}
            </div>
            {#if organization.subdomain}
              <div class="org-detail">
                <strong>Your Site:</strong>
                <a
                  href="https://{organization.subdomain}.pinpointgolf.com"
                  target="_blank"
                >
                  {organization.subdomain}.pinpointgolf.com
                </a>
              </div>
            {/if}
            <div class="org-detail">
              <strong>Plan:</strong> Free Plan
            </div>
          </div>
          <div class="org-actions">
            <Button
              variant="outline"
              size="small"
              onclick={() => goto("/dashboard/settings")}
            >
              Manage Settings
            </Button>
          </div>
        </Card>
      </div>
    {/if}
  </div>
{:else}
  <div class="loading-state">
    <div class="loading-spinner"></div>
    <p>Loading dashboard...</p>
  </div>
{/if}

<style>
  .dashboard-container {
    min-height: 100vh;
    background: var(--light-gray);
    padding: 2rem;
  }

  .welcome-banner {
    background: var(--gradient-green);
    color: white;
    padding: 2rem;
    border-radius: var(--border-radius-large);
    margin-bottom: 2rem;
    position: relative;
    box-shadow: var(--shadow-elevated);
  }

  .welcome-content h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }

  .welcome-content p {
    margin: 0 0 1.5rem 0;
    opacity: 0.95;
  }

  .welcome-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .welcome-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--border-radius);
    opacity: 0.8;
  }

  .welcome-close:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  .dashboard-header {
    background: white;
    border-radius: var(--border-radius-large);
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .header-info h1 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-green);
    font-size: 2rem;
  }

  .header-info p {
    margin: 0;
    color: var(--text-muted);
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    flex-shrink: 0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
  }

  .stat-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.75rem;
    color: var(--primary-green);
  }

  .stat-info p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .dashboard-main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .section {
    display: flex;
    flex-direction: column;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .section-header h2 {
    margin: 0;
    color: var(--primary-green);
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
    color: var(--text-muted);
  }

  .checklist {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .checklist-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: var(--off-white);
    border-radius: var(--border-radius);
  }

  .checklist-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .checklist-content h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text-dark);
    font-size: 1rem;
  }

  .checklist-content p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .organization-info {
    margin-bottom: 2rem;
  }

  .organization-info h3 {
    margin: 0 0 1rem 0;
    color: var(--primary-green);
  }

  .org-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .org-detail {
    font-size: 0.9rem;
  }

  .org-detail strong {
    color: var(--text-dark);
  }

  .org-detail a {
    color: var(--secondary-blue);
    text-decoration: none;
  }

  .org-detail a:hover {
    text-decoration: underline;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    text-align: center;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid var(--light-gray);
    border-top: 3px solid var(--primary-green);
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

  /* Responsive Design */
  @media (max-width: 1024px) {
    .dashboard-main {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .dashboard-container {
      padding: 1rem;
    }

    .header-content {
      flex-direction: column;
      align-items: stretch;
    }

    .header-actions {
      justify-content: flex-start;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .welcome-actions {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .stat-card {
      justify-content: center;
    }
  }
</style>
