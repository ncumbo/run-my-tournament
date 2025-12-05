<script lang="ts">
  import { onMount } from "svelte";
  import { customerAuth } from "$lib/stores/customerAuth";
  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";

  let organization = $customerAuth.organization;
  let loading = false;
  let message = "";

  // Form data
  let customization = {
    name: organization?.name || "",
    primary_color: organization?.primary_color || "#198038",
    secondary_color: organization?.secondary_color || "#0f62fe",
    font_family: organization?.font_family || "IBM Plex Sans",
    logo_url: organization?.logo_url || "",
    custom_css: "",
  };

  // Theme templates
  const themeTemplates = [
    { id: "classic", name: "Classic Golf", preview: "/previews/classic.jpg" },
    {
      id: "modern",
      name: "Modern Minimalist",
      preview: "/previews/modern.jpg",
    },
    { id: "charity", name: "Charity Focus", preview: "/previews/charity.jpg" },
    {
      id: "corporate",
      name: "Corporate Event",
      preview: "/previews/corporate.jpg",
    },
  ];

  let selectedTemplate = "classic";

  async function updateCustomization() {
    loading = true;
    message = "";

    try {
      const response = await fetch("/api/organization/customization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customization),
      });

      const result = await response.json();

      if (result.success) {
        message = "Customization updated successfully!";
        // Update the store
        customerAuth.update((state) => ({
          ...state,
          organization: { ...state.organization, ...customization },
        }));
      } else {
        message = result.error || "Failed to update customization";
      }
    } catch (error) {
      message = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function uploadLogo(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await fetch("/api/organization/upload-logo", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        customization.logo_url = result.url;
      }
    } catch (error) {
      console.error("Logo upload failed:", error);
    }
  }

  function applyTemplate(templateId: string) {
    selectedTemplate = templateId;

    const templateStyles = {
      classic: {
        primary_color: "#198038",
        secondary_color: "#0f62fe",
        font_family: "IBM Plex Sans",
      },
      modern: {
        primary_color: "#2563eb",
        secondary_color: "#64748b",
        font_family: "Inter",
      },
      charity: {
        primary_color: "#dc2626",
        secondary_color: "#f59e0b",
        font_family: "Source Sans Pro",
      },
      corporate: {
        primary_color: "#1f2937",
        secondary_color: "#6b7280",
        font_family: "Roboto",
      },
    };

    const template = templateStyles[templateId as keyof typeof templateStyles];
    if (template) {
      customization = { ...customization, ...template };
    }
  }

  onMount(() => {
    // Load current customization
    if (organization) {
      customization = {
        name: organization.name || "",
        primary_color: organization.primary_color || "#198038",
        secondary_color: organization.secondary_color || "#0f62fe",
        font_family: organization.font_family || "IBM Plex Sans",
        logo_url: organization.logo_url || "",
        custom_css: "",
      };
    }
  });
</script>

<svelte:head>
  <title>Site Customization - PinPoint Golf</title>
</svelte:head>

<div class="customization-page">
  <div class="page-header">
    <h1>Site Customization</h1>
    <p>Customize the look and feel of your tournament sites</p>
  </div>

  <div class="customization-grid">
    <!-- Theme Templates -->
    <Card>
      <h2>Theme Templates</h2>
      <div class="template-grid">
        {#each themeTemplates as template}
          <div
            class="template-card"
            class:selected={selectedTemplate === template.id}
            on:click={() => applyTemplate(template.id)}
          >
            <div class="template-preview">
              <div class="preview-placeholder">📄</div>
            </div>
            <h3>{template.name}</h3>
          </div>
        {/each}
      </div>
    </Card>

    <!-- Brand Settings -->
    <Card>
      <h2>Brand Settings</h2>
      <form on:submit|preventDefault={updateCustomization} class="brand-form">
        <div class="form-group">
          <label for="org-name">Organization Name</label>
          <Input
            id="org-name"
            bind:value={customization.name}
            placeholder="Enter organization name"
            required
          />
        </div>

        <div class="form-group">
          <label for="logo-upload">Logo</label>
          <div class="logo-upload">
            {#if customization.logo_url}
              <img
                src={customization.logo_url}
                alt="Logo"
                class="logo-preview"
              />
            {/if}
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              on:change={uploadLogo}
              class="file-input"
            />
            <label for="logo-upload" class="upload-button"> Choose Logo </label>
          </div>
        </div>

        <div class="color-row">
          <div class="form-group">
            <label for="primary-color">Primary Color</label>
            <div class="color-input">
              <input
                id="primary-color"
                type="color"
                bind:value={customization.primary_color}
              />
              <Input
                bind:value={customization.primary_color}
                placeholder="#198038"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="secondary-color">Secondary Color</label>
            <div class="color-input">
              <input
                id="secondary-color"
                type="color"
                bind:value={customization.secondary_color}
              />
              <Input
                bind:value={customization.secondary_color}
                placeholder="#0f62fe"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="font-family">Font Family</label>
          <select id="font-family" bind:value={customization.font_family}>
            <option value="IBM Plex Sans">IBM Plex Sans</option>
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Source Sans Pro">Source Sans Pro</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
          </select>
        </div>

        {#if message}
          <div class="message" class:success={message.includes("successfully")}>
            {message}
          </div>
        {/if}

        <Button type="submit" {loading} disabled={loading}>
          Update Customization
        </Button>
      </form>
    </Card>

    <!-- Custom CSS -->
    <Card>
      <h2>Custom CSS</h2>
      <div class="css-editor">
        <textarea
          bind:value={customization.custom_css}
          placeholder="/* Add your custom CSS here */"
          rows="12"
        ></textarea>
        <p class="css-help">
          Add custom CSS to further customize your tournament sites. Use
          standard CSS syntax to override default styles.
        </p>
      </div>
    </Card>

    <!-- Preview -->
    <Card>
      <h2>Live Preview</h2>
      <div class="preview-container">
        <div
          class="site-preview"
          style="
            --primary-color: {customization.primary_color};
            --secondary-color: {customization.secondary_color};
            font-family: {customization.font_family};
          "
        >
          <div class="preview-header">
            {#if customization.logo_url}
              <img
                src={customization.logo_url}
                alt="Logo"
                class="preview-logo"
              />
            {/if}
            <h3>{customization.name} Golf Tournament</h3>
          </div>
          <div class="preview-content">
            <div class="preview-button">Register Now</div>
            <p>Sample tournament description text...</p>
            <div class="preview-stats">
              <div class="stat">
                <strong>24</strong>
                <span>Registered</span>
              </div>
              <div class="stat">
                <strong>$2,400</strong>
                <span>Raised</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</div>

<style>
  .customization-page {
    padding: 2rem;
    max-width: 1400px;
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

  .customization-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .template-card {
    border: 2px solid var(--border-light);
    border-radius: var(--border-radius);
    padding: 1rem;
    cursor: pointer;
    transition: var(--transition);
    text-align: center;
  }

  .template-card:hover {
    border-color: var(--primary-green);
  }

  .template-card.selected {
    border-color: var(--primary-green);
    background: var(--pale-green);
  }

  .template-preview {
    height: 100px;
    background: var(--light-gray);
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
    font-size: 2rem;
  }

  .template-card h3 {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-dark);
  }

  .brand-form {
    space-y: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
  }

  .color-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .color-input {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .color-input input[type="color"] {
    width: 3rem;
    height: 2.5rem;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    cursor: pointer;
  }

  .logo-upload {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo-preview {
    width: 4rem;
    height: 4rem;
    object-fit: contain;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
  }

  .file-input {
    display: none;
  }

  .upload-button {
    padding: 0.5rem 1rem;
    background: var(--secondary-blue);
    color: white;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.9rem;
    transition: var(--transition);
  }

  .upload-button:hover {
    background: var(--dark-blue);
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    font-size: 1rem;
    background: white;
  }

  .css-editor textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    font-family: "Monaco", "Menlo", monospace;
    font-size: 0.9rem;
    resize: vertical;
  }

  .css-help {
    margin-top: 0.5rem;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .message {
    padding: 0.75rem;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    background: #fee;
    color: #c53030;
    border: 1px solid #feb2b2;
  }

  .message.success {
    background: #f0fff4;
    color: #22543d;
    border-color: #9ae6b4;
  }

  .preview-container {
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    padding: 1rem;
    background: var(--light-gray);
  }

  .site-preview {
    background: white;
    border-radius: var(--border-radius);
    overflow: hidden;
    min-height: 300px;
  }

  .preview-header {
    background: var(--primary-color);
    color: white;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .preview-logo {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
  }

  .preview-header h3 {
    margin: 0;
    font-size: 1.1rem;
  }

  .preview-content {
    padding: 1.5rem;
  }

  .preview-button {
    background: var(--secondary-color);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    display: inline-block;
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .preview-stats {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
  }

  .stat {
    text-align: center;
  }

  .stat strong {
    display: block;
    font-size: 1.5rem;
    color: var(--primary-color);
    margin-bottom: 0.25rem;
  }

  .stat span {
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .customization-grid {
      grid-template-columns: 1fr;
    }

    .color-row {
      grid-template-columns: 1fr;
    }

    .template-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
