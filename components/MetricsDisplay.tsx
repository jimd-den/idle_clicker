import React, { useState, useEffect, useRef } from 'react'; // Import useState and useEffect
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { formatTime } from '@/utils/timeUtils'; // Import formatTime

interface MetricsDisplayProps {
  clicks: number;
  elapsedTimeMs: number; // Expect milliseconds as prop now
  upm: number;
}

export function MetricsDisplay({ clicks, elapsedTimeMs, upm }: MetricsDisplayProps) { // Receive elapsedTimeMs
  const [displayTime, setDisplayTime] = useState("00:00"); // Local state for displayTime
  const lastUpdateTimeRef = useRef<number>(0); // Ref to track last update time

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
      setDisplayTime(formatTime(elapsedTimeMs)); // Format current elapsedTimeMs for display

      console.log("MetricsDisplay: displayTime interval - updating displayTime - Elapsed Time Ms:", elapsedTimeMs, "Display Time:", displayTime, "Time since last update:", timeSinceLastUpdate); // Enhanced logging

      lastUpdateTimeRef.current = now; // Update last update time
    }, 1000); // Update every 1 second

    lastUpdateTimeRef.current = Date.now(); // Initialize last update time on mount

    return () => {
      clearInterval(intervalId);
      console.log("MetricsDisplay: displayTime interval - cleared"); // ADDED LOG
    };
  }, [elapsedTimeMs]); // Update interval when elapsedTimeMs prop changes


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
          {displayTime} {/* Use local displayTime state */}
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
