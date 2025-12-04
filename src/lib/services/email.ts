import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { RegistrationData, PlayerInfo } from "./registrationWorkflow";

// Email configuration interface
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

// Email template types
export type EmailTemplate =
  | "registration_confirmation"
  | "registration_waitlisted"
  | "payment_confirmation"
  | "tournament_reminder"
  | "checkin_instructions"
  | "results_notification"
  | "volunteer_assignment";

// Email service class
export class EmailService {
  private transporter: Transporter | null = null;
  private config: EmailConfig | null = null;

  constructor(config?: EmailConfig) {
    if (config) {
      this.initialize(config);
    }
  }

  // Initialize email service with configuration
  initialize(config: EmailConfig): void {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  // Verify email connection
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Email service verification failed:", error);
      return false;
    }
  }

  // Send registration confirmation email
  async sendRegistrationConfirmation(
    registration: RegistrationData
  ): Promise<boolean> {
    if (!this.transporter || !this.config) {
      console.error("Email service not initialized");
      return false;
    }

    const emailContent =
      this.generateRegistrationConfirmationEmail(registration);

    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to: registration.primaryPlayer.email,
        subject: "Tournament Registration Confirmation - IBM Charity Golf",
        html: emailContent.html,
        text: emailContent.text,
      });

      // Send copies to additional players if foursome
      if (registration.type === "foursome" && registration.additionalPlayers) {
        for (const player of registration.additionalPlayers) {
          if (player.email) {
            await this.transporter.sendMail({
              from: this.config.from,
              to: player.email,
              subject:
                "Tournament Registration Confirmation - IBM Charity Golf",
              html: this.generatePlayerCopyEmail(registration, player).html,
              text: this.generatePlayerCopyEmail(registration, player).text,
            });
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Failed to send registration confirmation:", error);
      return false;
    }
  }

  // Send waitlist notification
  async sendWaitlistNotification(
    registration: RegistrationData
  ): Promise<boolean> {
    if (!this.transporter || !this.config) {
      return false;
    }

    const emailContent = this.generateWaitlistEmail(registration);

    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to: registration.primaryPlayer.email,
        subject: "Tournament Waitlist Confirmation - IBM Charity Golf",
        html: emailContent.html,
        text: emailContent.text,
      });
      return true;
    } catch (error) {
      console.error("Failed to send waitlist notification:", error);
      return false;
    }
  }

  // Send payment confirmation
  async sendPaymentConfirmation(
    registration: RegistrationData
  ): Promise<boolean> {
    if (!this.transporter || !this.config) {
      return false;
    }

    const emailContent = this.generatePaymentConfirmationEmail(registration);

    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to: registration.primaryPlayer.email,
        subject: "Payment Confirmed - IBM Charity Golf Tournament",
        html: emailContent.html,
        text: emailContent.text,
      });
      return true;
    } catch (error) {
      console.error("Failed to send payment confirmation:", error);
      return false;
    }
  }

  // Send tournament reminder
  async sendTournamentReminder(
    participants: { email: string; name: string; teamName?: string }[],
    reminderType: "week_before" | "day_before" | "checkin_open"
  ): Promise<boolean> {
    if (!this.transporter || !this.config) {
      return false;
    }

    try {
      for (const participant of participants) {
        const emailContent = this.generateTournamentReminderEmail(
          participant,
          reminderType
        );

        await this.transporter.sendMail({
          from: this.config.from,
          to: participant.email,
          subject: `Tournament Reminder - IBM Charity Golf (${this.getReminderSubject(reminderType)})`,
          html: emailContent.html,
          text: emailContent.text,
        });
      }
      return true;
    } catch (error) {
      console.error("Failed to send tournament reminders:", error);
      return false;
    }
  }

  // Send volunteer assignment notification
  async sendVolunteerAssignment(
    volunteer: { email: string; name: string },
    assignment: {
      role: string;
      location: string;
      startTime: string;
      endTime: string;
    }
  ): Promise<boolean> {
    if (!this.transporter || !this.config) {
      return false;
    }

    const emailContent = this.generateVolunteerAssignmentEmail(
      volunteer,
      assignment
    );

    try {
      await this.transporter.sendMail({
        from: this.config.from,
        to: volunteer.email,
        subject: "Volunteer Assignment - IBM Charity Golf Tournament",
        html: emailContent.html,
        text: emailContent.text,
      });
      return true;
    } catch (error) {
      console.error("Failed to send volunteer assignment:", error);
      return false;
    }
  }

  // Send tournament results
  async sendTournamentResults(
    participants: { email: string; name: string }[],
    results: { teamName: string; position: number; score: number }[]
  ): Promise<boolean> {
    if (!this.transporter || !this.config) {
      return false;
    }

    try {
      for (const participant of participants) {
        const emailContent = this.generateResultsEmail(participant, results);

        await this.transporter.sendMail({
          from: this.config.from,
          to: participant.email,
          subject: "Tournament Results - IBM Charity Golf",
          html: emailContent.html,
          text: emailContent.text,
        });
      }
      return true;
    } catch (error) {
      console.error("Failed to send tournament results:", error);
      return false;
    }
  }

  // Email template generators
  private generateRegistrationConfirmationEmail(
    registration: RegistrationData
  ): { html: string; text: string } {
    const playerCount =
      registration.type === "foursome" ? "4 players" : "1 player";
    const amount = (registration.paymentInfo.amount / 100).toFixed(2);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0f4c3a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .footer { background: #333; color: white; padding: 15px; text-align: center; }
          .button { background: #0f4c3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Confirmed!</h1>
            <p>IBM Charity Golf Tournament</p>
          </div>
          
          <div class="content">
            <h2>Thank you, ${registration.primaryPlayer.name}!</h2>
            <p>Your tournament registration has been successfully submitted and is being processed.</p>
            
            <div class="details">
              <h3>Registration Details:</h3>
              <p><strong>Registration ID:</strong> ${registration.id}</p>
              <p><strong>Registration Type:</strong> ${registration.type === "foursome" ? "Foursome" : "Individual"}</p>
              <p><strong>Number of Players:</strong> ${playerCount}</p>
              <p><strong>Total Amount:</strong> $${amount}</p>
              <p><strong>Status:</strong> ${registration.status}</p>
            </div>

            ${
              registration.type === "foursome" && registration.additionalPlayers
                ? `
            <div class="details">
              <h3>Team Members:</h3>
              <ol>
                <li>${registration.primaryPlayer.name} (Primary)</li>
                ${registration.additionalPlayers.map((player) => `<li>${player.name}</li>`).join("")}
              </ol>
            </div>
            `
                : ""
            }

            <div class="details">
              <h3>Tournament Information:</h3>
              <p><strong>Date:</strong> June 12, 2026</p>
              <p><strong>Time:</strong> 12:00 PM EST</p>
              <p><strong>Format:</strong> 18-Hole Scramble</p>
              <p><strong>Venue:</strong> TBD</p>
            </div>

            <div class="details">
              <h3>Next Steps:</h3>
              <ul>
                <li>Complete payment processing (if not already done)</li>
                <li>Watch for tournament updates via email</li>
                <li>Check-in instructions will be sent closer to the tournament date</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            <p>Questions? Contact us at tournament@ibm.com</p>
            <p>IBM Charity Golf Tournament 2026</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Tournament Registration Confirmed!

Thank you, ${registration.primaryPlayer.name}!

Your registration has been successfully submitted:
- Registration ID: ${registration.id}
- Type: ${registration.type}
- Players: ${playerCount}
- Amount: $${amount}
- Status: ${registration.status}

Tournament Details:
- Date: June 12, 2026
- Time: 12:00 PM EST
- Format: 18-Hole Scramble

Next Steps:
- Complete payment processing (if pending)
- Watch for tournament updates
- Check-in instructions coming soon

Questions? Contact tournament@ibm.com
    `;

    return { html, text };
  }

  private generatePlayerCopyEmail(
    registration: RegistrationData,
    player: PlayerInfo
  ): { html: string; text: string } {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0f4c3a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Registered!</h1>
            <p>IBM Charity Golf Tournament</p>
          </div>
          
          <div class="content">
            <h2>Hello ${player.name}!</h2>
            <p>You've been included in a tournament registration by ${registration.primaryPlayer.name}.</p>
            
            <div class="details">
              <h3>Tournament Information:</h3>
              <p><strong>Date:</strong> June 12, 2026</p>
              <p><strong>Time:</strong> 12:00 PM EST</p>
              <p><strong>Registration ID:</strong> ${registration.id}</p>
              <p><strong>Team Contact:</strong> ${registration.primaryPlayer.name} (${registration.primaryPlayer.email})</p>
            </div>

            <p>More details and check-in instructions will be sent as the tournament approaches!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
You're Registered for IBM Charity Golf Tournament!

Hello ${player.name}!

You've been included in a tournament registration by ${registration.primaryPlayer.name}.

Tournament Details:
- Date: June 12, 2026
- Time: 12:00 PM EST
- Registration ID: ${registration.id}
- Team Contact: ${registration.primaryPlayer.name} (${registration.primaryPlayer.email})

More details coming soon!
    `;

    return { html, text };
  }

  private generateWaitlistEmail(registration: RegistrationData): {
    html: string;
    text: string;
  } {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're on the Waitlist!</h1>
            <p>IBM Charity Golf Tournament</p>
          </div>
          
          <div class="content">
            <h2>Thank you, ${registration.primaryPlayer.name}!</h2>
            <p>The tournament is currently full, but you've been added to our waitlist. We'll notify you immediately if a spot becomes available!</p>
            
            <div class="details">
              <h3>Waitlist Details:</h3>
              <p><strong>Registration ID:</strong> ${registration.id}</p>
              <p><strong>Registration Type:</strong> ${registration.type}</p>
              <p><strong>Status:</strong> Waitlisted</p>
            </div>

            <p>We'll contact you immediately if a spot opens up!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
You're on the Waitlist - IBM Charity Golf Tournament

Thank you, ${registration.primaryPlayer.name}!

The tournament is currently full, but you've been added to our waitlist.

Waitlist Details:
- Registration ID: ${registration.id}
- Registration Type: ${registration.type}
- Status: Waitlisted

We'll contact you immediately if a spot opens up!

Questions? Contact tournament@ibm.com
    `;

    return { html, text };
  }

  private generatePaymentConfirmationEmail(registration: RegistrationData): {
    html: string;
    text: string;
  } {
    const amount = (registration.paymentInfo.amount / 100).toFixed(2);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Confirmed!</h1>
            <p>IBM Charity Golf Tournament</p>
          </div>
          
          <div class="content">
            <h2>Thank you, ${registration.primaryPlayer.name}!</h2>
            <p>Your payment has been successfully processed and your tournament registration is now confirmed!</p>
            
            <div class="details">
              <h3>Payment Details:</h3>
              <p><strong>Amount Paid:</strong> $${amount}</p>
              <p><strong>Registration ID:</strong> ${registration.id}</p>
              <p><strong>Payment Status:</strong> Confirmed</p>
              <p><strong>Registration Status:</strong> Confirmed</p>
            </div>

            <p>You're all set for the tournament on June 12, 2026. We'll send you check-in instructions closer to the event date.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Payment Confirmed - IBM Charity Golf Tournament

Thank you, ${registration.primaryPlayer.name}!

Your payment has been successfully processed and your registration is confirmed.

Payment Details:
- Amount Paid: $${amount}
- Registration ID: ${registration.id}
- Status: Confirmed

You're all set for June 12, 2026! Check-in instructions coming soon.

Questions? Contact tournament@ibm.com
    `;

    return { html, text };
  }

  private generateTournamentReminderEmail(
    participant: { email: string; name: string; teamName?: string },
    reminderType: "week_before" | "day_before" | "checkin_open"
  ): { html: string; text: string } {
    let subject = "";
    let message = "";

    switch (reminderType) {
      case "week_before":
        subject = "One Week Until Tournament";
        message =
          "The IBM Charity Golf Tournament is just one week away! Time to dust off those clubs.";
        break;
      case "day_before":
        subject = "Tournament Tomorrow";
        message =
          "The big day is tomorrow! Make sure you're ready for an amazing day on the course.";
        break;
      case "checkin_open":
        subject = "Check-in Now Open";
        message =
          "Tournament check-in is now open! Please check in at your earliest convenience.";
        break;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0f4c3a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${subject}</h1>
            <p>IBM Charity Golf Tournament</p>
          </div>
          
          <div class="content">
            <h2>Hello ${participant.name}!</h2>
            <p>${message}</p>
            ${participant.teamName ? `<p><strong>Team:</strong> ${participant.teamName}</p>` : ""}
            
            <p><strong>Tournament Details:</strong></p>
            <ul>
              <li>Date: June 12, 2026</li>
              <li>Time: 12:00 PM EST</li>
              <li>Format: 18-Hole Scramble</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
${subject} - IBM Charity Golf Tournament

Hello ${participant.name}!

${message}
${participant.teamName ? `Team: ${participant.teamName}` : ""}

Tournament Details:
- Date: June 12, 2026
- Time: 12:00 PM EST
- Format: 18-Hole Scramble

Questions? Contact tournament@ibm.com
    `;

    return { html, text };
  }

  private getReminderSubject(
    reminderType: "week_before" | "day_before" | "checkin_open"
  ): string {
    switch (reminderType) {
      case "week_before":
        return "One Week Until Tournament";
      case "day_before":
        return "Tournament Tomorrow";
      case "checkin_open":
        return "Check-in Now Open";
      default:
        return "Tournament Update";
    }
  }

  private generateVolunteerAssignmentEmail(
    volunteer: { email: string; name: string },
    assignment: {
      role: string;
      location: string;
      startTime: string;
      endTime: string;
    }
  ): { html: string; text: string } {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3498db; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Volunteer Assignment</h1>
            <p>IBM Charity Golf Tournament</p>
          </div>
          
          <div class="content">
            <h2>Thank you, ${volunteer.name}!</h2>
            <p>Here are your volunteer assignment details for the tournament:</p>
            
            <div class="details">
              <h3>Assignment Details:</h3>
              <p><strong>Role:</strong> ${assignment.role}</p>
              <p><strong>Location:</strong> ${assignment.location}</p>
              <p><strong>Start Time:</strong> ${assignment.startTime}</p>
              <p><strong>End Time:</strong> ${assignment.endTime}</p>
            </div>

            <p>Thank you for volunteering! Your contribution makes this tournament possible.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Volunteer Assignment - IBM Charity Golf Tournament

Thank you, ${volunteer.name}!

Assignment Details:
- Role: ${assignment.role}
- Location: ${assignment.location}
- Start Time: ${assignment.startTime}
- End Time: ${assignment.endTime}

Thank you for volunteering!

Questions? Contact tournament@ibm.com
    `;

    return { html, text };
  }

  private generateResultsEmail(
    participant: { email: string; name: string },
    results: { teamName: string; position: number; score: number }[]
  ): { html: string; text: string } {
    const topResults = results.slice(0, 10);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .results { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tournament Results</h1>
            <p>IBM Charity Golf Tournament</p>
          </div>
          
          <div class="content">
            <h2>Thank you, ${participant.name}!</h2>
            <p>What an amazing tournament! Here are the final results:</p>
            
            <div class="results">
              <h3>Top 10 Results:</h3>
              <ol>
                ${topResults
                  .map(
                    (result) =>
                      `<li>${result.teamName} - ${result.score} (Position ${result.position})</li>`
                  )
                  .join("")}
              </ol>
            </div>

            <p>Congratulations to all participants! Thank you for making this tournament a success.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Tournament Results - IBM Charity Golf Tournament

Thank you, ${participant.name}!

What an amazing tournament! Here are the final results:

Top 10 Results:
${topResults
  .map(
    (result, index) =>
      `${index + 1}. ${result.teamName} - ${result.score} (Position ${result.position})`
  )
  .join("\n")}

Congratulations to all participants!

Questions? Contact tournament@ibm.com
    `;

    return { html, text };
  }
}

// Create and export email service instance
export const emailService = new EmailService();

// Email configuration helper
export function initializeEmailService(config: EmailConfig): void {
  emailService.initialize(config);
}

// Default email configuration (use environment variables in production)
export const defaultEmailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
  from: process.env.SMTP_FROM || "tournament@ibm.com",
};
