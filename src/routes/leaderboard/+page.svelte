<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  // Leaderboard data structure
  interface Player {
    id: string;
    name: string;
    team: string;
    score: number;
    thru: number;
    position: number;
    previousPosition?: number;
    trend: "up" | "down" | "same";
    today: number;
    company: string;
    handicap: number;
  }

  // Mock tournament data - in real app this would come from API/database
  let players: Player[] = [
    {
      id: "1",
      name: "Mike Johnson",
      team: "Team IBM Cloud",
      score: -8,
      thru: 18,
      position: 1,
      previousPosition: 1,
      trend: "same",
      today: -8,
      company: "IBM",
      handicap: 12,
    },
    {
      id: "2",
      name: "Sarah Chen",
      team: "Watson Analytics",
      score: -6,
      thru: 18,
      position: 2,
      previousPosition: 3,
      trend: "up",
      today: -6,
      company: "IBM",
      handicap: 8,
    },
    {
      id: "3",
      name: "David Rodriguez",
      team: "Red Hat Rangers",
      score: -4,
      thru: 17,
      position: 3,
      previousPosition: 2,
      trend: "down",
      today: -4,
      company: "Red Hat",
      handicap: 15,
    },
    {
      id: "4",
      name: "Jennifer Lopez",
      team: "Security Squad",
      score: -3,
      thru: 16,
      position: 4,
      previousPosition: 4,
      trend: "same",
      today: -3,
      company: "IBM",
      handicap: 10,
    },
    {
      id: "5",
      name: "Tom Wilson",
      team: "Cloud Computing",
      score: -2,
      thru: 18,
      position: 5,
      previousPosition: 6,
      trend: "up",
      today: -2,
      company: "TechCorp",
      handicap: 18,
    },
    {
      id: "6",
      name: "Lisa Martinez",
      team: "AI Innovators",
      score: -2,
      thru: 17,
      position: 6,
      previousPosition: 5,
      trend: "down",
      today: -2,
      company: "IBM",
      handicap: 14,
    },
    {
      id: "7",
      name: "Kevin Brown",
      team: "Data Drivers",
      score: -1,
      thru: 18,
      position: 7,
      previousPosition: 7,
      trend: "same",
      today: -1,
      company: "CloudFirst",
      handicap: 16,
    },
    {
      id: "8",
      name: "Amanda Taylor",
      team: "Tech Titans",
      score: 0,
      thru: 16,
      position: 8,
      previousPosition: 8,
      trend: "same",
      today: 0,
      company: "Innovation Partners",
      handicap: 12,
    },
  ];

  let lastUpdate = new Date();
  let isLive = true;
  let updateInterval: number;
  let selectedView = "overall"; // 'overall', 'team', 'company'

  // Simulate live updates
  function simulateUpdate() {
    // Randomly update a few players' scores
    const playersToUpdate = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < playersToUpdate; i++) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const player = players[randomIndex];

      if (player.thru < 18) {
        // Simulate completing another hole
        const scoreChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        player.score += scoreChange;
        player.today += scoreChange;
        player.thru += 1;

        // Update position and trend (simplified)
        const oldPosition = player.position;
        players.sort((a, b) => a.score - b.score);
        players.forEach((p, index) => {
          p.previousPosition = p.position;
          p.position = index + 1;
          if (p.position < (p.previousPosition || p.position)) {
            p.trend = "up";
          } else if (p.position > (p.previousPosition || p.position)) {
            p.trend = "down";
          } else {
            p.trend = "same";
          }
        });
      }
    }

    players = [...players]; // Trigger reactivity
    lastUpdate = new Date();
  }

  onMount(() => {
    // Start live updates every 30 seconds
    if (isLive) {
      updateInterval = setInterval(simulateUpdate, 30000);
    }
  });

  onDestroy(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  function toggleLiveUpdates() {
    isLive = !isLive;
    if (isLive) {
      updateInterval = setInterval(simulateUpdate, 30000);
    } else {
      clearInterval(updateInterval);
    }
  }

  function formatScore(score: number): string {
    if (score === 0) return "E";
    return score > 0 ? `+${score}` : `${score}`;
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Group players by team or company for different views
  $: groupedData =
    selectedView === "team"
      ? groupBy(players, "team")
      : selectedView === "company"
        ? groupBy(players, "company")
        : null;

  function groupBy(array: Player[], key: keyof Player) {
    return array.reduce(
      (groups, item) => {
        const group = item[key] as string;
        if (!groups[group]) {
          groups[group] = [];
        }
        groups[group].push(item);
        return groups;
      },
      {} as Record<string, Player[]>
    );
  }
</script>

<svelte:head>
  <title>Live Leaderboard - IBM Charity Golf Tournament 2026</title>
  <meta
    name="description"
    content="Follow live scoring and leaderboard updates from the IBM Charity Golf Tournament. Real-time scores, standings, and player progress."
  />
</svelte:head>

<!-- Hero Section -->
<section class="page-hero">
  <div class="container">
    <h1>Live Tournament Leaderboard</h1>
    <p class="hero-subtitle">Real-time scoring and standings</p>
    <div class="tournament-status">
      <div class="status-indicator" class:live={isLive}>
        <span class="status-dot"></span>
        {isLive ? "LIVE" : "PAUSED"}
      </div>
      <div class="last-update">
        Last updated: {formatTime(lastUpdate)}
      </div>
    </div>
  </div>
</section>

<!-- Controls -->
<section class="controls section">
  <div class="container">
    <div class="controls-row">
      <div class="view-selector">
        <button
          class="view-btn"
          class:active={selectedView === "overall"}
          on:click={() => (selectedView = "overall")}
        >
          Overall Leaderboard
        </button>
        <button
          class="view-btn"
          class:active={selectedView === "team"}
          on:click={() => (selectedView = "team")}
        >
          By Team
        </button>
        <button
          class="view-btn"
          class:active={selectedView === "company"}
          on:click={() => (selectedView = "company")}
        >
          By Company
        </button>
      </div>

      <div class="live-controls">
        <button class="live-toggle-btn" on:click={toggleLiveUpdates}>
          {isLive ? "⏸️ Pause Updates" : "▶️ Resume Updates"}
        </button>
        <button class="refresh-btn" on:click={simulateUpdate}>
          🔄 Refresh Now
        </button>
      </div>
    </div>
  </div>
</section>

<!-- Leaderboard Display -->
<section class="leaderboard-section section">
  <div class="container">
    {#if selectedView === "overall"}
      <!-- Overall Leaderboard -->
      <div class="leaderboard-container">
        <div class="leaderboard-header">
          <span class="col-pos">Pos</span>
          <span class="col-trend">📈</span>
          <span class="col-player">Player / Team</span>
          <span class="col-company">Company</span>
          <span class="col-score">Score</span>
          <span class="col-today">Today</span>
          <span class="col-thru">Thru</span>
        </div>

        <div class="leaderboard-body">
          {#each players as player, index}
            <div
              class="leaderboard-row"
              class:leader={index === 0}
              class:top3={index < 3}
            >
              <span class="col-pos position-{player.position}">
                {player.position}
                {#if player.position === 1}
                  <span class="leader-badge">🏆</span>
                {/if}
              </span>
              <span class="col-trend">
                {#if player.trend === "up"}
                  <span class="trend-up">↗️</span>
                {:else if player.trend === "down"}
                  <span class="trend-down">↘️</span>
                {:else}
                  <span class="trend-same">➡️</span>
                {/if}
              </span>
              <span class="col-player">
                <div class="player-info">
                  <div class="player-name">{player.name}</div>
                  <div class="team-name">{player.team}</div>
                </div>
              </span>
              <span class="col-company">{player.company}</span>
              <span class="col-score score-display"
                >{formatScore(player.score)}</span
              >
              <span class="col-today">{formatScore(player.today)}</span>
              <span class="col-thru">{player.thru}/18</span>
            </div>
          {/each}
        </div>
      </div>
    {:else if groupedData}
      <!-- Grouped View -->
      <div class="grouped-leaderboard">
        {#each Object.entries(groupedData) as [groupName, groupPlayers]}
          <div class="group-section">
            <h3 class="group-header">{groupName}</h3>
            <div class="group-leaderboard">
              <div class="leaderboard-header">
                <span class="col-pos">Pos</span>
                <span class="col-player">Player</span>
                <span class="col-score">Score</span>
                <span class="col-thru">Thru</span>
              </div>
              {#each groupPlayers.sort((a, b) => a.score - b.score) as player}
                <div class="leaderboard-row">
                  <span class="col-pos">{player.position}</span>
                  <span class="col-player">{player.name}</span>
                  <span class="col-score">{formatScore(player.score)}</span>
                  <span class="col-thru">{player.thru}/18</span>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- Tournament Info -->
<section class="tournament-info section">
  <div class="container">
    <div class="info-grid">
      <div class="info-card">
        <h4>Tournament Format</h4>
        <p>18-Hole Scramble</p>
        <p>4-Person Teams</p>
      </div>
      <div class="info-card">
        <h4>Course Par</h4>
        <p>Par 72</p>
        <p>6,800 yards</p>
      </div>
      <div class="info-card">
        <h4>Weather</h4>
        <p>Sunny, 75°F</p>
        <p>Light breeze</p>
      </div>
      <div class="info-card">
        <h4>Prize Fund</h4>
        <p>Trophies & Prizes</p>
        <p>Charity Fundraising</p>
      </div>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  .page-hero {
    background: linear-gradient(
      135deg,
      var(--primary-green) 0%,
      var(--light-green) 100%
    );
    color: var(--white);
    padding: 6rem 0 4rem;
    text-align: center;
  }

  .page-hero h1 {
    color: var(--white);
    margin-bottom: 1rem;
  }

  .hero-subtitle {
    font-size: 1.4rem;
    opacity: 0.9;
    font-weight: 400;
    margin-bottom: 2rem;
  }

  .tournament-status {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 25px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-indicator.live {
    background: var(--accent-yellow);
    color: var(--text-dark);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .last-update {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* Controls */
  .controls {
    background-color: var(--light-gray);
    padding: 2rem 0;
  }

  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .view-selector {
    display: flex;
    gap: 0.5rem;
    background: var(--white);
    padding: 0.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }

  .view-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    background: transparent;
    color: var(--dark-gray);
    font-weight: 500;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
  }

  .view-btn.active {
    background: var(--primary-green);
    color: var(--white);
  }

  .view-btn:hover:not(.active) {
    background: var(--light-gray);
  }

  .live-controls {
    display: flex;
    gap: 1rem;
  }

  .live-toggle-btn,
  .refresh-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--primary-green);
    background: var(--white);
    color: var(--primary-green);
    font-weight: 600;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
  }

  .live-toggle-btn:hover,
  .refresh-btn:hover {
    background: var(--primary-green);
    color: var(--white);
  }

  /* Leaderboard Table */
  .leaderboard-container {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .leaderboard-header {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    display: grid;
    grid-template-columns: 60px 50px 2fr 1fr 80px 80px 80px;
    padding: 1rem;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .leaderboard-body {
    max-height: 600px;
    overflow-y: auto;
  }

  .leaderboard-row {
    display: grid;
    grid-template-columns: 60px 50px 2fr 1fr 80px 80px 80px;
    padding: 1rem;
    border-bottom: 1px solid var(--light-gray);
    transition: var(--transition);
    align-items: center;
  }

  .leaderboard-row:hover {
    background-color: rgba(25, 128, 56, 0.05);
  }

  .leaderboard-row.leader {
    background: linear-gradient(
      135deg,
      var(--accent-yellow),
      var(--dark-yellow)
    );
    font-weight: 600;
  }

  .leaderboard-row.top3 {
    background: rgba(25, 128, 56, 0.1);
  }

  .col-pos {
    text-align: center;
    font-weight: 700;
    font-size: 1.1rem;
  }

  .position-1 {
    color: var(--accent-yellow);
    font-size: 1.3rem;
  }

  .position-2,
  .position-3 {
    color: var(--primary-green);
  }

  .leader-badge {
    margin-left: 0.25rem;
  }

  .col-trend {
    text-align: center;
    font-size: 1.2rem;
  }

  .trend-up {
    color: var(--primary-green);
  }

  .trend-down {
    color: #dc3545;
  }

  .trend-same {
    color: var(--medium-gray);
  }

  .player-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .player-name {
    font-weight: 600;
    color: var(--text-dark);
  }

  .team-name {
    font-size: 0.9rem;
    color: var(--medium-gray);
  }

  .col-company {
    font-size: 0.9rem;
    color: var(--dark-gray);
  }

  .score-display {
    font-weight: 700;
    font-size: 1.2rem;
    text-align: center;
    color: var(--primary-green);
  }

  .col-today,
  .col-thru {
    text-align: center;
    font-size: 0.95rem;
    color: var(--dark-gray);
  }

  /* Grouped Leaderboard */
  .grouped-leaderboard {
    display: grid;
    gap: 2rem;
  }

  .group-section {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .group-header {
    background: var(--primary-green);
    color: var(--white);
    padding: 1.5rem;
    margin: 0;
    font-size: 1.3rem;
    text-align: center;
  }

  .group-leaderboard .leaderboard-header {
    grid-template-columns: 80px 2fr 100px 100px;
  }

  .group-leaderboard .leaderboard-row {
    grid-template-columns: 80px 2fr 100px 100px;
  }

  /* Tournament Info */
  .tournament-info {
    background-color: var(--light-gray);
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .info-card {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    text-align: center;
    box-shadow: var(--shadow);
  }

  .info-card h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  .info-card p {
    margin: 0.5rem 0;
    color: var(--dark-gray);
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .controls-row {
      flex-direction: column;
      align-items: stretch;
    }

    .view-selector {
      justify-content: center;
    }

    .live-controls {
      justify-content: center;
    }

    .leaderboard-header {
      grid-template-columns: 50px 30px 2fr 80px 60px;
      font-size: 0.8rem;
      padding: 0.75rem 0.5rem;
    }

    .leaderboard-row {
      grid-template-columns: 50px 30px 2fr 80px 60px;
      padding: 0.75rem 0.5rem;
    }

    .col-company,
    .col-today {
      display: none;
    }

    .group-leaderboard .leaderboard-header,
    .group-leaderboard .leaderboard-row {
      grid-template-columns: 60px 2fr 80px 60px;
    }

    .tournament-status {
      flex-direction: column;
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 4rem 0 2rem;
    }

    .view-selector {
      flex-direction: column;
    }

    .live-controls {
      flex-direction: column;
    }

    .player-info {
      gap: 0.125rem;
    }

    .player-name {
      font-size: 0.9rem;
    }

    .team-name {
      font-size: 0.8rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .info-card {
      padding: 1.5rem;
    }
  }
</style>
