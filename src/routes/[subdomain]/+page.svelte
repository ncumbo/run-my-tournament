<script lang="ts">
  import { page } from "$app/stores";

  export let data;

  $: ({ organization, tournaments } = data);

  // Get upcoming tournaments
  $: upcomingTournaments = tournaments
    .filter((t) => new Date(t.event_date) > new Date())
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);

  // Get featured tournament (next upcoming)
  $: featuredTournament = upcomingTournaments[0];

  // Statistics
  $: stats = {
    totalTournaments: tournaments.length,
    upcomingEvents: upcomingTournaments.length,
    activeRegistrations: upcomingTournaments.filter(
      (t) =>
        !t.registration_deadline ||
        new Date(t.registration_deadline) > new Date()
    ).length,
  };

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  }
</script>

<svelte:head>
  <title>{organization.name} - Golf Tournaments</title>
  <meta
    name="description"
    content="Join {organization.name} for exciting golf tournaments. Register online for upcoming events and be part of our golf community."
  />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  {#if featuredTournament?.hero_image_url}
    <div
      class="hero-background"
      style="background-image: url({featuredTournament.hero_image_url})"
    ></div>
  {:else}
    <div class="hero-background hero-gradient"></div>
  {/if}

  <div class="hero-overlay"></div>

  <div class="hero-content">
    <div class="container">
      <div class="hero-text">
        <h1 class="hero-title">Welcome to {organization.name}</h1>
        {#if featuredTournament}
          <p class="hero-subtitle">
            Join us for our next tournament: <strong
              >{featuredTournament.name}</strong
            >
          </p>
          <p class="hero-date">
            📅 {formatDate(featuredTournament.event_date)}
            {#if featuredTournament.location_city}
              • 📍 {featuredTournament.location_city}, {featuredTournament.location_state}
            {/if}
          </p>
          <div class="hero-actions">
            <a
              href="/{organization.subdomain}/tournament/{featuredTournament.slug}"
              class="cta-primary"
            >
              Learn More
            </a>
            <a
              href="/{organization.subdomain}/register?tournament={featuredTournament.id}"
              class="cta-secondary"
            >
              Register Now
            </a>
          </div>
        {:else}
          <p class="hero-subtitle">
            Creating memorable golf experiences for our community
          </p>
          <div class="hero-actions">
            <a href="/{organization.subdomain}/tournaments" class="cta-primary">
              View Tournaments
            </a>
            <a href="/{organization.subdomain}/about" class="cta-secondary">
              Learn More
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Statistics Section -->
<section class="stats-section">
  <div class="container">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{stats.totalTournaments}</div>
        <div class="stat-label">Total Tournaments</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{stats.upcomingEvents}</div>
        <div class="stat-label">Upcoming Events</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{stats.activeRegistrations}</div>
        <div class="stat-label">Open for Registration</div>
      </div>
    </div>
  </div>
</section>

<!-- Upcoming Tournaments -->
{#if upcomingTournaments.length > 0}
  <section class="tournaments-section">
    <div class="container">
      <div class="section-header">
        <h2>Upcoming Tournaments</h2>
        <p>Don't miss out on these exciting upcoming events</p>
      </div>

      <div class="tournaments-grid">
        {#each upcomingTournaments as tournament}
          <div class="tournament-card">
            {#if tournament.hero_image_url}
              <div class="tournament-image">
                <img src={tournament.hero_image_url} alt={tournament.name} />
              </div>
            {/if}

            <div class="tournament-content">
              <h3 class="tournament-title">
                <a
                  href="/{organization.subdomain}/tournament/{tournament.slug}"
                >
                  {tournament.name}
                </a>
              </h3>

              <div class="tournament-meta">
                <div class="tournament-date">
                  📅 {formatDate(tournament.event_date)}
                </div>
                {#if tournament.location_name}
                  <div class="tournament-location">
                    📍 {tournament.location_name}
                  </div>
                {/if}
              </div>

              {#if tournament.description}
                <p class="tournament-description">
                  {tournament.description.slice(0, 120)}{tournament.description
                    .length > 120
                    ? "..."
                    : ""}
                </p>
              {/if}

              <div class="tournament-pricing">
                {#if tournament.individual_price}
                  <span class="price"
                    >Individual: {formatPrice(
                      tournament.individual_price
                    )}</span
                  >
                {/if}
                {#if tournament.team_price}
                  <span class="price"
                    >Team: {formatPrice(tournament.team_price)}</span
                  >
                {/if}
              </div>

              <div class="tournament-actions">
                <a
                  href="/{organization.subdomain}/tournament/{tournament.slug}"
                  class="btn-outline"
                >
                  View Details
                </a>
                {#if !tournament.registration_deadline || new Date(tournament.registration_deadline) > new Date()}
                  <a
                    href="/{organization.subdomain}/register?tournament={tournament.id}"
                    class="btn-primary"
                  >
                    Register
                  </a>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>

      {#if tournaments.length > 3}
        <div class="section-footer">
          <a href="/{organization.subdomain}/tournaments" class="view-all-link">
            View All Tournaments →
          </a>
        </div>
      {/if}
    </div>
  </section>
{/if}

<!-- About Section -->
<section class="about-section">
  <div class="container">
    <div class="about-content">
      <div class="about-text">
        <h2>About {organization.name}</h2>
        <p>
          We're passionate about bringing together golf enthusiasts for
          memorable tournaments and events. Whether you're a seasoned player or
          just starting out, our tournaments offer something for everyone.
        </p>
        <p>
          Join our community and be part of exciting golf experiences while
          supporting great causes.
        </p>
        <a href="/{organization.subdomain}/about" class="learn-more-link">
          Learn More About Us →
        </a>
      </div>

      <div class="about-features">
        <div class="feature">
          <div class="feature-icon">🏆</div>
          <h4>Competitive Play</h4>
          <p>
            Well-organized tournaments with fair play and exciting competition
          </p>
        </div>
        <div class="feature">
          <div class="feature-icon">🤝</div>
          <h4>Community</h4>
          <p>
            Connect with fellow golf enthusiasts and build lasting friendships
          </p>
        </div>
        <div class="feature">
          <div class="feature-icon">❤️</div>
          <h4>Good Causes</h4>
          <p>
            Many of our events support local charities and community initiatives
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Hero Section */
  .hero {
    position: relative;
    min-height: 70vh;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .hero-gradient {
    background: linear-gradient(
      135deg,
      var(--org-primary-color, #198038),
      var(--org-secondary-color, #0f62fe)
    );
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
  }

  .hero-text {
    max-width: 600px;
    color: white;
  }

  .hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1.25rem;
    margin: 0 0 0.5rem 0;
    opacity: 0.95;
  }

  .hero-date {
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
    opacity: 0.9;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
  }

  .cta-primary,
  .cta-secondary {
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .cta-primary {
    background: white;
    color: var(--org-primary-color, #198038);
  }

  .cta-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .cta-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
  }

  .cta-secondary:hover {
    background: white;
    color: var(--org-primary-color, #198038);
  }

  /* Statistics Section */
  .stats-section {
    padding: 4rem 0;
    background: #f8fafc;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .stat-card {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 700;
    color: var(--org-primary-color, #198038);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #64748b;
    font-weight: 500;
  }

  /* Tournaments Section */
  .tournaments-section {
    padding: 5rem 0;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-header h2 {
    font-size: 2.5rem;
    margin: 0 0 1rem 0;
    color: #1a202c;
  }

  .section-header p {
    font-size: 1.1rem;
    color: #64748b;
    margin: 0;
  }

  .tournaments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .tournament-card {
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }

  .tournament-card:hover {
    transform: translateY(-4px);
  }

  .tournament-image {
    height: 200px;
    overflow: hidden;
  }

  .tournament-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tournament-content {
    padding: 1.5rem;
  }

  .tournament-title a {
    color: #1a202c;
    text-decoration: none;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
  }

  .tournament-title a:hover {
    color: var(--org-primary-color, #198038);
  }

  .tournament-meta {
    margin-bottom: 1rem;
    color: #64748b;
    font-size: 0.9rem;
  }

  .tournament-meta div {
    margin-bottom: 0.25rem;
  }

  .tournament-description {
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .tournament-pricing {
    margin-bottom: 1.5rem;
  }

  .price {
    background: #f1f5f9;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--org-primary-color, #198038);
    margin-right: 0.5rem;
  }

  .tournament-actions {
    display: flex;
    gap: 1rem;
  }

  .btn-outline,
  .btn-primary {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    text-align: center;
    transition: all 0.2s ease;
    flex: 1;
  }

  .btn-outline {
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
  }

  .btn-outline:hover {
    border-color: var(--org-primary-color, #198038);
    color: var(--org-primary-color, #198038);
  }

  .btn-primary {
    border: 1px solid var(--org-primary-color, #198038);
    background: var(--org-primary-color, #198038);
    color: white;
  }

  .btn-primary:hover {
    background: var(--org-secondary-color, #0f62fe);
    border-color: var(--org-secondary-color, #0f62fe);
  }

  .section-footer {
    text-align: center;
    margin-top: 3rem;
  }

  .view-all-link {
    color: var(--org-primary-color, #198038);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .view-all-link:hover {
    text-decoration: underline;
  }

  /* About Section */
  .about-section {
    padding: 5rem 0;
    background: #f8fafc;
  }

  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .about-text h2 {
    font-size: 2.5rem;
    margin: 0 0 1.5rem 0;
    color: #1a202c;
  }

  .about-text p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #4a5568;
    margin-bottom: 1.5rem;
  }

  .learn-more-link {
    color: var(--org-primary-color, #198038);
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .learn-more-link:hover {
    text-decoration: underline;
  }

  .about-features {
    display: grid;
    gap: 2rem;
  }

  .feature {
    text-align: center;
    padding: 1.5rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .feature h4 {
    font-size: 1.25rem;
    margin: 0 0 0.75rem 0;
    color: #1a202c;
  }

  .feature p {
    color: #64748b;
    line-height: 1.6;
    margin: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-subtitle {
      font-size: 1.1rem;
    }

    .hero-actions {
      flex-direction: column;
    }

    .cta-primary,
    .cta-secondary {
      text-align: center;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .tournaments-grid {
      grid-template-columns: 1fr;
    }

    .tournament-actions {
      flex-direction: column;
    }

    .about-content {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    .about-text {
      text-align: center;
    }

    .about-text h2 {
      font-size: 2rem;
    }

    .section-header h2 {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0 1rem;
    }

    .hero {
      min-height: 60vh;
    }

    .hero-title {
      font-size: 1.75rem;
    }

    .tournaments-grid {
      grid-template-columns: 1fr;
    }

    .tournament-card {
      margin: 0 -1rem;
    }

    .stats-section,
    .tournaments-section,
    .about-section {
      padding: 3rem 0;
    }
  }
</style>
