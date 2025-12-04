<script lang="ts">
  import { PageHero, Form, Input, Button } from "$lib/components";
  import { goto } from "$app/navigation";
  import { authActions, auth } from "$lib/stores/auth";

  let formData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  let errors: Record<string, string> = {};
  let registrationError = "";
  let showSuccessMessage = false;

  $: isSubmitting = $auth.isLoading;

  function validateForm(): boolean {
    errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    registrationError = "";

    const result = await authActions.register(
      formData.email,
      formData.password,
      formData.name
    );

    if (result.success) {
      showSuccessMessage = true;
      goto("/admin/dashboard");
    } else {
      registrationError =
        result.error || "Registration failed. Please try again.";
    }
  }

  function goToLogin() {
    goto("/admin/login");
  }
</script>

<svelte:head>
  <title>Admin Registration - IBM Charity Golf Tournament</title>
  <meta
    name="description"
    content="Create an admin account for IBM Charity Golf Tournament management"
  />
</svelte:head>

<PageHero
  title="Admin Registration"
  subtitle="Create an administrator account"
/>

<section class="register-section section">
  <div class="container">
    <div class="register-container">
      <div class="register-info">
        <div class="info-card">
          <h3>🎯 Admin Benefits</h3>
          <p>As a tournament administrator, you'll have access to:</p>
          <ul>
            <li>Complete tournament dashboard</li>
            <li>Real-time registration management</li>
            <li>Content editing capabilities</li>
            <li>Analytics and reporting tools</li>
            <li>Participant communication tools</li>
            <li>Financial tracking and reports</li>
          </ul>

          <div class="security-note">
            <h4>🔒 Security Notice</h4>
            <p>
              Admin accounts have full access to tournament management. Only
              create accounts for trusted staff members.
            </p>
          </div>
        </div>
      </div>

      <div class="register-form-container">
        <Form
          {handleSubmit}
          {isSubmitting}
          {showSuccessMessage}
          successTitle="Registration Successful!"
          successMessage="Your admin account has been created. You'll be redirected to the dashboard shortly."
        >
          <svelte:fragment slot="header">
            <h2>Create Admin Account</h2>
            <p>Fill out the form below to create your administrator account</p>
          </svelte:fragment>

          {#if registrationError}
            <div class="error-alert">
              <strong>Registration Failed:</strong>
              {registrationError}
            </div>
          {/if}

          <div class="form-fields">
            <Input
              type="text"
              label="Full Name"
              id="name"
              bind:value={formData.name}
              error={errors.name}
              placeholder="Enter your full name"
              required
            />

            <Input
              type="email"
              label="Email Address"
              id="email"
              bind:value={formData.email}
              error={errors.email}
              placeholder="admin@ibm.com"
              required
            />

            <Input
              type="password"
              label="Password"
              id="password"
              bind:value={formData.password}
              error={errors.password}
              placeholder="Choose a strong password"
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              id="confirmPassword"
              bind:value={formData.confirmPassword}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              required
            />
          </div>

          <svelte:fragment slot="footer">
            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Admin Account"}
            </Button>

            <div class="login-link">
              <p>Already have an admin account?</p>
              <Button variant="outline" onclick={goToLogin}>Login Here</Button>
            </div>
          </svelte:fragment>

          <svelte:fragment slot="successActions">
            <Button
              variant="primary"
              onclick={() => (window.location.href = "/admin/dashboard")}
            >
              Go to Dashboard
            </Button>
          </svelte:fragment>
        </Form>
      </div>
    </div>
  </div>
</section>

<style>
  .register-section {
    background: var(--light-gray);
    min-height: 80vh;
    display: flex;
    align-items: center;
  }

  .register-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    max-width: 1200px;
    margin: 0 auto;
    align-items: start;
  }

  .info-card {
    background: var(--white);
    padding: 3rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    border-left: 4px solid var(--secondary-blue);
  }

  .info-card h3 {
    color: var(--secondary-blue);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .info-card p {
    margin-bottom: 1.5rem;
    color: var(--dark-gray);
  }

  .info-card ul {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
  }

  .info-card li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--dark-gray);
  }

  .info-card li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--secondary-blue);
    font-weight: bold;
  }

  .security-note {
    background: var(--light-gray);
    padding: 2rem;
    border-radius: var(--border-radius);
    border: 2px solid var(--accent-yellow);
    margin-top: 2rem;
  }

  .security-note h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .security-note p {
    margin: 0;
    color: var(--dark-gray);
    font-size: 0.95rem;
  }

  .register-form-container {
    /* Form styling handled by Form component */
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin: 2rem 0;
  }

  .error-alert {
    background: #ffeaea;
    border: 1px solid #ff6b6b;
    color: #d73a49;
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
  }

  .error-alert strong {
    font-weight: 600;
  }

  .login-link {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-gray);
  }

  .login-link p {
    margin: 0 0 1rem 0;
    color: var(--medium-gray);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .register-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .info-card {
      padding: 2rem;
    }

    .security-note {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .info-card {
      padding: 1.5rem;
    }

    .security-note {
      padding: 1rem;
    }
  }
</style>
