import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
// import { formatTime } from '@/utils/timeUtils'; // No longer needed here

interface MetricsDisplayProps {
  clicks: number;
  elapsedTime: string; // Expects formatted time string now
  upm: number;
}

export function MetricsDisplay({ clicks, elapsedTime, upm }: MetricsDisplayProps) {
  return (
    <View style={styles.topModuleContainer}>
      <View style={styles.metricContainer}>
        <ThemedText style={styles.metricValue} type="title">
          {clicks}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Total Units</ThemedText>
      </View>

      <View style={styles.metricContainer}>
        <ThemedText style={styles.metricValue} type="title">
          {elapsedTime} {/* Now receives formatted time string */}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>Stopwatch</ThemedText>
      </View>

      <View style={styles.metricContainer}>
        <ThemedText style={styles.metricValue} type="title">
          {upm.toFixed(3)}
        </ThemedText>
        <ThemedText style={styles.metricLabel}>UPM</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topModuleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 60,
    marginTop: 40,
  },
  metricContainer: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 40,
    fontWeight: 'bold',
    lineHeight: 40,
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: 16,
    textAlign: 'center',
    color: '#687076',
  },
});
