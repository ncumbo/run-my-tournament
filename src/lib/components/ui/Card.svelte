<script lang="ts">
  export let variant:
    | "default"
    | "info"
    | "benefit"
    | "package"
    | "testimonial" = "default";
  export let hoverable = true;
  export let padding: "small" | "medium" | "large" = "medium";
  export let borderTop: "none" | "primary" | "secondary" | "accent" = "none";

  $: classes = [
    "card",
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable ? "card-hoverable" : "",
    borderTop !== "none" ? `card-border-top-${borderTop}` : "",
  ]
    .filter(Boolean)
    .join(" ");
</script>

<div class={classes}>
  {#if $$slots.header}
    <div class="card-header">
      <slot name="header" />
    </div>
  {/if}

  <div class="card-body">
    <slot />
  </div>

  {#if $$slots.footer}
    <div class="card-footer">
      <slot name="footer" />
    </div>
  {/if}
</div>

<style>
  .card {
    background: var(--white);
    border-radius: var(--border-radius-large);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
  }

  .card-hoverable:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  .card-header {
    background: linear-gradient(
      135deg,
      var(--primary-green),
      var(--light-green)
    );
    color: var(--white);
    padding: 2rem;
    text-align: center;
  }

  .card-header :global(h3) {
    color: var(--white);
    margin-bottom: 0.5rem;
  }

  .card-body {
    transition: var(--transition);
  }

  .card-padding-small .card-body {
    padding: 1rem;
  }

  .card-padding-medium .card-body {
    padding: 2rem;
  }

  .card-padding-large .card-body {
    padding: 3rem;
  }

  .card-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--light-gray);
    background: var(--light-gray);
  }

  /* Variants */
  .card-info {
    text-align: center;
  }

  .card-benefit {
    text-align: center;
    border-top: 4px solid var(--primary-green);
  }

  .card-package {
    position: relative;
    border: 3px solid transparent;
  }

  .card-testimonial {
    border-left: 4px solid var(--primary-green);
  }

  /* Border top colors */
  .card-border-top-primary {
    border-top: 4px solid var(--primary-green);
  }

  .card-border-top-secondary {
    border-top: 4px solid var(--secondary-blue);
  }

  .card-border-top-accent {
    border-top: 4px solid var(--accent-yellow);
  }

  /* Icon support */
  .card :global(.card-icon) {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  /* Special styling for benefit cards */
  .card-benefit .card-body :global(h3) {
    color: var(--primary-green);
    margin-bottom: 1rem;
  }

  /* Special styling for info cards */
  .card-info .card-body :global(h3) {
    color: var(--primary-green);
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  .card-info .card-body :global(p) {
    margin-bottom: 0.5rem;
    color: var(--dark-gray);
  }

  .card-info .card-body :global(p:first-of-type) {
    font-weight: 600;
    color: var(--text-dark);
  }
</style>
