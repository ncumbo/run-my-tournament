import { writable, derived } from "svelte/store";

// Sponsor types
export interface Sponsor {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  sponsorship_level:
    | "title"
    | "presenting"
    | "gold"
    | "silver"
    | "bronze"
    | "hole"
    | "cart"
    | "beverage";
  amount: number;
  benefits: string;
  logo_url?: string;
  website_url?: string;
  status: "pending" | "confirmed" | "paid" | "cancelled";
  hole_assignment?: number;
  created_at: string;
  created_by: number;
}

export interface SponsorshipPackage {
  level: Sponsor["sponsorship_level"];
  name: string;
  price: number;
  benefits: string[];
  maxSponsors: number;
  available: number;
  featured: boolean;
}

export interface SponsorshipBenefit {
  id: string;
  name: string;
  description: string;
  levels: Sponsor["sponsorship_level"][];
  isQuantifiable: boolean;
  quantity?: number;
  unit?: string;
}

// Default sponsorship packages
export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    level: "title",
    name: "Title Sponsor",
    price: 10000,
    benefits: [
      "Tournament named after sponsor",
      "Logo on all marketing materials",
      "Premium booth space",
      "VIP hospitality tent",
      "Speaking opportunity at awards ceremony",
      "Social media promotion",
      "8 tournament entries",
    ],
    maxSponsors: 1,
    available: 1,
    featured: true,
  },
  {
    level: "presenting",
    name: "Presenting Sponsor",
    price: 7500,
    benefits: [
      "Logo on banners and signage",
      "Booth space at registration",
      "VIP hospitality tent",
      "Logo on player gifts",
      "Social media mentions",
      "6 tournament entries",
    ],
    maxSponsors: 2,
    available: 2,
    featured: true,
  },
  {
    level: "gold",
    name: "Gold Sponsor",
    price: 5000,
    benefits: [
      "Logo on event signage",
      "Booth space",
      "Logo on scorecards",
      "Recognition at awards ceremony",
      "4 tournament entries",
    ],
    maxSponsors: 4,
    available: 4,
    featured: true,
  },
  {
    level: "silver",
    name: "Silver Sponsor",
    price: 3000,
    benefits: [
      "Logo on select signage",
      "Small booth space",
      "Recognition at ceremony",
      "2 tournament entries",
    ],
    maxSponsors: 8,
    available: 8,
    featured: false,
  },
  {
    level: "bronze",
    name: "Bronze Sponsor",
    price: 1500,
    benefits: [
      "Logo on program",
      "Recognition at ceremony",
      "1 tournament entry",
    ],
    maxSponsors: 15,
    available: 15,
    featured: false,
  },
  {
    level: "hole",
    name: "Hole Sponsor",
    price: 500,
    benefits: [
      "Sign at sponsored hole",
      "Logo on hole scorecard",
      "Recognition in program",
    ],
    maxSponsors: 18,
    available: 18,
    featured: false,
  },
  {
    level: "cart",
    name: "Cart Sponsor",
    price: 300,
    benefits: ["Logo on golf cart", "Recognition in program"],
    maxSponsors: 36,
    available: 36,
    featured: false,
  },
  {
    level: "beverage",
    name: "Beverage Sponsor",
    price: 1000,
    benefits: [
      "Logo on beverage stations",
      "Beverage cart branding",
      "Recognition in program",
    ],
    maxSponsors: 2,
    available: 2,
    featured: false,
  },
];

// Sponsor management store
export const sponsorManagement = writable<{
  sponsors: Sponsor[];
  packages: SponsorshipPackage[];
  totalRevenue: number;
  pendingSponsors: number;
  confirmedSponsors: number;
}>({
  sponsors: [],
  packages: sponsorshipPackages,
  totalRevenue: 0,
  pendingSponsors: 0,
  confirmedSponsors: 0,
});

// Derived stores
export const sponsorsByLevel = derived(sponsorManagement, ($sponsors) => {
  const grouped = new Map<string, Sponsor[]>();

  $sponsors.sponsors.forEach((sponsor) => {
    if (!grouped.has(sponsor.sponsorship_level)) {
      grouped.set(sponsor.sponsorship_level, []);
    }
    grouped.get(sponsor.sponsorship_level)!.push(sponsor);
  });

  return grouped;
});

export const confirmedSponsors = derived(sponsorManagement, ($sponsors) =>
  $sponsors.sponsors.filter(
    (s) => s.status === "confirmed" || s.status === "paid"
  )
);

export const availablePackages = derived(sponsorManagement, ($sponsors) => {
  const sponsorCounts = new Map<string, number>();

  // Count existing sponsors by level
  $sponsors.sponsors
    .filter((s) => s.status !== "cancelled")
    .forEach((sponsor) => {
      const count = sponsorCounts.get(sponsor.sponsorship_level) || 0;
      sponsorCounts.set(sponsor.sponsorship_level, count + 1);
    });

  // Update available counts
  return $sponsors.packages.map((pkg) => ({
    ...pkg,
    available: Math.max(
      0,
      pkg.maxSponsors - (sponsorCounts.get(pkg.level) || 0)
    ),
  }));
});

// Sponsor management actions
export const sponsorActions = {
  // Load all sponsors
  async loadSponsors(): Promise<void> {
    try {
      const response = await fetch("/api/sponsors");
      if (response.ok) {
        const sponsors: Sponsor[] = await response.json();

        const totalRevenue = sponsors
          .filter((s) => s.status === "paid")
          .reduce((sum, s) => sum + s.amount, 0);

        const pendingSponsors = sponsors.filter(
          (s) => s.status === "pending"
        ).length;
        const confirmedSponsors = sponsors.filter(
          (s) => s.status === "confirmed" || s.status === "paid"
        ).length;

        sponsorManagement.update((state) => ({
          ...state,
          sponsors,
          totalRevenue,
          pendingSponsors,
          confirmedSponsors,
        }));
      }
    } catch (error) {
      console.error("Failed to load sponsors:", error);
    }
  },

  // Create new sponsor
  async createSponsor(
    sponsorData: Omit<Sponsor, "id" | "created_at" | "created_by">
  ): Promise<{ success: boolean; sponsorId?: number; error?: string }> {
    try {
      const response = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sponsorData),
      });

      if (response.ok) {
        const result = await response.json();
        await this.loadSponsors();
        return { success: true, sponsorId: result.id };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to create sponsor:", error);
      return { success: false, error: "Failed to create sponsor" };
    }
  },

  // Update sponsor
  async updateSponsor(
    sponsorId: number,
    updates: Partial<Sponsor>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/sponsors/${sponsorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await this.loadSponsors();
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to update sponsor:", error);
      return { success: false, error: "Failed to update sponsor" };
    }
  },

  // Update sponsor status
  async updateSponsorStatus(
    sponsorId: number,
    status: Sponsor["status"]
  ): Promise<{ success: boolean; error?: string }> {
    return this.updateSponsor(sponsorId, { status });
  },

  // Assign hole to sponsor
  async assignHole(
    sponsorId: number,
    holeNumber: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if hole is already assigned
      const existingAssignment = await this.getHoleAssignment(holeNumber);
      if (existingAssignment) {
        return {
          success: false,
          error: `Hole ${holeNumber} is already assigned to another sponsor`,
        };
      }

      return this.updateSponsor(sponsorId, { hole_assignment: holeNumber });
    } catch (error) {
      console.error("Failed to assign hole:", error);
      return { success: false, error: "Failed to assign hole" };
    }
  },

  // Get hole assignment
  async getHoleAssignment(holeNumber: number): Promise<Sponsor | null> {
    try {
      const response = await fetch(`/api/sponsors/holes/${holeNumber}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Failed to get hole assignment:", error);
      return null;
    }
  },

  // Upload sponsor logo
  async uploadLogo(
    sponsorId: number,
    logoFile: File
  ): Promise<{ success: boolean; logoUrl?: string; error?: string }> {
    try {
      const formData = new FormData();
      formData.append("logo", logoFile);
      formData.append("sponsorId", sponsorId.toString());

      const response = await fetch("/api/sponsors/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        await this.updateSponsor(sponsorId, { logo_url: result.logoUrl });
        return { success: true, logoUrl: result.logoUrl };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to upload logo:", error);
      return { success: false, error: "Failed to upload logo" };
    }
  },

  // Generate sponsor invoice
  async generateInvoice(
    sponsorId: number
  ): Promise<{ success: boolean; invoiceUrl?: string; error?: string }> {
    try {
      const response = await fetch(`/api/sponsors/${sponsorId}/invoice`, {
        method: "POST",
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, invoiceUrl: result.invoiceUrl };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      return { success: false, error: "Failed to generate invoice" };
    }
  },

  // Send sponsor welcome email
  async sendWelcomeEmail(
    sponsorId: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/sponsors/${sponsorId}/welcome-email`, {
        method: "POST",
      });

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

  // Get sponsor statistics
  getSponsorStats(sponsors: Sponsor[]): {
    totalSponsors: number;
    totalRevenue: number;
    averageSponsorshipAmount: number;
    sponsorshipByLevel: Record<string, { count: number; revenue: number }>;
    conversionRate: number;
    pendingRevenue: number;
  } {
    const totalSponsors = sponsors.filter(
      (s) => s.status !== "cancelled"
    ).length;
    const totalRevenue = sponsors
      .filter((s) => s.status === "paid")
      .reduce((sum, s) => sum + s.amount, 0);

    const pendingRevenue = sponsors
      .filter((s) => s.status === "confirmed" || s.status === "pending")
      .reduce((sum, s) => sum + s.amount, 0);

    const sponsorshipByLevel: Record<
      string,
      { count: number; revenue: number }
    > = {};

    sponsors.forEach((sponsor) => {
      if (sponsor.status !== "cancelled") {
        if (!sponsorshipByLevel[sponsor.sponsorship_level]) {
          sponsorshipByLevel[sponsor.sponsorship_level] = {
            count: 0,
            revenue: 0,
          };
        }
        sponsorshipByLevel[sponsor.sponsorship_level].count++;

        if (sponsor.status === "paid") {
          sponsorshipByLevel[sponsor.sponsorship_level].revenue +=
            sponsor.amount;
        }
      }
    });

    const totalProspects = sponsors.length;
    const confirmedCount = sponsors.filter(
      (s) => s.status === "confirmed" || s.status === "paid"
    ).length;
    const conversionRate =
      totalProspects > 0 ? (confirmedCount / totalProspects) * 100 : 0;

    return {
      totalSponsors,
      totalRevenue,
      averageSponsorshipAmount:
        totalSponsors > 0 ? totalRevenue / totalSponsors : 0,
      sponsorshipByLevel,
      conversionRate: Math.round(conversionRate * 100) / 100,
      pendingRevenue,
    };
  },

  // Export sponsors data
  exportSponsors(sponsors: Sponsor[], format: "csv" | "json" = "csv"): string {
    if (format === "json") {
      return JSON.stringify(sponsors, null, 2);
    }

    // CSV export
    const headers = [
      "ID",
      "Name",
      "Contact Person",
      "Email",
      "Phone",
      "Sponsorship Level",
      "Amount",
      "Status",
      "Hole Assignment",
      "Created At",
    ];

    const rows = sponsors.map((sponsor) => [
      sponsor.id.toString(),
      sponsor.name,
      sponsor.contact_person,
      sponsor.email,
      sponsor.phone || "",
      sponsor.sponsorship_level,
      `$${sponsor.amount}`,
      sponsor.status,
      sponsor.hole_assignment?.toString() || "",
      new Date(sponsor.created_at).toLocaleDateString(),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  },

  // Generate sponsor recognition materials
  generateRecognitionMaterials(sponsors: Sponsor[]): {
    programListing: string;
    signageList: { sponsor: string; level: string; location?: string }[];
    socialMediaPosts: string[];
  } {
    const confirmedSponsors = sponsors.filter(
      (s) => s.status === "confirmed" || s.status === "paid"
    );

    // Program listing grouped by level
    const levelOrder = [
      "title",
      "presenting",
      "gold",
      "silver",
      "bronze",
      "hole",
      "cart",
      "beverage",
    ];
    const programListing = levelOrder
      .map((level) => {
        const levelSponsors = confirmedSponsors.filter(
          (s) => s.sponsorship_level === level
        );
        if (levelSponsors.length === 0) return "";

        const levelName =
          sponsorshipPackages.find((p) => p.level === level)?.name || level;
        const sponsorNames = levelSponsors.map((s) => s.name).join(", ");

        return `${levelName.toUpperCase()}\n${sponsorNames}\n`;
      })
      .filter((section) => section)
      .join("\n");

    // Signage list
    const signageList = confirmedSponsors.map((sponsor) => ({
      sponsor: sponsor.name,
      level: sponsor.sponsorship_level,
      location: sponsor.hole_assignment
        ? `Hole ${sponsor.hole_assignment}`
        : undefined,
    }));

    // Social media posts
    const socialMediaPosts = confirmedSponsors.map(
      (sponsor) =>
        `We're grateful for the support of ${sponsor.name} as a ${sponsor.sponsorship_level} sponsor of the IBM Charity Golf Tournament! 🏌️‍♂️ #TournamentSponsors #Gratitude`
    );

    return {
      programListing,
      signageList,
      socialMediaPosts,
    };
  },
};

// Initialize sponsor management
sponsorActions.loadSponsors();

export { sponsorManagement as sponsorStore };
