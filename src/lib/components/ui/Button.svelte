<script lang="ts">
  export let variant: "primary" | "secondary" | "outline" = "primary";
  export let size: "small" | "medium" | "large" = "medium";
  export let disabled = false;
  export let href: string | undefined = undefined;
  export let type: "button" | "submit" | "reset" = "button";
  export let onclick: (() => void) | undefined = undefined;

  $: classes = [
    "btn",
    `btn-${variant}`,
    size !== "medium" ? `btn-${size}` : "",
    disabled ? "btn-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  function handleClick() {
    if (onclick && !disabled) {
      onclick();
    }
  }
</script>

{#if href && !disabled}
  <a {href} class={classes} role="button">
    <slot />
  </a>
{:else}
  <button {type} class={classes} {disabled} on:click={handleClick}>
    <slot />
  </button>
{/if}

<style>
  .btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
</style>
