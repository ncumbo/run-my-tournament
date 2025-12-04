
<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Button, Input, Form } from '$lib/components';
  import { 
    registrationWorkflowActions, 
    registrationValidation,
    type RegistrationData,
    type RegistrationType,
    type PlayerInfo,
    type RegistrationPreferences 
  } from '$lib/services/registrationWorkflow';

  // Form state
  let currentStep = 1;
  let totalSteps = 4;
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';
  let acceptTerms = false;

  // Registration data
  let registrationType: RegistrationType = 'individual';
  let primaryPlayer: PlayerInfo = {
    name: '',
    email: '',
    phone: '',
    company: '',
    handicap: undefined,
    dietaryRestrictions: '',
    emergencyContact: {
      name: '',
      phone: ''
    }
  };

  let additionalPlayers: PlayerInfo[] = [
    { name: '', email: '', phone: '', company: '', handicap: undefined },
    { name: '', email: '', phone: '', company: '', handicap: undefined },
    { name: '', email: '', phone: '', company: '', handicap: undefined }
  ];

  let preferences: RegistrationPreferences = {
    wantsCart: false,
    wantsCaddie: false,
    shirtSize: 'L',
    specialRequests: '',
    teamName: '',
    preferredTeeTime: 'any'
  };

  let paymentMethod: 'stripe' | 'paypal' | 'bank_transfer' = 'stripe';
  let registrationId: string = '';

  // Computed values
  $: pricing = calculatePricing(registrationType);
  $: isFormValid = validateCurrentStep();
  $: showAdditionalPlayers = registrationType === 'foursome';

  function calculatePricing(type: RegistrationType) {
    let baseAmount: number;
    switch (type) {
      case 'individual':
        baseAmount = 150;
        break;
      case 'foursome':
        baseAmount = 550;
        break;
      case 'corporate_sponsor':
        baseAmount = 1000;
        break;
      default:
        baseAmount = 150;
    }

    const fees = Math.round((baseAmount * 0.029) + 0.30); // 2.9% + $0.30
    const total = baseAmount + fees;

    return { baseAmount, fees, total };
  }

  function validateCurrentStep(): boolean {
    switch (currentStep) {
      case 1:
        return ['individual', 'foursome', 'corporate_sponsor'].includes(registrationType);
      case 2:
        return validatePlayerInfo();
      case 3:
        return validatePreferences();
      case 4:
        return true;
      default:
        return false;
    }
  }

  function validatePlayerInfo(): boolean {
    if (!primaryPlayer.name.trim() || 
        !primaryPlayer.email.trim() || 
        !primaryPlayer.phone.trim()) {
      return false;
    }

    if (!registrationValidation.validateEmail(primaryPlayer.email)) {
      return false;
    }

    if (!primaryPlayer.emergencyContact?.name?.trim() || 
        !primaryPlayer.emergencyContact?.phone?.trim()) {
      return false;
    }

    if (registrationType === 'foursome') {
      return additionalPlayers.every(player => 
        player.name.trim() && 
        player.email.trim() && 
        registrationValidation.validateEmail(player.email)
      );
    }

    return true;
  }

  function validatePreferences(): boolean {
    if (preferences.teamName && !registrationValidation.validateTeamName(preferences.teamName)) {
      return false;
    }
    return true;
  }

  async function nextStep() {
    if (!isFormValid) {
      errorMessage = 'Please complete all required fields correctly';
      return;
    }

    errorMessage = '';
    
    if (currentStep < totalSteps) {
      currentStep++;
    } else {
      await submitRegistration();
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
    }
    errorMessage = '';
  }

  async function submitRegistration() {
    if (isSubmitting) return;
    
    isSubmitting = true;
    errorMessage = '';

    try {
      const registrationData = {
        type: registrationType,
        primaryPlayer,
        additionalPlayers: registrationType === 'foursome' ? additionalPlayers : undefined,
        paymentInfo: {
          amount: pricing.baseAmount * 100,
          fees: pricing.fees * 100,
          total: pricing.total * 100,
          status: 'pending' as const
        },
        preferences,
        meta {
          source: 'website' as const,
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined
        }
      };

      const result = await registrationWorkflowActions.createRegistration(registrationData);

      if (result.success && result.registrationId) {
        registrationId = result.registrationId;
        successMessage = 'Registration submitted successfully!';
        currentStep = 5;
      } else {
        errorMessage = result.error || 'Registration failed';
      }
    } catch (error) {
      console.error('Registration submission failed:', error);
      errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }

  function resetForm() {
    currentStep = 1;
    registrationType = 'individual';
    primaryPlayer = {
      name: '', email: '', phone: '', company: '', handicap: undefined,
      dietaryRestrictions: '', emergencyContact: { name: '', phone: '' }
    };
    additionalPlayers = Array(3).fill(null).map(() => ({
      name: '', email: '', phone: '', company: '', handicap: undefined
    }));
    preferences = {
      wantsCart: false, wantsCaddie: false, shirtSize: 'L',
      specialRequests: '', teamName: '', preferredTeeTime: 'any'
    };
    errorMessage = '';
    successMessage = '';
    registrationId = '';
    acceptTerms = false;
  }
</script>

<div class="registration-form">
  <!-- Progress Indicator -->
  <div class="progress-indicator">
    <div class="progress-bar">
      <div class="progress-fill" style="width: {(currentStep / totalSteps) * 100}%"></div>
    </div>
    <div class="step-labels">
      <span class="step-label" class:active={currentStep >= 1}>Type</span>
      <span class="step-label" class:active={currentStep >= 2}>Players</span>
      <span class="step-label" class:active={currentStep >= 3}>Preferences</span>
      <span class="step-label" class:active={currentStep >= 4}>Payment</span>
    </div>
  </div>

  {#if errorMessage}
    <div class="error-message">
      ⚠️ {errorMessage}
      <button class="close-btn" on:click={() => errorMessage = ''}>×</button>
    </div>
  {/if}

  {#if successMessage}
    <div class="success-message">
      ✅ {successMessage}
    </div>
  {/if}

  <Card variant="default" padding="large">
    {#if currentStep === 1}
      <!-- Registration Type -->
      <div class="step-content">
        <h2>Choose Registration Type</h2>
        <p class="step-description">Select your registration option</p>

        <div class="registration-types">
          <label class="type-option">
            <input type="radio" bind:group={registrationType} value="individual" />
            <div class="type-card" class:selected={registrationType === 'individual'}>
              <div class="type-icon">🏌️</div>
              <div class="type-content">
                <h3>Individual Player</h3>
                <p>Register as an individual - we'll pair you with others</p>
                <div class="type-price">${pricing.baseAmount}</div>
              </div>
            </div>
          </label>

          <label class="type-option">
            <input type="radio" bind:group={registrationType} value="foursome" />
            <div class="type-card" class:selected={registrationType === 'foursome'}>
              <div class="type-icon">👥</div>
              <div class="type-content">
                <h3>Foursome Group</h3>
                <p>Register a complete foursome of 4 players</p>
                <div class="type-price">${registrationType === 'foursome' ? 550 : pricing.baseAmount}</div>
              </div>
            </div>
          </label>

          <label class="type-option">
            <input type="radio" bind:group={registrationType} value="corporate_sponsor" />
            <div class="type-card" class:selected={registrationType === 'corporate_sponsor'}>
              <div class="type-icon">🏢</div>
              <div class="type-content">
                <h3>Corporate Sponsor</h3>
                <p>Premium sponsorship package with benefits</p>
                <div class="type-price">${registrationType === 'corporate_sponsor' ? 1000 : pricing.baseAmount}</div>
              </div>
            </div>
          </label>
        </div>
      </div>

    {:else if currentStep === 2}
      <!-- Player Information -->
      <div class="step-content">
        <h2>Player Information</h2>
        <p class="step-description">Enter player details</p>

        <div class="player-section">
          <h3>Primary Player</h3>
          <div class="form-grid">
            <Input label="Full Name *" bind:value={primaryPlayer.name} required />
            <Input label="Email *" type="email" bind:value={primaryPlayer.email} required />
            <Input label="Phone *" bind:value={primaryPlayer.phone} required />
            <Input label="Company" bind:value={primaryPlayer.company} />
            <Input label="Handicap" type="number" bind:value={primaryPlayer.handicap} min="0" max="54" />
            <Input label="Dietary Restrictions" bind:value={primaryPlayer.dietaryRestrictions} />
          </div>

          <h4>Emergency Contact *</h4>
          <div class="form-grid">
            <Input label="Name *" bind:value={primaryPlayer.emergencyContact.name} required />
            <Input label="Phone *" bind:value={primaryPlayer.emergencyContact.phone} required />
          </div>
        </div>

        {#if showAdditionalPlayers}
          <div class="player-section">
            <h3>Additional Players (3 required)</h3>
            {#each additionalPlayers as player, index}
              <div class="additional-player">
                <h4>Player {index + 2}</h4>
                <div class="form-grid">
                  <Input label="Name *" bind:value={player.name} required />
                  <Input label="Email *" type="email" bind:value={player.email} required />
                  <Input label="Phone" bind:value={player.phone} />
                  <Input label="Company" bind:value={player.company} />
                  <Input label="Handicap" type="number" bind:value={player.handicap} min="0" max="54" />
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    {:else if currentStep === 3}
      <!-- Preferences -->
      <div class="step-content">
        <h2>Tournament Preferences</h2>
        <p class="step-description">Customize your experience</p>

        <div class="preferences-grid">
          <div class="preference-group">
            <h4>Services</h4>
            <label class="checkbox-option">
              <input type="checkbox" bind:checked={preferences.wantsCart} />
              <span>Golf Cart (+$25)</span>
            </label>
            <label class="checkbox-option">
              <input type="checkbox" bind:checked={preferences.wantsCaddie} />
              <span>Caddie (+$50)</span>
            </label>
          </div>

          <div class="preference-group">
            <h4>Apparel</h4>
            <label>Shirt Size:</label>
            <select bind:value={preferences.shirtSize}>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
              <option value="XL">Extra Large</option>
              <option value="XXL">2X Large</option>
            </select>
          </div>

          <div class="preference-group">
            <h4>Tournament</h4>
            {#if registrationType === 'foursome'}
              <Input label="Team Name" bind:value={preferences.teamName} />
            {/if}
            <label>Tee Time Preference:</label>
            <select bind:value={preferences.preferredTeeTime}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="any">No Preference</option>
            </select>
            <Input label="Special Requests" bind:value={preferences.specialRequests} />
          </div>
        </div>
      </div>

    {:else if currentStep === 4}
      <!-- Payment -->
      <div class="step-content">
        <h2>Payment</h2>
        <p class="step-description">Complete your registration</p>

        <div class="registration-summary">
          <h4>Summary</h4>
          <div class="summary-item">
            <span>Type: {registrationType}</span>
            <span>Player: {primaryPlayer.name}</span>
          </div>
          <div class="summary-total">
            <span>Total: ${pricing.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="terms-section">
          <label class="checkbox-option">
            <input type="checkbox" bind:checked={acceptTerms} required />
            <span>I agree to the terms and conditions</span>
          </label>
        </div>
      </div>

    {:else if currentStep === 5}
      <!-- Success -->
      <div class="step-content success-step">
        <div class="success-icon">✅</div>
        <h2>Registration Complete!</h2>
        <p>Registration ID: {registrationId}</p>
        <div class="success-actions">
          <Button variant="outline" onclick={resetForm}>Register Another</Button>
          <Button variant="primary" href="/">Return Home</Button>
        </div>
      </div>
    {/if}
  </Card>

  <!-- Navigation -->
  {#if currentStep < 5}
    <div class="form-navigation">
      {#if currentStep > 1}
        <Button variant="outline" onclick={prevStep} disabled={isSubmitting}>Previous</Button>