<script lang="ts">
  import { onMount } from "svelte";

  // Form data
  let formData = {
    playerName: "",
    email: "",
    phone: "",
    company: "",
    handicap: "",
    registrationType: "",
    specialRequests: "",
    emergencyContact: "",
    emergencyPhone: "",
    shirtSize: "",
    dietaryRestrictions: "",
  };

  // Form validation
  let errors: Record<string, string> = {};
  let isSubmitting = false;
  let showPaymentModal = false;
  let registrationFee = 0;

  // Pricing
  const pricing = {
    individual: 150,
    foursome: 550,
  };

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

    if (!formData.playerName.trim()) errors.playerName = "Name is required";
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
    if (!formData.registrationType)
      errors.registrationType = "Please select a registration type";
    if (!formData.emergencyContact.trim())
      errors.emergencyContact = "Emergency contact is required";
    if (!formData.emergencyPhone.trim()) {
      errors.emergencyPhone = "Emergency contact phone is required";
    } else if (!validatePhone(formData.emergencyPhone)) {
      errors.emergencyPhone = "Please enter a valid emergency contact phone";
    }
    if (!formData.shirtSize) errors.shirtSize = "Please select a shirt size";

    return Object.keys(errors).length === 0;
  }

  // Update registration fee when type changes
  $: {
    if (formData.registrationType === "individual") {
      registrationFee = pricing.individual;
    } else if (formData.registrationType === "foursome") {
      registrationFee = pricing.foursome;
    } else {
      registrationFee = 0;
    }
  }

  async function handleSubmit() {
    if (!validateForm()) return;
    isSubmitting = true;
    showPaymentModal = true;
    isSubmitting = false;
  }

  async function processPayment() {
    try {
      isSubmitting = true;
      // Simulate payment processing
      setTimeout(() => {
        alert(
          "Registration successful! You will receive a confirmation email shortly."
        );
        showPaymentModal = false;
        // Reset form
        formData = {
          playerName: "",
          email: "",
          phone: "",
          company: "",
          handicap: "",
          registrationType: "",
          specialRequests: "",
          emergencyContact: "",
          emergencyPhone: "",
          shirtSize: "",
          dietaryRestrictions: "",
        };
        isSubmitting = false;
      }, 2000);
    } catch (err) {
      alert("Payment processing failed. Please try again.");
      isSubmitting = false;
    }
  }

  function closePaymentModal() {
    showPaymentModal = false;
    isSubmitting = false;
  }
</script>

<svelte:head>
  <title>Player Registration - IBM Charity Golf Tournament 2026</title>
  <meta
    name="description"
    content="Register for the IBM Charity Golf Tournament on June 12, 2026. Individual and foursome registration options available."
  />
</svelte:head>

<!-- Hero Section -->
<section class="page-hero">
  <div class="container">
    <h1>Tournament Registration</h1>
    <p class="hero-subtitle">Join us for a day of golf and giving back</p>
    <div class="tournament-details">
      <div class="detail-item">
        <span class="detail-label">Date:</span>
        <span class="detail-value">June 12, 2026</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Start Time:</span>
        <span class="detail-value">12:00 PM EST</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Format:</span>
        <span class="detail-value">18-Hole Scramble</span>
      </div>
    </div>
  </div>
</section>

<!-- Registration Options -->
<section class="registration-options section">
  <div class="container">
    <h2>Registration Options</h2>
    <div class="options-grid">
      <div class="option-card">
        <h3>Individual Registration</h3>
        <div class="price">${pricing.individual}</div>
        <ul class="includes-list">
          <li>18 holes of golf</li>
          <li>Golf cart</li>
          <li>Welcome breakfast</li>
          <li>Lunch during play</li>
          <li>Awards ceremony dinner</li>
          <li>Tournament gift bag</li>
          <li>Professional scoring</li>
        </ul>
      </div>

      <div class="option-card featured">
        <div class="popular-badge">Most Popular</div>
        <h3>Foursome Registration</h3>
        <div class="price">${pricing.foursome}</div>
        <div class="savings">Save $50!</div>
        <ul class="includes-list">
          <li>Everything in Individual Registration</li>
          <li>Reserved parking spot</li>
          <li>Team photo session</li>
          <li>Priority tee time selection</li>
          <li>Complimentary team snacks</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- Registration Form -->
<section class="registration-form-section section">
  <div class="container">
    <div class="form-container">
      <h2>Player Information</h2>
      <form on:submit|preventDefault={handleSubmit} class="registration-form">
        <!-- Player Details -->
        <div class="form-section">
          <h3>Player Details</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="playerName">Full Name *</label>
              <input
                type="text"
                id="playerName"
                bind:value={formData.playerName}
                class:error={errors.playerName}
                required
              />
              {#if errors.playerName}
                <span class="error-message">{errors.playerName}</span>
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
              <label for="handicap">Golf Handicap (Optional)</label>
              <input
                type="number"
                id="handicap"
                bind:value={formData.handicap}
                min="0"
                max="54"
                placeholder="Enter your handicap"
              />
            </div>
            <div class="form-group">
              <label for="shirtSize">Shirt Size *</label>
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

        <!-- Registration Type -->
        <div class="form-section">
          <h3>Registration Type</h3>
          <div class="registration-type-options">
            <label class="radio-option">
              <input
                type="radio"
                name="registrationType"
                value="individual"
                bind:group={formData.registrationType}
              />
              <div class="radio-content">
                <strong>Individual Player - ${pricing.individual}</strong>
                <p>Register as an individual player</p>
              </div>
            </label>

            <label class="radio-option">
              <input
                type="radio"
                name="registrationType"
                value="foursome"
                bind:group={formData.registrationType}
              />
              <div class="radio-content">
                <strong>Foursome Registration - ${pricing.foursome}</strong>
                <p>Register a complete team of 4 players</p>
              </div>
            </label>
          </div>
          {#if errors.registrationType}
            <span class="error-message">{errors.registrationType}</span>
          {/if}
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

        <!-- Additional Information -->
        <div class="form-section">
          <h3>Additional Information</h3>
          <div class="form-group">
            <label for="dietaryRestrictions">Dietary Restrictions</label>
            <input
              type="text"
              id="dietaryRestrictions"
              bind:value={formData.dietaryRestrictions}
              placeholder="Allergies, vegetarian, etc."
            />
          </div>

          <div class="form-group">
            <label for="specialRequests">Special Requests or Comments</label>
            <textarea
              id="specialRequests"
              bind:value={formData.specialRequests}
              rows="4"
              placeholder="Any special accommodations needed, team preferences, etc."
            ></textarea>
          </div>
        </div>

        <!-- Registration Summary -->
        <div class="registration-summary">
          <h3>Registration Summary</h3>
          <div class="summary-details">
            <div class="summary-row">
              <span>Registration Type:</span>
              <span
                >{formData.registrationType === "individual"
                  ? "Individual Player"
                  : formData.registrationType === "foursome"
                    ? "Foursome (4 players)"
                    : "Not selected"}</span
              >
            </div>
            <div class="summary-row total">
              <span><strong>Total Amount:</strong></span>
              <span><strong>${registrationFee}</strong></span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary btn-large"
          disabled={isSubmitting || registrationFee === 0}
        >
          {isSubmitting
            ? "Processing..."
            : `Continue to Payment ($${registrationFee})`}
        </button>
      </form>
    </div>
  </div>
</section>

<!-- Payment Modal -->
{#if showPaymentModal}
  <div class="modal-overlay" on:click={closePaymentModal}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h3>Complete Your Registration</h3>
        <button class="close-btn" on:click={closePaymentModal}>&times;</button>
      </div>

      <div class="modal-body">
        <div class="payment-summary">
          <h4>Registration Summary</h4>
          <div class="summary-item">
            <span>Registration Type:</span>
            <span
              >{formData.registrationType === "individual"
                ? "Individual Player"
                : "Foursome (4 players)"}</span
            >
          </div>
          <div class="summary-item">
            <span>Player Name:</span>
            <span>{formData.playerName}</span>
          </div>
          <div class="summary-item total">
            <span><strong>Total Amount:</strong></span>
            <span><strong>${registrationFee}</strong></span>
          </div>
        </div>

        <div class="payment-form">
          <h4>Payment Information</h4>
          <div class="card-element">
            <div class="card-placeholder">
              <p>💳 Credit Card Information</p>
              <p class="card-note">Secure payment processing via Stripe</p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary"
          on:click={closePaymentModal}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          class="btn btn-primary"
          on:click={processPayment}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing Payment..." : `Pay $${registrationFee}`}
        </button>
      </div>
    </div>
  </div>
{/if}

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

  .tournament-details {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
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
  }

  .detail-value {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--accent-yellow);
  }

  /* Registration Options */
  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
  }

  .option-card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    padding: 2rem;
    text-align: center;
    transition: var(--transition);
    position: relative;
    border: 3px solid transparent;
  }

  .option-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  .option-card.featured {
    border-color: var(--accent-yellow);
    transform: scale(1.05);
  }

  .popular-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background: var(--accent-yellow);
    color: var(--text-dark);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .option-card h3 {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .price {
    font-size: 3rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.5rem;
  }

  .savings {
    color: var(--accent-yellow);
    font-weight: 600;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }

  .includes-list {
    list-style: none;
    text-align: left;
    margin: 1.5rem 0;
  }

  .includes-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
  }

  .includes-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--primary-green);
    font-weight: bold;
  }

  /* Form Styles */
  .form-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .registration-form {
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
    font-size: 1.3rem;
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

  /* Registration Type Options */
  .registration-type-options {
    display: grid;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .radio-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
  }

  .radio-option:hover {
    border-color: var(--primary-green);
    background-color: rgba(25, 128, 56, 0.05);
  }

  .radio-option input[type="radio"] {
    margin: 0;
    width: 20px;
    height: 20px;
    accent-color: var(--primary-green);
  }

  .radio-content {
    flex: 1;
  }

  .radio-content strong {
    color: var(--primary-green);
    font-size: 1.1rem;
    display: block;
    margin-bottom: 0.25rem;
  }

  .radio-content p {
    margin: 0;
    color: var(--dark-gray);
    font-size: 0.95rem;
  }

  /* Registration Summary */
  .registration-summary {
    background: var(--light-gray);
    padding: 2rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
  }

  .registration-summary h3 {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  .summary-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  .summary-row.total {
    border-top: 2px solid var(--primary-green);
    padding-top: 1rem;
    margin-top: 0.5rem;
    font-size: 1.2rem;
    color: var(--primary-green);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: var(--white);
    border-radius: var(--border-radius-large);
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid var(--light-gray);
  }

  .modal-header h3 {
    color: var(--primary-green);
    margin: 0;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--medium-gray);
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: var(--text-dark);
  }

  .modal-body {
    padding: 2rem;
  }

  .payment-summary {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
  }

  .payment-summary h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .summary-item.total {
    border-top: 1px solid var(--medium-gray);
    padding-top: 0.5rem;
    margin-top: 1rem;
    font-size: 1.1rem;
  }

  .payment-form h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  .card-element {
    padding: 1rem;
    border: 2px solid var(--light-gray);
    border-radius: var(--border-radius);
    background: var(--white);
  }

  .card-placeholder {
    text-align: center;
    color: var(--medium-gray);
  }

  .card-placeholder p:first-child {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .card-note {
    font-size: 0.9rem;
    margin: 0;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1rem 2rem 2rem;
    border-top: 1px solid var(--light-gray);
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .tournament-details {
      gap: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .registration-form {
      padding: 2rem;
    }

    .modal-content {
      margin: 1rem;
      max-height: calc(100vh - 2rem);
    }

    .modal-header,
    .modal-body,
    .modal-footer {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .page-hero {
      padding: 4rem 0 2rem;
    }

    .tournament-details {
      flex-direction: column;
      gap: 1rem;
    }

    .options-grid {
      grid-template-columns: 1fr;
    }

    .option-card.featured {
      transform: none;
    }

    .registration-form {
      padding: 1.5rem;
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
    }

    .radio-option {
      padding: 1rem;
    }

    .modal-footer {
      flex-direction: column;
    }
  }
</style>
