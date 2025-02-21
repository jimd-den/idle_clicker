export class SmoothnessCalculator {
	// Calculate smoothness based on the variability of time gaps between clicks.
	calculateSmoothnessScore(timeGaps: number[]): {
		consistency: number;
		rhythm: number;
		flowState: number;
		criticalSuccess: number;
		criticalFailure: number;
	} {
		if (timeGaps.length === 0) {
			return { consistency: 0, rhythm: 0, flowState: 0, criticalSuccess: 0, criticalFailure: 0 };
		}
		// Calculate mean and standard deviation.
		const n = timeGaps.length;
		const mean = timeGaps.reduce((a, b) => a + b, 0) / n;
		const variance = timeGaps.reduce((acc, gap) => acc + Math.pow(gap - mean, 2), 0) / n;
		const stdDev = Math.sqrt(variance);
		// Coefficient of variation (percentage)
		const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
		// Higher variability means lower consistency.
		const consistency = Math.round(Math.max(0, 100 - cv));
		// For simplicity, use the same score for rhythm.
		const rhythm = consistency;
		// Flow state is a fraction of consistency.
		const flowState = Math.round(consistency * 0.8);
		// Define critical success as gaps within 10% deviation from the mean.
		const criticalSuccess = timeGaps.filter(gap => Math.abs(gap - mean) <= mean * 0.1).length;
		// Define critical failure as gaps deviating more than 50% from the mean.
		const criticalFailure = timeGaps.filter(gap => Math.abs(gap - mean) > mean * 0.5).length;
		
		return {
			consistency,
			rhythm,
			flowState,
			criticalSuccess,
			criticalFailure
		};
	}
}
