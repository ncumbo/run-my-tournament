<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { customerAuth, customerAuthActions } from "$lib/stores/customerAuth";
  import { Button, Card, Input } from "$lib/components";

  let email = "";
  let password = "";
  let isLoading = false;
  let errorMessage = "";
  let showForgotPassword = false;
  let forgotEmail = "";

  // Reactive auth state
  $: ({ isAuthenticated, isLoading: authLoading, user } = $customerAuth);

  // Redirect if already authenticated
  onMount(() => {
    if (isAuthenticated && user) {
      goto(`/dashboard`);
    }
  });

  async function handleLogin() {
    if (!email || !password) {
      errorMessage = "Please fill in all fields";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const result = await customerAuthActions.login(email, password);

      if (result.success) {
        // Redirect to dashboard
        goto("/dashboard");
      } else {
        errorMessage = result.error || "Login failed";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage = "An unexpected error occurred. Please try again.";
    } finally {
      isLoading = false;
    }
  }

  async function handleForgotPassword() {
    if (!forgotEmail) {
      errorMessage = "Please enter your email address";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      const result =
        await customerAuthActions.requestPasswordReset(forgotEmail);

      if (result.success) {
        showForgotPassword = false;
        errorMessage = "";
        // Show success message
        alert("Password reset instructions have been sent to your email.");
      } else {
        errorMessage = result.error || "Password reset failed";
      }
    } catch (error) {
      console.error("Password reset error:", error);
      errorMessage = "An unexpected error occurred. Please try again.";
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }
</script>

<svelte:head>
  <title>Login - Pinpoint Golf</title>
  <meta
    name="description"
    content="Login to your Pinpoint Golf account to manage your tournaments."
  />
</svelte:head>

<div class="login-container">
  <div class="login-content">
    <div class="login-header">
      <h1>Welcome Back</h1>
      <p>Sign in to your Pinpoint Golf account</p>
    </div>

    {#if !showForgotPassword}
      <Card variant="elevated" padding="large">
        <form class="login-form" on:submit|preventDefault={handleLogin}>
          <div class="form-group">
            <label for="email">Email Address</label>
            <Input
              id="email"
              type="email"
              bind:value={email}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              on:keypress={handleKeyPress}
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <Input
              id="password"
              type="password"
              bind:value={password}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              on:keypress={handleKeyPress}
            />
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
                Signing In...
              {:else}
                Sign In
              {/if}
            </Button>
          </div>

          <div class="form-footer">
            <button
              type="button"
              class="link-button"
              on:click={() => (showForgotPassword = true)}
            >
              Forgot your password?
            </button>
          </div>
        </form>
      </Card>
    {:else}
      <Card variant="elevated" padding="large">
        <div class="forgot-password-form">
          <h2>Reset Your Password</h2>
          <p>
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>

          <div class="form-group">
            <label for="forgot-email">Email Address</label>
            <Input
              id="forgot-email"
              type="email"
              bind:value={forgotEmail}
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
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
              disabled={isLoading}
              fullWidth
              onclick={handleForgotPassword}
            >
              {#if isLoading}
                Sending...
              {:else}
                Send Reset Instructions
              {/if}
            </Button>
          </div>

          <div class="form-footer">
            <button
              type="button"
              class="link-button"
              on:click={() => {
                showForgotPassword = false;
                errorMessage = "";
              }}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </Card>
    {/if}

    <div class="signup-prompt">
      <p>
        Don't have an account?
        <a href="/signup" class="signup-link">Create a free tournament site</a>
      </p>
    </div>
  </div>

  <div class="login-features">
    <h3>What you can do with Pinpoint Golf:</h3>
    <div class="features-list">
      <div class="feature-item">
        <div class="feature-icon">🏆</div>
        <div class="feature-text">
          <h4>Create Professional Tournaments</h4>
          <p>Build beautiful tournament websites in minutes</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">💰</div>
        <div class="feature-text">
          <h4>Collect Registrations & Payments</h4>
          <p>Secure payment processing with automatic confirmation</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">📊</div>
        <div class="feature-text">
          <h4>Track Performance</h4>
          <p>Real-time analytics and registration management</p>
        </div>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🎨</div>
        <div class="feature-text">
          <h4>Custom Branding</h4>
          <p>Personalize with your logos, colors, and content</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 4rem;
    padding: 2rem;
    background: var(--gradient-subtle);
  }

  .login-content {
    max-width: 480px;
    margin: 0 auto;
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--primary-green);
  }

  .login-header p {
    color: var(--text-muted);
    font-size: 1.1rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

  .form-footer {
    text-align: center;
    margin-top: 1rem;
  }

  .link-button {
    background: none;
    border: none;
    color: var(--secondary-blue);
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.9rem;
  }

  .link-button:hover {
    color: var(--dark-blue);
  }

  .signup-prompt {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: var(--border-radius);
  }

  .signup-link {
    color: var(--primary-green);
    font-weight: 600;
    text-decoration: none;
  }

  .signup-link:hover {
    text-decoration: underline;
  }

  .login-features {
    padding: 2rem;
  }

  .login-features h3 {
    color: var(--primary-green);
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }

  .feature-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .feature-text h4 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
    font-size: 1.1rem;
  }

  .feature-text p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .forgot-password-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .forgot-password-form h2 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-green);
    text-align: center;
  }

  .forgot-password-form p {
    margin: 0;
    color: var(--text-muted);
    text-align: center;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .login-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .login-features {
      order: -1;
    }
  }

  @media (max-width: 768px) {
    .login-container {
      padding: 1rem;
    }

    .login-header h1 {
      font-size: 2rem;
    }

    .features-list {
      gap: 1rem;
    }

    .feature-item {
      padding: 0.75rem;
    }
  }
</style>
