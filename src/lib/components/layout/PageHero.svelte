<script lang="ts">
  export let title: string;
  export let subtitle: string = "";
  export let variant: "default" | "home" = "default";

  interface Stat {
    number: string;
    label: string;
  }

  export let stats: Stat[] = [];
  export let showTournamentInfo = false;

  // Tournament info details
  const tournamentDetails = [
    { label: "Date:", value: "June 12, 2026" },
    { label: "Start Time:", value: "12:00 PM EST" },
    { label: "Format:", value: "18-Hole Scramble" },
  ];
</script>

<section class="page-hero" class:home-hero={variant === "home"}>
  {#if variant === "home"}
    <div class="hero-background"></div>
  {/if}

  <div class="hero-content">
    <div class="container">
      <div class="hero-text">
        <h1 class="hero-title">{title}</h1>
        {#if subtitle}
          <p class="hero-subtitle">{subtitle}</p>
        {/if}

        {#if variant === "home"}
          <div class="tournament-date">
            <div class="date-main">June 12, 2026</div>
            <div class="date-details">12:00 PM EST</div>
          </div>
        {/if}

        {#if showTournamentInfo}
          <div class="tournament-details">
            {#each tournamentDetails as detail}
              <div class="detail-item">
                <span class="detail-label">{detail.label}</span>
                <span class="detail-value">{detail.value}</span>
              </div>
            {/each}
          </div>
        {/if}

        {#if stats.length > 0}
          <div class="hero-stats">
            {#each stats as stat}
              <div class="stat-item">
                <span class="stat-number">{stat.number}</span>
                <span class="stat-label">{stat.label}</span>
              </div>
            {/each}
          </div>
        {/if}

        {#if $$slots.actions}
          <div class="hero-actions">
            <slot name="actions" />
          </div>
        {/if}
      </div>

      {#if $$slots.content}
        <slot name="content" />
      {/if}
    </div>
  </div>
</section>

<style>
  .page-hero {
    background: linear-gradient(
      135deg,
      var(--primary-green) 0%,
      var(--light-green) 100%
    );
    color: var(--white);
    padding: 6rem 0 4rem;
    text-align: center;
    position: relative;
  }

  /* Home hero specific styles */
  .home-hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--primary-green) 0%,
      var(--light-green) 50%,
      var(--accent-yellow) 100%
    );
    opacity: 0.95;
  }

  .hero-background::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      radial-gradient(
        circle at 20% 50%,
        rgba(255, 255, 255, 0.1) 2px,
        transparent 2px
      ),
      radial-gradient(
        circle at 80% 50%,
        rgba(255, 255, 255, 0.1) 1px,
        transparent 1px
      );
    background-size:
      50px 50px,
      30px 30px;
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px) translateX(0px);
    }
    50% {
      transform: translateY(-20px) translateX(10px);
    }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    width: 100%;
  }

  .hero-title {
    color: var(--white);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1.1;
  }

  .home-hero .hero-title {
    font-size: clamp(3rem, 6vw, 5rem);
  }

  .hero-subtitle {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    color: var(--white);
    margin-bottom: 2rem;
    font-weight: 400;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    opacity: 0.9;
  }

  .home-hero .hero-subtitle {
    margin-bottom: 0.5rem;
  }

  /* Tournament date (home page specific) */
  .tournament-date {
    margin-bottom: 3rem;
    text-align: center;
  }

  .date-main {
    font-size: clamp(2rem, 4vw, 2.8rem);
    color: var(--white);
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .date-details {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    color: var(--white);
    font-weight: 600;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* Tournament details */
  .tournament-details {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .detail-label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--accent-yellow);
  }

  .detail-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--white);
  }

  /* Stats */
  .hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 2rem;
    max-width: 600px;
    margin: 3rem auto 0;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-yellow);
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }

  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Actions */
  .hero-actions {
    margin-top: 3rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Tournament info (contact page specific) */
  .tournament-info {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .info-item strong {
    color: var(--accent-yellow);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-item span {
    font-size: 1.1rem;
    font-weight: 500;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .tournament-details,
    .tournament-info {
      flex-direction: column;
      gap: 1.5rem;
    }

    .hero-stats {
      grid-template-columns: 1fr;
      gap: 1rem;
      margin: 2rem auto 0;
    }

    .hero-actions {
      flex-direction: column;
      align-items: center;
    }

    .hero-actions :global(.btn) {
      width: 100%;
      max-width: 300px;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 4rem 0 2rem;
    }

    .home-hero {
      min-height: 100vh;
    }

    .stat-number {
      font-size: 2rem;
    }
  }
</style>
