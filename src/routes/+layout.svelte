<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { auth } from "$lib/stores/auth";

  let mobileMenuOpen = false;

  // Reactive admin state from the auth store
  $: isAdmin =
    $auth.isAuthenticated &&
    ["admin", "super_admin"].includes($auth.user?.role);

  onMount(() => {
    // Smooth scroll for anchor links
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && target.hash) {
        const el = document.getElementById(target.hash.slice(1));
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth" });
          mobileMenuOpen = false; // close menu on click
        }
      }
    };
    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  });

  // Close mobile menu on route change
  $: if ($page.url.pathname) {
    mobileMenuOpen = false;
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<nav class="navbar" aria-label="Main Navigation">
  <div class="nav-container">
    <!-- Logo -->
    <div class="nav-logo">
      <a href={isAdmin ? "/admin/dashboard" : "/"} class="logo-link">
        <h2>Pinpoint Golf</h2>
      </a>
    </div>

    {#if isAdmin && !($page.url.searchParams.get("preview") === "true")}
      <!-- Admin Navigation - Management Portal and Logout on same row -->
      <div class="admin-nav-section">
        <a
          href="/admin/dashboard?tab=management"
          class="nav-link management-link"
          class:active={$page.url.pathname === "/admin/dashboard" &&
            $page.url.searchParams.get("tab") === "management"}
          >Management Portal</a
        >
        <button
          class="nav-link admin-logout-btn"
          on:click={() => {
            import('$lib/stores/auth').then(({ authActions }) => {
              authActions.logout();
              window.location.href = '/';
            });
          }}
          >Logout</button
        >
      </div>
    {:else}
      <!-- Public Menu + Toggle -->
      <div class="nav-right">
        <ul class="nav-menu" class:nav-menu-active={mobileMenuOpen}>
          <li>
            <button
              class="nav-link demo-link"
              on:click={() => {
                document
                  .querySelector(".demo-section")
                  ?.scrollIntoView({ behavior: "smooth" });
                mobileMenuOpen = false;
              }}
            >
              Demo
            </button>
          </li>
          <li>
            <a
              href="/about"
              class="nav-link"
              class:active={$page.url.pathname === "/about"}
              on:click={() => (mobileMenuOpen = false)}>About</a
            >
          </li>
          <li>
            <a
              href="/signup"
              class="nav-link cta-link"
              class:active={$page.url.pathname === "/signup"}
              on:click={() => (mobileMenuOpen = false)}>Sign Up</a
            >
          </li>
          <li>
            <a
              href="/login"
              class="nav-link"
              class:active={$page.url.pathname === "/login"}
              on:click={() => (mobileMenuOpen = false)}>Login</a
            >
          </li>
        </ul>

        <!-- Hamburger Toggle -->
        <button
          class="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          on:click={toggleMobileMenu}
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    {/if}
  </div>
</nav>

<main class="main-content">
  <slot />
</main>

<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Pinpoint Golf</h4>
        <p>
          The free platform for creating professional golf tournament websites.
          Build stunning tournament sites in minutes.
        </p>
        <div class="platform-info">
          <p><strong>500+ Tournaments Created</strong></p>
          <p>Trusted by organizers worldwide</p>
        </div>
      </div>
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul class="footer-links">
          <li><a href="/about">About Platform</a></li>
          <li><a href="/register">Create Tournament</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/contact">Contact Support</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Support</h4>
        <div class="contact-info">
          <p>Email: support@pinpointgolf.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Help Center: help.pinpointgolf.com</p>
        </div>
        <br />
        <a href="/register" class="cta-footer-link">Start Building Free</a>
      </div>
      <div class="footer-section">
        <h4>For Tournament Organizers</h4>
        <p>
          Join hundreds of successful tournament organizers who trust Pinpoint
          Golf for their events. Easy setup, professional results.
        </p>
        <div class="social-links">
          <p>Follow us for updates and tips</p>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="footer-main">
          <p>&copy; 2025 Pinpoint Golf. All rights reserved.</p>
          <p class="footer-tagline">
            Empowering golf tournaments worldwide with professional websites.
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  /* =======================
     Navigation Styles
     ======================= */
  .navbar {
    background: var(--gradient-green);
    padding: 0.75rem 1rem;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: var(--shadow-elevated);
    backdrop-filter: blur(10px);
  }

  .nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }

  .nav-logo .logo-link {
    text-decoration: none;
    color: inherit;
  }

  .nav-logo .logo-link:hover {
    text-decoration: none;
  }

  .nav-logo h2 {
    color: var(--white);
    margin: 0;
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    font-weight: 600;
    white-space: nowrap;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-menu {
    display: flex;
    align-items: center;
    gap: clamp(0.3rem, 1.5vw, 1rem);
    list-style: none;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    flex-wrap: nowrap;
  }

  .nav-link {
    color: var(--white);
    text-decoration: none;
    font-weight: 500;
    padding: 0.4rem clamp(0.4rem, 1vw, 0.8rem);
    border-radius: var(--border-radius);
    transition: var(--transition);
    white-space: nowrap;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: clamp(0.85rem, 1.5vw, 1rem);
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    box-sizing: border-box;
  }

  .nav-link:hover,
  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .demo-link {
    background: var(--dark-green);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .demo-link:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .cta-link {
    background: var(--accent-yellow) !important;
    color: var(--text-dark) !important;
    font-weight: 600;
    border: 1px solid var(--accent-yellow);
  }

  .cta-link:hover {
    background: #ffd700 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .admin-logout-btn {
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: var(--white);
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
  }

  .admin-logout-btn:hover {
    background: linear-gradient(135deg, #c82333, #a71e2a);
    transform: translateY(-1px);
  }

  .admin-nav-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .management-link {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .management-link:hover,
  .management-link.active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .nav-toggle {
    display: none;
    flex-direction: column;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: var(--transition);
  }

  .nav-toggle:hover {
    background: var(--accent-yellow);
    border-color: var(--accent-yellow);
  }

  .bar {
    width: 25px;
    height: 3px;
    background-color: var(--white);
    margin: 3px 0;
    border-radius: 2px;
    transition: var(--transition);
  }

  .nav-toggle:hover .bar {
    background-color: var(--text-dark);
  }

  /* =======================
     Main Content
     ======================= */
  .main-content {
    min-height: calc(100vh - 60px);
  }

  /* =======================
     Footer
     ======================= */
  .footer {
    background: var(--gradient-green);
    color: var(--white);
    padding: 3rem 1rem 1rem;
    position: relative;
  }

  .footer::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      var(--primary-green) 0%,
      var(--light-green) 50%,
      var(--primary-green) 100%
    );
    opacity: 0.95;
    z-index: -1;
  }
  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
    max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
  }
  .footer-section h4 {
    color: var(--white);
    margin-bottom: 1rem;
    font-weight: 600;
  }
  .footer-section p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .footer-links a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: var(--transition);
    padding: 0.25rem 0;
    display: block;
  }
  .footer-links a:hover {
    color: var(--accent-yellow);
    transform: translateX(5px);
  }
  .contact-info p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.5rem;
  }
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 0;
    background: rgba(0, 0, 0, 0.1);
    margin: 0;
    width: 100%;
  }
  .footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  .footer-main {
    text-align: center;
    flex: 1;
  }
  .footer-main p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0.25rem 0;
  }
  .footer-tagline {
    font-style: italic;
    color: rgba(255, 255, 255, 0.7);
  }
  .cta-footer-link {
    color: var(--text-dark);
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    border: 2px solid var(--accent-yellow);
    transition: var(--transition);
    background: var(--accent-yellow);
    font-weight: 600;
    display: inline-block;
  }
  .cta-footer-link:hover {
    color: var(--white);
    border-color: var(--white);
    background-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .platform-info {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  .platform-info p:first-child {
    color: var(--accent-yellow);
    font-weight: 600;
  }

  /* =======================
     Responsive
     ======================= */
  @media (max-width: 1100px) {
    .nav-toggle {
      display: flex;
    }

    .nav-menu {
      position: absolute;
      top: 60px;
      right: -100%;
      flex-direction: column;
      width: 100%;
      background: linear-gradient(
        135deg,
        var(--primary-green),
        var(--light-green)
      );
      text-align: center;
      padding: 2rem 0;
      gap: 0;
      transition: 0.3s ease;
    }

    .nav-menu.nav-menu-active {
      right: 0;
    }

    .nav-link {
      padding: 1rem 2rem;
      display: block;
      border-radius: 0;
    }

    .admin-logout-btn {
      margin: 0.5rem auto;
      width: fit-content;
    }
  }

  @media (max-width: 768px) {
    .admin-nav-section {
      gap: 0.5rem;
    }

    .management-link,
    .admin-logout-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .nav-logo h2 {
      font-size: 1rem;
    }

    .admin-nav-section {
      flex-direction: column;
      gap: 0.25rem;
    }

    .management-link,
    .admin-logout-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
    }
  }
</style>
