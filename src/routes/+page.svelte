<script lang="ts">
  import { Card, Button } from "$lib/components";

  // Demo viewer state
  let activeTab = "home";
  let showSignupModal = false;

  // Mock data for demo
  const demoTournament = {
    name: "Sample Charity Golf Tournament",
    date: "June 15, 2025",
    charity: "Local Children's Hospital",
    location: "Pine Valley Golf Club",
    individualPrice: 125,
    teamPrice: 450,
  };

  const platformFeatures = [
    {
      icon: "🎯",
      title: "Easy Tournament Setup",
      description:
        "Create professional tournament sites in minutes with our intuitive wizard",
    },
    {
      icon: "💰",
      title: "Integrated Payments",
      description:
        "Secure registration and payment processing with automatic confirmation",
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description:
        "Track registrations, revenue, and participant engagement in real-time",
    },
    {
      icon: "🎨",
      title: "Custom Branding",
      description:
        "Personalize your tournament site with logos, colors, and custom content",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tournament Director",
      quote:
        "Pinpoint Golf made organizing our charity tournament effortless. We raised 40% more than last year!",
    },
    {
      name: "Mike Chen",
      role: "Golf Coordinator",
      quote:
        "The registration process was so smooth. Participants loved the professional look and feel.",
    },
  ];

  function scrollToDemo() {
    document
      .querySelector(".demo-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }
</script>

<svelte:head>
  <title
    >Pinpoint Golf - Create Professional Golf Tournament Websites for Free</title
  >
  <meta
    name="description"
    content="Build beautiful, professional golf tournament websites in minutes. Free platform with integrated registration, payments, and analytics."
  />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
  <div class="container">
    <div class="hero-content">
      <h1>Create Professional Golf Tournament Websites - Completely Free</h1>
      <p class="hero-subtitle">
        Build stunning tournament sites in minutes with integrated registration,
        payments, and analytics. Perfect for charity tournaments, corporate
        events, and golf leagues.
      </p>
      <div class="hero-actions">
        <Button
          variant="primary"
          size="large"
          onclick={() => (showSignupModal = true)}
        >
          🚀 Create Free Tournament Site
        </Button>
        <Button variant="secondary" size="large" onclick={scrollToDemo}>
          👁️ View Live Demo
        </Button>
      </div>
      <div class="hero-stats">
        <div class="stat">
          <strong>500+</strong>
          <span>Tournaments Created</span>
        </div>
        <div class="stat">
          <strong>25,000+</strong>
          <span>Players Registered</span>
        </div>
        <div class="stat">
          <strong>$2M+</strong>
          <span>Raised for Charity</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="features">
  <div class="container">
    <h2>Everything You Need for Successful Tournaments</h2>
    <div class="features-grid">
      {#each platformFeatures as feature}
        <Card variant="default" padding="large" hoverable={true}>
          <div class="feature-card">
            <div class="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </Card>
      {/each}
    </div>
  </div>
</section>

<!-- Demo Section -->
<section class="demo-section">
  <div class="container">
    <h2>See What Your Tournament Site Will Look Like</h2>
    <p class="demo-subtitle">
      Explore a live example of a tournament website created with Pinpoint Golf
    </p>

    <!-- Demo Tabs -->
    <div class="demo-tabs">
      <button
        class="demo-tab"
        class:active={activeTab === "home"}
        on:click={() => (activeTab = "home")}
      >
        🏠 Home
      </button>
      <button
        class="demo-tab"
        class:active={activeTab === "registration"}
        on:click={() => (activeTab = "registration")}
      >
        📝 Registration
      </button>
      <button
        class="demo-tab"
        class:active={activeTab === "about"}
        on:click={() => (activeTab = "about")}
      >
        ℹ️ About
      </button>
    </div>

    <!-- Demo Content -->
    <div class="demo-viewer">
      {#if activeTab === "home"}
        <div class="demo-content">
          <div class="demo-hero">
            <h1>{demoTournament.name}</h1>
            <p>Supporting {demoTournament.charity} • {demoTournament.date}</p>
            <div class="demo-cta">
              <Button variant="primary"
                >Register Now - ${demoTournament.individualPrice}</Button
              >
              <Button variant="secondary">Learn More</Button>
            </div>
          </div>
          <div class="demo-sections">
            <div class="demo-section-item">
              <h3>📅 Event Details</h3>
              <p>June 15, 2025 at {demoTournament.location}</p>
            </div>
            <div class="demo-section-item">
              <h3>💝 Our Cause</h3>
              <p>Supporting {demoTournament.charity} with 100% of proceeds</p>
            </div>
            <div class="demo-section-item">
              <h3>🏆 Tournament Format</h3>
              <p>18-hole scramble with prizes and dinner</p>
            </div>
          </div>
        </div>
      {:else if activeTab === "registration"}
        <div class="demo-content">
          <h2>Registration Options</h2>
          <div class="demo-pricing">
            <div class="price-card">
              <h3>Individual Player</h3>
              <div class="price">${demoTournament.individualPrice}</div>
              <ul>
                <li>18 holes of golf</li>
                <li>Cart and lunch included</li>
                <li>Awards ceremony dinner</li>
              </ul>
              <Button variant="primary">Register Individual</Button>
            </div>
            <div class="price-card">
              <h3>Team (4 Players)</h3>
              <div class="price">${demoTournament.teamPrice}</div>
              <ul>
                <li>Reserved foursome</li>
                <li>Team photo opportunity</li>
                <li>Group coordination</li>
              </ul>
              <Button variant="primary">Register Team</Button>
            </div>
          </div>
          <div class="demo-help">
            <h4>Need Help?</h4>
            <p>Contact our tournament coordinator at tournament@example.org</p>
          </div>
        </div>
      {:else if activeTab === "about"}
        <div class="demo-content">
          <h2>About Our Tournament</h2>
          <div class="demo-about">
            <div class="about-section">
              <h3>Our Mission</h3>
              <p>
                What started as a small group of golf enthusiasts wanting to
                make a difference has grown into an annual tradition supporting {demoTournament.charity}.
                Every dollar raised goes directly to helping children in our
                community.
              </p>
            </div>
            <div class="about-section">
              <h3>Tournament History</h3>
              <p>
                Now in its 5th year, our tournament has raised over $75,000 for
                local charities and brought together more than 200 golfers who
                share our passion for giving back.
              </p>
            </div>
            <div class="about-gallery">
              <h3>Photo Gallery</h3>
              <div class="gallery-grid">
                <div class="gallery-item">📸 Tournament highlights</div>
                <div class="gallery-item">🏆 Awards ceremony</div>
                <div class="gallery-item">🤝 Community impact</div>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="demo-footer">
      <p>
        <strong>Quick Links:</strong> About • Registration • Contact • History
      </p>
    </div>
  </div>
</section>

<!-- Testimonials -->
<section class="testimonials">
  <div class="container">
    <h2>Trusted by Tournament Organizers</h2>
    <div class="testimonials-grid">
      {#each testimonials as testimonial}
        <Card variant="default" padding="large">
          <div class="testimonial">
            <p>"{testimonial.quote}"</p>
            <div class="testimonial-author">
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
  <div class="container">
    <Card variant="elevated" padding="large">
      <div class="cta-content">
        <h2>Ready to Create Your Tournament Site?</h2>
        <p>
          Join hundreds of tournament organizers who trust Pinpoint Golf for
          their events.
        </p>
        <Button
          variant="primary"
          size="large"
          onclick={() => (showSignupModal = true)}
        >
          Start Building - It's Free!
        </Button>
      </div>
    </Card>
  </div>
</section>

<!-- Signup Modal -->
{#if showSignupModal}
  <div
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="signup-modal-title"
    tabindex="-1"
    on:click={() => (showSignupModal = false)}
    on:keydown={(e) => e.key === "Escape" && (showSignupModal = false)}
  >
    <div class="modal-content" role="document">
      <button class="close-btn" on:click={() => (showSignupModal = false)}
        >✕</button
      >
      <div class="signup-form">
        <h2 id="signup-modal-title">Create Your Free Tournament Site</h2>
        <p>Get started in less than 2 minutes</p>

        <div class="signup-benefits">
          <div class="benefit">✅ Free forever</div>
          <div class="benefit">✅ Professional design</div>
          <div class="benefit">✅ Payment processing</div>
        </div>

        <div class="modal-actions">
          <Button
            variant="primary"
            size="large"
            onclick={() => {
              showSignupModal = false;
              window.location.href = "/signup";
            }}
          >
            Sign Up Now - It's Free!
          </Button>
        </div>

        <p class="signup-note">
          No credit card required • Setup takes 2 minutes
        </p>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Hero Section */
  .hero {
    background: var(--gradient-green);
    color: white;
    padding: 4rem 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent 75%
    );
    background-size: 40px 40px;
    opacity: 0.1;
    animation: subtle-move 20s linear infinite;
  }

  @keyframes subtle-move {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(40px);
    }
  }

  .hero-content h1 {
    color: white;
    font-size: clamp(2.5rem, 5vw, 4rem);
    margin-bottom: 1.5rem;
    font-weight: 700;
  }

  .hero-subtitle {
    color: var(--accent-yellow);
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.95;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 3rem;
    flex-wrap: wrap;
  }

  .hero-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .stat {
    text-align: center;
  }

  .stat strong {
    display: block;
    font-size: 2rem;
    font-weight: 700;
  }

  .stat span {
    font-size: 0.9rem;
    opacity: 0.9;
  }

  /* Features Section */
  .features {
    padding: 4rem 0;
    background: var(--light-gray);
  }

  .features h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: var(--text-dark);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .feature-card {
    text-align: center;
  }

  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  .feature-card p {
    color: var(--medium-gray);
    line-height: 1.6;
  }

  /* Demo Section */
  .demo-section {
    padding: 4rem 0;
  }

  .demo-section h2 {
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2.5rem;
    color: var(--text-dark);
  }

  .demo-subtitle {
    text-align: center;
    margin-bottom: 3rem;
    color: var(--medium-gray);
    font-size: 1.1rem;
  }

  .demo-tabs {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .demo-tab {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--light-gray);
    background: white;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 500;
    transition: var(--transition);
  }

  .demo-tab:hover {
    border-color: var(--primary-green);
  }

  .demo-tab.active {
    background: var(--primary-green);
    color: white;
    border-color: var(--primary-green);
  }

  .demo-viewer {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .demo-content {
    padding: 2rem;
  }

  .demo-hero {
    text-align: center;
    padding: 2rem;
    background: var(--gradient-green);
    color: white;
    margin: -2rem -2rem 2rem -2rem;
    position: relative;
    overflow: hidden;
  }

  .demo-hero::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shimmer 3s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }

  .demo-hero h1 {
    color: white;
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  .demo-hero p {
    color: var(--accent-yellow);
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .demo-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .demo-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .demo-section-item {
    text-align: center;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .demo-section-item h3 {
    margin-bottom: 0.5rem;
    color: var(--text-dark);
  }

  .demo-pricing {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .price-card {
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    padding: 2rem;
    text-align: center;
  }

  .price-card h3 {
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  .price {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  .price-card ul {
    list-style: none;
    padding: 0;
    margin: 1rem 0;
  }

  .price-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--light-gray);
  }

  .demo-help {
    text-align: center;
    padding: 1.5rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .demo-about {
    display: grid;
    gap: 2rem;
  }

  .about-section h3 {
    margin-bottom: 1rem;
    color: var(--text-dark);
  }

  .about-section p {
    color: var(--medium-gray);
    line-height: 1.6;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .gallery-item {
    background: var(--light-gray);
    padding: 2rem;
    border-radius: var(--border-radius);
    text-align: center;
    color: var(--medium-gray);
  }

  .demo-footer {
    text-align: center;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    color: var(--medium-gray);
  }

  /* Testimonials */
  .testimonials {
    padding: 4rem 0;
    background: var(--light-gray);
  }

  .testimonials h2 {
    text-align: center;
    margin-bottom: 3rem;
    font-size: 2.5rem;
    color: var(--text-dark);
  }

  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .testimonial p {
    font-style: italic;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: var(--medium-gray);
  }

  .testimonial-author strong {
    color: var(--text-dark);
  }

  .testimonial-author span {
    color: var(--medium-gray);
    display: block;
    font-size: 0.9rem;
  }

  /* CTA Section */
  .cta-section {
    padding: 4rem 0;
  }

  .cta-content {
    text-align: center;
  }

  .cta-content h2 {
    margin-bottom: 1rem;
    font-size: 2.5rem;
    color: var(--text-dark);
  }

  .cta-content p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    color: var(--medium-gray);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--medium-gray);
  }

  .signup-form {
    padding: 2rem;
  }

  .signup-form h2 {
    margin-bottom: 0.5rem;
    color: var(--text-dark);
  }

  .signup-form p {
    margin-bottom: 2rem;
    color: var(--medium-gray);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-dark);
  }

  .form-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--medium-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
  }

  .signup-benefits {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem 0;
    flex-wrap: wrap;
  }

  .benefit {
    color: var(--primary-green);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .modal-actions {
    margin: 2rem 0;
  }

  .signup-note {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.9rem;
    color: var(--medium-gray);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-stats {
      gap: 2rem;
    }

    .stat {
      flex: 1;
      min-width: 120px;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .demo-tabs {
      gap: 0.5rem;
    }

    .demo-tab {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    .demo-sections {
      grid-template-columns: 1fr;
    }

    .demo-pricing {
      grid-template-columns: 1fr;
    }

    .testimonials-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
