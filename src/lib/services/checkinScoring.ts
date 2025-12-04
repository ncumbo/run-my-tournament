import { writable, derived } from "svelte/store";

// Check-in and scoring types
export interface CheckIn {
  id: number;
  registration_id: number;
  player_name: string;
  checked_in_at: string;
  checked_in_by: number;
  cart_number?: string;
  starting_hole: number;
  notes?: string;
}

export interface Score {
  id: number;
  pairing_id: number;
  registration_id: number;
  player_name: string;
  hole_number: number;
  strokes: number;
  putts?: number;
  penalties?: number;
  notes?: string;
  recorded_by: number;
  recorded_at: string;
}

export interface Scorecard {
  registration_id: number;
  team_name: string;
  player_name: string;
  scores: HoleScore[];
  total_strokes: number;
  total_score_to_par: number;
  holes_completed: number;
}

export interface HoleScore {
  hole_number: number;
  par: number;
  strokes: number;
  putts?: number;
  penalties?: number;
  score_to_par: number;
  notes?: string;
}

export interface CheckInStats {
  total_registrations: number;
  checked_in: number;
  pending_checkin: number;
  check_in_rate: number;
  peak_checkin_time: string;
}

export interface ScoringStats {
  total_scorecards: number;
  completed_rounds: number;
  in_progress: number;
  average_score: number;
  best_score: number;
  scoring_completion_rate: number;
}

// Course information
export const courseInfo = {
  holes: [
    { number: 1, par: 4, yardage: 380 },
    { number: 2, par: 3, yardage: 165 },
    { number: 3, par: 5, yardage: 520 },
    { number: 4, par: 4, yardage: 395 },
    { number: 5, par: 3, yardage: 180 },
    { number: 6, par: 4, yardage: 410 },
    { number: 7, par: 5, yardage: 545 },
    { number: 8, par: 4, yardage: 365 },
    { number: 9, par: 3, yardage: 155 },
    { number: 10, par: 4, yardage: 385 },
    { number: 11, par: 3, yardage: 170 },
    { number: 12, par: 5, yardage: 530 },
    { number: 13, par: 4, yardage: 400 },
    { number: 14, par: 3, yardage: 175 },
    { number: 15, par: 4, yardage: 420 },
    { number: 16, par: 5, yardage: 555 },
    { number: 17, par: 4, yardage: 375 },
    { number: 18, par: 4, yardage: 390 },
  ],
  totalPar: 72,
  totalYardage: 6615,
};

// Check-in and scoring store
export const checkinScoring = writable<{
  checkIns: CheckIn[];
  scores: Score[];
  scorecards: Scorecard[];
  checkInStats: CheckInStats;
  scoringStats: ScoringStats;
  activeScoringMode: boolean;
}>({
  checkIns: [],
  scores: [],
  scorecards: [],
  checkInStats: {
    total_registrations: 0,
    checked_in: 0,
    pending_checkin: 0,
    check_in_rate: 0,
    peak_checkin_time: "",
  },
  scoringStats: {
    total_scorecards: 0,
    completed_rounds: 0,
    in_progress: 0,
    average_score: 0,
    best_score: 0,
    scoring_completion_rate: 0,
  },
  activeScoringMode: false,
});

// Derived stores
export const pendingCheckIns = derived(checkinScoring, ($checkin) => {
  // This would normally come from registrations that haven't checked in
  return [];
});

export const recentCheckIns = derived(checkinScoring, ($checkin) =>
  $checkin.checkIns
    .sort(
      (a, b) =>
        new Date(b.checked_in_at).getTime() -
        new Date(a.checked_in_at).getTime()
    )
    .slice(0, 10)
);

export const incompleteRounds = derived(checkinScoring, ($checkin) =>
  $checkin.scorecards.filter((card) => card.holes_completed < 18)
);

export const completedRounds = derived(checkinScoring, ($checkin) =>
  $checkin.scorecards.filter((card) => card.holes_completed === 18)
);

// Check-in and scoring actions
export const checkinScoringActions = {
  // Load check-in data
  async loadCheckIns(): Promise<void> {
    try {
      const response = await fetch("/api/checkins");
      if (response.ok) {
        const checkIns: CheckIn[] = await response.json();

        checkinScoring.update((state) => ({
          ...state,
          checkIns,
          checkInStats: this.calculateCheckInStats(checkIns),
        }));
      }
    } catch (error) {
      console.error("Failed to load check-ins:", error);
    }
  },

  // Check in a player/team
  async checkInPlayer(
    registrationId: number,
    playerName: string,
    cartNumber?: string,
    startingHole: number = 1,
    notes?: string
  ): Promise<{ success: boolean; checkInId?: number; error?: string }> {
    try {
      const response = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: registrationId,
          player_name: playerName,
          cart_number: cartNumber,
          starting_hole: startingHole,
          notes,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        await this.loadCheckIns();

        // Initialize scorecard for the player
        await this.initializeScorecard(registrationId, playerName);

        return { success: true, checkInId: result.id };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to check in player:", error);
      return { success: false, error: "Failed to check in player" };
    }
  },

  // Initialize scorecard
  async initializeScorecard(
    registrationId: number,
    playerName: string
  ): Promise<void> {
    const scorecard: Scorecard = {
      registration_id: registrationId,
      team_name: playerName, // This would be fetched from registration data
      player_name: playerName,
      scores: courseInfo.holes.map((hole) => ({
        hole_number: hole.number,
        par: hole.par,
        strokes: 0,
        score_to_par: 0,
      })),
      total_strokes: 0,
      total_score_to_par: 0,
      holes_completed: 0,
    };

    checkinScoring.update((state) => ({
      ...state,
      scorecards: [
        ...state.scorecards.filter((c) => c.registration_id !== registrationId),
        scorecard,
      ],
    }));
  },

  // Record score for a hole
  async recordScore(
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
          penalties: penalties || 0,
          notes,
        }),
      });

      if (response.ok) {
        await this.updateScorecard(
          registrationId,
          holeNumber,
          strokes,
          putts,
          penalties,
          notes
        );
        return { success: true };
      }

      const error = await response.text();
      return { success: false, error };
    } catch (error) {
      console.error("Failed to record score:", error);
      return { success: false, error: "Failed to record score" };
    }
  },

  // Update local scorecard
  updateScorecard(
    registrationId: number,
    holeNumber: number,
    strokes: number,
    putts?: number,
    penalties?: number,
    notes?: string
  ): void {
    checkinScoring.update((state) => {
      const scorecards = [...state.scorecards];
      const scorecardIndex = scorecards.findIndex(
        (c) => c.registration_id === registrationId
      );

      if (scorecardIndex !== -1) {
        const scorecard = { ...scorecards[scorecardIndex] };
        const holeIndex = scorecard.scores.findIndex(
          (s) => s.hole_number === holeNumber
        );

        if (holeIndex !== -1) {
          const hole = courseInfo.holes.find((h) => h.number === holeNumber);
          const par = hole?.par || 4;

          scorecard.scores[holeIndex] = {
            hole_number: holeNumber,
            par,
            strokes,
            putts,
            penalties,
            score_to_par: strokes - par,
            notes,
          };

          // Recalculate totals
          const completedHoles = scorecard.scores.filter((s) => s.strokes > 0);
          scorecard.holes_completed = completedHoles.length;
          scorecard.total_strokes = completedHoles.reduce(
            (sum, s) => sum + s.strokes,
            0
          );
          scorecard.total_score_to_par = completedHoles.reduce(
            (sum, s) => sum + s.score_to_par,
            0
          );

          scorecards[scorecardIndex] = scorecard;
        }
      }

      return {
        ...state,
        scorecards,
        scoringStats: this.calculateScoringStats(scorecards),
      };
    });
  },

  // Get scorecard by registration
  getScorecard(registrationId: number): Scorecard | null {
    const state = this.getCurrentState();
    return (
      state.scorecards.find(
        (c: Scorecard) => c.registration_id === registrationId
      ) || null
    );
  },

  // Get current state helper
  getCurrentState(): any {
    let currentState: any;
    checkinScoring.subscribe((state) => {
      currentState = state;
    })();
    return currentState;
  },

  // Load all scores
  async loadScores(): Promise<void> {
    try {
      const response = await fetch("/api/scores");
      if (response.ok) {
        const scores: Score[] = await response.json();

        checkinScoring.update((state) => ({
          ...state,
          scores,
        }));

        // Update scorecards based on loaded scores
        await this.syncScorecardsWithScores(scores);
      }
    } catch (error) {
      console.error("Failed to load scores:", error);
    }
  },

  // Sync scorecards with loaded scores
  async syncScorecardsWithScores(scores: Score[]): Promise<void> {
    const scorecardMap = new Map<number, Scorecard>();

    // Group scores by registration
    scores.forEach((score) => {
      if (!scorecardMap.has(score.registration_id)) {
        scorecardMap.set(score.registration_id, {
          registration_id: score.registration_id,
          team_name: score.player_name, // This should come from registration data
          player_name: score.player_name,
          scores: courseInfo.holes.map((hole) => ({
            hole_number: hole.number,
            par: hole.par,
            strokes: 0,
            score_to_par: 0,
          })),
          total_strokes: 0,
          total_score_to_par: 0,
          holes_completed: 0,
        });
      }

      const scorecard = scorecardMap.get(score.registration_id)!;
      const holeIndex = scorecard.scores.findIndex(
        (s) => s.hole_number === score.hole_number
      );

      if (holeIndex !== -1) {
        scorecard.scores[holeIndex] = {
          hole_number: score.hole_number,
          par:
            courseInfo.holes.find((h) => h.number === score.hole_number)?.par ||
            4,
          strokes: score.strokes,
          putts: score.putts,
          penalties: score.penalties,
          score_to_par:
            score.strokes -
            (courseInfo.holes.find((h) => h.number === score.hole_number)
              ?.par || 4),
          notes: score.notes,
        };
      }
    });

    // Recalculate totals for each scorecard
    const scorecards = Array.from(scorecardMap.values()).map((scorecard) => {
      const completedHoles = scorecard.scores.filter((s) => s.strokes > 0);
      return {
        ...scorecard,
        holes_completed: completedHoles.length,
        total_strokes: completedHoles.reduce((sum, s) => sum + s.strokes, 0),
        total_score_to_par: completedHoles.reduce(
          (sum, s) => sum + s.score_to_par,
          0
        ),
      };
    });

    checkinScoring.update((state) => ({
      ...state,
      scorecards,
      scoringStats: this.calculateScoringStats(scorecards),
    }));
  },

  // Calculate check-in statistics
  calculateCheckInStats(checkIns: CheckIn[]): CheckInStats {
    // This would normally fetch total registrations from the database
    const totalRegistrations = 100; // Placeholder
    const checkedIn = checkIns.length;
    const pendingCheckin = Math.max(0, totalRegistrations - checkedIn);
    const checkInRate =
      totalRegistrations > 0 ? (checkedIn / totalRegistrations) * 100 : 0;

    // Find peak check-in time
    const hourlyCheckins = new Map<string, number>();
    checkIns.forEach((checkin) => {
      const hour = new Date(checkin.checked_in_at).getHours();
      const hourKey = `${hour}:00`;
      hourlyCheckins.set(hourKey, (hourlyCheckins.get(hourKey) || 0) + 1);
    });

    const peakHour =
      Array.from(hourlyCheckins.entries()).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] || "";

    return {
      total_registrations: totalRegistrations,
      checked_in: checkedIn,
      pending_checkin: pendingCheckin,
      check_in_rate: Math.round(checkInRate * 100) / 100,
      peak_checkin_time: peakHour,
    };
  },

  // Calculate scoring statistics
  calculateScoringStats(scorecards: Scorecard[]): ScoringStats {
    const totalScorecards = scorecards.length;
    const completedRounds = scorecards.filter(
      (c) => c.holes_completed === 18
    ).length;
    const inProgress = scorecards.filter(
      (c) => c.holes_completed > 0 && c.holes_completed < 18
    ).length;

    const completedScores = scorecards
      .filter((c) => c.holes_completed === 18)
      .map((c) => c.total_score_to_par);

    const averageScore =
      completedScores.length > 0
        ? completedScores.reduce((sum, score) => sum + score, 0) /
          completedScores.length
        : 0;

    const bestScore =
      completedScores.length > 0 ? Math.min(...completedScores) : 0;
    const scoringCompletionRate =
      totalScorecards > 0 ? (completedRounds / totalScorecards) * 100 : 0;

    return {
      total_scorecards: totalScorecards,
      completed_rounds: completedRounds,
      in_progress: inProgress,
      average_score: Math.round(averageScore * 10) / 10,
      best_score: bestScore,
      scoring_completion_rate: Math.round(scoringCompletionRate * 100) / 100,
    };
  },

  // Export scoring data
  exportScoringData(
    scorecards: Scorecard[],
    format: "csv" | "json" = "csv"
  ): string {
    if (format === "json") {
      return JSON.stringify(scorecards, null, 2);
    }

    // CSV export with hole-by-hole scores
    const headers = [
      "Registration ID",
      "Team Name",
      "Player Name",
      "Total Strokes",
      "Score to Par",
      "Holes Completed",
      ...courseInfo.holes.map((h) => `Hole ${h.number}`),
      ...courseInfo.holes.map((h) => `H${h.number} Par`),
    ];

    const rows = scorecards.map((scorecard) => [
      scorecard.registration_id.toString(),
      scorecard.team_name,
      scorecard.player_name,
      scorecard.total_strokes.toString(),
      scorecard.total_score_to_par > 0
        ? `+${scorecard.total_score_to_par}`
        : scorecard.total_score_to_par.toString(),
      scorecard.holes_completed.toString(),
      ...scorecard.scores.map((s) => s.strokes.toString()),
      ...scorecard.scores.map((s) => s.score_to_par.toString()),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  },

  // Generate tournament results
  generateResults(scorecards: Scorecard[]): {
    overall: Scorecard[];
    byFlight: Record<string, Scorecard[]>;
    prizes: { category: string; winner: Scorecard; score: number }[];
  } {
    const completedRounds = scorecards.filter((c) => c.holes_completed === 18);

    // Sort by total score to par
    const overall = [...completedRounds].sort(
      (a, b) => a.total_score_to_par - b.total_score_to_par
    );

    // Create flights (groups) - simple division by thirds
    const flightSize = Math.ceil(overall.length / 3);
    const byFlight = {
      "Championship Flight": overall.slice(0, flightSize),
      "First Flight": overall.slice(flightSize, flightSize * 2),
      "Second Flight": overall.slice(flightSize * 2),
    };

    // Generate prize categories
    const prizes = [
      {
        category: "Overall Champion",
        winner: overall[0],
        score: overall[0]?.total_score_to_par || 0,
      },
      {
        category: "Runner-up",
        winner: overall[1],
        score: overall[1]?.total_score_to_par || 0,
      },
    ];

    // Add flight winners
    Object.entries(byFlight).forEach(([flightName, players]) => {
      if (players.length > 0) {
        prizes.push({
          category: `${flightName} Winner`,
          winner: players[0],
          score: players[0].total_score_to_par,
        });
      }
    });

    return { overall, byFlight, prizes };
  },

  // Toggle scoring mode
  toggleScoringMode(): void {
    checkinScoring.update((state) => ({
      ...state,
      activeScoringMode: !state.activeScoringMode,
    }));
  },
};

// Initialize check-in and scoring
checkinScoringActions.loadCheckIns();
checkinScoringActions.loadScores();

export { checkinScoring as checkinScoringStore };
