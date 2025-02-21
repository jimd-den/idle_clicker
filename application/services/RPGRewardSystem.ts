import { rewards } from '@/types/metrics';

export class RPGRewardSystem {
  calculateRewards(smoothnessMetrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  }) {
    const baseXP = 10;
    const flowBonus = (smoothnessMetrics.consistency + smoothnessMetrics.rhythm) / 2;
    const streakMultiplier = smoothnessMetrics.flowState > 80 ? 2 : 1;

    return {
      experience: Math.round(baseXP * streakMultiplier),
      achievementPoints: smoothnessMetrics.criticalSuccess * 100,
      flowBonus: Math.round(flowBonus),
      streakMultiplier: streakMultiplier
    };
  }
}
