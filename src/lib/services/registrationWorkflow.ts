import { writable, derived } from "svelte/store";
import { paymentService, type PaymentStatus } from "./payment";

// Registration workflow types
export type RegistrationStatus =
  | "draft"
  | "submitted"
  | "payment_pending"
  | "payment_processing"
  | "confirmed"
  | "waitlisted"
  | "cancelled";

export type RegistrationType = "individual" | "foursome" | "corporate_sponsor";

export interface RegistrationData {
  id?: string;
  type: RegistrationType;
  status: RegistrationStatus;
  primaryPlayer: PlayerInfo;
  additionalPlayers?: PlayerInfo[];
  paymentInfo: PaymentInfo;
  preferences: RegistrationPreferences;
  metadata: RegistrationMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerInfo {
  name: string;
  email: string;
  phone: string;
  company?: string;
  handicap?: number;
  dietaryRestrictions?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

export interface PaymentInfo {
  method?: "stripe" | "paypal" | "bank_transfer" | "check";
  amount: number;
  fees: number;
  total: number;
  paymentIntentId?: string;
  status: PaymentStatus;
  paidAt?: string;
}

export interface RegistrationPreferences {
  wantsCart: boolean;
  wantsCaddie: boolean;
  shirtSize?: "S" | "M" | "L" | "XL" | "XXL";
  specialRequests?: string;
  teamName?: string;
  preferredTeeTime?: "morning" | "afternoon" | "any";
}

export interface RegistrationMetadata {
  source: "website" | "admin" | "import";
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  adminUserId?: number;
}

// Registration workflow configuration
export interface WorkflowConfig {
  maxIndividualRegistrations: number;
  maxFoursomeRegistrations: number;
  maxTotalPlayers: number;
  registrationDeadline: string;
  autoConfirmPayments: boolean;
  enableWaitlist: boolean;
  requireEmergencyContact: boolean;
  allowTeamNameChanges: boolean;
}

// Default configuration
export const defaultWorkflowConfig: WorkflowConfig = {
  maxIndividualRegistrations: 50,
  maxFoursomeRegistrations: 25,
  maxTotalPlayers: 144, // 36 foursomes
  registrationDeadline: "2026-05-15T23:59:59Z",
  autoConfirmPayments: true,
  enableWaitlist: true,
  requireEmergencyContact: true,
  allowTeamNameChanges: false,
};

// Registration workflow store
export const registrationWorkflow = writable<{
  registrations: RegistrationData[];
  config: WorkflowConfig;
  stats: {
    totalRegistrations: number;
    confirmedRegistrations: number;
    pendingPayments: number;
    waitlistedRegistrations: number;
    totalRevenue: number;
    availableSpots: number;
  };
}>({
  registrations: [],
  config: defaultWorkflowConfig,
  stats: {
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    pendingPayments: 0,
    waitlistedRegistrations: 0,
    totalRevenue: 0,
    availableSpots: 144,
  },
});

// Derived stores for specific data views
export const confirmedRegistrations = derived(
  registrationWorkflow,
  ($workflow) =>
    $workflow.registrations.filter((reg) => reg.status === "confirmed")
);

export const pendingRegistrations = derived(registrationWorkflow, ($workflow) =>
  $workflow.registrations.filter(
    (reg) =>
      reg.status === "payment_pending" || reg.status === "payment_processing"
  )
);

export const waitlistedRegistrations = derived(
  registrationWorkflow,
  ($workflow) =>
    $workflow.registrations.filter((reg) => reg.status === "waitlisted")
);

// Registration workflow actions
export const registrationWorkflowActions = {
  // Create new registration
  async createRegistration(
    data: Omit<RegistrationData, "id" | "createdAt" | "updatedAt" | "status">
  ): Promise<{ success: boolean; registrationId?: string; error?: string }> {
    try {
      const registrationId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Calculate pricing
      const pricing = calculatePricing(data.type);

      const registration: RegistrationData = {
        ...data,
        id: registrationId,
        status: "draft",
        paymentInfo: {
          ...data.paymentInfo,
          amount: pricing.baseAmount,
          fees: pricing.fees,
          total: pricing.total,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Validate registration
      const validation = await validateRegistration(registration);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(", ") };
      }

      // Add to store
      registrationWorkflow.update((workflow) => ({
        ...workflow,
        registrations: [...workflow.registrations, registration],
      }));

      // Auto-advance to payment if validation passes
      await advanceRegistrationStatus(registrationId, "submitted");

      return { success: true, registrationId };
    } catch (error) {
      console.error("Registration creation failed:", error);
      return { success: false, error: "Failed to create registration" };
    }
  },

  // Update registration status
  async advanceRegistrationStatus(
    registrationId: string,
    newStatus: RegistrationStatus
  ): Promise<boolean> {
    return advanceRegistrationStatus(registrationId, newStatus);
  },

  // Process payment
  async processPayment(
    registrationId: string,
    paymentMethod: "stripe" | "paypal" | "bank_transfer"
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const workflow = get(registrationWorkflow);
      const registration = workflow.registrations.find(
        (r) => r.id === registrationId
      );

      if (!registration) {
        return { success: false, error: "Registration not found" };
      }

      if (registration.status !== "payment_pending") {
        return { success: false, error: "Registration not ready for payment" };
      }

      // Update status to processing
      await advanceRegistrationStatus(registrationId, "payment_processing");

      // Process payment based on method
      let paymentResult;
      switch (paymentMethod) {
        case "stripe":
          paymentResult = await paymentService.createPaymentIntent(
            registration.paymentInfo.total,
            registration.primaryPlayer.email,
            { registrationId }
          );
          break;
        case "paypal":
          paymentResult = await paymentService.createPayPalOrder(
            registration.paymentInfo.total,
            registration.primaryPlayer.email,
            { registrationId }
          );
          break;
        case "bank_transfer":
          paymentResult = await paymentService.processBankTransfer(
            registration.paymentInfo.total,
            registration.primaryPlayer.email,
            { registrationId }
          );
          break;
      }

      if (paymentResult.success) {
        // Update payment info
        registrationWorkflow.update((workflow) => ({
          ...workflow,
          registrations: workflow.registrations.map((r) =>
            r.id === registrationId
              ? {
                  ...r,
                  paymentInfo: {
                    ...r.paymentInfo,
                    method: paymentMethod,
                    paymentIntentId: paymentResult.payment_intent_id,
                    status: "completed",
                  },
                }
              : r
          ),
        }));

        // Auto-confirm if configured
        if (workflow.config.autoConfirmPayments) {
          await advanceRegistrationStatus(registrationId, "confirmed");
        }

        return { success: true };
      } else {
        // Payment failed, revert status
        await advanceRegistrationStatus(registrationId, "payment_pending");
        return { success: false, error: paymentResult.error };
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      return { success: false, error: "Payment processing failed" };
    }
  },

  // Cancel registration
  async cancelRegistration(
    registrationId: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const workflow = get(registrationWorkflow);
      const registration = workflow.registrations.find(
        (r) => r.id === registrationId
      );

      if (!registration) return false;

      // Process refund if payment was made
      if (
        registration.paymentInfo.status === "completed" &&
        registration.paymentInfo.paymentIntentId
      ) {
        await paymentService.processRefund({
          payment_intent_id: registration.paymentInfo.paymentIntentId,
          reason: reason || "Registration cancelled",
        });
      }

      // Update status
      await advanceRegistrationStatus(registrationId, "cancelled");

      // Process waitlist if spot opened up
      await processWaitlist();

      return true;
    } catch (error) {
      console.error("Registration cancellation failed:", error);
      return false;
    }
  },

  // Get registration statistics
  getRegistrationStats(): any {
    const workflow = get(registrationWorkflow);
    return calculateStats(workflow.registrations, workflow.config);
  },

  // Update workflow configuration
  updateConfig(newConfig: Partial<WorkflowConfig>): void {
    registrationWorkflow.update((workflow) => ({
      ...workflow,
      config: { ...workflow.config, ...newConfig },
    }));
  },
};

// Helper functions
function calculatePricing(type: RegistrationType): {
  baseAmount: number;
  fees: number;
  total: number;
} {
  let baseAmount: number;

  switch (type) {
    case "individual":
      baseAmount = 15000; // $150.00 in cents
      break;
    case "foursome":
      baseAmount = 55000; // $550.00 in cents
      break;
    case "corporate_sponsor":
      baseAmount = 100000; // $1000.00 in cents
      break;
    default:
      baseAmount = 15000;
  }

  const feeCalculation = paymentService.calculateFees(baseAmount);
  return {
    baseAmount,
    fees: feeCalculation.processingFee,
    total: feeCalculation.total,
  };
}

async function validateRegistration(
  registration: RegistrationData
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];
  const workflow = get(registrationWorkflow);

  // Check registration deadline
  if (new Date() > new Date(workflow.config.registrationDeadline)) {
    errors.push("Registration deadline has passed");
  }

  // Validate required player information
  if (!registration.primaryPlayer.name.trim()) {
    errors.push("Primary player name is required");
  }

  if (!registration.primaryPlayer.email.trim()) {
    errors.push("Primary player email is required");
  }

  if (!registration.primaryPlayer.phone.trim()) {
    errors.push("Primary player phone is required");
  }

  // Validate emergency contact if required
  if (
    workflow.config.requireEmergencyContact &&
    !registration.primaryPlayer.emergencyContact
  ) {
    errors.push("Emergency contact information is required");
  }

  // Validate foursome players
  if (registration.type === "foursome") {
    if (
      !registration.additionalPlayers ||
      registration.additionalPlayers.length !== 3
    ) {
      errors.push("Foursome registrations must include 3 additional players");
    } else {
      registration.additionalPlayers.forEach((player, index) => {
        if (!player.name.trim()) {
          errors.push(`Player ${index + 2} name is required`);
        }
        if (!player.email.trim()) {
          errors.push(`Player ${index + 2} email is required`);
        }
      });
    }
  }

  // Check availability
  const stats = calculateStats(workflow.registrations, workflow.config);
  const wouldExceedCapacity = checkCapacityLimits(
    registration,
    stats,
    workflow.config
  );

  if (wouldExceedCapacity && !workflow.config.enableWaitlist) {
    errors.push("Tournament is at capacity and waitlist is disabled");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function checkCapacityLimits(
  registration: RegistrationData,
  stats: any,
  config: WorkflowConfig
): boolean {
  const playersNeeded = registration.type === "foursome" ? 4 : 1;
  return stats.confirmedPlayers + playersNeeded > config.maxTotalPlayers;
}

async function advanceRegistrationStatus(
  registrationId: string,
  newStatus: RegistrationStatus
): Promise<boolean> {
  try {
    registrationWorkflow.update((workflow) => {
      const updatedRegistrations = workflow.registrations.map((r) =>
        r.id === registrationId
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r
      );

      return {
        ...workflow,
        registrations: updatedRegistrations,
        stats: calculateStats(updatedRegistrations, workflow.config),
      };
    });

    // Trigger side effects based on status change
    await handleStatusChange(registrationId, newStatus);

    return true;
  } catch (error) {
    console.error("Status advancement failed:", error);
    return false;
  }
}

async function handleStatusChange(
  registrationId: string,
  newStatus: RegistrationStatus
): Promise<void> {
  const workflow = get(registrationWorkflow);
  const registration = workflow.registrations.find(
    (r) => r.id === registrationId
  );

  if (!registration) return;

  switch (newStatus) {
    case "submitted":
      // Auto-advance to payment pending
      setTimeout(
        () => advanceRegistrationStatus(registrationId, "payment_pending"),
        100
      );
      break;

    case "confirmed":
      // Check if we need to process waitlist
      await processWaitlist();
      // TODO: Send confirmation email
      break;

    case "waitlisted":
      // TODO: Send waitlist notification email
      break;

    case "cancelled":
      // Process waitlist to fill the spot
      await processWaitlist();
      break;
  }
}

async function processWaitlist(): Promise<void> {
  const workflow = get(registrationWorkflow);
  const waitlisted = workflow.registrations.filter(
    (r) => r.status === "waitlisted"
  );

  if (waitlisted.length === 0) return;

  const stats = calculateStats(workflow.registrations, workflow.config);

  // Check if we have available spots
  for (const registration of waitlisted) {
    const playersNeeded = registration.type === "foursome" ? 4 : 1;

    if (stats.availableSpots >= playersNeeded) {
      // Move from waitlist to payment pending
      await advanceRegistrationStatus(registration.id!, "payment_pending");
      stats.availableSpots -= playersNeeded;
      // TODO: Send notification email about spot availability
    } else {
      break; // No more spots available
    }
  }
}

function calculateStats(
  registrations: RegistrationData[],
  config: WorkflowConfig
): any {
  const stats = {
    totalRegistrations: registrations.length,
    confirmedRegistrations: 0,
    pendingPayments: 0,
    waitlistedRegistrations: 0,
    totalRevenue: 0,
    confirmedPlayers: 0,
    availableSpots: config.maxTotalPlayers,
  };

  registrations.forEach((registration) => {
    const playerCount = registration.type === "foursome" ? 4 : 1;

    switch (registration.status) {
      case "confirmed":
        stats.confirmedRegistrations++;
        stats.confirmedPlayers += playerCount;
        stats.totalRevenue += registration.paymentInfo.amount;
        break;
      case "payment_pending":
      case "payment_processing":
        stats.pendingPayments++;
        break;
      case "waitlisted":
        stats.waitlistedRegistrations++;
        break;
    }
  });

  stats.availableSpots = Math.max(
    0,
    config.maxTotalPlayers - stats.confirmedPlayers
  );

  return stats;
}

// Import get function from svelte/store
import { get } from "svelte/store";

// Team formation utilities
export const teamFormationUtils = {
  // Auto-form teams from individual registrations
  autoFormTeams(individualRegistrations: RegistrationData[]): Array<{
    teamId: string;
    teamName: string;
    players: PlayerInfo[];
    averageHandicap: number;
  }> {
    const availablePlayers = individualRegistrations
      .filter((reg) => reg.status === "confirmed" && reg.type === "individual")
      .map((reg) => reg.primaryPlayer)
      .filter((player) => player.handicap !== undefined);

    const teams = [];
    const playersPerTeam = 4;

    // Sort by handicap for balanced team formation
    availablePlayers.sort((a, b) => (a.handicap || 0) - (b.handicap || 0));

    for (let i = 0; i < availablePlayers.length; i += playersPerTeam) {
      const teamPlayers = availablePlayers.slice(i, i + playersPerTeam);

      if (teamPlayers.length === playersPerTeam) {
        const averageHandicap =
          teamPlayers.reduce((sum, p) => sum + (p.handicap || 0), 0) /
          playersPerTeam;

        teams.push({
          teamId: `team_${teams.length + 1}`,
          teamName: `Team ${teams.length + 1}`,
          players: teamPlayers,
          averageHandicap: Math.round(averageHandicap * 10) / 10,
        });
      }
    }

    return teams;
  },

  // Generate balanced pairings for tournament
  generatePairings(confirmedRegistrations: RegistrationData[]): Array<{
    pairingId: string;
    teeTime: string;
    players: PlayerInfo[];
    averageHandicap: number;
  }> {
    const allPlayers: PlayerInfo[] = [];

    // Collect all players from registrations
    confirmedRegistrations.forEach((registration) => {
      if (registration.status === "confirmed") {
        allPlayers.push(registration.primaryPlayer);
        if (registration.additionalPlayers) {
          allPlayers.push(...registration.additionalPlayers);
        }
      }
    });

    // Sort by handicap for balanced pairings
    const playersWithHandicap = allPlayers.filter(
      (p) => p.handicap !== undefined
    );
    playersWithHandicap.sort((a, b) => (a.handicap || 0) - (b.handicap || 0));

    const pairings = [];
    const startTime = new Date("2026-06-12T08:00:00Z");
    const intervalMinutes = 10;

    for (let i = 0; i < playersWithHandicap.length; i += 4) {
      const group = playersWithHandicap.slice(i, i + 4);

      if (group.length === 4) {
        const teeTime = new Date(
          startTime.getTime() + pairings.length * intervalMinutes * 60000
        );
        const averageHandicap =
          group.reduce((sum, p) => sum + (p.handicap || 0), 0) / 4;

        pairings.push({
          pairingId: `pairing_${pairings.length + 1}`,
          teeTime: teeTime.toISOString(),
          players: group,
          averageHandicap: Math.round(averageHandicap * 10) / 10,
        });
      }
    }

    return pairings;
  },
};

// Registration validation utilities
export const registrationValidation = {
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  validateHandicap(handicap: number): boolean {
    return handicap >= 0 && handicap <= 54;
  },

  validateTeamName(name: string): boolean {
    return name.length >= 3 && name.length <= 50 && !/[<>\"'&]/.test(name);
  },
};

// Export utility function
export { calculateStats };
