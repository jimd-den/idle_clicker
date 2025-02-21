import { smoothnessMetrics } from '@/types/metrics';

export class SmoothnessCalculator {
  calculateSmoothnessScore(timeGaps: number[]) {
    console.log('SmoothnessCalculator input timeGaps:', timeGaps);
    
    const consistency = this.calculateConsistency(timeGaps);
    const rhythm = this.calculateRhythm(timeGaps);
    const flowState = (consistency + rhythm) / 2;
    
    const result = {
      consistency: Math.round(consistency),
      rhythm: Math.round(rhythm),
      flowState: Math.round(flowState),
      criticalSuccess: flowState > 90 ? 1 : 0,
      criticalFailure: flowState < 10 ? 1 : 0
    };
    
    console.log('SmoothnessCalculator output:', result);
    return result;
  }

  private calculateConsistency(timeGaps: number[]): number {
    if (timeGaps.length < 2) return 0;
    
    const avg = timeGaps.reduce((a, b) => a + b) / timeGaps.length;
    const variance = timeGaps.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / timeGaps.length;
    const stdDev = Math.sqrt(variance);

    // Make the scoring more lenient - using 20 instead of 50 as multiplier
    const score = Math.max(0, Math.min(100, 100 - (stdDev / avg * 20)));
    
    console.log('Consistency calculation:', {
      avg,
      stdDev,
      score
    });
    
    return score;
  }

  private calculateRhythm(timeGaps: number[]): number {
    if (timeGaps.length < 2) return 0;
    
    let rhythmScore = 0;
    let validIntervals = 0;

    for (let i = 1; i < timeGaps.length; i++) {
      const ratio = timeGaps[i] / timeGaps[i-1];
      
      // Consider any ratio between 0.5 and 2.0 as potentially rhythmic
      // Map this range to a 0-100 score
      if (ratio >= 0.5 && ratio <= 2.0) {
        const deviation = Math.abs(1 - ratio);
        const intervalScore = Math.max(0, 100 - (deviation * 100));
        rhythmScore += intervalScore;
        validIntervals++;
      }
    }

    return validIntervals > 0 ? rhythmScore / validIntervals : 0;
  }
}
