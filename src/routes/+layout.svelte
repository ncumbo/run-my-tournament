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

<nav class="navbar" role="navigation" aria-label="Main Navigation">
  <div class="nav-container">
    <!-- Logo -->
    <div class="nav-logo">
      <a href={isAdmin ? "/admin/dashboard" : "/"} class="logo-link">
        <h2>IBM Charity Golf Tournament</h2>
      </a>
    </div>

    <!-- Menu + Toggle -->
    <div class="nav-right">
      <ul class="nav-menu" class:nav-menu-active={mobileMenuOpen}>
        {#if isAdmin}
          <li>
            <a
              href="/admin/dashboard?tab=management"
              class="nav-link"
              class:active={$page.url.pathname === "/admin/dashboard" &&
                $page.url.searchParams.get("tab") === "management"}
              on:click={() => (mobileMenuOpen = false)}>Management Portal</a
            >
          </li>
          <li>
            <button
              class="nav-link admin-logout-btn"
              on:click={() => {
                import('$lib/stores/auth').then(({ authActions }) => {
                  authActions.logout();
                  window.location.href = '/';
                });
                mobileMenuOpen = false;
              }}
              >Logout</button
            >
          </li>
        {:else}
          <li>
            <a
              href="/register"
              class="nav-link"
              class:active={$page.url.pathname === "/register"}
              on:click={() => (mobileMenuOpen = false)}>Register</a
            >
          </li>
          <li>
            <a
              href="/tournament-details"
              class="nav-link"
              class:active={$page.url.pathname === "/tournament-details"}
              on:click={() => (mobileMenuOpen = false)}>Details</a
            >
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
              href="/sponsorship"
              class="nav-link"
              class:active={$page.url.pathname === "/sponsorship"}
              on:click={() => (mobileMenuOpen = false)}>Sponsorship</a
            >
          </li>
          <li>
            <a
              href="/leaderboard"
              class="nav-link"
              class:active={$page.url.pathname === "/leaderboard"}
              on:click={() => (mobileMenuOpen = false)}>Leaderboard</a
            >
          </li>
          <li>
            <a
              href="/contact"
              class="nav-link"
              class:active={$page.url.pathname === "/contact"}
              on:click={() => (mobileMenuOpen = false)}>Contact</a
            >
          </li>
        {/if}
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
  </div>
</nav>

<main class="main-content">
  <slot />
</main>

<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-section">
        <h4>IBM Charity Golf Tournament</h4>
        <p>
          Supporting CHARITY TBD and making a difference in our community
          through the power of golf.
        </p>
        <div class="tournament-info">
          <p><strong>June 12, 2026</strong></p>
          <p>12:00 PM EST Start</p>
        </div>
      </div>
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul class="footer-links">
          <li><a href="/about">About Tournament</a></li>
          <li><a href="/sponsorship">Sponsorship</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/volunteer">Volunteer</a></li>
          <li><a href="/history">Tournament History</a></li>
          <li><a href="/leaderboard">Live Leaderboard</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Contact</h4>
        <div class="contact-info">
          <p>Email: tournament@ibm.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Tournament Director: John Smith</p>
        </div>
        <br />
        {#if !isAdmin}
          <a href="/admin/login" class="admin-footer-link">Admin Login</a>
        {/if}
      </div>
      <div class="footer-section">
        <h4>CHARITY TBD</h4>
        <p>
          Learn more about the charity that started it all and continues to
          inspire our annual tournament.
        </p>
        <div class="social-links">
          <p>Follow our tournament updates</p>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <div class="footer-main">
          <p>&copy; 2025 IBM Charity Golf Tournament. All rights reserved.</p>
          <p class="footer-tagline">
            Building communities through golf and giving back.
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
    background: linear-gradient(
      135deg,
      var(--primary-green) 0%,
      var(--light-green) 100%
    );
    padding: 0.75rem 1rem;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: var(--shadow);
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
    gap: clamp(0.5rem, 2vw, 1.5rem);
    list-style: none;
    margin: 0;
    padding: 0;
    white-space: nowrap;
  }

  .nav-link {
    color: var(--white);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem clamp(0.5rem, 1.5vw, 1rem);
    border-radius: var(--border-radius);
    transition: var(--transition);
    white-space: nowrap;
  }

  .nav-link:hover,
  .nav-link.active {
    background-color: rgba(255, 255, 255, 0.2);
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

  .nav-toggle-active .bar:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }
  .nav-toggle-active .bar:nth-child(2) {
    opacity: 0;
  }
  .nav-toggle-active .bar:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
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
    background: linear-gradient(
      135deg,
      var(--primary-green) 0%,
      var(--light-green) 50%,
      var(--primary-green) 100%
    );
    color: var(--white);
    padding: 3rem 1rem 1rem;
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
  .tournament-info {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  .tournament-info p:first-child {
    color: var(--accent-yellow);
    font-weight: 600;
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
  .admin-footer-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: var(--transition);
    background: rgba(255, 255, 255, 0.1);
  }
  .admin-footer-link:hover {
    color: var(--text-dark);
    border-color: var(--accent-yellow);
    background-color: var(--accent-yellow);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  /* =======================
     Responsive
     ======================= */
  @media (max-width: 1250px) {
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

  @media (max-width: 480px) {
    .nav-logo h2 {
      font-size: 1rem;
    }
  }
</style>
