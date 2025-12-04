<script lang="ts">
  // Tournament history data
  const tournaments = [
    {
      year: 2026,
      status: "upcoming",
      title: "Upcoming Tournament",
      description:
        "Join us for our biggest tournament yet on June 12, 2026. Registration opens soon!",
      participants: "Expected: 120+",
      amountRaised: "Goal: $25,000+",
      charity: "CHARITY TBD",
      winner: null,
      highlights: [
        "New 12:00 PM EST start time",
        "Enhanced sponsorship packages",
        "Live leaderboard updates",
        "Expanded volunteer opportunities",
      ],
    },
    {
      year: 2025,
      status: "completed",
      title: "Record Participation",
      description:
        "120 players participated, raising $25,000 for Kate's Krew. Our most successful tournament to date.",
      participants: 120,
      amountRaised: "$25,000",
      charity: "Kate's Krew",
      winner: "Team IBM Solutions",
      winningScore: 58,
      highlights: [
        "Exceeded fundraising goal",
        "Perfect weather conditions",
        "New course record set",
        "15+ corporate sponsors",
      ],
    },
    {
      year: 2024,
      status: "completed",
      title: "Growing Impact",
      description:
        "95 players joined the cause, contributing $18,500 to support Kate's Krew.",
      participants: 95,
      amountRaised: "$18,500",
      charity: "Kate's Krew",
      winner: "Team Cloud Computing",
      winningScore: 61,
      highlights: [
        "First year with 90+ participants",
        "Introduced silent auction",
        "Corporate foursome packages launched",
        "Professional photography added",
      ],
    },
    {
      year: 2023,
      status: "completed",
      title: "Building Momentum",
      description:
        "72 dedicated golfers came together, raising $15,000 for the cause.",
      participants: 72,
      amountRaised: "$15,000",
      charity: "Kate's Krew",
      winner: "Team Watson",
      winningScore: 63,
      highlights: [
        "Established tournament format",
        "Added awards ceremony dinner",
        "First hole sponsorships",
        "Volunteer program launched",
      ],
    },
    {
      year: 2022,
      status: "completed",
      title: "First Tournament",
      description:
        "Our inaugural event brought together 48 IBM employees and friends, raising $12,000.",
      participants: 48,
      amountRaised: "$12,000",
      charity: "Kate's Krew",
      winner: "Team Founders",
      winningScore: 65,
      highlights: [
        "Tournament founding year",
        "Grassroots community effort",
        "Local course partnership",
        "Foundation for future growth",
      ],
    },
  ];
</script>

<svelte:head>
  <title>Tournament History - IBM Charity Golf Tournament</title>
  <meta
    name="description"
    content="Explore the history of the IBM Charity Golf Tournament from 2022 to present. See past winners, fundraising achievements, and tournament highlights."
  />
</svelte:head>

<!-- Hero Section -->
<section class="page-hero">
  <div class="container">
    <h1>Tournament History</h1>
    <p class="hero-subtitle">Celebrating years of giving back and great golf</p>
    <div class="hero-stats">
      <div class="stat-item">
        <span class="stat-number">5</span>
        <span class="stat-label">Years Running</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">455+</span>
        <span class="stat-label">Total Participants</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">$95,500+</span>
        <span class="stat-label">Total Raised</span>
      </div>
    </div>
  </div>
</section>

<!-- Timeline Section -->
<section class="timeline-section section">
  <div class="container">
    <h2>Tournament Timeline</h2>
    <p class="section-subtitle">
      From humble beginnings to community tradition
    </p>

    <div class="timeline">
      {#each tournaments as tournament, index}
        <div
          class="timeline-item"
          class:upcoming={tournament.status === "upcoming"}
        >
          <div class="timeline-marker">
            <div
              class="year-badge"
              class:upcoming={tournament.status === "upcoming"}
            >
              {tournament.year}
            </div>
          </div>

          <div class="timeline-content">
            <div class="tournament-card">
              <div class="card-header">
                <h3>{tournament.title}</h3>
                {#if tournament.status === "upcoming"}
                  <span class="status-badge upcoming">Upcoming</span>
                {:else}
                  <span class="status-badge completed">Completed</span>
                {/if}
              </div>

              <div class="card-body">
                <p class="tournament-description">{tournament.description}</p>

                <div class="tournament-stats">
                  <div class="stat-row">
                    <div class="stat">
                      <span class="stat-label">Participants:</span>
                      <span class="stat-value">{tournament.participants}</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">Amount Raised:</span>
                      <span class="stat-value">{tournament.amountRaised}</span>
                    </div>
                  </div>
                  <div class="stat-row">
                    <div class="stat">
                      <span class="stat-label">Supporting:</span>
                      <span class="stat-value">{tournament.charity}</span>
                    </div>
                    {#if tournament.winner}
                      <div class="stat">
                        <span class="stat-label">Winner:</span>
                        <span class="stat-value"
                          >{tournament.winner} ({tournament.winningScore})</span
                        >
                      </div>
                    {/if}
                  </div>
                </div>

                <div class="highlights">
                  <h4>Highlights</h4>
                  <ul class="highlights-list">
                    {#each tournament.highlights as highlight}
                      <li>{highlight}</li>
                    {/each}
                  </ul>
                </div>

                {#if tournament.status === "upcoming"}
                  <div class="cta-buttons">
                    <a href="/register" class="btn btn-primary">Register Now</a>
                    <a href="/sponsorship" class="btn btn-secondary"
                      >Become a Sponsor</a
                    >
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Awards Gallery -->
<section class="awards-section section">
  <div class="container">
    <h2>Awards & Recognition</h2>
    <div class="awards-grid">
      <div class="award-card">
        <div class="award-icon">🏆</div>
        <h3>Tournament Champions</h3>
        <div class="champions-list">
          <div class="champion-year">
            <span class="year">2025:</span>
            <span class="winner">Team IBM Solutions (58)</span>
          </div>
          <div class="champion-year">
            <span class="year">2024:</span>
            <span class="winner">Team Cloud Computing (61)</span>
          </div>
          <div class="champion-year">
            <span class="year">2023:</span>
            <span class="winner">Team Watson (63)</span>
          </div>
          <div class="champion-year">
            <span class="year">2022:</span>
            <span class="winner">Team Founders (65)</span>
          </div>
        </div>
      </div>

      <div class="award-card">
        <div class="award-icon">🎯</div>
        <h3>Special Awards</h3>
        <div class="special-awards">
          <div class="award-item">
            <strong>Longest Drive:</strong>
            <span>Mike Johnson (2025) - 285 yards</span>
          </div>
          <div class="award-item">
            <strong>Closest to Pin:</strong>
            <span>Sarah Chen (2025) - 3 feet 2 inches</span>
          </div>
          <div class="award-item">
            <strong>Most Improved Team:</strong>
            <span>Team Rising Stars (2024)</span>
          </div>
          <div class="award-item">
            <strong>Best Team Spirit:</strong>
            <span>Team Thunder (2024)</span>
          </div>
        </div>
      </div>

      <div class="award-card">
        <div class="award-icon">💝</div>
        <h3>Impact Awards</h3>
        <div class="impact-awards">
          <div class="award-item">
            <strong>Top Corporate Sponsor:</strong>
            <span>TechCorp Solutions (2025)</span>
          </div>
          <div class="award-item">
            <strong>Volunteer of the Year:</strong>
            <span>Jennifer Martinez (2024)</span>
          </div>
          <div class="award-item">
            <strong>Community Champion:</strong>
            <span>IBM Buffalo Team (2023)</span>
          </div>
          <div class="award-item">
            <strong>Fundraising Excellence:</strong>
            <span>Record $25,000 raised (2025)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Photo Gallery Preview -->
<section class="gallery-preview section">
  <div class="container">
    <h2>Tournament Memories</h2>
    <p class="section-subtitle">Capturing the spirit of our annual tradition</p>

    <div class="gallery-grid">
      <div class="gallery-item large">
        <div class="image-placeholder">
          <div class="placeholder-content">
            <h4>2025 Tournament Highlights</h4>
            <p>Championship ceremony and celebration</p>
          </div>
        </div>
      </div>
      <div class="gallery-item">
        <div class="image-placeholder">
          <div class="placeholder-content">
            <h5>Sponsor Recognition</h5>
            <p>Corporate partners celebration</p>
          </div>
        </div>
      </div>
      <div class="gallery-item">
        <div class="image-placeholder">
          <div class="placeholder-content">
            <h5>Golf Action</h5>
            <p>Players on the course</p>
          </div>
        </div>
      </div>
      <div class="gallery-item">
        <div class="image-placeholder">
          <div class="placeholder-content">
            <h5>Awards Dinner</h5>
            <p>Evening celebration</p>
          </div>
        </div>
      </div>
      <div class="gallery-item">
        <div class="image-placeholder">
          <div class="placeholder-content">
            <h5>Team Spirit</h5>
            <p>Camaraderie and fun</p>
          </div>
        </div>
      </div>
    </div>

    <div class="gallery-note">
      <p>
        Professional photography captures every tournament moment. Participants
        receive complimentary digital copies of all photos.
      </p>
    </div>
  </div>
</section>

<!-- Join Us CTA -->
<section class="join-cta section">
  <div class="container">
    <div class="cta-content">
      <h2>Be Part of Our Next Chapter</h2>
      <p>
        Join us in 2026 as we continue this amazing tradition of golf, giving,
        and community building.
      </p>

      <div class="cta-buttons">
        <a href="/register" class="btn btn-primary btn-large"
          >Register for 2026</a
        >
        <a href="/sponsorship" class="btn btn-secondary btn-large"
          >Sponsor the Tournament</a
        >
        <a href="/volunteer" class="btn btn-outline btn-large">Volunteer</a>
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
    margin-bottom: 3rem;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 600px;
    margin: 0 auto;
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
  }

  .stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Timeline */
  .timeline {
    position: relative;
    margin: 3rem 0;
  }

  .timeline::before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      var(--primary-green),
      var(--light-green)
    );
    border-radius: 2px;
  }

  .timeline-item {
    display: flex;
    margin: 4rem 0;
    align-items: center;
    position: relative;
  }

  .timeline-item:nth-child(odd) .timeline-content {
    margin-left: auto;
    margin-right: 2rem;
    text-align: right;
  }

  .timeline-item:nth-child(even) .timeline-content {
    margin-left: 2rem;
    margin-right: auto;
  }

  .timeline-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  .year-badge {
    background: var(--primary-green);
    color: var(--white);
    padding: 1rem 1.5rem;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1.2rem;
    min-width: 120px;
    text-align: center;
    box-shadow: var(--shadow);
    border: 3px solid var(--white);
  }

  .year-badge.upcoming {
    background: var(--accent-yellow);
    color: var(--text-dark);
  }

  .timeline-content {
    flex: 1;
    max-width: 45%;
  }

  /* Tournament Cards */
  .tournament-card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
  }

  .tournament-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }

  .card-header {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-header h3 {
    color: var(--white);
    margin: 0;
    font-size: 1.5rem;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-badge.upcoming {
    background: var(--accent-yellow);
    color: var(--text-dark);
  }

  .status-badge.completed {
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
  }

  .card-body {
    padding: 2rem;
  }

  .tournament-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: var(--dark-gray);
  }

  .tournament-stats {
    margin-bottom: 2rem;
  }

  .stat-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat .stat-label {
    font-size: 0.9rem;
    color: var(--medium-gray);
    font-weight: 500;
  }

  .stat .stat-value {
    font-weight: 600;
    color: var(--primary-green);
    font-size: 1rem;
  }

  .highlights {
    background: var(--light-gray);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
  }

  .highlights h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .highlights-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .highlights-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--dark-gray);
  }

  .highlights-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--primary-green);
    font-weight: bold;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  /* Awards Section */
  .awards-section {
    background-color: var(--light-gray);
  }

  .awards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .award-card {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius-large);
    text-align: center;
    box-shadow: var(--shadow);
    transition: var(--transition);
  }

  .award-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  .award-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  .award-card h3 {
    color: var(--primary-green);
    margin-bottom: 1.5rem;
  }

  .champions-list,
  .special-awards,
  .impact-awards {
    text-align: left;
  }

  .champion-year {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .champion-year .year {
    font-weight: 600;
    color: var(--primary-green);
  }

  .champion-year .winner {
    color: var(--dark-gray);
  }

  .award-item {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--light-gray);
  }

  .award-item:last-child {
    border-bottom: none;
  }

  .award-item strong {
    color: var(--primary-green);
    display: block;
    margin-bottom: 0.25rem;
  }

  .award-item span {
    color: var(--dark-gray);
    font-size: 0.95rem;
  }

  /* Gallery Preview */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 3rem;
  }

  .gallery-item {
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);
  }

  .gallery-item:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }

  .gallery-item.large {
    grid-column: span 2;
    grid-row: span 2;
  }

  .image-placeholder {
    background: linear-gradient(
      135deg,
      var(--light-green),
      var(--primary-green)
    );
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    text-align: center;
  }

  .gallery-item.large .image-placeholder {
    height: 400px;
  }

  .placeholder-content h4,
  .placeholder-content h5 {
    color: var(--white);
    margin-bottom: 0.5rem;
  }

  .placeholder-content p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }

  .gallery-note {
    text-align: center;
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    font-style: italic;
    color: var(--dark-gray);
  }

  /* Join CTA */
  .join-cta {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    text-align: center;
  }

  .join-cta h2 {
    color: var(--white);
    margin-bottom: 1rem;
  }

  .join-cta p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .join-cta .cta-buttons {
    justify-content: center;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .timeline::before {
      left: 20px;
    }

    .timeline-marker {
      left: 20px;
    }

    .timeline-content {
      max-width: calc(100% - 60px);
      margin-left: 60px !important;
      margin-right: 0 !important;
      text-align: left !important;
    }

    .hero-stats {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .stat-row {
      grid-template-columns: 1fr;
    }

    .cta-buttons {
      flex-direction: column;
    }

    .cta-buttons .btn {
      width: 100%;
    }

    .awards-grid {
      grid-template-columns: 1fr;
    }

    .gallery-item.large {
      grid-column: span 1;
      grid-row: span 1;
    }

    .gallery-item.large .image-placeholder {
      height: 200px;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 4rem 0 2rem;
    }

    .card-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .card-body {
      padding: 1.5rem;
    }

    .award-card {
      padding: 1.5rem;
    }

    .timeline-item {
      margin: 2rem 0;
    }
  }
</style>
