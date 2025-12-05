<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { customerAuth } from "$lib/stores/customerAuth";
  import { Button, Card, Input } from "$lib/components";

  let isLoading = false;
  let errorMessage = "";

  // Form data
  let tournamentData = {
    name: "",
    slug: "",
    event_date: "",
    location_name: "",
    location_address: "",
    location_city: "",
    location_state: "",
    location_zip: "",
    individual_price: 150,
    team_price: 550,
    max_participants: null,
    registration_deadline: "",
    description: "",
    charity_name: "",
    charity_description: "",
    theme_template: "classic",
  };

  // Reactive auth state
  $: ({ isAuthenticated, user, organization } = $customerAuth);

  onMount(() => {
    if (!isAuthenticated || !user) {
      goto("/login");
      return;
    }
  });

  // Auto-generate slug from tournament name
  $: if (tournamentData.name) {
    tournamentData.slug = tournamentData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50);
  }

  // Auto-set registration deadline to 7 days before event
  $: if (tournamentData.event_date) {
    const eventDate = new Date(tournamentData.event_date);
    const deadlineDate = new Date(eventDate);
    deadlineDate.setDate(deadlineDate.getDate() - 7);
    tournamentData.registration_deadline = deadlineDate
      .toISOString()
      .split("T")[0];
  }

  async function handleSubmit() {
    // Validation
    if (
      !tournamentData.name ||
      !tournamentData.event_date ||
      !tournamentData.location_name
    ) {
      errorMessage = "Please fill in all required fields";
      return;
    }

    if (tournamentData.individual_price < 0) {
      errorMessage = "Individual price must be a positive number";
      return;
    }

    if (tournamentData.team_price && tournamentData.team_price < 0) {
      errorMessage = "Team price must be a positive number";
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...tournamentData,
          organization_id: organization?.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to tournament management page
        goto(`/dashboard/tournaments/${result.id}`);
      } else {
        const error = await response.json();
        errorMessage = error.message || "Failed to create tournament";
      }
    } catch (error) {
      console.error("Error creating tournament:", error);
      errorMessage = "An unexpected error occurred. Please try again.";
    } finally {
      isLoading = false;
    }
  }

  function handleCancel() {
    goto("/dashboard/tournaments");
  }
</script>

<svelte:head>
  <title>Create Tournament - Pinpoint Golf</title>
</svelte:head>

<div class="create-tournament-page">
  <div class="page-header">
    <div class="header-content">
      <h1>Create New Tournament</h1>
      <p>
        Set up your golf tournament with all the details your participants need
      </p>
    </div>
  </div>

  <form class="tournament-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-sections">
      <!-- Basic Information -->
      <Card variant="default" padding="large">
        <div class="section-header">
          <h2>Basic Information</h2>
          <p>Essential details about your tournament</p>
        </div>

        <div class="form-grid">
          <div class="form-group span-2">
            <label for="name">Tournament Name *</label>
            <Input
              id="name"
              type="text"
              bind:value={tournamentData.name}
              placeholder="Annual Charity Golf Classic"
              required
              disabled={isLoading}
            />
          </div>

          <div class="form-group span-2">
            <label for="slug">URL Slug *</label>
            <Input
              id="slug"
              type="text"
              bind:value={tournamentData.slug}
              placeholder="charity-golf-classic"
              required
              disabled={isLoading}
            />
            <small class="form-hint">
              This will be your tournament's web address: {organization?.subdomain}.pinpointgolf.com/<strong
                >{tournamentData.slug || "your-tournament-url"}</strong
              >
            </small>
          </div>

          <div class="form-group">
            <label for="event_date">Event Date *</label>
            <Input
              id="event_date"
              type="date"
              bind:value={tournamentData.event_date}
              required
              disabled={isLoading}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div class="form-group">
            <label for="registration_deadline">Registration Deadline</label>
            <Input
              id="registration_deadline"
              type="date"
              bind:value={tournamentData.registration_deadline}
              disabled={isLoading}
            />
          </div>

          <div class="form-group span-2">
            <label for="description">Tournament Description</label>
            <textarea
              id="description"
              bind:value={tournamentData.description}
              placeholder="Describe your tournament, its purpose, and what participants can expect..."
              rows="4"
              disabled={isLoading}
            ></textarea>
          </div>
        </div>
      </Card>

      <!-- Location Details -->
      <Card variant="default" padding="large">
        <div class="section-header">
          <h2>Location Details</h2>
          <p>Where your tournament will take place</p>
        </div>

        <div class="form-grid">
          <div class="form-group span-2">
            <label for="location_name">Venue Name *</label>
            <Input
              id="location_name"
              type="text"
              bind:value={tournamentData.location_name}
              placeholder="Pine Valley Golf Club"
              required
              disabled={isLoading}
            />
          </div>

          <div class="form-group span-2">
            <label for="location_address">Address</label>
            <Input
              id="location_address"
              type="text"
              bind:value={tournamentData.location_address}
              placeholder="123 Golf Course Drive"
              disabled={isLoading}
            />
          </div>

          <div class="form-group">
            <label for="location_city">City</label>
            <Input
              id="location_city"
              type="text"
              bind:value={tournamentData.location_city}
              placeholder="Springfield"
              disabled={isLoading}
            />
          </div>

          <div class="form-group">
            <label for="location_state">State</label>
            <Input
              id="location_state"
              type="text"
              bind:value={tournamentData.location_state}
              placeholder="NY"
              disabled={isLoading}
            />
          </div>

          <div class="form-group">
            <label for="location_zip">ZIP Code</label>
            <Input
              id="location_zip"
              type="text"
              bind:value={tournamentData.location_zip}
              placeholder="12345"
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      <!-- Pricing & Registration -->
      <Card variant="default" padding="large">
        <div class="section-header">
          <h2>Pricing & Registration</h2>
          <p>Set your registration fees and limits</p>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="individual_price">Individual Price ($) *</label>
            <Input
              id="individual_price"
              type="number"
              bind:value={tournamentData.individual_price}
              min="0"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <div class="form-group">
            <label for="team_price">Team Price ($)</label>
            <Input
              id="team_price"
              type="number"
              bind:value={tournamentData.team_price}
              min="0"
              step="0.01"
              placeholder="Optional - for 4-person teams"
              disabled={isLoading}
            />
          </div>

          <div class="form-group">
            <label for="max_participants">Max Participants</label>
            <Input
              id="max_participants"
              type="number"
              bind:value={tournamentData.max_participants}
              min="1"
              placeholder="Leave empty for no limit"
              disabled={isLoading}
            />
          </div>
        </div>
      </Card>

      <!-- Charity Information -->
      <Card variant="default" padding="large">
        <div class="section-header">
          <h2>Charity Information</h2>
          <p>
            Optional - Add charity details if this is a fundraising tournament
          </p>
        </div>

        <div class="form-grid">
          <div class="form-group span-2">
            <label for="charity_name">Charity Name</label>
            <Input
              id="charity_name"
              type="text"
              bind:value={tournamentData.charity_name}
              placeholder="Local Children's Hospital Foundation"
              disabled={isLoading}
            />
          </div>

          <div class="form-group span-2">
            <label for="charity_description">Charity Description</label>
            <textarea
              id="charity_description"
              bind:value={tournamentData.charity_description}
              placeholder="Describe the charity and how the tournament supports their mission..."
              rows="3"
              disabled={isLoading}
            ></textarea>
          </div>
        </div>
      </Card>
    </div>

    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}

    <div class="form-actions">
      <Button variant="outline" onclick={handleCancel} disabled={isLoading}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" disabled={isLoading}>
        {#if isLoading}
          Creating Tournament...
        {:else}
          Create Tournament
        {/if}
      </Button>
    </div>
  </form>
</div>

<style>
  .create-tournament-page {
    padding: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .header-content h1 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-green);
    font-size: 2rem;
  }

  .header-content p {
    margin: 0;
    color: var(--text-muted);
  }

  .tournament-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-light);
  }

  .section-header h2 {
    margin: 0 0 0.5rem 0;
    color: var(--primary-green);
    font-size: 1.25rem;
  }

  .section-header p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group.span-2 {
    grid-column: span 2;
  }

  .form-group label {
    font-weight: 600;
    color: var(--text-dark);
    font-size: 0.9rem;
  }

  .form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: var(--border-radius);
    font-family: inherit;
    font-size: 0.9rem;
    resize: vertical;
    min-height: 80px;
  }

  .form-group textarea:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 3px rgba(25, 128, 56, 0.1);
  }

  .form-hint {
    color: var(--text-muted);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .form-hint strong {
    color: var(--primary-green);
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .create-tournament-page {
      padding: 1rem;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-group.span-2 {
      grid-column: span 1;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .form-actions button {
      width: 100%;
    }
  }
</style>
