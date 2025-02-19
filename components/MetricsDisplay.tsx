import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { formatTime } from '@/utils/timeUtils'; // Import formatTime

interface MetricsDisplayProps {
  clicks: number;
  elapsedTimeMs: number; // Expect milliseconds as prop now
  upm: number;
}

export function MetricsDisplay({ clicks, elapsedTimeMs, upm }: MetricsDisplayProps) { // Receive elapsedTimeMs
  // const [displayTime, setDisplayTime] = useState("00:00"); // REMOVE local displayTime state

  const displayTime = formatTime(elapsedTimeMs); // Format displayTime directly from prop

  console.log("MetricsDisplay: Rendering with props - Clicks:", clicks, "ElapsedTimeMs:", elapsedTimeMs, "UPM:", upm, "Display Time:", displayTime); // ADDED LOG - Display Time in render
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
          {displayTime} {/* Use directly formatted displayTime from prop */}
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
