<script lang="ts">
  export let tabs: Array<{
    id: string;
    label: string;
    icon?: string;
    href?: string;
    onclick?: () => void;
    disabled?: boolean;
  }>;
  export let activeTab: string = "";
  export let variant: "default" | "minimal" = "default";
  export let size: "small" | "medium" | "large" = "medium";
  export let orientation: "horizontal" | "vertical" = "horizontal";
</script>

<nav class="tab-navigation tab-{variant} tab-{size} tab-{orientation}">
  <div class="tab-list" role="tablist">
    {#each tabs as tab}
      {#if tab.href}
        <a
          href={tab.href}
          class="tab-item"
          class:active={activeTab === tab.id}
          class:disabled={tab.disabled}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabindex={tab.disabled ? -1 : 0}
        >
          {#if tab.icon}
            <span class="tab-icon">{tab.icon}</span>
          {/if}
          <span class="tab-label">{tab.label}</span>
        </a>
      {:else}
        <button
          class="tab-item"
          class:active={activeTab === tab.id}
          class:disabled={tab.disabled}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabindex={tab.disabled ? -1 : 0}
          on:click={tab.onclick}
        >
          {#if tab.icon}
            <span class="tab-icon">{tab.icon}</span>
          {/if}
          <span class="tab-label">{tab.label}</span>
        </button>
      {/if}
    {/each}
  </div>
</nav>

<style>
  .tab-navigation {
    --tab-border-color: var(--border-color, #e1e5e9);
    --tab-active-color: var(--primary-green, #2d5f3f);
    --tab-text-color: var(--text-dark, #1a1a1a);
    --tab-hover-bg: var(--light-gray, #f8f9fa);
    --tab-spacing: 1rem;
    --tab-padding: 0.75rem 1.5rem;
    --tab-border-radius: var(--border-radius, 8px);
  }

  .tab-list {
    display: flex;
    gap: 0.25rem;
    border-bottom: 2px solid var(--tab-border-color);
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .tab-list::-webkit-scrollbar {
    display: none;
  }

  .tab-vertical .tab-list {
    flex-direction: column;
    border-bottom: none;
    border-right: 2px solid var(--tab-border-color);
    min-width: 200px;
  }

  .tab-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: var(--tab-padding);
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    font-weight: 500;
    color: var(--tab-text-color);
    text-decoration: none;
    border-radius: var(--tab-border-radius) var(--tab-border-radius) 0 0;
    position: relative;
  }

  .tab-vertical .tab-item {
    border-radius: var(--tab-border-radius) 0 0 var(--tab-border-radius);
    justify-content: flex-start;
  }

  .tab-item:hover:not(.disabled) {
    background: var(--tab-hover-bg);
    color: var(--tab-active-color);
  }

  .tab-item.active {
    color: var(--tab-active-color);
    background: var(--white, #ffffff);
  }

  .tab-item.active::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--tab-active-color);
    border-radius: 2px 2px 0 0;
  }

  .tab-vertical .tab-item.active::after {
    bottom: auto;
    top: 0;
    right: -2px;
    left: auto;
    width: 3px;
    height: 100%;
    border-radius: 0 2px 2px 0;
  }

  .tab-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tab-icon {
    font-size: 1.1em;
    flex-shrink: 0;
  }

  .tab-label {
    flex: 1;
  }

  /* Size variants */
  .tab-small {
    --tab-padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .tab-large {
    --tab-padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  /* Minimal variant */
  .tab-minimal .tab-list {
    border-bottom: 1px solid var(--tab-border-color);
    gap: 0;
  }

  .tab-minimal .tab-item {
    border-radius: 0;
    border-bottom: 3px solid transparent;
  }

  .tab-minimal .tab-item.active {
    background: none;
    border-bottom-color: var(--tab-active-color);
  }

  .tab-minimal .tab-item.active::after {
    display: none;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .tab-list {
      gap: 0;
      border-bottom: 1px solid var(--tab-border-color);
    }

    .tab-item {
      --tab-padding: 0.75rem 1rem;
      font-size: 0.9rem;
      flex: 1;
      justify-content: center;
      min-width: 0;
    }

    .tab-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tab-vertical .tab-list {
      flex-direction: row;
      border-right: none;
      border-bottom: 2px solid var(--tab-border-color);
      min-width: auto;
    }

    .tab-vertical .tab-item {
      border-radius: var(--tab-border-radius) var(--tab-border-radius) 0 0;
    }

    .tab-vertical .tab-item.active::after {
      bottom: -2px;
      top: auto;
      right: auto;
      left: 0;
      width: 100%;
      height: 3px;
      border-radius: 2px 2px 0 0;
    }
  }

  @media (max-width: 480px) {
    .tab-item {
      --tab-padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
    }

    .tab-icon {
      font-size: 1em;
    }
  }
</style>
