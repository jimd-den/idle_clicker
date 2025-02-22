export class RPGRewardSystem {
  private lastMetrics: string | null = null;
  private lastRewards: {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  } | null = null;

  calculateRewards(smoothnessMetrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  }): {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  } {
    const metricsString = JSON.stringify(smoothnessMetrics);
    if (metricsString === this.lastMetrics && this.lastRewards) {
      return this.lastRewards;
    }
    
    this.lastMetrics = metricsString;

    const baseXP = Math.max(1, smoothnessMetrics.consistency / 10);
    const flowBonus = Math.round((smoothnessMetrics.consistency + smoothnessMetrics.rhythm) / 2);
    const streakMultiplier = 1 + (smoothnessMetrics.flowState >= 80 ? 0.5 : 0);

    const rewards = {
      experience: Math.round(baseXP * streakMultiplier),
      achievementPoints: smoothnessMetrics.criticalSuccess * 10,
      flowBonus,
      streakMultiplier
    };

    this.lastRewards = rewards;
    return rewards;
  }
}
