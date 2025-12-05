<script lang="ts">
  // About page component
</script>

<svelte:head>
  <title
    >About PinPoint Golf - The Complete Tournament Management Platform</title
  >
  <meta
    name="description"
    content="Discover PinPoint Golf, the comprehensive platform for creating, customizing, and managing golf tournaments. From site generation to payment processing, we make tournament management effortless."
  />
</svelte:head>

<!-- Hero Section -->
<section class="page-hero">
  <div class="container">
    <h1>About PinPoint Golf</h1>
    <p class="hero-subtitle">
      The complete platform for golf tournament management and community
      building
    </p>
  </div>
</section>

<!-- Mission Section -->
<section class="mission section">
  <div class="container">
    <div class="mission-content">
      <div class="mission-text">
        <h2>Our Mission</h2>
        <p class="lead-text">
          PinPoint Golf was born from the success of community-driven golf
          tournaments like the IBM Charity Golf Tournament. We saw how powerful
          these events could be for bringing communities together and supporting
          great causes, but we also recognized the challenges organizers face in
          managing every aspect of their events.
        </p>

        <p>
          Our mission is to democratize golf tournament management by providing
          organizations of all sizes with professional-grade tools that were
          previously available only to large golf organizations. We believe
          every community deserves the ability to create memorable golf
          experiences that drive meaningful impact.
        </p>

        <div class="mission-stats">
          <div class="stat-item">
            <span class="stat-number">10,000+</span>
            <span class="stat-label">Tournaments Created</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">500+</span>
            <span class="stat-label">Active Organizations</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">$2M+</span>
            <span class="stat-label">Raised for Charity</span>
          </div>
        </div>
      </div>

      <div class="mission-image">
        <div class="platform-preview">
          <div class="preview-header">
            <h4>🏆 PinPoint Golf Platform</h4>
            <p>Complete tournament management solution</p>
          </div>
          <div class="preview-features">
            <div class="feature-tag">✨ Custom Sites</div>
            <div class="feature-tag">💳 Payment Processing</div>
            <div class="feature-tag">📊 Analytics</div>
            <div class="feature-tag">🌐 Domain Management</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Platform Features Section -->
<section class="platform-features section">
  <div class="container">
    <h2>Complete Tournament Management Platform</h2>
    <div class="features-content">
      <div class="features-story">
        <h3>Everything You Need in One Place</h3>
        <p>
          PinPoint Golf provides a comprehensive suite of tools that handle
          every aspect of your golf tournament, from initial setup to final
          reporting. Our platform eliminates the complexity of managing multiple
          vendors and systems, giving you more time to focus on what matters
          most—your participants and your cause.
        </p>

        <p>
          Built by tournament organizers for tournament organizers, we
          understand the unique challenges you face and have designed our
          platform to address them with intuitive, powerful solutions that scale
          with your needs.
        </p>

        <blockquote class="testimonial">
          <p>
            "PinPoint Golf transformed our annual tournament. What used to take
            weeks of coordination now happens seamlessly. Our registration
            doubled, and we raised 40% more for charity than ever before."
          </p>
          <cite>— Sarah Johnson, Tournament Director</cite>
        </blockquote>
      </div>

      <div class="platform-details">
        <h3>Platform Features</h3>
        <div class="feature-grid">
          <div class="feature-item">
            <div class="feature-icon">🎨</div>
            <h4>Custom Site Builder</h4>
            <p>
              Create beautiful, branded tournament websites with our
              drag-and-drop builder and professional themes
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💳</div>
            <h4>Payment Processing</h4>
            <p>
              Integrated Stripe payments with automatic fee distribution and
              financial reporting
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌐</div>
            <h4>Domain Management</h4>
            <p>
              Free subdomains or connect your own custom domain with SSL
              certificates
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <h4>Analytics Dashboard</h4>
            <p>
              Real-time insights on registrations, revenue, and participant
              engagement
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📧</div>
            <h4>Email Automation</h4>
            <p>
              Automated confirmations, reminders, and follow-up communications
            </p>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔌</div>
            <h4>API Integration</h4>
            <p>
              Connect with your existing systems through our comprehensive REST
              API
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Tournament Format -->
<section class="tournament-format section">
  <div class="container">
    <h2>Tournament Format & Details</h2>
    <div class="format-grid">
      <div class="format-card">
        <div class="format-header">
          <h3>18-Hole Scramble</h3>
          <div class="format-icon">⛳</div>
        </div>
        <div class="format-content">
          <p>
            Our tournament features a fun and inclusive scramble format that
            welcomes golfers of all skill levels. Each team selects the best
            shot from all players and continues from that position.
          </p>
          <ul>
            <li>4-person teams</li>
            <li>Shotgun start at 8:00 AM</li>
            <li>All skill levels welcome</li>
            <li>Handicap adjustments available</li>
          </ul>
        </div>
      </div>

      <div class="format-card">
        <div class="format-header">
          <h3>Awards & Recognition</h3>
          <div class="format-icon">🏆</div>
        </div>
        <div class="format-content">
          <p>
            We celebrate achievement and participation with various awards and
            prizes throughout the day.
          </p>
          <ul>
            <li>Low gross team score</li>
            <li>Longest drive competitions</li>
            <li>Closest to pin challenges</li>
            <li>Most improved team</li>
            <li>Best team spirit</li>
          </ul>
        </div>
      </div>

      <div class="format-card">
        <div class="format-header">
          <h3>Day Schedule</h3>
          <div class="format-icon">⏰</div>
        </div>
        <div class="format-content">
          <p>
            A full day of golf, networking, and celebration with our community.
          </p>
          <ul>
            <li>11:00 AM - Registration & Breakfast</li>
            <li>12:00 PM - Shotgun Start</li>
            <li>3:30 PM - Lunch Break</li>
            <li>6:00 PM - Awards Ceremony</li>
            <li>7:00 PM - Dinner & Silent Auction</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Course Information -->
<section class="course-info section">
  <div class="container">
    <div class="course-content">
      <div class="course-details">
        <h2>Tournament Venue</h2>
        <h3>Premium Golf Course Experience</h3>
        <p>
          Our tournament is held at a carefully selected premium golf course
          that provides an excellent playing experience for all participants.
          The venue features well-maintained fairways, challenging holes, and
          beautiful scenery that makes for a memorable day of golf.
        </p>

        <div class="course-features">
          <h4>Course Features</h4>
          <div class="features-grid">
            <div class="feature">
              <span class="feature-icon">🌿</span>
              <span>Championship-quality fairways</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🏌️</span>
              <span>Practice facilities available</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🅿️</span>
              <span>Ample parking</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🍽️</span>
              <span>Full-service clubhouse</span>
            </div>
          </div>
        </div>

        <p class="course-note">
          Final course details and location will be announced closer to the
          tournament date to ensure the best possible experience for all
          participants.
        </p>
      </div>

      <div class="course-image">
        <div class="image-placeholder">
          <div class="placeholder-content">
            <h4>Beautiful Golf Course Setting</h4>
            <p>Championship-quality course with scenic views</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Get Started CTA -->
<section class="join-cta section">
  <div class="container">
    <div class="cta-content">
      <h2>Ready to Create Your Tournament?</h2>
      <p>
        Join hundreds of organizations who trust PinPoint Golf to manage their
        tournaments. From small community events to large corporate
        championships, our platform scales to meet your needs.
      </p>

      <div class="cta-buttons">
        <a href="/signup" class="btn btn-primary btn-large">Start Free Trial</a>
        <a href="/dashboard" class="btn btn-secondary btn-large"
          >View Dashboard</a
        >
        <a href="/contact" class="btn btn-outline btn-large">Contact Sales</a>
      </div>

      <div class="pricing-preview">
        <h4>Simple, Transparent Pricing</h4>
        <div class="pricing-options">
          <div class="pricing-option">
            <strong>Free</strong>
            <span>Up to 50 participants</span>
          </div>
          <div class="pricing-option">
            <strong>Pro - $29/month</strong>
            <span>Unlimited participants + advanced features</span>
          </div>
          <div class="pricing-option">
            <strong>Enterprise</strong>
            <span>Custom solutions for large organizations</span>
          </div>
        </div>
      </div>

      <div class="contact-info">
        <p>Questions about our platform?</p>
        <p>
          Contact our team at <a href="mailto:hello@pinpointgolf.com"
            >hello@pinpointgolf.com</a
          > or schedule a demo
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  /* Page Hero */
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
    font-size: clamp(2.5rem, 5vw, 4rem);
  }

  .hero-subtitle {
    font-size: 1.4rem;
    opacity: 0.9;
    font-weight: 400;
  }

  /* Mission Section */
  .mission-content {
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

  .mission-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
  }

  .stat-item {
    text-align: center;
    padding: 2rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    border-top: 4px solid var(--primary-green);
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.9rem;
    color: var(--dark-gray);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .logo-image {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }

  .image-overlay {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    margin-top: 1rem;
    text-align: center;
  }

  .image-overlay h4 {
    color: var(--white);
    margin-bottom: 0.5rem;
  }

  .image-overlay p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }

  /* CHARITY TBD Section */
  .kates-krew {
    background-color: var(--light-gray);
  }

  .kates-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }

  .testimonial {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    border-left: 4px solid var(--accent-yellow);
    margin: 2rem 0;
    font-style: italic;
  }

  .testimonial p {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: var(--dark-gray);
  }

  .testimonial cite {
    font-weight: 600;
    color: var(--primary-green);
    font-style: normal;
  }

  .impact-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .impact-item {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    text-align: center;
    box-shadow: var(--shadow);
    transition: var(--transition);
  }

  .impact-item:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }

  .impact-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  .impact-item h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  /* Tournament Format */
  .format-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .format-card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
  }

  .format-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  .format-header {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    padding: 2rem;
    text-align: center;
    position: relative;
  }

  .format-header h3 {
    color: var(--white);
    margin-bottom: 0.5rem;
  }

  .format-icon {
    font-size: 3rem;
    opacity: 0.8;
  }

  .format-content {
    padding: 2rem;
  }

  .format-content ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
  }

  .format-content li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
  }

  .format-content li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--primary-green);
    font-weight: bold;
  }

  /* Course Info */
  .course-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  .feature {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .feature-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
    width: 2rem;
  }

  .course-note {
    background: var(--light-gray);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border-left: 4px solid var(--secondary-blue);
    margin-top: 2rem;
    font-style: italic;
  }

  .image-placeholder {
    background: linear-gradient(
      135deg,
      var(--light-green),
      var(--primary-green)
    );
    height: 300px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    text-align: center;
  }

  .placeholder-content h4 {
    color: var(--white);
    margin-bottom: 1rem;
  }

  .placeholder-content p {
    color: rgba(255, 255, 255, 0.9);
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

  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
  }

  .contact-info {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 2rem;
  }

  .contact-info p {
    margin: 0.5rem 0;
    font-size: 1rem;
  }

  .contact-info a {
    color: var(--accent-yellow);
    text-decoration: none;
    font-weight: 600;
  }

  .contact-info a:hover {
    text-decoration: underline;
  }

  .pricing-preview {
    margin: 2rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 2rem;
  }

  .pricing-preview h4 {
    color: var(--white);
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }

  .pricing-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  .pricing-option {
    background: rgba(255, 255, 255, 0.1);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    text-align: center;
    backdrop-filter: blur(10px);
  }

  .pricing-option strong {
    display: block;
    color: var(--accent-yellow);
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .pricing-option span {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .mission-content,
    .features-content,
    .course-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .preview-features {
      grid-template-columns: 1fr;
    }

    .feature-grid {
      grid-template-columns: 1fr;
    }

    .pricing-options {
      grid-template-columns: 1fr;
    }
    .mission-content,
    .kates-content,
    .course-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .mission-stats {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .impact-grid {
      grid-template-columns: 1fr;
    }

    .format-grid {
      grid-template-columns: 1fr;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }

    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }

    .cta-buttons .btn {
      width: 100%;
      max-width: 300px;
    }

    .page-hero {
      padding: 4rem 0 2rem;
    }
  }

  @media (max-width: 480px) {
    .format-header {
      padding: 1.5rem;
    }

    .format-content {
      padding: 1.5rem;
    }

    .impact-item,
    .stat-item {
      padding: 1.5rem;
    }

    .testimonial {
      padding: 1.5rem;
    }
  }
</style>
