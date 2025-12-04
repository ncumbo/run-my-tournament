import { writable, derived } from "svelte/store";

// Volunteer types
export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role:
    | "registration"
    | "scoring"
    | "marshal"
    | "beverage"
    | "food"
    | "setup"
    | "cleanup"
    | "photography";
  assignment_location?: string;
  start_time?: string;
  end_time?: string;
  status: "registered" | "confirmed" | "checked_in" | "completed";
  notes?: string;
  created_at: string;
  created_by?: number;
}

export interface VolunteerRole {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  maxVolunteers: number;
  currentCount: number;
  priority: "high" | "medium" | "low";
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  maxVolunteers: number;
  currentCount: number;
  location?: string;
}

export interface VolunteerSchedule {
  volunteerId: number;
  assignments: Assignment[];
  totalHours: number;
  conflicts: string[];
}

export interface Assignment {
  id: string;
  role: string;
  location: string;
  start_time: string;
  end_time: string;
  instructions: string;
  contactPerson: string;
  contactPhone: string;
}

// Default volunteer roles configuration
export const defaultVolunteerRoles: VolunteerRole[] = [
  {
    id: "registration",
    name: "Registration Desk",
    description:
      "Check-in players, distribute materials, handle registration issues",
    requirements: [
      "Customer service experience",
      "Computer literacy",
      "Professional appearance",
    ],
    maxVolunteers: 6,
    currentCount: 0,
    priority: "high",
    timeSlots: [
      {
        id: "reg-early",
        start_time: "06:30",
        end_time: "09:00",
        maxVolunteers: 4,
        currentCount: 0,
        location: "Registration Tent",
      },
      {
        id: "reg-late",
        start_time: "08:30",
        end_time: "11:00",
        maxVolunteers: 2,
        currentCount: 0,
        location: "Registration Tent",
      },
    ],
  },
  {
    id: "scoring",
    name: "Scoring & Leaderboard",
    description:
      "Input scores, update leaderboard, assist with scoring questions",
    requirements: ["Golf knowledge", "Attention to detail", "Computer skills"],
    maxVolunteers: 4,
    currentCount: 0,
    priority: "high",
    timeSlots: [
      {
        id: "score-full",
        start_time: "07:00",
        end_time: "17:00",
        maxVolunteers: 2,
        currentCount: 0,
        location: "Scoring Tent",
      },
      {
        id: "score-afternoon",
        start_time: "12:00",
        end_time: "17:00",
        maxVolunteers: 2,
        currentCount: 0,
        location: "Scoring Tent",
      },
    ],
  },
  {
    id: "marshal",
    name: "Course Marshal",
    description:
      "Monitor pace of play, assist players, maintain course etiquette",
    requirements: [
      "Golf knowledge",
      "Good communication skills",
      "Physical mobility",
    ],
    maxVolunteers: 8,
    currentCount: 0,
    priority: "high",
    timeSlots: [
      {
        id: "marshal-morning",
        start_time: "07:30",
        end_time: "13:30",
        maxVolunteers: 4,
        currentCount: 0,
        location: "Course Holes 1-9",
      },
      {
        id: "marshal-afternoon",
        start_time: "11:30",
        end_time: "17:30",
        maxVolunteers: 4,
        currentCount: 0,
        location: "Course Holes 10-18",
      },
    ],
  },
  {
    id: "beverage",
    name: "Beverage Cart",
    description:
      "Drive beverage cart, serve refreshments, interact with players",
    requirements: [
      "Valid driver license",
      "Customer service skills",
      "Cash handling",
    ],
    maxVolunteers: 4,
    currentCount: 0,
    priority: "medium",
    timeSlots: [
      {
        id: "bev-cart1",
        start_time: "08:00",
        end_time: "16:00",
        maxVolunteers: 2,
        currentCount: 0,
        location: "Beverage Cart 1",
      },
      {
        id: "bev-cart2",
        start_time: "08:00",
        end_time: "16:00",
        maxVolunteers: 2,
        currentCount: 0,
        location: "Beverage Cart 2",
      },
    ],
  },
  {
    id: "food",
    name: "Food Service",
    description: "Serve meals, manage buffet, assist with catering",
    requirements: ["Food handling certification preferred", "Customer service"],
    maxVolunteers: 6,
    currentCount: 0,
    priority: "medium",
    timeSlots: [
      {
        id: "food-lunch",
        start_time: "11:00",
        end_time: "15:00",
        maxVolunteers: 4,
        currentCount: 0,
        location: "Dining Area",
      },
      {
        id: "food-dinner",
        start_time: "17:00",
        end_time: "21:00",
        maxVolunteers: 2,
        currentCount: 0,
        location: "Banquet Hall",
      },
    ],
  },
  {
    id: "setup",
    name: "Setup Crew",
    description: "Set up tents, signage, registration areas, course markers",
    requirements: ["Physical ability", "Early availability", "Teamwork"],
    maxVolunteers: 10,
    currentCount: 0,
    priority: "high",
    timeSlots: [
      {
        id: "setup-early",
        start_time: "05:00",
        end_time: "08:00",
        maxVolunteers: 6,
        currentCount: 0,
        location: "Various Locations",
      },
      {
        id: "setup-course",
        start_time: "06:00",
        end_time: "08:00",
        maxVolunteers: 4,
        currentCount: 0,
        location: "Golf Course",
      },
    ],
  },
  {
    id: "cleanup",
    name: "Cleanup Crew",
    description: "Break down equipment, clean facilities, pack materials",
    requirements: [
      "Physical ability",
      "Late availability",
      "Attention to detail",
    ],
    maxVolunteers: 8,
    currentCount: 0,
    priority: "medium",
    timeSlots: [
      {
        id: "cleanup-course",
        start_time: "17:00",
        end_time: "19:00",
        maxVolunteers: 4,
        currentCount: 0,
        location: "Golf Course",
      },
      {
        id: "cleanup-facilities",
        start_time: "19:00",
        end_time: "21:00",
        maxVolunteers: 4,
        currentCount: 0,
        location: "Event Facilities",
      },
    ],
  },
  {
    id: "photography",
    name: "Event Photography",
    description: "Capture tournament moments, action shots, awards ceremony",
    requirements: ["Photography equipment", "Photography skills", "Mobility"],
    maxVolunteers: 3,
    currentCount: 0,
    priority: "low",
    timeSlots: [
      {
        id: "photo-tournament",
        start_time: "07:00",
        end_time: "17:00",
        maxVolunteers: 2,
        currentCount: 0,
        location: "Roaming",
      },
      {
        id: "photo-ceremony",
        start_time: "17:00",
        end_time: "19:00",
        maxVolunteers: 1,
        currentCount: 0,
        location: "Awards Area",
      },
    ],
  },
];

// Volunteer coordination store
export const volunteerCoordination = writable<{
  volunteers: Volunteer[];
  roles: VolunteerRole[];
  schedules: VolunteerSchedule[];
  totalVolunteers: number;
  confirmedVolunteers: number;
  checkedInVolunteers: number;
}>({
  volunteers: [],
  roles: defaultVolunteerRoles,
  schedules: [],
  totalVolunteers: 0,
  confirmedVolunteers: 0,
  checkedInVolunteers: 0,
});

// Derived stores
export const volunteersByRole = derived(
  volunteerCoordination,
  ($volunteers) => {
    const grouped = new Map<string, Volunteer[]>();

    $volunteers.volunteers.forEach((volunteer) => {
      if (!grouped.has(volunteer.role)) {
        grouped.set(volunteer.role, []);
      }
      grouped.get(volunteer.role)!.push(volunteer);
    });

    return grouped;
  }
);

export const availableRoles = derived(volunteerCoordination, ($volunteers) => {
  const volunteerCounts = new Map<string, number>();

  // Count volunteers by role (excluding cancelled)
  $volunteers.volunteers
    .filter((v) => v.status !== "completed")
    .forEach((volunteer) => {
      const count = volunteerCounts.get(volunteer.role) || 0;
      volunteerCounts.set(volunteer.role, count + 1);
    });

  // Update current counts
  return $volunteers.roles.map((role) => ({
    ...role,
    currentCount: volunteerCounts.get(role.id) || 0,
    available: Math.max(
      0,
      role.maxVolunteers - (volunteerCounts.get(role.id) || 0)
    ),
  }));
});

export const urgentNeeds = derived(availableRoles, ($roles) =>
  $roles.filter(
    (role) =>
      role.priority === "high" && role.currentCount < role.maxVolunteers * 0.8 // Less than 80% filled
  )
);

// Volunteer coordination actions
export const volunteerActions = {
  // Load all volunteers
  async loadVolunteers(): Promise<void> {
    try {
      const response = await fetch("/api/volunteers");
      if (response.ok) {
        const volunteers: Volunteer[] = await response.json();

        const totalVolunteers = volunteers.length;
        const confirmedVolunteers = volunteers.filter(
          (v) => v.status === "confirmed" || v.status === "checked_in"
        ).length;
        const checkedInVolunteers = volunteers.filter(
          (v) => v.status === "checked_in"
        ).length;

        volunteerCoordination.update((state) => ({
          ...state,
          volunteers,
          totalVolunteers,
          confirmedVolunteers,
          checkedInVolunteers,
        }));
      }
    } catch (error) {
      console.error("Failed to load volunteers:", error);
    }
  },

  // Register new volunteer
  async registerVolunteer(
    volunteerData: Omit<Volunteer, "id" | "created_at" | "status">
  ): Promise<{ success: boolean; volunteerId?: number; error?: string }> {
    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...volunteerData, status: "registered" }),
      });

      if (response.ok) {
        const result = await response.json();
        await this.loadVolunteers();

        // Send welcome email
        await this.sendWelcomeEmail(result.id);

        return { success: true, volunteerId: result.id };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to register volunteer:", error);
      return { success: false, error: "Failed to register volunteer" };
    }
  },

  // Update volunteer status
  async updateVolunteerStatus(
    volunteerId: number,
    status: Volunteer["status"]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/volunteers/${volunteerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await this.loadVolunteers();

        // Send appropriate email based on status change
        if (status === "confirmed") {
          await this.sendConfirmationEmail(volunteerId);
        }

        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to update volunteer status:", error);
      return { success: false, error: "Failed to update volunteer status" };
    }
  },

  // Check in volunteer
  async checkInVolunteer(
    volunteerId: number
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateVolunteerStatus(volunteerId, "checked_in");
  },

  // Assign volunteer to specific location and time
  async assignVolunteer(
    volunteerId: number,
    assignment: {
      location: string;
      start_time: string;
      end_time: string;
      instructions?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/volunteers/${volunteerId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignment),
      });

      if (response.ok) {
        await this.loadVolunteers();
        await this.sendAssignmentEmail(volunteerId, assignment);
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to assign volunteer:", error);
      return { success: false, error: "Failed to assign volunteer" };
    }
  },

  // Generate volunteer schedules
  async generateSchedules(): Promise<{
    success: boolean;
    schedules?: VolunteerSchedule[];
    error?: string;
  }> {
    try {
      const response = await fetch("/api/volunteers/schedules/generate", {
        method: "POST",
      });

      if (response.ok) {
        const schedules = await response.json();

        volunteerCoordination.update((state) => ({
          ...state,
          schedules,
        }));

        return { success: true, schedules };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to generate schedules:", error);
      return { success: false, error: "Failed to generate schedules" };
    }
  },

  // Send welcome email to new volunteer
  async sendWelcomeEmail(
    volunteerId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `/api/volunteers/${volunteerId}/welcome-email`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      return { success: false, error: "Failed to send welcome email" };
    }
  },

  // Send confirmation email
  async sendConfirmationEmail(
    volunteerId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `/api/volunteers/${volunteerId}/confirmation-email`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      return { success: false, error: "Failed to send confirmation email" };
    }
  },

  // Send assignment email
  async sendAssignmentEmail(
    volunteerId: number,
    assignment: {
      location: string;
      start_time: string;
      end_time: string;
      instructions?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(
        `/api/volunteers/${volunteerId}/assignment-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(assignment),
        }
      );

      if (response.ok) {
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to send assignment email:", error);
      return { success: false, error: "Failed to send assignment email" };
    }
  },

  // Get volunteer statistics
  getVolunteerStats(volunteers: Volunteer[]): {
    totalVolunteers: number;
    byRole: Record<string, number>;
    byStatus: Record<string, number>;
    hoursCommitted: number;
    fillRate: number;
  } {
    const totalVolunteers = volunteers.length;
    const byRole: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    volunteers.forEach((volunteer) => {
      // Count by role
      byRole[volunteer.role] = (byRole[volunteer.role] || 0) + 1;

      // Count by status
      byStatus[volunteer.status] = (byStatus[volunteer.status] || 0) + 1;
    });

    // Calculate total hours committed (rough estimate)
    const hoursCommitted = volunteers
      .filter((v) => v.start_time && v.end_time)
      .reduce((total, volunteer) => {
        if (volunteer.start_time && volunteer.end_time) {
          const start = new Date(`2026-06-12T${volunteer.start_time}`);
          const end = new Date(`2026-06-12T${volunteer.end_time}`);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return total + Math.max(0, hours);
        }
        return total;
      }, 0);

    // Calculate fill rate based on total needed vs confirmed
    const totalNeeded = defaultVolunteerRoles.reduce(
      (sum, role) => sum + role.maxVolunteers,
      0
    );
    const confirmedCount = volunteers.filter(
      (v) => v.status === "confirmed" || v.status === "checked_in"
    ).length;
    const fillRate = totalNeeded > 0 ? (confirmedCount / totalNeeded) * 100 : 0;

    return {
      totalVolunteers,
      byRole,
      byStatus,
      hoursCommitted: Math.round(hoursCommitted),
      fillRate: Math.round(fillRate * 100) / 100,
    };
  },

  // Export volunteer data
  exportVolunteers(
    volunteers: Volunteer[],
    format: "csv" | "json" = "csv"
  ): string {
    if (format === "json") {
      return JSON.stringify(volunteers, null, 2);
    }

    // CSV export
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Status",
      "Assignment Location",
      "Start Time",
      "End Time",
      "Created At",
    ];

    const rows = volunteers.map((volunteer) => [
      volunteer.id.toString(),
      volunteer.name,
      volunteer.email,
      volunteer.phone || "",
      volunteer.role,
      volunteer.status,
      volunteer.assignment_location || "",
      volunteer.start_time || "",
      volunteer.end_time || "",
      new Date(volunteer.created_at).toLocaleDateString(),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  },

  // Generate volunteer certificates
  generateCertificates(
    volunteers: Volunteer[]
  ): { volunteerId: number; certificateData: any }[] {
    const completedVolunteers = volunteers.filter(
      (v) => v.status === "completed"
    );

    return completedVolunteers.map((volunteer) => ({
      volunteerId: volunteer.id,
      certificateData: {
        name: volunteer.name,
        role: volunteer.role,
        date: "2026-06-12",
        hours:
          volunteer.start_time && volunteer.end_time
            ? Math.round(
                (new Date(`2026-06-12T${volunteer.end_time}`).getTime() -
                  new Date(`2026-06-12T${volunteer.start_time}`).getTime()) /
                  (1000 * 60 * 60)
              )
            : 0,
      },
    }));
  },
};

// Initialize volunteer coordination
volunteerActions.loadVolunteers();

export { volunteerCoordination as volunteerStore };
