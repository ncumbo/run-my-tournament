import { writable, derived } from "svelte/store";
import type { RegistrationData } from "./registrationWorkflow";

// Tournament bracket types
export interface TournamentBracket {
  id: number;
  name: string;
  tournament_date: string;
  status: "draft" | "active" | "completed";
  bracket_type: "championship" | "consolation" | "skills";
  created_at: string;
  created_by: number;
}

export interface TournamentPairing {
  id: number;
  bracket_id: number;
  pairing_number: number;
  tee_time: string;
  hole_assignment: number;
  status: "scheduled" | "in_progress" | "completed";
  created_at: string;
  players: PairingPlayer[];
}

export interface PairingPlayer {
  id: number;
  pairing_id: number;
  registration_id: number;
  player_name: string;
  handicap?: number;
  position_in_group: number;
}

export interface BracketConfiguration {
  startTime: string;
  intervalMinutes: number;
  playersPerGroup: number;
  startingHole: number;
  maxGroups: number;
}

// Default bracket configuration
export const defaultBracketConfig: BracketConfiguration = {
  startTime: "08:00",
  intervalMinutes: 10,
  playersPerGroup: 4,
  startingHole: 1,
  maxGroups: 36,
};

// Tournament brackets store
export const tournamentBrackets = writable<{
  brackets: TournamentBracket[];
  activeBracket: TournamentBracket | null;
  pairings: TournamentPairing[];
  config: BracketConfiguration;
}>({
  brackets: [],
  activeBracket: null,
  pairings: [],
  config: defaultBracketConfig,
});

// Derived stores
export const activePairings = derived(tournamentBrackets, ($brackets) =>
  $brackets.pairings.filter(
    (p) => p.status === "scheduled" || p.status === "in_progress"
  )
);

export const completedPairings = derived(tournamentBrackets, ($brackets) =>
  $brackets.pairings.filter((p) => p.status === "completed")
);

// Tournament bracket actions
export const bracketActions = {
  // Create a new tournament bracket
  async createBracket(
    name: string,
    tournamentDate: string,
    bracketType: TournamentBracket["bracket_type"] = "championship",
    createdBy: number
  ): Promise<{ success: boolean; bracketId?: number; error?: string }> {
    try {
      const response = await fetch("/api/brackets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, tournamentDate, bracketType, createdBy }),
      });

      if (response.ok) {
        const result = await response.json();
        await this.loadBrackets();
        return { success: true, bracketId: result.id };
      }

      return { success: false, error: "Failed to create bracket" };
    } catch (error) {
      console.error("Bracket creation failed:", error);
      return { success: false, error: "Bracket creation failed" };
    }
  },

  // Generate automatic pairings from registrations
  async generatePairings(
    bracketId: number,
    registrations: RegistrationData[],
    config?: Partial<BracketConfiguration>
  ): Promise<{ success: boolean; pairingCount?: number; error?: string }> {
    try {
      const finalConfig = { ...defaultBracketConfig, ...config };

      // Filter confirmed registrations
      const confirmedRegistrations = registrations.filter(
        (reg) => reg.status === "confirmed"
      );

      // Collect all players with handicaps for balanced grouping
      const allPlayers: Array<{
        registrationId: string;
        name: string;
        handicap: number;
        email: string;
      }> = [];

      confirmedRegistrations.forEach((registration) => {
        // Add primary player
        allPlayers.push({
          registrationId: registration.id!,
          name: registration.primaryPlayer.name,
          handicap: registration.primaryPlayer.handicap || 36,
          email: registration.primaryPlayer.email,
        });

        // Add additional players for foursomes
        if (
          registration.type === "foursome" &&
          registration.additionalPlayers
        ) {
          registration.additionalPlayers.forEach((player) => {
            allPlayers.push({
              registrationId: registration.id!,
              name: player.name,
              handicap: player.handicap || 36,
              email: player.email,
            });
          });
        }
      });

      // Sort players by handicap for balanced grouping
      allPlayers.sort((a, b) => a.handicap - b.handicap);

      // Create balanced groups using snake draft method
      const groups = this.createBalancedGroups(
        allPlayers,
        finalConfig.playersPerGroup
      );

      const response = await fetch("/api/pairings/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bracketId,
          groups,
          config: finalConfig,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        await this.loadPairings(bracketId);
        return { success: true, pairingCount: result.pairingCount };
      }

      return { success: false, error: "Failed to generate pairings" };
    } catch (error) {
      console.error("Pairing generation failed:", error);
      return { success: false, error: "Failed to generate pairings" };
    }
  },

  // Create balanced groups using snake draft method
  createBalancedGroups(players: any[], groupSize: number): any[][] {
    const groups: any[][] = [];
    const numGroups = Math.ceil(players.length / groupSize);

    // Initialize groups
    for (let i = 0; i < numGroups; i++) {
      groups[i] = [];
    }

    // Snake draft assignment
    let currentGroup = 0;
    let direction = 1;

    for (const player of players) {
      groups[currentGroup].push(player);

      currentGroup += direction;

      // Change direction at boundaries
      if (currentGroup === numGroups) {
        currentGroup = numGroups - 1;
        direction = -1;
      } else if (currentGroup === -1) {
        currentGroup = 0;
        direction = 1;
      }
    }

    // Filter out empty groups and ensure minimum group size
    return groups.filter((group) => group.length > 0);
  },

  // Load pairings for a bracket
  async loadPairings(bracketId: number): Promise<void> {
    try {
      const response = await fetch(`/api/brackets/${bracketId}/pairings`);
      if (response.ok) {
        const pairings = await response.json();

        tournamentBrackets.update((state) => ({
          ...state,
          pairings,
        }));
      }
    } catch (error) {
      console.error("Failed to load pairings:", error);
    }
  },

  // Update bracket status
  async updateBracketStatus(
    bracketId: number,
    status: TournamentBracket["status"]
  ): Promise<boolean> {
    try {
      const response = await fetch(`/api/brackets/${bracketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await this.loadBrackets();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update bracket status:", error);
      return false;
    }
  },

  // Set active bracket
  setActiveBracket(bracket: TournamentBracket | null): void {
    tournamentBrackets.update((state) => ({
      ...state,
      activeBracket: bracket,
    }));

    if (bracket) {
      this.loadPairings(bracket.id);
    }
  },

  // Load all brackets
  async loadBrackets(): Promise<void> {
    try {
      const response = await fetch("/api/brackets");
      if (response.ok) {
        const brackets = await response.json();
        tournamentBrackets.update((state) => ({
          ...state,
          brackets,
        }));
      }
    } catch (error) {
      console.error("Failed to load brackets:", error);
    }
  },

  // Get pairing statistics
  getPairingStats(pairings: TournamentPairing[]): {
    totalPairings: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    totalPlayers: number;
    averageHandicap: number;
  } {
    const stats = {
      totalPairings: pairings.length,
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      totalPlayers: 0,
      averageHandicap: 0,
    };

    let totalHandicap = 0;
    let playersWithHandicap = 0;

    pairings.forEach((pairing) => {
      switch (pairing.status) {
        case "scheduled":
          stats.scheduled++;
          break;
        case "in_progress":
          stats.inProgress++;
          break;
        case "completed":
          stats.completed++;
          break;
      }

      stats.totalPlayers += pairing.players.length;

      pairing.players.forEach((player) => {
        if (player.handicap) {
          totalHandicap += player.handicap;
          playersWithHandicap++;
        }
      });
    });

    if (playersWithHandicap > 0) {
      stats.averageHandicap =
        Math.round((totalHandicap / playersWithHandicap) * 10) / 10;
    }

    return stats;
  },

  // Export pairings to CSV
  exportPairings(pairings: TournamentPairing[]): string {
    const headers = [
      "Pairing Number",
      "Tee Time",
      "Hole Assignment",
      "Status",
      "Player 1",
      "Handicap 1",
      "Player 2",
      "Handicap 2",
      "Player 3",
      "Handicap 3",
      "Player 4",
      "Handicap 4",
    ];

    const rows = pairings.map((pairing) => {
      const row = [
        pairing.pairing_number.toString(),
        new Date(pairing.tee_time).toLocaleTimeString(),
        pairing.hole_assignment.toString(),
        pairing.status,
      ];

      // Add up to 4 players
      for (let i = 0; i < 4; i++) {
        const player = pairing.players.find(
          (p) => p.position_in_group === i + 1
        );
        row.push(player?.player_name || "");
        row.push(player?.handicap?.toString() || "");
      }

      return row;
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  },
};

export { tournamentBrackets as bracketsStore };
