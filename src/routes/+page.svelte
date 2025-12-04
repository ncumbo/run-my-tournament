<script lang="ts">
  import { PageHero, CountdownTimer, Card, Button } from "$lib/components";

  // Tournament date: June 12, 2026 at 12:00 PM EST
  const tournamentDate = new Date("2026-06-12T12:00:00-05:00");
</script>

<svelte:head>
  <title>IBM Charity Golf Tournament 2026</title>
  <meta
    name="description"
    content="Join the annual IBM Charity Golf Tournament on June 12, 2026. Supporting CHARITY TBD with golf, giving, and community spirit."
  />
</svelte:head>

<!-- Hero Section -->
<PageHero
  title="IBM Charity Golf Tournament"
  subtitle="Supporting CHARITY TBD & Making a Difference"
  variant="home"
>
  <svelte:fragment slot="content">
    <CountdownTimer targetDate={tournamentDate} title="Tournament Countdown" />
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <Button href="/register" variant="primary" size="large">Register Now</Button
    >
    <Button href="/sponsorship" variant="secondary" size="large"
      >Become a Sponsor</Button
    >
  </svelte:fragment>
</PageHero>

<!-- Quick Info Section -->
<section class="quick-info section">
  <div class="container">
    <h2>Tournament Information</h2>
    <div class="info-grid">
      <Card variant="info" hoverable={true}>
        <div class="card-icon">📅</div>
        <h3>Date & Time</h3>
        <p>June 12, 2026</p>
        <p>8:00 AM Shotgun Start</p>
      </Card>

      <Card variant="info" hoverable={true}>
        <div class="card-icon">🏌️</div>
        <h3>Format</h3>
        <p>18-Hole Scramble</p>
        <p>All skill levels welcome</p>
      </Card>

      <Card variant="info" hoverable={true}>
        <div class="card-icon">❤️</div>
        <h3>Supporting</h3>
        <p>CHARITY TBD</p>
        <p>Making a difference together</p>
      </Card>

      <Card variant="info" hoverable={true}>
        <div class="card-icon">🏆</div>
        <h3>Registration</h3>
        <p>Individual: $150</p>
        <p>Foursome: $550</p>
      </Card>
    </div>
  </div>
</section>

<!-- About Preview Section -->
<section class="about-preview section">
  <div class="container">
    <div class="about-content">
      <div class="about-text">
        <h2>About Our Tournament</h2>
        <p class="lead-text">
          What began as a heartfelt initiative to support CHARITY TBD has grown
          into an annual tradition that brings together IBM employees, partners,
          and the community for a day of golf and giving back.
        </p>
        <p>
          Join us for competitive golf, networking opportunities, and the chance
          to make a real difference in our community. Whether you're a seasoned
          golfer or just starting out, our tournament welcomes players of all
          skill levels.
        </p>

        <div class="features-list">
          <div class="feature-item">
            <span class="feature-icon">⛳</span>
            <span>Professional golf course setting</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🍽️</span>
            <span>Awards ceremony dinner</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎁</span>
            <span>Silent auction & prizes</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🤝</span>
            <span>Networking opportunities</span>
          </div>
        </div>

        <Button href="/about" variant="outline"
          >Learn More About Our Mission</Button
        >
      </div>
      <div class="about-image">
        <div class="image-placeholder">
          <div class="placeholder-content">
            <h4>Tournament Highlights</h4>
            <p>Photos from previous tournaments</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Sponsorship CTA -->
<section class="sponsorship-cta section">
  <div class="container">
    <div class="cta-content">
      <h2>Partner With Us</h2>
      <p class="cta-text">
        Join leading companies in supporting our community while gaining
        valuable brand visibility. Our sponsorship packages offer excellent
        opportunities to connect with professionals and make a lasting impact.
      </p>
      <div class="cta-highlights">
        <div class="highlight-item">
          <strong>Corporate Foursome</strong>
          <span>$2,500 - Includes 4 players + 3 hole sponsorships</span>
        </div>
        <div class="highlight-item">
          <strong>Hole Sponsorship</strong>
          <span>$500 - Tee box signage and recognition</span>
        </div>
        <div class="highlight-item">
          <strong>Premium Packages</strong>
          <span>$5,000+ - Maximum visibility and perks</span>
        </div>
      </div>
      <Button href="/sponsorship" variant="primary" size="large">
        View Sponsorship Packages
      </Button>
    </div>
  </div>
</section>

<style>
  /* Hero Section */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
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
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    color: var(--white);
    margin-bottom: 0.5rem;
    font-weight: 400;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

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

  /* Countdown Timer */
  .countdown-container {
    margin: 3rem auto;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.15);
    border-radius: var(--border-radius-large);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 600px;
  }

  .countdown-container h3 {
    color: var(--white);
    margin-bottom: 2rem;
    font-size: 1.5rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .countdown {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .time-unit {
    background: rgba(255, 255, 255, 0.2);
    padding: 1.5rem 1rem;
    border-radius: var(--border-radius);
    text-align: center;
    backdrop-filter: blur(5px);
  }

  .time-number {
    display: block;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: var(--white);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1;
  }

  .time-label {
    display: block;
    font-size: 0.9rem;
    color: var(--white);
    font-weight: 500;
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .hero-buttons {
    margin-top: 3rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Quick Info Section */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  /* About Preview */
  .about-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  .lead-text {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--primary-green);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .features-list {
    margin: 2rem 0;
  }

  .feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .feature-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    width: 2rem;
  }

  .image-placeholder {
    background: linear-gradient(
      135deg,
      var(--light-green),
      var(--primary-green)
    );
    height: 400px;
    border-radius: var(--border-radius-large);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    text-align: center;
  }

  .placeholder-content h4 {
    color: var(--white);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .placeholder-content p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
  }

  /* Sponsorship CTA */
  .sponsorship-cta {
    background: linear-gradient(
      135deg,
      var(--light-gray) 0%,
      var(--white) 100%
    );
  }

  .cta-content {
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .cta-text {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: var(--dark-gray);
  }

  .cta-highlights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .highlight-item {
    background: var(--white);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .highlight-item strong {
    color: var(--primary-green);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    display: block;
  }

  .highlight-item span {
    color: var(--dark-gray);
    font-size: 0.95rem;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .countdown {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .time-unit {
      padding: 1rem 0.5rem;
    }

    .hero-buttons {
      flex-direction: column;
      align-items: center;
    }

    .hero-buttons .btn {
      width: 100%;
      max-width: 300px;
    }

    .about-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .info-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .cta-highlights {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .countdown-container {
      padding: 1.5rem;
      margin: 2rem auto;
    }

    .countdown {
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }

    .time-unit {
      padding: 1rem 0.5rem;
    }

    .time-number {
      font-size: 1.5rem;
    }

    .time-label {
      font-size: 0.7rem;
    }

    .info-card {
      padding: 1.5rem;
    }

    .info-icon {
      font-size: 2.5rem;
    }
  }
</style>
