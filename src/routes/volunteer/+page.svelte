<script lang="ts">
  // Volunteer form data
  let formData = {
    volunteerName: "",
    email: "",
    phone: "",
    company: "",
    volunteerRole: "",
    availability: [] as string[],
    experience: "",
    shirtSize: "",
    emergencyContact: "",
    emergencyPhone: "",
    comments: "",
  };

  // Form validation
  let errors: Record<string, string> = {};
  let isSubmitting = false;
  let showSuccessMessage = false;

  // Volunteer roles with descriptions
  const volunteerRoles = [
    {
      id: "registration",
      title: "Registration Check-in",
      description: "Welcome players and handle check-in process",
      timeSlot: "10:00 AM - 12:30 PM",
    },
    {
      id: "scorekeeping",
      title: "Scorekeeping",
      description: "Assist with score tracking and leaderboard updates",
      timeSlot: "11:30 AM - 7:00 PM",
    },
    {
      id: "hole-monitor",
      title: "Hole Monitor",
      description: "Manage specific holes and assist players",
      timeSlot: "11:00 AM - 6:00 PM",
    },
    {
      id: "awards-ceremony",
      title: "Awards Ceremony",
      description: "Assist with awards ceremony and dinner",
      timeSlot: "5:30 PM - 8:30 PM",
    },
    {
      id: "setup-cleanup",
      title: "Setup/Cleanup",
      description: "Help with event setup and breakdown",
      timeSlot: "6:00 AM - 9:00 AM / 7:00 PM - 9:00 PM",
    },
    {
      id: "general",
      title: "General Support",
      description: "Flexible role based on daily needs",
      timeSlot: "Flexible",
    },
  ];

  // Availability time slots
  const availabilitySlots = [
    { id: "early-setup", label: "Early Setup (6:00 AM - 8:00 AM)" },
    { id: "morning", label: "Morning Shift (8:00 AM - 12:00 PM)" },
    { id: "tournament", label: "Tournament Hours (12:00 PM - 6:00 PM)" },
    { id: "awards", label: "Awards Ceremony (6:00 PM - 8:00 PM)" },
    { id: "cleanup", label: "Cleanup (7:00 PM - 9:00 PM)" },
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

    if (!formData.volunteerName.trim())
      errors.volunteerName = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!formData.volunteerRole)
      errors.volunteerRole = "Please select a volunteer role";
    if (formData.availability.length === 0)
      errors.availability = "Please select at least one availability slot";
    if (!formData.shirtSize) errors.shirtSize = "Please select a shirt size";
    if (!formData.emergencyContact.trim())
      errors.emergencyContact = "Emergency contact is required";
    if (!formData.emergencyPhone.trim()) {
      errors.emergencyPhone = "Emergency contact phone is required";
    } else if (!validatePhone(formData.emergencyPhone)) {
      errors.emergencyPhone = "Please enter a valid emergency contact phone";
    }

    return Object.keys(errors).length === 0;
  }

  // Handle availability checkbox changes
  function handleAvailabilityChange(event: Event, slotId: string) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      formData.availability = [...formData.availability, slotId];
    } else {
      formData.availability = formData.availability.filter(
        (id) => id !== slotId
      );
    }
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
      formData = {
        volunteerName: "",
        email: "",
        phone: "",
        company: "",
        volunteerRole: "",
        availability: [],
        experience: "",
        shirtSize: "",
        emergencyContact: "",
        emergencyPhone: "",
        comments: "",
      };
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      isSubmitting = false;
    }
  }

  // Get selected role details
  $: selectedRole = volunteerRoles.find(
    (role) => role.id === formData.volunteerRole
  );
</script>

<svelte:head>
  <title>Volunteer - IBM Charity Golf Tournament 2026</title>
  <meta
    name="description"
    content="Volunteer for the IBM Charity Golf Tournament 2026. Various roles available from registration to awards ceremony."
  />
</svelte:head>

<!-- Hero Section -->
<section class="page-hero">
  <div class="container">
    <h1>Volunteer Opportunities</h1>
    <p class="hero-subtitle">Help make our tournament a success</p>
    <div class="volunteer-stats">
      <div class="stat-item">
        <span class="stat-number">50+</span>
        <span class="stat-label">Volunteers Needed</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">6</span>
        <span class="stat-label">Different Roles</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">100%</span>
        <span class="stat-label">Impact on Success</span>
      </div>
    </div>
  </div>
</section>

<!-- Why Volunteer Section -->
<section class="why-volunteer section">
  <div class="container">
    <h2>Why Volunteer With Us?</h2>
    <div class="benefits-grid">
      <div class="benefit-card">
        <div class="benefit-icon">🤝</div>
        <h3>Make a Difference</h3>
        <p>
          Directly contribute to raising funds for CHARITY TBD while supporting
          your local community.
        </p>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">🎯</div>
        <h3>Gain Experience</h3>
        <p>
          Develop event management skills and gain valuable experience in
          tournament operations.
        </p>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">👥</div>
        <h3>Network & Connect</h3>
        <p>
          Meet IBM professionals, community leaders, and like-minded volunteers.
        </p>
      </div>
      <div class="benefit-card">
        <div class="benefit-icon">🎁</div>
        <h3>Great Perks</h3>
        <p>
          Free tournament t-shirt, lunch, volunteer appreciation event, and
          certificates.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Volunteer Roles -->
<section class="volunteer-roles section">
  <div class="container">
    <h2>Volunteer Roles</h2>
    <p class="section-subtitle">
      Choose the role that best matches your interests and availability
    </p>

    <div class="roles-grid">
      {#each volunteerRoles as role}
        <div
          class="role-card"
          class:selected={formData.volunteerRole === role.id}
        >
          <div class="role-header">
            <h3>{role.title}</h3>
            <div class="time-badge">{role.timeSlot}</div>
          </div>
          <div class="role-content">
            <p class="role-description">{role.description}</p>
          </div>
          <div class="role-footer">
            <button
              class="select-role-btn"
              class:selected={formData.volunteerRole === role.id}
              on:click={() => (formData.volunteerRole = role.id)}
            >
              {formData.volunteerRole === role.id
                ? "Selected"
                : "Select This Role"}
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Volunteer Form -->
<section class="volunteer-form-section section">
  <div class="container">
    {#if showSuccessMessage}
      <div class="success-message">
        <div class="success-content">
          <h2>🎉 Thank You for Volunteering!</h2>
          <p>
            Your volunteer application has been submitted successfully. Our
            volunteer coordinator will contact you within 48 hours.
          </p>
          <button
            class="btn btn-primary"
            on:click={() => (showSuccessMessage = false)}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    {:else}
      <div class="form-container">
        <h2>Volunteer Application</h2>
        <form on:submit|preventDefault={handleSubmit} class="volunteer-form">
          <!-- Personal Information -->
          <div class="form-section">
            <h3>Personal Information</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="volunteerName">Full Name *</label>
                <input
                  type="text"
                  id="volunteerName"
                  bind:value={formData.volunteerName}
                  class:error={errors.volunteerName}
                  required
                />
                {#if errors.volunteerName}
                  <span class="error-message">{errors.volunteerName}</span>
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
                <label for="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  bind:value={formData.phone}
                  class:error={errors.phone}
                  placeholder="(555) 123-4567"
                  required
                />
                {#if errors.phone}
                  <span class="error-message">{errors.phone}</span>
                {/if}
              </div>
              <div class="form-group">
                <label for="company">Company/Organization</label>
                <input
                  type="text"
                  id="company"
                  bind:value={formData.company}
                  placeholder="IBM, TechCorp, etc."
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="shirtSize">Volunteer T-Shirt Size *</label>
                <select
                  id="shirtSize"
                  bind:value={formData.shirtSize}
                  class:error={errors.shirtSize}
                  required
                >
                  <option value="">Select Size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                  <option value="XXL">2X Large</option>
                </select>
                {#if errors.shirtSize}
                  <span class="error-message">{errors.shirtSize}</span>
                {/if}
              </div>
            </div>
          </div>

          <!-- Volunteer Role -->
          <div class="form-section">
            <h3>Volunteer Role Preference *</h3>
            {#if selectedRole}
              <div class="selected-role-display">
                <div class="selected-role-header">
                  <h4>Selected: {selectedRole.title}</h4>
                  <span class="selected-time-badge"
                    >{selectedRole.timeSlot}</span
                  >
                </div>
                <p>{selectedRole.description}</p>
                <button
                  type="button"
                  class="change-role-btn"
                  on:click={() => (formData.volunteerRole = "")}
                >
                  Change Role
                </button>
              </div>
            {:else}
              <p class="role-prompt">
                Please select a volunteer role from the options above.
              </p>
            {/if}
            {#if errors.volunteerRole}
              <span class="error-message">{errors.volunteerRole}</span>
            {/if}
          </div>

          <!-- Availability -->
          <div class="form-section">
            <h3>Availability *</h3>
            <p class="availability-note">
              Select all time slots when you're available:
            </p>
            <div class="availability-options">
              {#each availabilitySlots as slot}
                <label class="checkbox-option">
                  <input
                    type="checkbox"
                    value={slot.id}
                    on:change={(e) => handleAvailabilityChange(e, slot.id)}
                  />
                  <div class="checkbox-content">
                    <strong>{slot.label}</strong>
                  </div>
                </label>
              {/each}
            </div>
            {#if errors.availability}
              <span class="error-message">{errors.availability}</span>
            {/if}
          </div>

          <!-- Experience -->
          <div class="form-section">
            <h3>Experience & Skills</h3>
            <div class="form-group">
              <label for="experience"
                >Previous Volunteer Experience (Optional)</label
              >
              <textarea
                id="experience"
                bind:value={formData.experience}
                rows="4"
                placeholder="Describe any relevant experience..."
              ></textarea>
            </div>
          </div>

          <!-- Emergency Contact -->
          <div class="form-section">
            <h3>Emergency Contact</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="emergencyContact">Emergency Contact Name *</label>
                <input
                  type="text"
                  id="emergencyContact"
                  bind:value={formData.emergencyContact}
                  class:error={errors.emergencyContact}
                  required
                />
                {#if errors.emergencyContact}
                  <span class="error-message">{errors.emergencyContact}</span>
                {/if}
              </div>
              <div class="form-group">
                <label for="emergencyPhone">Emergency Contact Phone *</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  bind:value={formData.emergencyPhone}
                  class:error={errors.emergencyPhone}
                  required
                />
                {#if errors.emergencyPhone}
                  <span class="error-message">{errors.emergencyPhone}</span>
                {/if}
              </div>
            </div>
          </div>

          <!-- Additional Comments -->
          <div class="form-section">
            <h3>Additional Information</h3>
            <div class="form-group">
              <label for="comments">Comments or Special Requests</label>
              <textarea
                id="comments"
                bind:value={formData.comments}
                rows="4"
                placeholder="Any additional information..."
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-large"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting Application..."
              : "Submit Volunteer Application"}
          </button>
        </form>
      </div>
    {/if}
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

  .volunteer-stats {
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

  /* Volunteer Roles */
  .roles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .role-card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
    border: 3px solid transparent;
  }

  .role-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-hover);
  }

  .role-card.selected {
    border-color: var(--primary-green);
  }

  .role-header {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    padding: 2rem;
  }

  .role-header h3 {
    color: var(--white);
    margin-bottom: 1rem;
  }

  .time-badge {
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
  }

  .role-content {
    padding: 2rem;
  }

  .role-description {
    margin-bottom: 1.5rem;
    color: var(--dark-gray);
  }

  .role-footer {
    padding: 0 2rem 2rem;
  }

  .select-role-btn {
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

  .select-role-btn:hover {
    background: var(--primary-green);
    color: var(--white);
  }

  .select-role-btn.selected {
    background: var(--primary-green);
    color: var(--white);
  }

  /* Form Styles */
  .form-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .volunteer-form {
    background: var(--white);
    padding: 3rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
  }

  .form-section {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--light-gray);
  }

  .form-section:last-of-type {
    border-bottom: none;
    margin-bottom: 2rem;
  }

  .form-section h3 {
    color: var(--primary-green);
    margin-bottom: 1.5rem;
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
  .form-group select.error {
    border-color: #dc3545;
  }

  .error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  /* Selected Role Display */
  .selected-role-display {
    background: var(--light-gray);
    padding: 2rem;
    border-radius: var(--border-radius);
    border-left: 4px solid var(--primary-green);
  }

  .selected-role-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .selected-role-header h4 {
    color: var(--primary-green);
    margin: 0;
  }

  .selected-time-badge {
    background: var(--primary-green);
    color: var(--white);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
  }

  .change-role-btn {
    background: var(--secondary-blue);
    color: var(--white);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    margin-top: 1rem;
  }

  .change-role-btn:hover {
    background: var(--dark-blue);
  }

  .role-prompt {
    text-align: center;
    padding: 2rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    color: var(--medium-gray);
    font-style: italic;
  }

  /* Availability Options */
  .availability-note {
    margin-bottom: 1.5rem;
    color: var(--dark-gray);
  }

  .availability-options {
    display: grid;
    gap: 1rem;
  }

  .checkbox-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
  }

  .checkbox-option:hover {
    border-color: var(--primary-green);
    background-color: rgba(25, 128, 56, 0.05);
  }

  .checkbox-option input[type="checkbox"] {
    margin: 0;
    width: 20px;
    height: 20px;
    accent-color: var(--primary-green);
  }

  .checkbox-content {
    flex: 1;
  }

  .checkbox-content strong {
    color: var(--text-dark);
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
    margin-bottom: 2rem;
    color: var(--dark-gray);
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .volunteer-stats {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .volunteer-form {
      padding: 2rem;
    }

    .selected-role-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 4rem 0 2rem;
    }

    .volunteer-form {
      padding: 1.5rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
    }
  }
</style>
