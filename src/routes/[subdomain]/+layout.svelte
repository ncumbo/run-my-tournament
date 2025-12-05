<script lang="ts">
  import type { LayoutData } from "./$types";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  export let data: LayoutData;

  $: ({ organization, tournaments } = data);

  // Apply organization branding
  $: cssCustomProperties = `
    --org-primary-color: ${organization.primary_color};
    --org-secondary-color: ${organization.secondary_color};
    --org-font-family: ${organization.font_family};
  `;

  onMount(() => {
    // Set dynamic title
    document.title = `${organization.name} - Golf Tournaments`;

    // Add custom font if needed
    if (
      organization.font_family &&
      organization.font_family !== "IBM Plex Sans"
    ) {
      const fontLink = document.createElement("link");
      fontLink.href = `https://fonts.googleapis.com/css2?family=${organization.font_family.replace(/ /g, "+")}:wght@300;400;500;600;700&display=swap`;
      fontLink.rel = "stylesheet";
      document.head.appendChild(fontLink);
    }
  });

  // Navigation items
  const navigationItems = [
    { label: "Home", href: `/${organization.subdomain}`, exact: true },
    { label: "Tournaments", href: `/${organization.subdomain}/tournaments` },
    { label: "About", href: `/${organization.subdomain}/about` },
    { label: "Contact", href: `/${organization.subdomain}/contact` },
  ];

  function isActive(item: any) {
    if (item.exact) {
      return $page.url.pathname === item.href;
    }
    return $page.url.pathname.startsWith(item.href);
  }
</script>

<svelte:head>
  <meta
    name="description"
    content="{organization.name} - Golf Tournament Registration and Management"
  />
  <meta property="og:title" content="{organization.name} - Golf Tournaments" />
  <meta
    property="og:description"
    content="Register for golf tournaments hosted by {organization.name}"
  />
  {#if organization.logo_url}
    <meta property="og:image" content={organization.logo_url} />
  {/if}
</svelte:head>

<div class="site-layout" style={cssCustomProperties}>
  <!-- Header -->
  <header class="site-header">
    <div class="container">
      <div class="header-content">
        <div class="brand">
          {#if organization.logo_url}
            <img
              src={organization.logo_url}
              alt={organization.name}
              class="logo"
            />
          {/if}
          <h1 class="org-name">{organization.name}</h1>
        </div>

        <nav class="main-nav">
          <ul class="nav-list">
            {#each navigationItems as item}
              <li class="nav-item">
                <a
                  href={item.href}
                  class="nav-link"
                  class:active={isActive(item)}
                >
                  {item.label}
                </a>
              </li>
            {/each}
          </ul>
        </nav>

        <div class="header-actions">
          <a href={`/${organization.subdomain}/register`} class="cta-button">
            Register Now
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="site-main">
    <slot />
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>{organization.name}</h3>
          <p>
            Creating memorable golf experiences and supporting great causes.
          </p>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            {#each navigationItems as item}
              <li>
                <a href={item.href}>{item.label}</a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="footer-section">
          <h4>Tournaments</h4>
          <ul class="footer-links">
            {#each tournaments.slice(0, 3) as tournament}
              <li>
                <a
                  href={`/${organization.subdomain}/tournament/${tournament.slug}`}
                >
                  {tournament.name}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="footer-section">
          <h4>Contact</h4>
          <p>Questions about our tournaments?</p>
          <a href={`/${organization.subdomain}/contact`} class="contact-link">
            Get in touch
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()}
          {organization.name}. All rights reserved.
        </p>
        <p class="powered-by">
          Powered by <a href="https://pinpointgolf.com" target="_blank"
            >PinPoint Golf</a
          >
        </p>
      </div>
    </div>
  </footer>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
    font-family: var(--org-font-family, "IBM Plex Sans", sans-serif);
    line-height: 1.6;
    color: #333;
  }

  .site-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  /* Header */
  .site-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    height: 3rem;
    width: auto;
    object-fit: contain;
  }

  .org-name {
    margin: 0;
    color: var(--org-primary-color, #198038);
    font-size: 1.5rem;
    font-weight: 700;
  }

  .main-nav {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .nav-list {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    text-decoration: none;
    color: #64748b;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
  }

  .nav-link:hover,
  .nav-link.active {
    color: var(--org-primary-color, #198038);
    background: rgba(25, 128, 56, 0.1);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .cta-button {
    background: var(--org-primary-color, #198038);
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .cta-button:hover {
    background: var(--org-secondary-color, #0f62fe);
    transform: translateY(-1px);
  }

  /* Main Content */
  .site-main {
    flex: 1;
  }

  /* Footer */
  .site-footer {
    background: #1a202c;
    color: white;
    margin-top: auto;
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 3rem 0;
  }

  .footer-section h3,
  .footer-section h4 {
    margin: 0 0 1rem 0;
    color: var(--org-primary-color, #198038);
  }

  .footer-section p {
    margin: 0 0 1rem 0;
    color: #a0aec0;
  }

  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .footer-links li {
    margin-bottom: 0.5rem;
  }

  .footer-links a {
    color: #a0aec0;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-links a:hover {
    color: white;
  }

  .contact-link {
    color: var(--org-primary-color, #198038);
    text-decoration: none;
    font-weight: 600;
  }

  .contact-link:hover {
    text-decoration: underline;
  }

  .footer-bottom {
    border-top: 1px solid #2d3748;
    padding: 2rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #a0aec0;
    font-size: 0.9rem;
  }

  .powered-by a {
    color: var(--org-primary-color, #198038);
    text-decoration: none;
  }

  .powered-by a:hover {
    text-decoration: underline;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .container {
      padding: 0 1rem;
    }

    .header-content {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }

    .main-nav {
      order: 3;
      width: 100%;
    }

    .nav-list {
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .org-name {
      font-size: 1.25rem;
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .brand {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }

    .nav-list {
      gap: 0.5rem;
    }

    .nav-link {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
</style>
