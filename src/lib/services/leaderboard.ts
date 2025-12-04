import { writable, derived } from "svelte/store";

// Mock socket.io types for now - will be implemented when socket.io is properly set up
type Socket = {
  connected: boolean;
  on: (event: string, callback: Function) => void;
  emit: (event: string, data?: any) => void;
  disconnect: () => void;
};

declare function io(url: string, options?: any): Socket;

// Leaderboard types
export interface LeaderboardEntry {
  id: number;
  bracket_id: number;
  registration_id: number;
  team_name: string;
  total_strokes: number;
  total_score_to_par: number;
  holes_completed: number;
  position: number;
  is_tied: boolean;
  updated_at: string;
  players?: string[];
  current_hole?: number;
  last_score?: number;
}

export interface HoleScore {
  hole_number: number;
  par: number;
  strokes: number;
  score_to_par: number;
}

export interface LiveScoreUpdate {
  registration_id: number;
  team_name: string;
  hole_number: number;
  strokes: number;
  total_strokes: number;
  total_score_to_par: number;
  holes_completed: number;
}

export interface LeaderboardConfig {
  refreshInterval: number;
  showTiedPositions: boolean;
  maxDisplayEntries: number;
  enableLiveUpdates: boolean;
  highlightRecentUpdates: boolean;
}

// Default leaderboard configuration
export const defaultLeaderboardConfig: LeaderboardConfig = {
  refreshInterval: 30000, // 30 seconds
  showTiedPositions: true,
  maxDisplayEntries: 50,
  enableLiveUpdates: true,
  highlightRecentUpdates: true,
};

// Leaderboard store
export const leaderboard = writable<{
  entries: LeaderboardEntry[];
  activeBracketId: number | null;
  config: LeaderboardConfig;
  isLive: boolean;
  lastUpdated: string | null;
  recentUpdates: Set<number>;
}>({
  entries: [],
  activeBracketId: null,
  config: defaultLeaderboardConfig,
  isLive: false,
  lastUpdated: null,
  recentUpdates: new Set(),
});

// Derived stores
export const topTen = derived(leaderboard, ($leaderboard) =>
  $leaderboard.entries.slice(0, 10)
);

export const leadersByPosition = derived(leaderboard, ($leaderboard) => {
  const grouped = new Map<number, LeaderboardEntry[]>();

  $leaderboard.entries.forEach((entry) => {
    if (!grouped.has(entry.position)) {
      grouped.set(entry.position, []);
    }
    grouped.get(entry.position)!.push(entry);
  });

  return Array.from(grouped.entries()).sort(([a], [b]) => a - b);
});

export const recentScoreUpdates = derived(leaderboard, ($leaderboard) =>
  $leaderboard.entries
    .filter((entry) => $leaderboard.recentUpdates.has(entry.registration_id))
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
);

// Socket connection for real-time updates
let socket: Socket | null = null;

// Leaderboard actions
export const leaderboardActions = {
  // Initialize real-time connection
  initializeRealTime(): void {
    if (typeof window === "undefined") return;

    // Mock implementation - will use actual socket.io when available
    socket = {
      connected: false,
      on: () => {},
      emit: () => {},
      disconnect: () => {},
    };

    console.log("Leaderboard real-time initialized (mock)");

    leaderboard.update((state) => ({
      ...state,
      isLive: true,
    }));
  },

  // Disconnect real-time updates
  disconnectRealTime(): void {
    if (socket) {
      socket.disconnect();
      socket = null;
      leaderboard.update((state) => ({
        ...state,
        isLive: false,
      }));
    }
  },

  // Load leaderboard for a bracket
  async loadLeaderboard(bracketId: number): Promise<void> {
    try {
      const response = await fetch(`/api/leaderboard/${bracketId}`);
      if (response.ok) {
        const entries: LeaderboardEntry[] = await response.json();

        leaderboard.update((state) => ({
          ...state,
          entries: entries.sort((a, b) => a.position - b.position),
          activeBracketId: bracketId,
          lastUpdated: new Date().toISOString(),
        }));

        // Join bracket room for live updates
        if (socket && socket.connected) {
          socket.emit("join_bracket", bracketId);
        }
      }
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  },

  // Handle live score update
  handleLiveScoreUpdate(update: LiveScoreUpdate): void {
    leaderboard.update((state) => {
      const entryIndex = state.entries.findIndex(
        (entry) => entry.registration_id === update.registration_id
      );

      if (entryIndex !== -1) {
        // Update existing entry
        const updatedEntries = [...state.entries];
        updatedEntries[entryIndex] = {
          ...updatedEntries[entryIndex],
          total_strokes: update.total_strokes,
          total_score_to_par: update.total_score_to_par,
          holes_completed: update.holes_completed,
          current_hole: update.hole_number,
          last_score: update.strokes,
          updated_at: new Date().toISOString(),
        };

        // Recalculate positions
        const sortedEntries = this.recalculatePositions(updatedEntries);

        // Mark as recently updated
        const newRecentUpdates = new Set(state.recentUpdates);
        newRecentUpdates.add(update.registration_id);

        // Clear recent update after 30 seconds
        setTimeout(() => {
          leaderboard.update((currentState) => ({
            ...currentState,
            recentUpdates: new Set(
              [...currentState.recentUpdates].filter(
                (id) => id !== update.registration_id
              )
            ),
          }));
        }, 30000);

        return {
          ...state,
          entries: sortedEntries,
          recentUpdates: newRecentUpdates,
          lastUpdated: new Date().toISOString(),
        };
      }

      return state;
    });
  },

  // Recalculate leaderboard positions
  recalculatePositions(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    // Sort by score to par (ascending), then by total strokes (ascending)
    const sorted = entries.sort((a, b) => {
      if (a.total_score_to_par !== b.total_score_to_par) {
        return a.total_score_to_par - b.total_score_to_par;
      }
      return a.total_strokes - b.total_strokes;
    });

    // Assign positions and handle ties
    let currentPosition = 1;
    for (let i = 0; i < sorted.length; i++) {
      const entry = sorted[i];
      const prevEntry = i > 0 ? sorted[i - 1] : null;

      if (
        prevEntry &&
        entry.total_score_to_par === prevEntry.total_score_to_par &&
        entry.total_strokes === prevEntry.total_strokes
      ) {
        // Tied with previous entry
        entry.position = prevEntry.position;
        entry.is_tied = true;
        prevEntry.is_tied = true;
      } else {
        // Not tied
        entry.position = currentPosition;
        entry.is_tied = false;
        currentPosition = i + 1;
      }
    }

    return sorted;
  },

  // Highlight position change
  highlightPositionChange(data: {
    registration_id: number;
    old_position: number;
    new_position: number;
  }): void {
    // This could trigger UI animations or notifications
    console.log(
      `Position change: Registration ${data.registration_id} moved from ${data.old_position} to ${data.new_position}`
    );
  },

  // Submit score update
  async submitScore(
    registrationId: number,
    holeNumber: number,
    strokes: number,
    putts?: number,
    penalties?: number,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: registrationId,
          hole_number: holeNumber,
          strokes,
          putts,
          penalties,
          notes,
        }),
      });

      if (response.ok) {
        // Score will be updated via WebSocket
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to submit score:", error);
      return { success: false, error: "Failed to submit score" };
    }
  },

  // Get player's scorecard
  async getScorecard(registrationId: number): Promise<HoleScore[]> {
    try {
      const response = await fetch(`/api/scores/${registrationId}`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error("Failed to load scorecard:", error);
      return [];
    }
  },

  // Export leaderboard data
  exportLeaderboard(
    entries: LeaderboardEntry[],
    format: "csv" | "json" = "csv"
  ): string {
    if (format === "json") {
      return JSON.stringify(entries, null, 2);
    }

    // CSV export
    const headers = [
      "Position",
      "Team Name",
      "Total Strokes",
      "Score to Par",
      "Holes Completed",
      "Last Updated",
    ];

    const rows = entries.map((entry) => [
      entry.is_tied ? `T${entry.position}` : entry.position.toString(),
      entry.team_name,
      entry.total_strokes.toString(),
      entry.total_score_to_par > 0
        ? `+${entry.total_score_to_par}`
        : entry.total_score_to_par.toString(),
      entry.holes_completed.toString(),
      new Date(entry.updated_at).toLocaleString(),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  },

  // Get leaderboard statistics
  getLeaderboardStats(entries: LeaderboardEntry[]): {
    totalTeams: number;
    completedRounds: number;
    inProgress: number;
    averageScore: number;
    bestScore: number;
    worstScore: number;
    cutLine?: number;
  } {
    const completedRounds = entries.filter(
      (e) => e.holes_completed === 18
    ).length;
    const inProgress = entries.filter(
      (e) => e.holes_completed > 0 && e.holes_completed < 18
    ).length;

    const scores = entries.map((e) => e.total_score_to_par);
    const averageScore =
      scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 0;
    const bestScore = scores.length > 0 ? Math.min(...scores) : 0;
    const worstScore = scores.length > 0 ? Math.max(...scores) : 0;

    // Calculate cut line (top 50% or minimum 10 teams)
    const cutLine = Math.max(10, Math.ceil(entries.length / 2));

    return {
      totalTeams: entries.length,
      completedRounds,
      inProgress,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore,
      worstScore,
      cutLine,
    };
  },

  // Update configuration
  updateConfig(newConfig: Partial<LeaderboardConfig>): void {
    leaderboard.update((state) => ({
      ...state,
      config: { ...state.config, ...newConfig },
    }));
  },
};

// Auto-initialize real-time updates when in browser
if (typeof window !== "undefined") {
  leaderboardActions.initializeRealTime();
}

export { leaderboard as leaderboardStore };
