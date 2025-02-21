export class SmoothnessCalculator {
  calculateSmoothnessScore(timeGaps: number[]): {
    consistency: number;
    rhythm: number;
    flowState: number;
  } {
    const stdDev = this.calculateStandardDeviation(timeGaps);
    const avgGap = this.calculateAverage(timeGaps);
    
    return {
      consistency: Math.max(0, 100 - (stdDev * 10)),
      rhythm: this.calculateRhythmScore(timeGaps, avgGap),
      flowState: this.calculateFlowState(timeGaps)
    };
  }

  private calculateStandardDeviation(timeGaps: number[]): number {
    const avg = this.calculateAverage(timeGaps);
    const squareDiffs = timeGaps.map(gap => Math.pow(gap - avg, 2));
    const avgSquareDiff = this.calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  private calculateAverage(timeGaps: number[]): number {
    const sum = timeGaps.reduce((a, b) => a + b, 0);
    return sum / timeGaps.length;
  }

  private calculateRhythmScore(timeGaps: number[], avgGap: number): number {
    // Implement rhythm score calculation logic
    return 0; // Placeholder
  }

  private calculateFlowState(timeGaps: number[]): number {
    // Implement flow state calculation logic
    return 0; // Placeholder
  }

  checkCritical(currentGap: number, averageGap: number): string {
    if (Math.abs(currentGap - averageGap) < 0.1) {
      return 'CRITICAL_SUCCESS'; // Like rolling a natural 20
    } else if (Math.abs(currentGap - averageGap) > 2) {
      return 'CRITICAL_FAILURE';  // Like rolling a 1
    }
    return 'NORMAL';
  }
}
