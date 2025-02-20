import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { formatTime } from '@/utils/timeUtils';
import { IconSymbol } from './ui/IconSymbol';

interface MetricsDisplayProps {
  clicks: number;
  elapsedTimeMs: number;
  upm: number;
}

export function MetricsDisplay({ clicks, elapsedTimeMs, upm }: MetricsDisplayProps) {
  const displayTime = formatTime(elapsedTimeMs);
  // Don't show UPM for the first few seconds to avoid jumpiness
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: '5%',
    paddingHorizontal: 8,
    marginTop: Platform.OS === 'ios' ? 50 : 30, // Adjust for different platforms
    minHeight: 120, // Ensure minimum height for content
  },
  metricContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
    minWidth: 80, // Ensure minimum width for content
  },
  metricValue: {
    fontSize: 24, // More conservative base font size
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 4,
    includeFontPadding: false, // Prevent Android font padding issues
    textAlignVertical: 'center', // Better vertical alignment
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
