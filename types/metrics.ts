export interface MetricsUpdate {
  elapsedTimeMs: number;
  upm: number;
  isRunning: boolean;
  clicks: number;
  smoothnessMetrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  };
  rewards: {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  };
}
