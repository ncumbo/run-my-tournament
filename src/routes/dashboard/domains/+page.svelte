<script lang="ts">
  import { onMount } from "svelte";
  import { customerAuth } from "$lib/stores/customerAuth";
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";

  let organization = $customerAuth.organization;
  let loading = false;
  let message = "";
  let dnsCheckLoading = false;

  // Domain settings
  let domainSettings = {
    subdomain: organization?.subdomain || "",
    custom_domain: organization?.custom_domain || "",
    domain_verified: false,
  };

  // DNS records for custom domain
  const requiredDnsRecords = [
    {
      type: "CNAME",
      name: "@",
      value: "proxy.pinpointgolf.com",
      description: "Points your domain to PinPoint Golf",
    },
    {
      type: "CNAME",
      name: "www",
      value: "proxy.pinpointgolf.com",
      description: "Points www subdomain to PinPoint Golf",
    },
  ];

  async function updateSubdomain() {
    loading = true;
    message = "";

    try {
      const response = await fetch("/api/organization/domain", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: domainSettings.subdomain,
          action: "update_subdomain",
        }),
      });

      const result = await response.json();

      if (result.success) {
        message = "Subdomain updated successfully!";
        customerAuth.update((state) => ({
          ...state,
          organization: {
            ...state.organization,
            subdomain: domainSettings.subdomain,
          },
        }));
      } else {
        message = result.error || "Failed to update subdomain";
      }
    } catch (error) {
      message = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function addCustomDomain() {
    loading = true;
    message = "";

    try {
      const response = await fetch("/api/organization/domain", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom_domain: domainSettings.custom_domain,
          action: "add_custom_domain",
        }),
      });

      const result = await response.json();

      if (result.success) {
        message =
          "Custom domain added! Please configure your DNS settings and verify.";
        customerAuth.update((state) => ({
          ...state,
          organization: {
            ...state.organization,
            custom_domain: domainSettings.custom_domain,
          },
        }));
      } else {
        message = result.error || "Failed to add custom domain";
      }
    } catch (error) {
      message = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function verifyDomain() {
    dnsCheckLoading = true;

    try {
      const response = await fetch("/api/organization/domain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainSettings.custom_domain }),
      });

      const result = await response.json();

      if (result.success) {
        domainSettings.domain_verified = true;
        message = "Domain verified successfully!";
      } else {
        message =
          result.error ||
          "Domain verification failed. Please check your DNS settings.";
      }
    } catch (error) {
      message = "Network error during verification.";
    } finally {
      dnsCheckLoading = false;
    }
  }

  async function removeCustomDomain() {
    loading = true;

    try {
      const response = await fetch("/api/organization/domain", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          custom_domain: "",
          action: "remove_custom_domain",
        }),
      });

      const result = await response.json();

      if (result.success) {
        domainSettings.custom_domain = "";
        domainSettings.domain_verified = false;
        message = "Custom domain removed successfully!";
        customerAuth.update((state) => ({
          ...state,
          organization: {
            ...state.organization,
            custom_domain: "",
          },
        }));
      } else {
        message = result.error || "Failed to remove custom domain";
      }
    } catch (error) {
      message = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Show temporary success message
      const originalMessage = message;
      message = "Copied to clipboard!";
      setTimeout(() => {
        message = originalMessage;
      }, 2000);
    });
  }

  onMount(() => {
    if (organization) {
      domainSettings = {
        subdomain: organization.subdomain || "",
        custom_domain: organization.custom_domain || "",
        domain_verified: false, // TODO: Get this from API
      };
    }
  });
</script>

<svelte:head>
  <title>Domain & DNS - PinPoint Golf</title>
</svelte:head>

<div class="domains-page">
  <div class="page-header">
    <h1>Domain & DNS Settings</h1>
    <p>Manage your tournament site domains and DNS configuration</p>
  </div>

  <div class="domains-grid">
    <!-- Subdomain Settings -->
    <Card>
      <h2>PinPoint Golf Subdomain</h2>
      <p class="card-description">
        Your free subdomain on the PinPoint Golf platform
      </p>

      <div class="subdomain-form">
        <div class="subdomain-input">
          <Input
            bind:value={domainSettings.subdomain}
            placeholder="your-organization"
          />
          <span class="domain-suffix">.pinpointgolf.com</span>
        </div>

        <Button
          on:click={updateSubdomain}
          {loading}
          disabled={loading || !domainSettings.subdomain}
        >
          Update Subdomain
        </Button>
      </div>

      {#if domainSettings.subdomain}
        <div class="domain-preview">
          <strong>Your site will be available at:</strong>
          <a
            href="https://{domainSettings.subdomain}.pinpointgolf.com"
            target="_blank"
            class="domain-link"
          >
            https://{domainSettings.subdomain}.pinpointgolf.com
          </a>
        </div>
      {/if}
    </Card>

    <!-- Custom Domain -->
    <Card>
      <h2>Custom Domain</h2>
      <p class="card-description">
        Use your own domain name for a professional appearance
      </p>

      {#if !domainSettings.custom_domain}
        <div class="custom-domain-form">
          <Input
            bind:value={domainSettings.custom_domain}
            placeholder="www.yourdomain.com"
          />
          <Button
            on:click={addCustomDomain}
            {loading}
            disabled={loading || !domainSettings.custom_domain}
          >
            Add Custom Domain
          </Button>
        </div>
      {:else}
        <div class="current-domain">
          <div class="domain-info">
            <strong>Current Domain:</strong>
            <span class="domain-name">{domainSettings.custom_domain}</span>
            <span
              class="status"
              class:verified={domainSettings.domain_verified}
            >
              {domainSettings.domain_verified
                ? "✅ Verified"
                : "⏳ Pending Verification"}
            </span>
          </div>

          <div class="domain-actions">
            {#if !domainSettings.domain_verified}
              <Button
                on:click={verifyDomain}
                loading={dnsCheckLoading}
                disabled={dnsCheckLoading}
                variant="secondary"
              >
                Verify Domain
              </Button>
            {/if}

            <Button
              on:click={removeCustomDomain}
              {loading}
              disabled={loading}
              variant="danger"
            >
              Remove Domain
            </Button>
          </div>
        </div>
      {/if}
    </Card>

    <!-- DNS Configuration -->
    {#if domainSettings.custom_domain}
      <Card>
        <h2>DNS Configuration</h2>
        <p class="card-description">
          Add these DNS records to your domain provider to complete setup
        </p>

        <div class="dns-records">
          {#each requiredDnsRecords as record}
            <div class="dns-record">
              <div class="record-header">
                <span class="record-type">{record.type}</span>
                <Button
                  on:click={() => copyToClipboard(record.value)}
                  variant="ghost"
                  size="small"
                >
                  📋 Copy
                </Button>
              </div>

              <div class="record-details">
                <div class="record-field">
                  <label>Name/Host:</label>
                  <code>{record.name}</code>
                </div>
                <div class="record-field">
                  <label>Value/Target:</label>
                  <code>{record.value}</code>
                </div>
              </div>

              <p class="record-description">{record.description}</p>
            </div>
          {/each}
        </div>

        <div class="dns-help">
          <h4>Need Help?</h4>
          <ul>
            <li>DNS changes can take up to 48 hours to propagate</li>
            <li>
              Contact your domain provider if you need help adding DNS records
            </li>
            <li>Common providers: GoDaddy, Namecheap, Cloudflare, Route 53</li>
          </ul>
        </div>
      </Card>
    {/if}

    <!-- Domain Status & Info -->
    <Card>
      <h2>Domain Status</h2>

      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">Subdomain:</span>
          <span class="status-value">
            {domainSettings.subdomain ? "✅ Active" : "❌ Not Set"}
          </span>
        </div>

        <div class="status-item">
          <span class="status-label">Custom Domain:</span>
          <span class="status-value">
            {#if domainSettings.custom_domain}
              {domainSettings.domain_verified ? "✅ Verified" : "⏳ Pending"}
            {:else}
              "❌ Not Set"
            {/if}
          </span>
        </div>

        <div class="status-item">
          <span class="status-label">SSL Certificate:</span>
          <span class="status-value">✅ Auto-managed</span>
        </div>

        <div class="status-item">
          <span class="status-label">CDN:</span>
          <span class="status-value">✅ Global</span>
        </div>
      </div>

      <div class="features-list">
        <h4>Included Features:</h4>
        <ul>
          <li>✅ Free SSL certificates</li>
          <li>✅ Global CDN for fast loading</li>
          <li>✅ Automatic HTTPS redirect</li>
          <li>✅ DDoS protection</li>
          <li>✅ 99.9% uptime guarantee</li>
        </ul>
      </div>
    </Card>
  </div>

  {#if message}
    <div
      class="message"
      class:success={message.includes("successfully") ||
        message.includes("Copied")}
    >
      {message}
    </div>
  {/if}
</div>

<style>
  .domains-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
    font-size: 2rem;
    font-weight: 700;
  }

  .page-header p {
    margin: 0;
    color: var(--text-muted);
    font-size: 1.1rem;
  }

  .domains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .card-description {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }

  .subdomain-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .subdomain-input {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .subdomain-input :global(.input) {
    border: none;
    border-radius: 0;
    flex: 1;
  }

  .domain-suffix {
    background: var(--light-gray);
    padding: 0.75rem 1rem;
    color: var(--text-muted);
    font-family: monospace;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .domain-preview {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--pale-green);
    border-radius: var(--border-radius);
  }

  .domain-link {
    display: block;
    margin-top: 0.5rem;
    color: var(--secondary-blue);
    text-decoration: none;
    font-family: monospace;
  }

  .domain-link:hover {
    text-decoration: underline;
  }

  .custom-domain-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .current-domain {
    space-y: 1rem;
  }

  .domain-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .domain-name {
    font-family: monospace;
    background: var(--light-gray);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
  }
  .status {
    font-size: 0.9rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background: var(--light-gray);
    color: var(--text-muted);
  }

  .status.verified {
    background: var(--pale-green);
    color: var(--primary-green);
  }

  .domain-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .dns-records {
    space-y: 1rem;
  }

  .dns-record {
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .record-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .record-type {
    background: var(--secondary-blue);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.8rem;
    font-weight: bold;
  }

  .record-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .record-field label {
    display: block;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
  }

  .record-field code {
    display: block;
    background: var(--light-gray);
    padding: 0.5rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9rem;
    word-break: break-all;
  }

  .record-description {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0;
  }

  .dns-help {
    margin-top: 2rem;
    padding: 1rem;
    background: var(--off-white);
    border-radius: var(--border-radius);
  }

  .dns-help h4 {
    margin: 0 0 1rem 0;
    color: var(--text-dark);
  }

  .dns-help ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .dns-help li {
    color: var(--text-muted);
    margin-bottom: 0.5rem;
  }

  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
  }

  .status-label {
    font-weight: 500;
    color: var(--text-dark);
  }

  .status-value {
    font-size: 0.9rem;
  }

  .features-list {
    padding: 1rem;
    background: var(--pale-green);
    border-radius: var(--border-radius);
  }

  .features-list h4 {
    margin: 0 0 1rem 0;
    color: var(--primary-green);
  }

  .features-list ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  .features-list li {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }

  .message {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    background: #fee;
    color: #c53030;
    border: 1px solid #feb2b2;
    box-shadow: var(--shadow);
    z-index: 1000;
  }

  .message.success {
    background: #f0fff4;
    color: #22543d;
    border-color: #9ae6b4;
  }

  @media (max-width: 768px) {
    .domains-grid {
      grid-template-columns: 1fr;
    }

    .record-details {
      grid-template-columns: 1fr;
    }

    .status-grid {
      grid-template-columns: 1fr;
    }

    .domain-actions {
      flex-direction: column;
    }

    .message {
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
    }
  }
</style>
