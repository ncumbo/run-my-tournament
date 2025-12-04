<script lang="ts">
  import { PageHero, Form, Input, Button } from "$lib/components";
  import { goto } from "$app/navigation";
  import { authActions, auth } from "$lib/stores/auth";

  let formData = {
    email: "",
    password: "",
  };

  let errors: Record<string, string> = {};
  let loginError = "";

  $: isSubmitting = $auth.isLoading;

  function validateForm(): boolean {
    errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    loginError = "";
    console.log("🔑 LOGIN PAGE: Starting login process...");

    const result = await authActions.login(formData.email, formData.password);
    console.log("🔑 LOGIN PAGE: Login result:", result);

    if (result.success) {
      console.log("🔑 LOGIN PAGE: Login successful, redirecting...");
      console.log("🔑 LOGIN PAGE: Current auth state:", $auth);

      // Small delay to ensure auth state is set before navigation
      setTimeout(() => {
        console.log("🔑 LOGIN PAGE: Navigating to dashboard...");
        goto("/admin/dashboard");
      }, 200);
    } else {
      loginError = result.error || "Login failed. Please try again.";
      console.log("🔑 LOGIN PAGE: Login failed:", loginError);
    }
  }
</script>

<svelte:head>
  <title>Admin Login - IBM Charity Golf Tournament</title>
  <meta
    name="description"
    content="Admin login for IBM Charity Golf Tournament management"
  />
</svelte:head>

<PageHero
  title="Admin Login"
  subtitle="Access tournament management dashboard"
/>

<section class="login-section section">
  <div class="container">
    <div class="login-container">
      <div class="login-info">
        <div class="info-card">
          <h3>🔐 Admin Access</h3>
          <p>
            Login to access the tournament management dashboard where you can:
          </p>
          <ul>
            <li>Edit tournament information</li>
            <li>Manage registrations</li>
            <li>Update content across the site</li>
            <li>View analytics and reports</li>
          </ul>

          <div class="demo-credentials">
            <h4>Demo Credentials:</h4>
            <p><strong>Email:</strong> admin@ibm.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </div>
      </div>

      <div class="login-form-container">
        <Form {handleSubmit} {isSubmitting}>
          <svelte:fragment slot="header">
            <h2>Administrator Login</h2>
            <p>Enter your credentials to access the admin dashboard</p>
          </svelte:fragment>

          {#if loginError}
            <div class="error-alert">
              <strong>Login Failed:</strong>
              {loginError}
            </div>
          {/if}

          <div class="form-fields">
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
              placeholder="Enter your password"
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
              {isSubmitting ? "Logging in..." : "Login to Dashboard"}
            </Button>

            <div class="register-link">
              <p>
                Need an admin account? <a href="/admin/register"
                  >Register here</a
                >
              </p>
            </div>
          </svelte:fragment>
        </Form>
      </div>
    </div>
  </div>
</section>

<style>
  .login-section {
    background: var(--light-gray);
    min-height: 80vh;
    display: flex;
    align-items: center;
  }

  .login-container {
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
    border-left: 4px solid var(--primary-green);
  }

  .info-card h3 {
    color: var(--primary-green);
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
    color: var(--primary-green);
    font-weight: bold;
  }

  .demo-credentials {
    background: var(--light-gray);
    padding: 2rem;
    border-radius: var(--border-radius);
    border: 2px solid var(--accent-yellow);
    margin-top: 2rem;
  }

  .demo-credentials h4 {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .demo-credentials p {
    margin: 0.5rem 0;
    font-family: "Courier New", monospace;
    background: var(--white);
    padding: 0.5rem;
    border-radius: var(--border-radius);
  }

  .login-form-container {
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

  .register-link {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-gray);
  }

  .register-link p {
    margin: 0;
    color: var(--medium-gray);
  }

  .register-link a {
    color: var(--primary-green);
    text-decoration: none;
    font-weight: 600;
  }

  .register-link a:hover {
    text-decoration: underline;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .login-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .info-card {
      padding: 2rem;
    }

    .demo-credentials {
      padding: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .info-card {
      padding: 1.5rem;
    }

    .demo-credentials {
      padding: 1rem;
    }
  }
</style>
