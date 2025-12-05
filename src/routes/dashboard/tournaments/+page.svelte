<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { customerAuth } from "$lib/stores/customerAuth";
  import { Button, Card } from "$lib/components";

  // Mock tournament data - will be replaced with real API calls
  let tournaments = [
    {
      id: "1",
      name: "Annual Charity Golf Classic",
      slug: "charity-golf-classic",
      event_date: "2025-06-15",
      status: "draft",
      registrations: 0,
      revenue: 0,
      location_name: "Pine Valley Golf Club",
    },
    {
      id: "2",
      name: "Corporate Championship",
      slug: "corporate-championship",
      event_date: "2025-08-20",
      status: "published",
      registrations: 24,
      revenue: 3600,
      location_name: "Oakwood Country Club",
    },
  ];

  let isLoading = false;

  // Reactive auth state
  $: ({ isAuthenticated, user, organization } = $customerAuth);

  onMount(() => {
    if (!isAuthenticated || !user) {
      goto("/login");
      return;
    }

    loadTournaments();
  });

  async function loadTournaments() {
    isLoading = true;
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/tournaments');
      // tournaments = await response.json();
    } catch (error) {
      console.error("Error loading tournaments:", error);
    } finally {
      isLoading = false;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "draft":
        return "var(--medium-gray)";
      case "published":
        return "var(--secondary-blue)";
      case "active":
        return "var(--primary-green)";
      case "completed":
        return "var(--dark-gray)";
      case "cancelled":
        return "#dc2626";
      default:
        return "var(--medium-gray)";
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "draft":
        return "Draft";
      case "published":
        return "Published";
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
</script>

<svelte:head>
  <title>My Tournaments - Pinpoint Golf</title>
</svelte:head>

<div class="tournaments-page">
  <div class="page-header">
    <div class="header-content">
      <h1>My Tournaments</h1>
      <p>Manage your golf tournaments and track their performance</p>
    </div>
    <div class="header-actions">
      <Button
        variant="primary"
        onclick={() => goto("/dashboard/tournaments/create")}
      >
        + Create Tournament
      </Button>
    </div>
  </div>

  {#if isLoading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading tournaments...</p>
    </div>
  {:else if tournaments.length === 0}
    <div class="empty-state">
      <Card variant="elevated" padding="large">
        <div class="empty-content">
          <div class="empty-icon">🏌️‍♂️</div>
          <h2>No tournaments yet</h2>
          <p>Create your first tournament to get started with Pinpoint Golf.</p>
          <div class="empty-actions">
            <Button
              variant="primary"
              onclick={() => goto("/dashboard/tournaments/create")}
            >
              Create Your First Tournament
            </Button>
          </div>
        </div>
      </Card>
    </div>
  {:else}
    <div class="tournaments-grid">
      {#each tournaments as tournament}
        <Card variant="default" padding="large" hoverable={true}>
          <div class="tournament-card">
            <div class="tournament-header">
              <h3>{tournament.name}</h3>
              <div
                class="tournament-status"
                style="color: {getStatusColor(tournament.status)}"
              >
                <div
                  class="status-dot"
                  style="background-color: {getStatusColor(tournament.status)}"
                ></div>
                {getStatusLabel(tournament.status)}
              </div>
            </div>

            <div class="tournament-info">
              <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value"
                  >{formatDate(tournament.event_date)}</span
                >
              </div>
              <div class="info-item">
                <span class="info-label">Location:</span>
                <span class="info-value">{tournament.location_name}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Registrations:</span>
                <span class="info-value">{tournament.registrations}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Revenue:</span>
                <span class="info-value"
                  >{formatCurrency(tournament.revenue)}</span
                >
              </div>
            </div>

            <div class="tournament-actions">
              <Button
                variant="outline"
                size="small"
                onclick={() => goto(`/dashboard/tournaments/${tournament.id}`)}
              >
                Manage
              </Button>

              {#if tournament.status === "published" || tournament.status === "active"}
                <Button
                  variant="ghost"
                  size="small"
                  onclick={() =>
                    window.open(
                      `https://${organization?.subdomain}.pinpointgolf.com/${tournament.slug}`,
                      "_blank"
                    )}
                >
                  View Site
                </Button>
              {/if}

              <Button
                variant="ghost"
                size="small"
                onclick={() =>
                  goto(`/dashboard/tournaments/${tournament.id}/edit`)}
              >
                Edit
              </Button>
            </div>
          </div>
        </Card>
      {/each}
    </div>

    <div class="tournaments-footer">
      <div class="footer-stats">
        <div class="stat">
          <strong>{tournaments.length}</strong>
          <span>Total Tournaments</span>
        </div>
        <div class="stat">
          <strong
            >{tournaments.filter((t) => t.status === "active").length}</strong
          >
          <span>Active</span>
        </div>
        <div class="stat">
          <strong
            >{tournaments.reduce((sum, t) => sum + t.registrations, 0)}</strong
          >
          <span>Total Registrations</span>
        </div>
        <div class="stat">
          <strong
            >{formatCurrency(
              tournaments.reduce((sum, t) => sum + t.revenue, 0)
            )}</strong
          >
          <span>Total Revenue</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .tournaments-page {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    gap: 2rem;
  }

  .header-content h1 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-green);
    font-size: 2rem;
  }

  .header-content p {
    margin: 0;
    color: var(--text-muted);
  }

  .header-actions {
    flex-shrink: 0;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
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

  .empty-state {
    margin-top: 2rem;
  }

  .empty-content {
    text-align: center;
    padding: 2rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-content h2 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .empty-content p {
    margin: 0 0 2rem 0;
    color: var(--text-muted);
  }

  .tournaments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .tournament-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tournament-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .tournament-header h3 {
    margin: 0;
    color: var(--text-dark);
    font-size: 1.1rem;
    flex: 1;
  }

  .tournament-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .tournament-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .info-label {
    color: var(--text-muted);
  }

  .info-value {
    color: var(--text-dark);
    font-weight: 500;
  }

  .tournament-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .tournaments-footer {
    background: white;
    border-radius: var(--border-radius-large);
    padding: 2rem;
    box-shadow: var(--shadow);
  }

  .footer-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    text-align: center;
  }

  .stat strong {
    display: block;
    font-size: 1.5rem;
    color: var(--primary-green);
    margin-bottom: 0.25rem;
  }

  .stat span {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .tournaments-page {
      padding: 1rem;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
    }

    .tournaments-grid {
      grid-template-columns: 1fr;
    }

    .footer-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .tournament-actions {
      justify-content: center;
    }
  }
</style>
