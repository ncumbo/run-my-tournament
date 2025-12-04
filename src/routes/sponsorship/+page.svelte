<script lang="ts">
  let selectedPackage = "";

  function selectPackage(packageName: string) {
    selectedPackage = packageName;
    // Scroll to contact form or show contact modal
    const contactSection = document.getElementById("contact-form");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<svelte:head>
  <title>Sponsorship Packages - IBM Charity Golf Tournament 2026</title>
  <meta
    name="description"
    content="Partner with the IBM Charity Golf Tournament. Choose from corporate foursome packages, hole sponsorships, and premium opportunities to support CHARITY TBD."
  />
</svelte:head>

<!-- Hero Section -->
<section class="page-hero">
  <div class="container">
    <h1>Sponsorship Opportunities</h1>
    <p class="hero-subtitle">
      Partner with us to make a difference while growing your brand visibility
    </p>
    <div class="hero-stats">
      <div class="stat-item">
        <span class="stat-number">120+</span>
        <span class="stat-label">Attendees Expected</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">$25,000+</span>
        <span class="stat-label">Goal for 2026</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">18</span>
        <span class="stat-label">Holes Available</span>
      </div>
    </div>
  </div>
</section>

<!-- Why Sponsor Section -->
<section class="why-sponsor section">
  <div class="container">
    <h2>Why Sponsor Our Tournament?</h2>
    <div class="benefits-grid">
      <div class="benefit-card">
        <div class="benefit-icon">🎯</div>
        <h3>Targeted Audience</h3>
        <p>
          Connect with IBM professionals, partners, and community leaders in a
          relaxed, networking environment.
        </p>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">💼</div>
        <h3>Brand Visibility</h3>
        <p>
          Prominent logo placement, signage, and recognition throughout the
          tournament day and marketing materials.
        </p>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">🤝</div>
        <h3>Community Impact</h3>
        <p>
          Demonstrate your commitment to corporate social responsibility while
          supporting a meaningful local cause.
        </p>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">📈</div>
        <h3>ROI & Value</h3>
        <p>
          Excellent value packages with multiple touchpoints and year-round
          recognition opportunities.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Sponsorship Packages -->
<section class="packages section">
  <div class="container">
    <h2>Sponsorship Packages</h2>
    <p class="section-subtitle">
      Choose the package that best fits your goals and budget
    </p>

    <div class="packages-grid">
      <!-- Corporate Foursome Package -->
      <div class="package-card featured" id="corporate-foursome">
        <div class="package-ribbon">Most Popular</div>
        <div class="package-header">
          <h3>Corporate Foursome</h3>
          <div class="price">$2,500</div>
          <p class="package-tagline">Perfect for team building & networking</p>
        </div>
        <div class="package-content">
          <h4>What's Included:</h4>
          <ul class="package-features">
            <li>Four player registrations</li>
            <li>Three hole sponsorships</li>
            <li>Company logo on tournament materials</li>
            <li>Reserved VIP parking spots</li>
            <li>Recognition at awards ceremony</li>
            <li>Golf cart decorations with company branding</li>
            <li>Professional tournament photos</li>
            <li>Social media mentions and tags</li>
          </ul>
          <div class="package-value">
            <strong>Value: Over $3,200</strong>
            <span>You save $700+</span>
          </div>
          <button
            class="btn btn-primary btn-large"
            on:click={() => selectPackage("Corporate Foursome")}
          >
            Select This Package
          </button>
        </div>
      </div>

      <!-- Premium Sponsor Package -->
      <div class="package-card premium" id="premium-sponsor">
        <div class="package-ribbon premium-ribbon">Premium</div>
        <div class="package-header">
          <h3>Premium Sponsor</h3>
          <div class="price">$5,000</div>
          <p class="package-tagline">Maximum visibility & impact</p>
        </div>
        <div class="package-content">
          <h4>Everything in Corporate Foursome, plus:</h4>
          <ul class="package-features">
            <li>Eight player registrations</li>
            <li>Six hole sponsorships</li>
            <li>Prominent logo on all marketing materials</li>
            <li>VIP reception area for your guests</li>
            <li>Speaking opportunity at awards ceremony</li>
            <li>Custom promotional items in goodie bags</li>
            <li>Year-round website recognition</li>
            <li>Exclusive networking opportunities</li>
            <li>Professional videography highlights</li>
          </ul>
          <div class="package-value">
            <strong>Value: Over $7,000</strong>
            <span>Maximum ROI package</span>
          </div>
          <button
            class="btn btn-primary btn-large"
            on:click={() => selectPackage("Premium Sponsor")}
          >
            Select This Package
          </button>
        </div>
      </div>

      <!-- Hole Sponsorship -->
      <div class="package-card" id="hole-sponsorship">
        <div class="package-header">
          <h3>Hole Sponsorship</h3>
          <div class="price">$500</div>
          <p class="package-tagline">Great entry-level opportunity</p>
        </div>
        <div class="package-content">
          <h4>Perfect For:</h4>
          <ul class="package-features">
            <li>Tee box signage with company logo</li>
            <li>Recognition in tournament program</li>
            <li>Social media mentions</li>
            <li>Photo opportunities at your hole</li>
            <li>Digital recognition on website</li>
            <li>Thank you certificate</li>
          </ul>
          <div class="package-note">
            <p>
              Multiple hole sponsorships available. Mix and match with other
              packages!
            </p>
          </div>
          <button
            class="btn btn-secondary btn-large"
            on:click={() => selectPackage("Hole Sponsorship")}
          >
            Select This Package
          </button>
        </div>
      </div>

      <!-- Custom Package -->
      <div class="package-card" id="custom-package">
        <div class="package-header">
          <h3>Custom Package</h3>
          <div class="price">Let's Talk</div>
          <p class="package-tagline">Tailored to your needs</p>
        </div>
        <div class="package-content">
          <h4>We'll Work With You To Create:</h4>
          <ul class="package-features">
            <li>Tailored sponsorship opportunities</li>
            <li>Custom branding solutions</li>
            <li>Flexible investment levels</li>
            <li>Unique recognition options</li>
            <li>Special event partnerships</li>
            <li>Multi-year agreements</li>
          </ul>
          <div class="package-note">
            <p>
              Have specific goals or budget requirements? Let's create something
              special together.
            </p>
          </div>
          <button
            class="btn btn-outline btn-large"
            on:click={() => selectPackage("Custom Package")}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Add-On Options -->
<section class="add-ons section">
  <div class="container">
    <h2>Additional Opportunities</h2>
    <div class="add-ons-grid">
      <div class="add-on-item">
        <h4>Tournament Title Sponsor</h4>
        <p class="add-on-price">$10,000</p>
        <p>
          Become the official title sponsor with maximum brand integration
          throughout the entire event.
        </p>
      </div>
      <div class="add-on-item">
        <h4>Lunch Sponsor</h4>
        <p class="add-on-price">$1,500</p>
        <p>
          Sponsor the mid-tournament lunch with prominent signage and
          announcements.
        </p>
      </div>
      <div class="add-on-item">
        <h4>Awards Ceremony Sponsor</h4>
        <p class="add-on-price">$2,000</p>
        <p>Present awards and be recognized during the ceremony and photos.</p>
      </div>
      <div class="add-on-item">
        <h4>Goodie Bag Sponsor</h4>
        <p class="add-on-price">$1,000</p>
        <p>Include your branded items in every participant's goodie bag.</p>
      </div>
      <div class="add-on-item">
        <h4>Driving Range Sponsor</h4>
        <p class="add-on-price">$800</p>
        <p>Sponsor the practice area with signage and warm-up opportunities.</p>
      </div>
      <div class="add-on-item">
        <h4>Beverage Cart Sponsor</h4>
        <p class="add-on-price">$1,200</p>
        <p>
          Mobile brand visibility throughout the course with beverage service.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Testimonials -->
<section class="testimonials section">
  <div class="container">
    <h2>What Our Sponsors Say</h2>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="testimonial-content">
          <p>
            "The IBM Golf Tournament provided excellent networking opportunities
            and great visibility for our brand. The cause is meaningful and the
            organization is top-notch."
          </p>
          <div class="testimonial-author">
            <strong>Sarah Mitchell</strong>
            <span>Marketing Director, TechCorp Solutions</span>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-content">
          <p>
            "We've been proud sponsors for three years. It's a perfect blend of
            business networking and community giving. Highly recommend to other
            companies."
          </p>
          <div class="testimonial-author">
            <strong>Mike Chen</strong>
            <span>CEO, Innovation Partners</span>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-content">
          <p>
            "The ROI on our sponsorship exceeded expectations. Great
            professional crowd and excellent organization made it a win-win for
            everyone involved."
          </p>
          <div class="testimonial-author">
            <strong>Jennifer Lopez</strong>
            <span>VP Business Development, CloudFirst</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Contact Form -->
<section class="contact-form section" id="contact-form">
  <div class="container">
    <div class="form-container">
      <div class="form-header">
        <h2>Ready to Partner With Us?</h2>
        <p>
          Let's discuss how we can create the perfect sponsorship opportunity
          for your organization.
        </p>
        {#if selectedPackage}
          <div class="selected-package">
            <span>Selected Package: <strong>{selectedPackage}</strong></span>
          </div>
        {/if}
      </div>

      <form class="sponsor-form">
        <div class="form-row">
          <div class="form-group">
            <label for="companyName">Company Name *</label>
            <input type="text" id="companyName" name="companyName" required />
          </div>
          <div class="form-group">
            <label for="contactName">Contact Name *</label>
            <input type="text" id="contactName" name="contactName" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" required />
          </div>
        </div>

        <div class="form-group">
          <label for="packageInterest">Package Interest</label>
          <select
            id="packageInterest"
            name="packageInterest"
            bind:value={selectedPackage}
          >
            <option value="">Select a package</option>
            <option value="Corporate Foursome"
              >Corporate Foursome - $2,500</option
            >
            <option value="Premium Sponsor">Premium Sponsor - $5,000</option>
            <option value="Hole Sponsorship">Hole Sponsorship - $500</option>
            <option value="Custom Package">Custom Package</option>
            <option value="Title Sponsor"
              >Tournament Title Sponsor - $10,000</option
            >
          </select>
        </div>

        <div class="form-group">
          <label for="goals">Sponsorship Goals & Objectives</label>
          <textarea
            id="goals"
            name="goals"
            rows="4"
            placeholder="Tell us about your marketing goals, target audience, budget range, or any specific requirements..."
          ></textarea>
        </div>

        <div class="form-group">
          <label for="timeline">Preferred Timeline</label>
          <select id="timeline" name="timeline">
            <option value="">When would you like to finalize?</option>
            <option value="asap">As soon as possible</option>
            <option value="1-month">Within 1 month</option>
            <option value="2-months">Within 2 months</option>
            <option value="flexible">Flexible timeline</option>
          </select>
        </div>

        <button type="submit" class="btn btn-primary btn-large"
          >Submit Sponsorship Inquiry</button
        >
      </form>
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

  /* Benefits Grid */
  .benefits-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .benefit-card {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius-large);
    text-align: center;
    box-shadow: var(--shadow);
    transition: var(--transition);
    border-top: 4px solid var(--primary-green);
  }

  .benefit-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  .benefit-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  .benefit-card h3 {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  /* Package Cards */
  .packages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .package-card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
    position: relative;
    border: 3px solid transparent;
  }

  .package-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  .package-card.featured {
    border-color: var(--accent-yellow);
    transform: scale(1.02);
  }

  .package-card.premium {
    border-color: var(--secondary-blue);
  }

  .package-ribbon {
    position: absolute;
    top: 20px;
    right: -30px;
    background: var(--accent-yellow);
    color: var(--text-dark);
    padding: 0.5rem 2rem;
    font-weight: 600;
    font-size: 0.9rem;
    transform: rotate(35deg);
    z-index: 10;
  }

  .premium-ribbon {
    background: var(--secondary-blue);
    color: var(--white);
  }

  .package-header {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    padding: 2rem;
    text-align: center;
  }

  .package-header h3 {
    color: var(--white);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .price {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-yellow);
    margin-bottom: 0.5rem;
  }

  .package-tagline {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    margin: 0;
  }

  .package-content {
    padding: 2rem;
  }

  .package-features {
    list-style: none;
    margin: 1.5rem 0;
    padding: 0;
  }

  .package-features li {
    padding: 0.75rem 0;
    padding-left: 2rem;
    position: relative;
    border-bottom: 1px solid var(--light-gray);
  }

  .package-features li:last-child {
    border-bottom: none;
  }

  .package-features li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--primary-green);
    font-weight: bold;
    font-size: 1.2rem;
  }

  .package-value {
    background: var(--light-gray);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin: 1.5rem 0;
    text-align: center;
  }

  .package-value strong {
    color: var(--primary-green);
    font-size: 1.1rem;
    display: block;
    margin-bottom: 0.25rem;
  }

  .package-value span {
    color: var(--medium-gray);
    font-size: 0.9rem;
  }

  .package-note {
    background: var(--light-gray);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin: 1.5rem 0;
    border-left: 4px solid var(--secondary-blue);
  }

  .package-note p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--dark-gray);
  }

  /* Add-ons */
  .add-ons {
    background-color: var(--light-gray);
  }

  .add-ons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .add-on-item {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    transition: var(--transition);
  }

  .add-on-item:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }

  .add-on-item h4 {
    color: var(--primary-green);
    margin-bottom: 0.5rem;
  }

  .add-on-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--secondary-blue);
    margin-bottom: 1rem;
  }

  /* Testimonials */
  .testimonials-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .testimonial-card {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    border-left: 4px solid var(--primary-green);
  }

  .testimonial-content p {
    font-style: italic;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: var(--dark-gray);
  }

  .testimonial-author strong {
    color: var(--primary-green);
    display: block;
    margin-bottom: 0.25rem;
  }

  .testimonial-author span {
    color: var(--medium-gray);
    font-size: 0.9rem;
  }

  /* Contact Form */
  .contact-form {
    background: linear-gradient(135deg, var(--light-gray), var(--white));
  }

  .form-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .form-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .form-header h2 {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  .form-header p {
    font-size: 1.1rem;
    color: var(--dark-gray);
  }

  .selected-package {
    background: var(--primary-green);
    color: var(--white);
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-top: 1rem;
    font-weight: 500;
  }

  .sponsor-form {
    background: var(--white);
    padding: 3rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .hero-stats {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .packages-grid {
      grid-template-columns: 1fr;
    }

    .package-card.featured {
      transform: none;
    }

    .package-ribbon {
      top: 10px;
      right: -25px;
      padding: 0.4rem 1.5rem;
      font-size: 0.8rem;
    }

    .add-ons-grid {
      grid-template-columns: 1fr;
    }

    .testimonials-grid {
      grid-template-columns: 1fr;
    }

    .sponsor-form {
      padding: 2rem;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 4rem 0 2rem;
    }

    .stat-number {
      font-size: 2rem;
    }

    .price {
      font-size: 2rem;
    }

    .package-content {
      padding: 1.5rem;
    }

    .package-header {
      padding: 1.5rem;
    }

    .sponsor-form {
      padding: 1.5rem;
    }
  }
</style>
