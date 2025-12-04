<script lang="ts">
  export let handleSubmit: (event?: Event) => void;
  export let onSubmit: ((event: Event) => void) | undefined = undefined;
  export let isSubmitting = false;
  export let showSuccessMessage = false;
  export let successTitle = "Success!";
  export let successMessage = "Your form has been submitted successfully.";

  function internalHandleSubmit(event: Event) {
    event.preventDefault();
    if (!isSubmitting) {
      // Support both prop patterns
      if (handleSubmit) {
        handleSubmit();
      } else if (onSubmit) {
        onSubmit(event);
      }
    }
  }
</script>

{#if showSuccessMessage}
  <div class="success-message">
    <div class="success-content">
      <h2>✉️ {successTitle}</h2>
      <p>{successMessage}</p>
      {#if $$slots.successActions}
        <div class="success-actions">
          <slot name="successActions" />
        </div>
      {/if}
    </div>
  </div>
{:else}
  <form on:submit={internalHandleSubmit} class="form">
    {#if $$slots.header}
      <div class="form-header">
        <slot name="header" />
      </div>
    {/if}

    <div class="form-body">
      <slot />
    </div>

    {#if $$slots.footer}
      <div class="form-footer">
        <slot name="footer" />
      </div>
    {/if}
  </form>
{/if}

<style>
  .form {
    background: var(--white);
    padding: 3rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    width: 100%;
  }

  .form-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .form-header :global(h2) {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  .form-header :global(p) {
    font-size: 1.1rem;
    color: var(--dark-gray);
  }

  .form-body {
    /* Form body styling handled by child components */
  }

  .form-footer {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--light-gray);
    text-align: center;
  }

  /* Success message */
  .success-message {
    background: var(--white);
    padding: 4rem;
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    text-align: center;
    width: 100%;
  }

  .success-content h2 {
    color: var(--primary-green);
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  .success-content p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: var(--dark-gray);
  }

  .success-actions {
    margin-top: 2rem;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .form {
      padding: 2rem;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .success-message {
      padding: 2rem;
    }

    .success-content h2 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .form {
      padding: 1.5rem;
    }

    .success-message {
      padding: 1.5rem;
    }
  }
</style>
