<script lang="ts">
  import { PageHero, Form, Input, Button, Card } from "$lib/components";

  // Contact form data
  let formData = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  // Form validation
  let errors: Record<string, string> = {};
  let isSubmitting = false;
  let showSuccessMessage = false;

  // Contact categories
  const contactCategories = [
    {
      id: "general",
      title: "General Tournament Information",
      description:
        "Questions about the tournament, schedule, format, or general inquiries",
    },
    {
      id: "registration",
      title: "Player Registration",
      description:
        "Help with player registration, payment issues, or team formation",
    },
    {
      id: "sponsorship",
      title: "Sponsorship Opportunities",
      description:
        "Corporate sponsorship packages, custom opportunities, or partnership inquiries",
    },
    {
      id: "volunteer",
      title: "Volunteer Questions",
      description:
        "Volunteer roles, schedules, requirements, or application status",
    },
    {
      id: "technical",
      title: "Website/Technical Support",
      description:
        "Technical issues with the website, registration system, or payment processing",
    },
    {
      id: "media",
      title: "Media & Press",
      description:
        "Press inquiries, media credentials, or tournament coverage requests",
    },
  ];

  // Tournament committee members
  const committeeMembers = [
    {
      name: "John Smith",
      title: "Tournament Director",
      email: "tournament@ibm.com",
      phone: "(555) 123-4567",
      responsibilities: [
        "Overall tournament management",
        "Course coordination",
        "Day-of operations",
      ],
    },
    {
      name: "Sarah Johnson",
      title: "Sponsorship Coordinator",
      email: "sponsors@ibm.com",
      phone: "(555) 234-5678",
      responsibilities: [
        "Corporate partnerships",
        "Sponsorship packages",
        "Brand coordination",
      ],
    },
    {
      name: "Mike Wilson",
      title: "Volunteer Coordinator",
      email: "volunteers@ibm.com",
      phone: "(555) 345-6789",
      responsibilities: [
        "Volunteer recruitment",
        "Role assignments",
        "Training coordination",
      ],
    },
    {
      name: "Lisa Chen",
      title: "Registration Manager",
      email: "registration@ibm.com",
      phone: "(555) 456-7890",
      responsibilities: [
        "Player registration",
        "Payment processing",
        "Team coordination",
      ],
    },
  ];

  // Validation functions
  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone: string): boolean {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  function validateForm(): boolean {
    errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.subject) errors.subject = "Please select a subject";
    if (!formData.message.trim()) errors.message = "Message is required";

    return Object.keys(errors).length === 0;
  }

  // Form submission
  async function handleSubmit() {
    if (!validateForm()) return;

    isSubmitting = true;

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showSuccessMessage = true;

      // Reset form
      formData = { name: "", email: "", phone: "", subject: "", message: "" };
    } catch (error) {
      alert(
        "Message submission failed. Please try again or contact us directly."
      );
    } finally {
      isSubmitting = false;
    }
  }

  // Get selected category details
  $: selectedCategory = contactCategories.find(
    (cat) => cat.id === formData.subject
  );
</script>

<svelte:head>
  <title>Contact - IBM Charity Golf Tournament 2026</title>
  <meta
    name="description"
    content="Contact the IBM Charity Golf Tournament committee for information about registration, sponsorship, volunteering, and tournament details."
  />
</svelte:head>

<!-- Hero Section -->
<PageHero
  title="Contact Us"
  subtitle="Get in touch with our tournament committee"
  showTournamentInfo={true}
/>

<!-- Committee Members -->
<section class="committee section">
  <div class="container">
    <h2>Tournament Committee</h2>
    <p class="section-subtitle">
      Meet the team organizing this year's tournament
    </p>

    <div class="committee-grid">
      {#each committeeMembers as member}
        <div class="committee-card">
          <div class="member-header">
            <h3>{member.name}</h3>
            <p class="member-title">{member.title}</p>
          </div>
          <div class="member-contact">
            <div class="contact-item">
              <span class="contact-label">📧 Email:</span>
              <a href="mailto:{member.email}" class="contact-link"
                >{member.email}</a
              >
            </div>
            <div class="contact-item">
              <span class="contact-label">📞 Phone:</span>
              <a href="tel:{member.phone}" class="contact-link"
                >{member.phone}</a
              >
            </div>
          </div>
          <div class="member-responsibilities">
            <h4>Responsibilities:</h4>
            <ul>
              {#each member.responsibilities as responsibility}
                <li>{responsibility}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Contact Categories -->
<section class="contact-categories section">
  <div class="container">
    <h2>What Can We Help You With?</h2>
    <p class="section-subtitle">
      Choose the category that best matches your inquiry
    </p>

    <div class="categories-grid">
      {#each contactCategories as category}
        <div
          class="category-card"
          class:selected={formData.subject === category.id}
        >
          <div class="category-header">
            <h3>{category.title}</h3>
          </div>
          <div class="category-content">
            <p>{category.description}</p>
          </div>
          <div class="category-footer">
            <button
              class="select-category-btn"
              class:selected={formData.subject === category.id}
              on:click={() => (formData.subject = category.id)}
            >
              {formData.subject === category.id
                ? "Selected"
                : "Select This Category"}
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Contact Form -->
<section class="contact-form-section section">
  <div class="container">
    {#if showSuccessMessage}
      <div class="success-message">
        <div class="success-content">
          <h2>✉️ Message Sent Successfully!</h2>
          <p>
            Thank you for contacting us. We've received your message and will
            respond within 24 hours during business days.
          </p>
          <p>
            If you need immediate assistance, please call our tournament hotline
            at <a href="tel:(555)123-4567">(555) 123-4567</a>.
          </p>
          <button
            class="btn btn-primary"
            on:click={() => (showSuccessMessage = false)}
          >
            Send Another Message
          </button>
        </div>
      </div>
    {:else}
      <div class="form-container">
        <div class="form-header">
          <h2>Send Us a Message</h2>
          {#if selectedCategory}
            <div class="selected-category">
              <h4>Subject: {selectedCategory.title}</h4>
              <p>{selectedCategory.description}</p>
            </div>
          {/if}
        </div>

        <form on:submit|preventDefault={handleSubmit} class="contact-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input
                type="text"
                id="name"
                bind:value={formData.name}
                class:error={errors.name}
                required
              />
              {#if errors.name}
                <span class="error-message">{errors.name}</span>
              {/if}
            </div>
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input
                type="email"
                id="email"
                bind:value={formData.email}
                class:error={errors.email}
                required
              />
              {#if errors.email}
                <span class="error-message">{errors.email}</span>
              {/if}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                bind:value={formData.phone}
                placeholder="(555) 123-4567"
              />
            </div>
            <div class="form-group">
              <label for="subject">Subject *</label>
              <select
                id="subject"
                bind:value={formData.subject}
                class:error={errors.subject}
                required
              >
                <option value="">Select a category</option>
                {#each contactCategories as category}
                  <option value={category.id}>{category.title}</option>
                {/each}
              </select>
              {#if errors.subject}
                <span class="error-message">{errors.subject}</span>
              {/if}
            </div>
          </div>

          <div class="form-group">
            <label for="message">Message *</label>
            <textarea
              id="message"
              bind:value={formData.message}
              rows="6"
              class:error={errors.message}
              placeholder="Please provide details about your inquiry..."
              required
            ></textarea>
            {#if errors.message}
              <span class="error-message">{errors.message}</span>
            {/if}
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-large"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Message..." : "Send Message"}
          </button>
        </form>
      </div>
    {/if}
  </div>
</section>

<!-- Tournament Details -->
<section class="tournament-details section">
  <div class="container">
    <h2>Tournament Information</h2>
    <div class="details-grid">
      <div class="detail-card">
        <h3>📅 Tournament Date</h3>
        <p><strong>June 12, 2026</strong></p>
        <p>12:00 PM EST Shotgun Start</p>
        <p>Registration begins at 11:00 AM</p>
      </div>

      <div class="detail-card">
        <h3>🏌️ Format</h3>
        <p><strong>18-Hole Scramble</strong></p>
        <p>4-person teams</p>
        <p>All skill levels welcome</p>
      </div>

      <div class="detail-card">
        <h3>🏆 Registration</h3>
        <p><strong>Individual:</strong> $150</p>
        <p><strong>Foursome:</strong> $550</p>
        <p>Deadline: May 15, 2026</p>
      </div>

      <div class="detail-card">
        <h3>❤️ Beneficiary</h3>
        <p><strong>CHARITY TBD</strong></p>
        <p>Supporting local community initiatives</p>
        <p>100% of proceeds donated</p>
      </div>

      <div class="detail-card">
        <h3>🏟️ Venue</h3>
        <p><strong>Premium Golf Course</strong></p>
        <p>Location details coming soon</p>
        <p>Championship-quality facilities</p>
      </div>

      <div class="detail-card">
        <h3>🍽️ Includes</h3>
        <p><strong>Full Day Package:</strong></p>
        <p>Welcome breakfast, lunch, dinner</p>
        <p>Golf cart, tournament gifts</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ Section -->
<section class="faq section">
  <div class="container">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-grid">
      <div class="faq-item">
        <h4>Q: What skill level is required to participate?</h4>
        <p>
          A: All skill levels are welcome! Our scramble format ensures everyone
          can contribute and have fun regardless of their golf experience.
        </p>
      </div>

      <div class="faq-item">
        <h4>Q: Can I register as an individual if I don't have a team?</h4>
        <p>
          A: Absolutely! We'll pair individual registrants with other players to
          form complete teams.
        </p>
      </div>

      <div class="faq-item">
        <h4>Q: What's included in the registration fee?</h4>
        <p>
          A: Registration includes 18 holes of golf, cart, welcome breakfast,
          lunch, awards dinner, tournament gift bag, and professional scoring.
        </p>
      </div>

      <div class="faq-item">
        <h4>Q: Are there sponsorship opportunities for small businesses?</h4>
        <p>
          A: Yes! We offer various sponsorship levels starting with hole
          sponsorships at $500. Contact our sponsorship coordinator for custom
          options.
        </p>
      </div>

      <div class="faq-item">
        <h4>Q: What volunteer opportunities are available?</h4>
        <p>
          A: We need volunteers for registration, scorekeeping, hole monitoring,
          setup/cleanup, and awards ceremony. All volunteers receive a free
          t-shirt and lunch.
        </p>
      </div>

      <div class="faq-item">
        <h4>Q: Is there a rain date for the tournament?</h4>
        <p>
          A: The tournament will be held rain or shine. In case of severe
          weather, we have contingency plans and will communicate any changes
          via email and our website.
        </p>
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

  .tournament-info {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
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

  /* Committee Section */
  .committee-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .committee-card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
  }

  .committee-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  .member-header {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    padding: 2rem;
    text-align: center;
  }

  .member-header h3 {
    color: var(--white);
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .member-title {
    color: var(--accent-yellow);
    font-weight: 600;
    margin: 0;
  }

  .member-contact {
    padding: 1.5rem;
    border-bottom: 1px solid var(--light-gray);
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .contact-item:last-child {
    margin-bottom: 0;
  }

  .contact-label {
    font-size: 0.9rem;
    min-width: 80px;
  }

  .contact-link {
    color: var(--primary-green);
    text-decoration: none;
    font-weight: 500;
  }

  .contact-link:hover {
    text-decoration: underline;
  }

  .member-responsibilities {
    padding: 1.5rem;
  }

  .member-responsibilities h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  .member-responsibilities ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .member-responsibilities li {
    padding: 0.25rem 0;
    padding-left: 1rem;
    position: relative;
    font-size: 0.9rem;
    color: var(--dark-gray);
  }

  .member-responsibilities li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--primary-green);
  }

  /* Contact Categories */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .category-card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
    border: 3px solid transparent;
  }

  .category-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }

  .category-card.selected {
    border-color: var(--primary-green);
  }

  .category-header {
    background: var(--light-gray);
    padding: 1.5rem;
    border-bottom: 1px solid var(--medium-gray);
  }

  .category-header h3 {
    color: var(--primary-green);
    margin: 0;
    font-size: 1.2rem;
  }

  .category-content {
    padding: 1.5rem;
  }

  .category-content p {
    margin: 0;
    color: var(--dark-gray);
  }

  .category-footer {
    padding: 0 1.5rem 1.5rem;
  }

  .select-category-btn {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--primary-green);
    background: var(--white);
    color: var(--primary-green);
    font-weight: 600;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
  }

  .select-category-btn:hover {
    background: var(--primary-green);
    color: var(--white);
  }

  .select-category-btn.selected {
    background: var(--primary-green);
    color: var(--white);
  }

  /* Contact Form */
  .form-container {
    max-width: 700px;
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

  .selected-category {
    background: var(--light-gray);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border-left: 4px solid var(--primary-green);
    margin-top: 2rem;
  }

  .selected-category h4 {
    color: var(--primary-green);
    margin-bottom: 0.5rem;
  }

  .selected-category p {
    margin: 0;
    color: var(--dark-gray);
  }

  .contact-form {
    background: var(--white);
    padding: 3rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-dark);
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 1rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: var(--transition);
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(25, 128, 56, 0.1);
  }

  .form-group input.error,
  .form-group select.error,
  .form-group textarea.error {
    border-color: #dc3545;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  /* Success Message */
  .success-message {
    background: var(--white);
    padding: 4rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    text-align: center;
  }

  .success-content h2 {
    color: var(--primary-green);
    margin-bottom: 2rem;
  }

  .success-content p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: var(--dark-gray);
  }

  /* Tournament Details */
  .tournament-details {
    background-color: var(--light-gray);
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .detail-card {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    text-align: center;
  }

  .detail-card h3 {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .detail-card p {
    margin: 0.5rem 0;
    color: var(--dark-gray);
  }

  .detail-card p strong {
    color: var(--text-dark);
  }

  /* FAQ Section */
  .faq-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .faq-item {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    border-left: 4px solid var(--primary-green);
  }

  .faq-item h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .faq-item p {
    margin: 0;
    color: var(--dark-gray);
    line-height: 1.6;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .tournament-info {
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .contact-form {
      padding: 2rem;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .faq-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 4rem 0 2rem;
    }

    .contact-form {
      padding: 1.5rem;
    }

    .committee-card,
    .category-card,
    .detail-card,
    .faq-item {
      padding: 1.5rem;
    }

    .member-header {
      padding: 1.5rem;
    }

    .member-contact,
    .member-responsibilities {
      padding: 1rem;
    }
  }
</style>
