import React, { memo } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { formatTime } from '@/utils/timeUtils';
import { IconSymbol } from './ui/IconSymbol';

interface MetricsDisplayProps {
  clicks: number;
  elapsedTimeMs: number;
  upm: number;
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

export const MetricsDisplay = memo(({ 
  clicks, 
  elapsedTimeMs, 
  upm, 
  smoothnessMetrics = {
    consistency: 0,
    rhythm: 0,
    flowState: 0,
    criticalSuccess: 0,
    criticalFailure: 0
  }, 
  rewards = {
    experience: 0,
    achievementPoints: 0,
    flowBonus: 0,
    streakMultiplier: 0
  } 
}: MetricsDisplayProps) => {
  const displayTime = formatTime(elapsedTimeMs);
  const shouldShowUPM = elapsedTimeMs > 3000;

  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="number" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`${clicks} units`}>
          {clicks}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Units</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="clock" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Time ${displayTime}`}>
          {displayTime}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Time</ThemedText>
      </View>

      {/*
      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="speedometer" size={20} color="#687076" />
        <ThemedText 
          style={[styles.metricValue, !shouldShowUPM && styles.metricValuePlaceholder]} 
          accessibilityLabel={shouldShowUPM ? `${upm.toFixed(1)} units per minute` : 'Calculating units per minute'}
        >
          {shouldShowUPM ? upm.toFixed(1) : '--'}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>UPM</ThemedText>
      </View>
      */}

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="exclamationmark.circle" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Consistency ${smoothnessMetrics.consistency}`}>
          {smoothnessMetrics.consistency}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Consistency</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="exclamationmark.circle" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Rhythm ${smoothnessMetrics.rhythm}`}>
          {smoothnessMetrics.rhythm}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Rhythm</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="exclamationmark.circle" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Flow State ${smoothnessMetrics.flowState}`}>
          {smoothnessMetrics.flowState}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Flow State</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="exclamationmark.circle" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Critical Success ${smoothnessMetrics.criticalSuccess}`}>
          {smoothnessMetrics.criticalSuccess}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Critical Success</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="exclamationmark.circle" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Critical Failure ${smoothnessMetrics.criticalFailure}`}>
          {smoothnessMetrics.criticalFailure}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Critical Failure</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="paperplane.fill" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Experience ${rewards.experience}`}>
          {rewards.experience}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Experience</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="chevron.left.forwardslash.chevron.right" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Flow Bonus ${rewards.flowBonus}`}>
          {rewards.flowBonus}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Flow Bonus</ThemedText>
      </View>

      <View style={styles.metricContainer} accessibilityRole="text">
        <IconSymbol name="stop.circle" size={20} color="#687076" />
        <ThemedText style={styles.metricValue} accessibilityLabel={`Streak Multiplier ${rewards.streakMultiplier}`}>
          {rewards.streakMultiplier}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Streak Multiplier</ThemedText>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.clicks === nextProps.clicks &&
    prevProps.elapsedTimeMs === nextProps.elapsedTimeMs &&
    prevProps.upm === nextProps.upm &&
    JSON.stringify(prevProps.smoothnessMetrics) === JSON.stringify(nextProps.smoothnessMetrics) &&
    JSON.stringify(prevProps.rewards) === JSON.stringify(nextProps.rewards)
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap', // allow items to wrap
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: '5%',
    paddingHorizontal: 8,
    marginTop: Platform.OS === 'ios' ? 50 : 30,
    minHeight: 180, // increased to allow extra rows
  },
  metricContainer: {
    alignItems: 'center',
    width: '30%', // fixed width for up to three items per row
    paddingHorizontal: 4,
    paddingVertical: 8,
    minWidth: 80,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 4,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  metricLabel: {
    fontSize: 13,
    color: '#687076',
    textAlign: 'center',
    marginTop: 2,
  },
  metricValuePlaceholder: {
    color: '#687076',
  },
});
