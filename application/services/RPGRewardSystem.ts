export class RPGRewardSystem {
  private readonly EXPERIENCE_BASE = 10;
  private readonly FLOW_BONUS_MULTIPLIER = 1.5;
  private readonly STREAK_THRESHOLD = 5;

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
    const baseXP = this.EXPERIENCE_BASE * (smoothnessMetrics.consistency / 100);
    
    const flowBonus = smoothnessMetrics.flowState >= this.STREAK_THRESHOLD
      ? baseXP * this.FLOW_BONUS_MULTIPLIER
      : 0;

    const criticalBonus = smoothnessMetrics.criticalSuccess * 50;

    return {
      experience: Math.round(baseXP + flowBonus + criticalBonus),
      achievementPoints: this.calculateAchievementPoints(smoothnessMetrics),
      flowBonus: flowBonus,
      streakMultiplier: this.calculateStreakMultiplier(smoothnessMetrics.flowState)
    };
  }

  private calculateAchievementPoints(smoothnessMetrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  }): number {
    return smoothnessMetrics.consistency + smoothnessMetrics.flowState * 2 + smoothnessMetrics.criticalSuccess * 5;
  }

  private calculateStreakMultiplier(flowState: number): number {
    return 1 + (Math.floor(flowState / this.STREAK_THRESHOLD) * 0.1);
  }
}
