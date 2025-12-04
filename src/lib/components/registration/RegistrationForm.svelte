
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
  import { paymentService } from '$lib/services/payment';

  // Form state
  let currentStep = 1;
  let totalSteps = 4;
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';

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
        return validateRegistrationType();
      case 2:
        return validatePlayerInfo();
      case 3:
        return validatePreferences();
      case 4:
        return true; // Payment step
      default:
        return false;
    }
  }

  function validateRegistrationType(): boolean {
    return ['individual', 'foursome', 'corporate_sponsor'].includes(registrationType);
  }

  function validatePlayerInfo(): boolean {
    // Validate primary player
    if (!primaryPlayer.name.trim() || 
        !primaryPlayer.email.trim() || 
        !primaryPlayer.phone.trim()) {
      return false;
    }

    if (!registrationValidation.validateEmail(primaryPlayer.email)) {
      return false;
    }

    if (!registrationValidation.validatePhone(primaryPlayer.phone)) {
      return false;
    }

    if (primaryPlayer.handicap !== undefined && 
        !registrationValidation.validateHandicap(primaryPlayer.handicap)) {
      return false;
    }

    // Validate emergency contact
    if (!primaryPlayer.emergencyContact?.name?.trim() || 
        !primaryPlayer.emergencyContact?.phone?.trim()) {
      return false;
    }

    // Validate additional players for foursome
    if (registrationType === 'foursome') {
      return additionalPlayers.every(player => 
        player.name.trim() && 
        player.email.trim() && 
        registrationValidation.validateEmail(player.email) &&
        (player.handicap === undefined || registrationValidation.validateHandicap(player.handicap))
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
      // Create registration
      const registrationData = {
        type: registrationType,
        primaryPlayer,
        additionalPlayers: registrationType === 'foursome' ? additionalPlayers : undefined,
        paymentInfo: {
          amount: pricing.baseAmount * 100, // Convert to cents
          fees: pricing.fees * 100,
          total: pricing.total * 100,
          status: 'pending' as const
        },
        preferences,
        meta {
          source: 'website' as const,
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined
        }
      };

      const result = await registrationWorkflowActions.createRegistration(registrationData);

      if (result.success && result.registrationId) {
        registrationId = result.registrationId;
        
        // Process payment
        const paymentResult = await registrationWorkflowActions.processPayment(
          registrationId,
          paymentMethod
        );

        if (paymentResult.success) {
          successMessage = 'Registration submitted successfully! You will receive a confirmation email shortly.';
          currentStep = 5; // Success step
        } else {
          errorMessage = paymentResult.error || 'Payment processing failed';
        }
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

  async function getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  function resetForm() {
    currentStep = 1;
    registrationType = 'individual';
    primaryPlayer = {
      name: '',
      email: '',
      phone: '',
      company: '',
      handicap: undefined,
      dietaryRestrictions: '',
      emergencyContact: { name: '', phone: '' }
    };
    additionalPlayers = Array(3).fill(null).map(() => ({
      name: '',
      email: '',
      phone: '',
      company: '',
      handicap: undefined
    }));
    preferences = {
      wantsCart: false,
      wantsCaddie: false,
      shirtSize: 'L',
      specialRequests: '',
      teamName: '',
      preferredTeeTime: 'any'
    };
    errorMessage = '';
    successMessage = '';
    registrationId = '';
  }

  onMount(() => {
    // Initialize any required data
    console.log('Registration form initialized');
  });
</script>

<div class="registration-form">
  <!-- Progress Indicator -->
  <div class="progress-indicator">
    <div class="progress-bar">
      <div class="progress-fill" style="width: {(currentStep / totalSteps) * 100}%"></div>
    </div>
    <div class="step-labels">
      <span class="step-label" class:active={currentStep >= 1}>Registration Type</span>
      <span class="step-label" class:active={currentStep >= 2}>Player Information</span>
      <span class="step-label" class:active={currentStep >= 3}>Preferences</span>
      <span class="step-label" class:active={currentStep >= 4}>Payment</span>
    </div>
  </div>

  {#if errorMessage}
    <div class="error-message">
      <span class="error-icon">⚠️</span>
      {errorMessage}
      <button class="close-btn" on:click={() => errorMessage = ''}>×</button>
    </div>
  {/if}

  {#if successMessage}
    <div class="success-message">
      <span class="success-icon">✅</span>
      {successMessage}
    </div>
  {/if}

  <!-- Step Content -->
  <Card variant="default" padding="large">
    {#if currentStep === 1}
      <!-- Registration Type Selection -->
      <div class="step-content">
        <h2>Choose Your Registration Type</h2>
        <p class="step-description">Select the registration option that best fits your needs</p>

        <div class="registration-types">
          <label class="type-option">
            <input
              type="radio"
              bind:group={registrationType}
              value="individual"
            />
            <div class="type-card" class:selected={registrationType === 'individual'}>
              <div class="type-icon">🏌️</div>
              <div class="type-content">
                <h3>Individual Player</h3>
                <p>Register as an individual player. You'll be paired with other players.</p>
                <div class="type-price">${pricing.baseAmount}</div>
              </div>
            </div>
          </label>

          <label class="type-option">
            <input
              type="radio"
              bind:group={registrationType}
              value="foursome"
            />
            <div class="type-card" class:selected={registrationType === 'foursome'}>
              <div class="type-icon">👥</div>
              <div class="type-content">
                <h3>Foursome Group</h3>
                <p>Register a complete foursome. Includes all 4 players.</p>
                <div class="type-price">${registrationType === 'foursome' ? 550 : pricing.baseAmount}</div>
              </div>
            </div>
          </label>

          <label class="type-option">
            <input
              type="radio"
              bind:group={registrationType}
              value="corporate_sponsor"
            />
            <div class="type-card" class:selected={registrationType === 'corporate_sponsor'}>
              <div class="type-icon">🏢</div>
              <div class="type-content">
                <h3>Corporate Sponsor</h3>
                <p>Corporate sponsorship package with premium benefits.</p>
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
        <p class="step-description">Please provide information for all players</p>

        <!-- Primary Player -->
        <div class="player-section">
          <h3>Primary Player</h3>
          <div class="form-grid">
            <Input
              label="Full Name *"
              bind:value={primaryPlayer.name}
              placeholder="Enter full name"
              required
            />
            <Input
              label="Email Address *"
              type="email"
              bind:value={primaryPlayer.email}
              placeholder="player@example.com"
              required
            />
            <Input
              label="Phone Number *"
              type="tel"
              bind:value={primaryPlayer.phone}
              placeholder="+1 (555) 123-4567"
              required
            />
            <Input
              label="Company/Organization"
              bind:value={primaryPlayer.company}
              placeholder="Optional"
            />
            <Input
              label="Golf Handicap"
              type="number"
              bind:value={primaryPlayer.handicap}
              placeholder="0-54"
              min="0"
              max="54"
            />
            <Input
              label="Dietary Restrictions"
              bind:value={primaryPlayer.dietaryRestrictions}
              placeholder="Optional"
            />
          </div>

          <h4>Emergency Contact *</h4>
          <div class="form-grid">
            <Input
              label="Emergency Contact Name *"
              bind:value={primaryPlayer.emergencyContact.name}
              placeholder="Full name"
              required
            />
            <Input
              label="Emergency Contact Phone *"
              type="tel"
              bind:value={primaryPlayer.emergencyContact.phone}
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>

        {#if showAdditionalPlayers}
          <!-- Additional Players for Foursome -->
          <div class="player-section">
            <h3>Additional Players (3 required)</h3>
            {#each additionalPlayers as player, index}
              <div class="additional-player">
                <h4>Player {index + 2}</h4>
                <div class="form-grid">
                  <Input
                    label="Full Name *"
                    bind:value={player.name}
                    placeholder="Enter full name"
                    required={showAdditionalPlayers}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    bind:value={player.email}
                    placeholder="player@example.com"
                    required={showAdditionalPlayers}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    bind:value={player.phone}
                    placeholder="+1 (555) 123-4567"
                  />
                  <Input
                    label="Company/Organization"
                    bind:value={player.company}
                    placeholder="Optional"
                  />
                  <Input
                    label="Golf Handicap"
                    type="number"
                    bind:value={player.handicap}
                    placeholder="0-54"
                    min="0"
                    max="54"
                  />
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
        <p class="step-description">Customize your tournament experience</p>

        <div class="preferences-grid">
          <div class="preference-group">
            <h4>Equipment & Services</h4>
            <label class="checkbox-option">
              <input type="checkbox" bind:checked={preferences.wantsCart} />
              <span>Golf Cart