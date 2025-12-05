<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { customerAuth } from "$lib/stores/customerAuth";
  import { Card } from "$lib/components";

  // Mock analytics data - will be replaced with real API calls
  let analyticsData = {
    overview: {
      total_pageviews: 2847,
      unique_visitors: 1523,
      conversion_rate: 8.2,
      total_revenue: 12450,
    },
    tournaments: [
      {
        id: "1",
        name: "Annual Charity Golf Classic",
        pageviews: 1845,
        registrations: 42,
        revenue: 6300,
        conversion_rate: 2.3,
      },
      {
        id: "2",
        name: "Corporate Championship",
        pageviews: 1002,
        registrations: 24,
        revenue: 3600,
        conversion_rate: 2.4,
      },
    ],
    traffic_sources: [
      { source: "Direct", visitors: 658, percentage: 43.2 },
      { source: "Social Media", visitors: 457, percentage: 30.0 },
      { source: "Google Search", visitors: 304, percentage: 20.0 },
      { source: "Email", visitors: 104, percentage: 6.8 },
    ],
    recent_activity: [
      {
        date: "2024-12-05",
        type: "registration",
        description: "New registration for Corporate Championship",
        value: "$150",
      },
      {
        date: "2024-12-04",
        type: "pageview",
        description: "45 new page views today",
        value: "+12%",
      },
      {
        date: "2024-12-03",
        type: "registration",
        description: "Team registration for Charity Classic",
        value: "$550",
      },
      {
        date: "2024-12-02",
        type: "site_visit",
        description: "23 unique visitors today",
        value: "+8%",
      },
    ],
  };

  let isLoading = false;
  let selectedTimeframe = "30d";

  // Reactive auth state
  $: ({ isAuthenticated, user } = $customerAuth);

  onMount(() => {
    if (!isAuthenticated || !user) {
      goto("/login");
      return;
    }

    loadAnalytics();
  });

  async function loadAnalytics() {
    isLoading = true;
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/analytics?timeframe=${selectedTimeframe}`);
      // analyticsData = await response.json();
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      isLoading = false;
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Handle timeframe change
  $: if (selectedTimeframe) {
    loadAnalytics();
  }
</script>

<svelte:head>
  <title>Analytics - Pinpoint Golf</title>
</svelte:head>

<div class="analytics-page">
  <div class="page-header">
    <div class="header-content">
      <h1>Analytics Dashboard</h1>
      <p>Track your tournament performance and visitor engagement</p>
    </div>
    <div class="header-actions">
      <select class="timeframe-select" bind:value={selectedTimeframe}>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>
    </div>
  </div>

  {#if isLoading}
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading analytics...</p>
    </div>
  {:else}
    <!-- Overview Cards -->
    <div class="overview-grid">
      <Card variant="default" padding="large">
        <div class="metric-card">
          <div class="metric-icon">👁️</div>
          <div class="metric-content">
            <h3>{analyticsData.overview.total_pageviews.toLocaleString()}</h3>
            <p>Total Page Views</p>
          </div>
        </div>
      </Card>

      <Card variant="default" padding="large">
        <div class="metric-card">
          <div class="metric-icon">👥</div>
          <div class="metric-content">
            <h3>{analyticsData.overview.unique_visitors.toLocaleString()}</h3>
            <p>Unique Visitors</p>
          </div>
        </div>
      </Card>

      <Card variant="default" padding="large">
        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <div class="metric-content">
            <h3>{analyticsData.overview.conversion_rate}%</h3>
            <p>Conversion Rate</p>
          </div>
        </div>
      </Card>

      <Card variant="default" padding="large">
        <div class="metric-card">
          <div class="metric-icon">💰</div>
          <div class="metric-content">
            <h3>{formatCurrency(analyticsData.overview.total_revenue)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </Card>
    </div>

    <div class="analytics-grid">
      <!-- Tournament Performance -->
      <div class="analytics-section">
        <Card variant="elevated" padding="large">
          <div class="section-header">
            <h2>Tournament Performance</h2>
            <p>How each tournament is performing</p>
          </div>

          <div class="tournament-metrics">
            {#each analyticsData.tournaments as tournament}
              <div class="tournament-metric">
                <div class="tournament-name">
                  <h4>{tournament.name}</h4>
                </div>
                <div class="tournament-stats">
                  <div class="stat">
                    <span class="stat-label">Page Views:</span>
                    <span class="stat-value"
                      >{tournament.pageviews.toLocaleString()}</span
                    >
                  </div>
                  <div class="stat">
                    <span class="stat-label">Registrations:</span>
                    <span class="stat-value">{tournament.registrations}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Revenue:</span>
                    <span class="stat-value"
                      >{formatCurrency(tournament.revenue)}</span
                    >
                  </div>
                  <div class="stat">
                    <span class="stat-label">Conversion:</span>
                    <span class="stat-value">{tournament.conversion_rate}%</span
                    >
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </Card>
      </div>

      <!-- Traffic Sources -->
      <div class="analytics-section">
        <Card variant="elevated" padding="large">
          <div class="section-header">
            <h2>Traffic Sources</h2>
            <p>Where your visitors are coming from</p>
          </div>

          <div class="traffic-sources">
            {#each analyticsData.traffic_sources as source}
              <div class="source-item">
                <div class="source-info">
                  <span class="source-name">{source.source}</span>
                  <span class="source-visitors">{source.visitors} visitors</span
                  >
                </div>
                <div class="source-percentage">
                  <div class="percentage-bar">
                    <div
                      class="percentage-fill"
                      style="width: {source.percentage}%; background: var(--primary-green);"
                    ></div>
                  </div>
                  <span class="percentage-text">{source.percentage}%</span>
                </div>
              </div>
            {/each}
          </div>
        </Card>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <Card variant="elevated" padding="large">
        <div class="section-header">
          <h2>Recent Activity</h2>
          <p>Latest registrations and site activity</p>
        </div>

        <div class="activity-list">
          {#each analyticsData.recent_activity as activity}
            <div class="activity-item">
              <div class="activity-icon">
                {#if activity.type === "registration"}
                  🎯
                {:else if activity.type === "pageview"}
                  👁️
                {:else if activity.type === "site_visit"}
                  👥
                {:else}
                  📊
                {/if}
              </div>
              <div class="activity-content">
                <p class="activity-description">{activity.description}</p>
                <span class="activity-date">{formatDate(activity.date)}</span>
              </div>
              <div class="activity-value">
                {activity.value}
              </div>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  {/if}
</div>

<style>
  .analytics-page {
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

  .timeframe-select {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    background: white;
    color: var(--text-dark);
    font-size: 0.9rem;
    cursor: pointer;
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

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .metric-card {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .metric-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
  }

  .metric-content h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.75rem;
    color: var(--primary-green);
    font-weight: 700;
  }

  .metric-content p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .analytics-section {
    display: flex;
    flex-direction: column;
  }

  .section-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-light);
  }

  .section-header h2 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-green);
    font-size: 1.25rem;
  }

  .section-header p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .tournament-metrics {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .tournament-metric {
    padding: 1rem;
    background: var(--off-white);
    border-radius: var(--border-radius);
  }

  .tournament-name h4 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
    font-size: 1rem;
  }

  .tournament-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .stat-label {
    color: var(--text-muted);
  }

  .stat-value {
    color: var(--text-dark);
    font-weight: 500;
  }

  .traffic-sources {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .source-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .source-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .source-name {
    font-weight: 500;
    color: var(--text-dark);
  }

  .source-visitors {
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .source-percentage {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 120px;
  }

  .percentage-bar {
    flex: 1;
    height: 8px;
    background: var(--light-gray);
    border-radius: 4px;
    overflow: hidden;
  }

  .percentage-fill {
    height: 100%;
    transition: width 0.3s ease;
  }

  .percentage-text {
    font-size: 0.8rem;
    color: var(--text-dark);
    font-weight: 500;
    min-width: 35px;
    text-align: right;
  }

  .activity-section {
    grid-column: 1 / -1;
  }

  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--off-white);
    border-radius: var(--border-radius);
  }

  .activity-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .activity-content {
    flex: 1;
  }

  .activity-description {
    margin: 0 0 0.25rem 0;
    color: var(--text-dark);
    font-size: 0.9rem;
  }

  .activity-date {
    color: var(--text-muted);
    font-size: 0.8rem;
  }

  .activity-value {
    color: var(--primary-green);
    font-weight: 600;
    font-size: 0.9rem;
  }

  /* Mobile Responsive */
  @media (max-width: 1024px) {
    .analytics-grid {
      grid-template-columns: 1fr;
    }

    .page-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    .analytics-page {
      padding: 1rem;
    }

    .overview-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .metric-card {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }

    .tournament-stats {
      grid-template-columns: 1fr;
    }

    .source-item {
      flex-direction: column;
      align-items: stretch;
      gap: 0.5rem;
    }

    .source-percentage {
      justify-content: space-between;
    }
  }

  @media (max-width: 480px) {
    .overview-grid {
      grid-template-columns: 1fr;
    }

    .activity-item {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
      gap: 0.75rem;
    }

    .activity-content {
      order: 2;
    }

    .activity-value {
      order: 3;
      font-size: 1rem;
    }

    .activity-icon {
      order: 1;
      align-self: center;
    }
  }
</style>
