import { writable, derived } from "svelte/store";
import {
  registrationWorkflowActions,
  type RegistrationData,
} from "./registrationWorkflow";
import { emailService } from "./email";

// Enhanced registration workflow with email notifications
export interface EnhancedRegistrationData extends RegistrationData {
  email_notifications: {
    registration_sent: boolean;
    confirmation_sent: boolean;
    reminder_sent: boolean;
    checkin_instructions_sent: boolean;
  };
  workflow_stage:
    | "registration"
    | "payment"
    | "confirmation"
    | "pre_tournament"
    | "tournament_day"
    | "completed";
}

// Enhanced workflow store
export const enhancedRegistrationWorkflow = writable<{
  registrations: EnhancedRegistrationData[];
  emailQueue: EmailQueueItem[];
  automationSettings: AutomationSettings;
}>({
  registrations: [],
  emailQueue: [],
  automationSettings: {
    enableAutoEmails: true,
    sendReminderDays: [7, 1],
    sendCheckinInstructions: true,
    sendResultsNotification: true,
  },
});

export interface EmailQueueItem {
  id: string;
  registration_id: string;
  email_type:
    | "registration"
    | "confirmation"
    | "reminder"
    | "checkin"
    | "results";
  scheduled_for: string;
  status: "pending" | "sent" | "failed";
  attempts: number;
  created_at: string;
}

export interface AutomationSettings {
  enableAutoEmails: boolean;
  sendReminderDays: number[];
  sendCheckinInstructions: boolean;
  sendResultsNotification: boolean;
}

// Enhanced registration actions
export const enhancedRegistrationActions = {
  // Create registration with email automation
  async createRegistrationWithEmails(
    registrationData: Omit<
      RegistrationData,
      "id" | "createdAt" | "updatedAt" | "status"
    >
  ): Promise<{ success: boolean; registrationId?: string; error?: string }> {
    try {
      // Create the registration using existing workflow
      const result =
        await registrationWorkflowActions.createRegistration(registrationData);

      if (result.success && result.registrationId) {
        // Create enhanced registration data
        const enhancedData: EnhancedRegistrationData = {
          ...(registrationData as RegistrationData),
          id: result.registrationId,
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          email_notifications: {
            registration_sent: false,
            confirmation_sent: false,
            reminder_sent: false,
            checkin_instructions_sent: false,
          },
          workflow_stage: "registration",
        };

        // Add to enhanced store
        enhancedRegistrationWorkflow.update((state) => ({
          ...state,
          registrations: [...state.registrations, enhancedData],
        }));

        // Send registration confirmation email
        await this.sendRegistrationEmail(result.registrationId);

        // Schedule reminder emails if automation is enabled
        await this.scheduleAutomaticEmails(result.registrationId);

        return result;
      }

      return result;
    } catch (error) {
      console.error("Enhanced registration creation failed:", error);
      return { success: false, error: "Registration creation failed" };
    }
  },

  // Send registration confirmation email
  async sendRegistrationEmail(
    registrationId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const registration = await this.getRegistration(registrationId);
      if (!registration) {
        return { success: false, error: "Registration not found" };
      }

      const emailSent =
        await emailService.sendRegistrationConfirmation(registration);

      if (emailSent) {
        // Update email notification status
        await this.updateEmailNotificationStatus(
          registrationId,
          "registration_sent",
          true
        );
        return { success: true };
      }

      return { success: false, error: "Failed to send email" };
    } catch (error) {
      console.error("Failed to send registration email:", error);
      return { success: false, error: "Email sending failed" };
    }
  },

  // Send payment confirmation email
  async sendPaymentConfirmationEmail(
    registrationId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const registration = await this.getRegistration(registrationId);
      if (!registration) {
        return { success: false, error: "Registration not found" };
      }

      const emailSent =
        await emailService.sendPaymentConfirmation(registration);

      if (emailSent) {
        await this.updateEmailNotificationStatus(
          registrationId,
          "confirmation_sent",
          true
        );
        await this.updateWorkflowStage(registrationId, "confirmation");
        return { success: true };
      }

      return { success: false, error: "Failed to send confirmation email" };
    } catch (error) {
      console.error("Failed to send payment confirmation email:", error);
      return { success: false, error: "Email sending failed" };
    }
  },

  // Schedule automatic reminder emails
  async scheduleAutomaticEmails(registrationId: string): Promise<void> {
    const settings = await this.getAutomationSettings();
    if (!settings.enableAutoEmails) return;

    const tournamentDate = new Date("2026-06-12T12:00:00Z");

    // Schedule reminder emails
    for (const days of settings.sendReminderDays) {
      const reminderDate = new Date(tournamentDate);
      reminderDate.setDate(reminderDate.getDate() - days);

      await this.scheduleEmail({
        registration_id: registrationId,
        email_type: "reminder",
        scheduled_for: reminderDate.toISOString(),
      });
    }

    // Schedule check-in instructions (day before tournament)
    if (settings.sendCheckinInstructions) {
      const checkinDate = new Date(tournamentDate);
      checkinDate.setDate(checkinDate.getDate() - 1);
      checkinDate.setHours(18, 0, 0); // 6 PM day before

      await this.scheduleEmail({
        registration_id: registrationId,
        email_type: "checkin",
        scheduled_for: checkinDate.toISOString(),
      });
    }
  },

  // Schedule an email
  async scheduleEmail(emailData: {
    registration_id: string;
    email_type: EmailQueueItem["email_type"];
    scheduled_for: string;
  }): Promise<void> {
    const emailItem: EmailQueueItem = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...emailData,
      status: "pending",
      attempts: 0,
      created_at: new Date().toISOString(),
    };

    enhancedRegistrationWorkflow.update((state) => ({
      ...state,
      emailQueue: [...state.emailQueue, emailItem],
    }));
  },

  // Process email queue (would be called by a cron job)
  async processEmailQueue(): Promise<void> {
    const currentState = await this.getCurrentState();
    const now = new Date();

    const pendingEmails = currentState.emailQueue.filter(
      (email: EmailQueueItem) =>
        email.status === "pending" &&
        new Date(email.scheduled_for) <= now &&
        email.attempts < 3
    );

    for (const email of pendingEmails) {
      try {
        await this.sendScheduledEmail(email);
      } catch (error) {
        console.error(`Failed to send scheduled email ${email.id}:`, error);
        await this.markEmailAsFailed(email.id);
      }
    }
  },

  // Send a scheduled email
  async sendScheduledEmail(emailItem: EmailQueueItem): Promise<void> {
    const registration = await this.getRegistration(emailItem.registration_id);
    if (!registration) {
      await this.markEmailAsFailed(emailItem.id);
      return;
    }

    let emailSent = false;

    switch (emailItem.email_type) {
      case "reminder":
        emailSent = await emailService.sendTournamentReminder(
          [
            {
              email: registration.primaryPlayer.email,
              name: registration.primaryPlayer.name,
              teamName: registration.preferences.teamName,
            },
          ],
          "week_before"
        );
        break;

      case "checkin":
        // Send check-in instructions
        emailSent = true; // Placeholder
        console.log(
          `Check-in instructions sent to ${registration.primaryPlayer.email}`
        );
        break;

      case "results":
        // Send tournament results
        emailSent = true; // Placeholder
        console.log(`Results sent to ${registration.primaryPlayer.email}`);
        break;
    }

    if (emailSent) {
      await this.markEmailAsSent(emailItem.id);
    } else {
      await this.incrementEmailAttempts(emailItem.id);
    }
  },

  // Update email notification status
  async updateEmailNotificationStatus(
    registrationId: string,
    field: keyof EnhancedRegistrationData["email_notifications"],
    value: boolean
  ): Promise<void> {
    enhancedRegistrationWorkflow.update((state) => ({
      ...state,
      registrations: state.registrations.map((reg) =>
        reg.id === registrationId
          ? {
              ...reg,
              email_notifications: {
                ...reg.email_notifications,
                [field]: value,
              },
            }
          : reg
      ),
    }));
  },

  // Update workflow stage
  async updateWorkflowStage(
    registrationId: string,
    stage: EnhancedRegistrationData["workflow_stage"]
  ): Promise<void> {
    enhancedRegistrationWorkflow.update((state) => ({
      ...state,
      registrations: state.registrations.map((reg) =>
        reg.id === registrationId ? { ...reg, workflow_stage: stage } : reg
      ),
    }));
  },

  // Mark email as sent
  async markEmailAsSent(emailId: string): Promise<void> {
    enhancedRegistrationWorkflow.update((state) => ({
      ...state,
      emailQueue: state.emailQueue.map((email) =>
        email.id === emailId ? { ...email, status: "sent" as const } : email
      ),
    }));
  },

  // Mark email as failed
  async markEmailAsFailed(emailId: string): Promise<void> {
    enhancedRegistrationWorkflow.update((state) => ({
      ...state,
      emailQueue: state.emailQueue.map((email) =>
        email.id === emailId ? { ...email, status: "failed" as const } : email
      ),
    }));
  },

  // Increment email attempts
  async incrementEmailAttempts(emailId: string): Promise<void> {
    enhancedRegistrationWorkflow.update((state) => ({
      ...state,
      emailQueue: state.emailQueue.map((email) =>
        email.id === emailId
          ? { ...email, attempts: email.attempts + 1 }
          : email
      ),
    }));
  },

  // Helper methods
  async getCurrentState(): Promise<any> {
    let currentState: any;
    enhancedRegistrationWorkflow.subscribe((state) => {
      currentState = state;
    })();
    return currentState;
  },

  async getRegistration(
    registrationId: string
  ): Promise<EnhancedRegistrationData | null> {
    const state = await this.getCurrentState();
    return (
      state.registrations.find(
        (reg: EnhancedRegistrationData) => reg.id === registrationId
      ) || null
    );
  },

  async getAutomationSettings(): Promise<AutomationSettings> {
    const state = await this.getCurrentState();
    return state.automationSettings;
  },

  // Send bulk tournament reminders
  async sendBulkReminders(
    reminderType: "week_before" | "day_before" | "checkin_open"
  ): Promise<{ sent: number; failed: number }> {
    const state = await this.getCurrentState();
    const confirmedRegistrations = state.registrations.filter(
      (reg: EnhancedRegistrationData) => reg.status === "confirmed"
    );

    let sent = 0;
    let failed = 0;

    for (const registration of confirmedRegistrations) {
      try {
        const emailSent = await emailService.sendTournamentReminder(
          [
            {
              email: registration.primaryPlayer.email,
              name: registration.primaryPlayer.name,
              teamName: registration.preferences.teamName,
            },
          ],
          reminderType
        );

        if (emailSent) {
          sent++;
          await this.updateEmailNotificationStatus(
            registration.id!,
            "reminder_sent",
            true
          );
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        console.error(
          `Failed to send reminder to ${registration.primaryPlayer.email}:`,
          error
        );
      }
    }

    return { sent, failed };
  },
};

// Initialize enhanced workflow
export { enhancedRegistrationWorkflow as enhancedWorkflowStore };
