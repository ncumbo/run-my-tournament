<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { customerAuth, customerAuthActions } from "$lib/stores/customerAuth";

  let sidebarOpen = false;

  // Reactive auth state
  $: ({ isAuthenticated, user, organization } = $customerAuth);

  onMount(() => {
    if (!isAuthenticated || !user) {
      goto("/login");
      return;
    }
  });

  function handleLogout() {
    customerAuthActions.logout();
    goto("/");
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  // Navigation items
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      href: "/dashboard",
      exact: true,
    },
    {
      id: "tournaments",
      label: "Tournaments",
      icon: "🏆",
      href: "/dashboard/tournaments",
      submenu: [
        { label: "All Tournaments", href: "/dashboard/tournaments" },
        { label: "Create Tournament", href: "/dashboard/tournaments/create" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "📈",
      href: "/dashboard/analytics",
    },
    {
      id: "registrations",
      label: "Registrations",
      icon: "👥",
      href: "/dashboard/registrations",
    },
    {
      id: "payments",
      label: "Payments",
      icon: "💳",
      href: "/dashboard/payments",
    },
    {
      id: "customization",
      label: "Site Design",
      icon: "🎨",
      href: "/dashboard/customization",
    },
    {
      id: "domains",
      label: "Domain & DNS",
      icon: "🌐",
      href: "/dashboard/domains",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      href: "/dashboard/settings",
    },
  ];

  // Check if current path matches navigation item
  function isActive(item: any) {
    if (item.exact) {
      return $page.url.pathname === item.href;
    }
    return $page.url.pathname.startsWith(item.href);
  }
</script>

<div class="dashboard-layout">
  <!-- Sidebar -->
  <aside class="sidebar" class:sidebar-open={sidebarOpen}>
    <div class="sidebar-header">
      <div class="organization-info">
        <h3>{organization?.name || "My Organization"}</h3>
        <p class="organization-url">
          {#if organization?.subdomain}
            {organization.subdomain}.pinpointgolf.com
          {:else}
            Setup your domain
          {/if}
        </p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        {#each navigationItems as item}
          <li class="nav-item">
            <a
              href={item.href}
              class="nav-link"
              class:active={isActive(item)}
              on:click={() => (sidebarOpen = false)}
            >
              <span class="nav-icon">{item.icon}</span>
              <span class="nav-label">{item.label}</span>
            </a>

            {#if item.submenu && isActive(item)}
              <ul class="submenu">
                {#each item.submenu as subItem}
                  <li class="submenu-item">
                    <a
                      href={subItem.href}
                      class="submenu-link"
                      class:active={$page.url.pathname === subItem.href}
                      on:click={() => (sidebarOpen = false)}
                    >
                      {subItem.label}
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          {user?.first_name?.[0]?.toUpperCase() || "U"}
        </div>
        <div class="user-details">
          <p class="user-name">{user?.first_name} {user?.last_name}</p>
          <p class="user-email">{user?.email}</p>
        </div>
      </div>

      <div class="footer-actions">
        <button class="logout-btn" on:click={handleLogout}>
          <span class="logout-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="main-content">
    <!-- Top Bar -->
    <header class="top-bar">
      <button class="sidebar-toggle" on:click={toggleSidebar}>
        <span class="hamburger-icon">☰</span>
      </button>

      <div class="top-bar-content">
        <div class="breadcrumb">
          <a href="/dashboard">Dashboard</a>
          {#if $page.url.pathname !== "/dashboard"}
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">
              {navigationItems.find((item) => isActive(item))?.label || "Page"}
            </span>
          {/if}
        </div>

        <div class="top-bar-actions">
          {#if organization?.subdomain}
            <a
              href="https://{organization.subdomain}.pinpointgolf.com"
              target="_blank"
              class="view-site-btn"
            >
              <span class="external-icon">🔗</span>
              <span>View Site</span>
            </a>
          {/if}

          <div class="notification-bell">
            <span class="bell-icon">🔔</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="page-content">
      <slot />
    </main>
  </div>
</div>

<!-- Sidebar Overlay for Mobile -->
{#if sidebarOpen}
  <div class="sidebar-overlay" on:click={toggleSidebar}></div>
{/if}

<style>
  .dashboard-layout {
    display: flex;
    min-height: 100vh;
    background: var(--off-white);
  }

  /* Sidebar */
  .sidebar {
    width: 280px;
    background: var(--white);
    border-right: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-light);
  }

  .organization-info h3 {
    margin: 0 0 0.25rem 0;
    color: var(--primary-green);
    font-size: 1.1rem;
    font-weight: 600;
  }

  .organization-url {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.8rem;
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .nav-item {
    margin: 0.25rem 0;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    color: var(--text-dark);
    text-decoration: none;
    transition: var(--transition);
    font-weight: 500;
  }

  .nav-link:hover,
  .nav-link.active {
    background: var(--pale-green);
    color: var(--primary-green);
  }

  .nav-icon {
    font-size: 1.1rem;
    width: 1.5rem;
    text-align: center;
  }

  .nav-label {
    flex: 1;
  }

  .submenu {
    list-style: none;
    margin: 0;
    padding: 0;
    background: var(--off-white);
  }

  .submenu-item {
    margin: 0;
  }

  .submenu-link {
    display: block;
    padding: 0.5rem 1.5rem 0.5rem 3.25rem;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: var(--transition);
  }

  .submenu-link:hover,
  .submenu-link.active {
    color: var(--primary-green);
    background: var(--pale-green);
  }

  .sidebar-footer {
    border-top: 1px solid var(--border-light);
    padding: 1rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    background: var(--gradient-green);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
  }

  .user-details {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.9rem;
  }

  .user-email {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem;
    background: none;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    color: var(--text-muted);
    font-size: 0.9rem;
    cursor: pointer;
    transition: var(--transition);
  }

  .logout-btn:hover {
    background: var(--light-gray);
    color: var(--text-dark);
  }

  /* Main Content */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 0;
    min-width: 0;
  }

  .top-bar {
    background: var(--white);
    border-bottom: 1px solid var(--border-light);
    padding: 0 1rem;
    height: 4rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .sidebar-toggle {
    display: block;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--text-dark);
    font-size: 1.2rem;
    border-radius: var(--border-radius);
  }

  .sidebar-toggle:hover {
    background: var(--light-gray);
  }

  .top-bar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .breadcrumb a {
    color: var(--secondary-blue);
    text-decoration: none;
  }

  .breadcrumb a:hover {
    text-decoration: underline;
  }

  .breadcrumb-separator {
    color: var(--medium-gray);
  }

  .breadcrumb-current {
    color: var(--text-dark);
    font-weight: 500;
  }

  .top-bar-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .view-site-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--secondary-blue);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    font-weight: 500;
    transition: var(--transition);
  }

  .view-site-btn:hover {
    background: var(--dark-blue);
    color: white;
    text-decoration: none;
  }

  .notification-bell {
    padding: 0.5rem;
    cursor: pointer;
    border-radius: var(--border-radius);
  }

  .notification-bell:hover {
    background: var(--light-gray);
  }

  .page-content {
    flex: 1;
    overflow: auto;
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  /* Desktop Styles */
  @media (min-width: 1024px) {
    .sidebar {
      position: static;
      transform: none;
      transition: none;
    }

    .main-content {
      margin-left: 0;
    }

    .sidebar-toggle {
      display: none;
    }

    .sidebar-overlay {
      display: none;
    }
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    .top-bar {
      padding: 0 0.75rem;
    }

    .breadcrumb {
      display: none;
    }
  }
</style>
