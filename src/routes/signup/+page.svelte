<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { customerAuth, customerAuthActions } from "$lib/stores/customerAuth";
  import { Button, Card, Input } from "$lib/components";

  let email = "";
  let password = "";
  let confirmPassword = "";
  let firstName = "";
  let lastName = "";
  let organizationName = "";
  let phone = "";
  let isLoading = false;
  let errorMessage = "";
  let acceptTerms = false;

  // Reactive auth state
  $: ({ isAuthenticated, user } = $customerAuth);

  // Redirect if already authenticated
  onMount(() => {
    if (isAuthenticated && user) {
      goto("/dashboard");
    }
  });

  async function handleSignup() {
    // Validation
    if (!email || !password || !firstName || !lastName || !organizationName) {
      errorMessage = "Please fill in all required fields";
      return;
    }

    if (password.length < 8) {
      errorMessage = "Password must be at least 8 characters long";
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = "Passwords do not match";
      return;
    }

    if (!acceptTerms) {
      errorMessage = "Please accept the Terms of Service and Privacy Policy";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const result = await customerAuthActions.signup(
        email,
        password,
        firstName,
        lastName,
        organizationName,
        phone || undefined
      );

      if (result.success) {
        // Redirect to dashboard with success message
        goto("/dashboard?welcome=true");
      } else {
        errorMessage = result.error || "Signup failed";
      }
    } catch (error) {
      console.error("Signup error:", error);
      errorMessage = "An unexpected error occurred. Please try again.";
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleSignup();
    }
  }

  // Generate organization name from first/last name
  $: if (firstName && lastName && !organizationName) {
    organizationName = `${firstName} ${lastName} Golf Tournaments`;
  }
</script>

<svelte:head>
  <title>Create Free Tournament Site - Pinpoint Golf</title>
  <meta
    name="description"
    content="Create your free professional golf tournament website in minutes with Pinpoint Golf."
  />
</svelte:head>

<div class="signup-container">
  <div class="signup-content">
    <div class="signup-header">
      <h1>Create Your Free Tournament Site</h1>
      <p>Join thousands of tournament organizers using Pinpoint Golf</p>
      <div class="benefits">
        <div class="benefit">✅ Free forever</div>
        <div class="benefit">✅ 2-minute setup</div>
        <div class="benefit">✅ No credit card required</div>
      </div>
    </div>

    <Card variant="elevated" padding="large">
      <form class="signup-form" on:submit|preventDefault={handleSignup}>
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name *</label>
            <Input
              id="firstName"
              type="text"
              bind:value={firstName}
              placeholder="John"
              required
              disabled={isLoading}
              on:keypress={handleKeyPress}
            />
          </div>

          <div class="form-group">
            <label for="lastName">Last Name *</label>
            <Input
              id="lastName"
              type="text"
              bind:value={lastName}
              placeholder="Smith"
              required
              disabled={isLoading}
              on:keypress={handleKeyPress}
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email Address *</label>
          <Input
            id="email"
            type="email"
            bind:value={email}
            placeholder="john@example.com"
            required
            disabled={isLoading}
            on:keypress={handleKeyPress}
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <Input
            id="phone"
            type="tel"
            bind:value={phone}
            placeholder="+1 (555) 123-4567"
            disabled={isLoading}
            on:keypress={handleKeyPress}
          />
        </div>

        <div class="form-group">
          <label for="organizationName">Organization Name *</label>
          <Input
            id="organizationName"
            type="text"
            bind:value={organizationName}
            placeholder="Your Tournament Organization"
            required
            disabled={isLoading}
            on:keypress={handleKeyPress}
          />
          <small class="form-hint"
            >This will be the name of your tournament organization</small
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password">Password *</label>
            <Input
              id="password"
              type="password"
              bind:value={password}
              placeholder="Choose a strong password"
              required
              disabled={isLoading}
              on:keypress={handleKeyPress}
            />
            <small class="form-hint">At least 8 characters</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password *</label>
            <Input
              id="confirmPassword"
              type="password"
              bind:value={confirmPassword}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              on:keypress={handleKeyPress}
            />
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              type="checkbox"
              bind:checked={acceptTerms}
              disabled={isLoading}
            />
            <span class="checkmark"></span>
            I agree to the <a href="/terms" target="_blank">Terms of Service</a>
            and <a href="/privacy" target="_blank">Privacy Policy</a> *
          </label>
        </div>

        {#if errorMessage}
          <div class="error-message">
            {errorMessage}
          </div>
        {/if}

        <div class="form-actions">
          <Button
            variant="primary"
            size="large"
            type="submit"
            disabled={isLoading}
            fullWidth
          >
            {#if isLoading}
              Creating Your Account...
            {:else}
              Create My Free Tournament Site
            {/if}
          </Button>
        </div>
      </form>
    </Card>

    <div class="login-prompt">
      <p>
        Already have an account?
        <a href="/login" class="login-link">Sign in here</a>
      </p>
    </div>
  </div>

  <div class="signup-features">
    <h3>What You Get With Pinpoint Golf</h3>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🏆</div>
        <h4>Professional Tournament Sites</h4>
        <p>Beautiful, responsive websites that work on all devices</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">💳</div>
        <h4>Secure Payment Processing</h4>
        <p>Accept credit cards and online payments safely</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h4>Real-Time Analytics</h4>
        <p>Track registrations, revenue, and participant data</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h4>Custom Branding</h4>
        <p>Add your logo, colors, and custom content</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">📱</div>
        <h4>Mobile-Friendly</h4>
        <p>Perfect experience on phones, tablets, and desktops</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🔧</div>
        <h4>Easy Management</h4>
        <p>Simple admin dashboard to manage everything</p>
      </div>
    </div>

    <div class="testimonial">
      <blockquote>
        "Pinpoint Golf helped us create a professional tournament site in
        minutes. We raised 40% more than last year!"
      </blockquote>
      <cite>— Sarah Johnson, Tournament Director</cite>
    </div>
  </div>
</div>

<style>
  .signup-container {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 4rem;
    padding: 2rem;
    background: var(--gradient-subtle);
  }

  .signup-content {
    max-width: 520px;
    margin: 0 auto;
  }

  .signup-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .signup-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--primary-green);
  }

  .signup-header p {
    color: var(--text-muted);
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .benefits {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .benefit {
    color: var(--primary-green);
    font-weight: 600;
    font-size: 0.9rem;
  }

  .signup-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: var(--text-dark);
  }

  .form-hint {
    color: var(--text-muted);
    font-size: 0.8rem;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.9rem;
    line-height: 1.4;
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    margin: 0;
    width: auto;
  }

  .checkbox-label a {
    color: var(--secondary-blue);
    text-decoration: none;
  }

  .checkbox-label a:hover {
    text-decoration: underline;
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
  }

  .form-actions {
    margin-top: 1rem;
  }

  .login-prompt {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: var(--border-radius);
  }

  .login-link {
    color: var(--primary-green);
    font-weight: 600;
    text-decoration: none;
  }

  .login-link:hover {
    text-decoration: underline;
  }

  .signup-features {
    padding: 2rem;
  }

  .signup-features h3 {
    color: var(--primary-green);
    margin-bottom: 2rem;
    font-size: 1.5rem;
    text-align: center;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .feature-card {
    background: var(--white);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    text-align: center;
  }

  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .feature-card h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
    font-size: 1rem;
  }

  .feature-card p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.85rem;
    line-height: 1.4;
  }

  .testimonial {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    text-align: center;
  }

  .testimonial blockquote {
    margin: 0 0 1rem 0;
    font-style: italic;
    color: var(--text-dark);
    font-size: 1.1rem;
    line-height: 1.5;
  }

  .testimonial cite {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .signup-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .signup-features {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .signup-container {
      padding: 1rem;
    }

    .signup-header h1 {
      font-size: 2rem;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .benefits {
      flex-direction: column;
      gap: 0.5rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .feature-card {
      padding: 1rem;
    }
  }
</style>
