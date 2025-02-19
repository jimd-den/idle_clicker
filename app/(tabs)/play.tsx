import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PlayScreenController } from '@/presentation/controllers/PlayScreenController';
import { formatTime } from '@/utils/timeUtils';

/**
 * Presentation Layer - UI (React Component)
 *
 * PlayScreen: Implements the main screen of the Non-Idle Clicker app.
 * It provides the UI for tracking work units, time, and performance metrics
 * as defined in the Software Requirements Specification (SRS).
 *
 * This component interacts with the PlayScreenController to handle user
 * actions and update the UI based on the application state.
 */
export default function PlayScreen() {
  // --- UI State ---
  const [elapsedTime, setElapsedTime] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // --- Styling ---
  const timerColor = useThemeColor({}, 'tint');

  // --- Controller ---
  const controller = new PlayScreenController();

  // --- Effects ---
  useEffect(() => {
    // Initialize state from controller on component mount
    setIsRunning(controller.isRunning());
    setClicks(controller.getClicks());
    setElapsedTime(controller.getElapsedTimeMs());
    console.log("PlayScreen: useEffect (initial state) - isRunning:", isRunning, "clicks:", clicks, "elapsedTime:", elapsedTime); // ADDED LOG
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Subscribe to time updates from the controller
    const updateTime = (elapsedTimeMs: number) => {
      setElapsedTime(elapsedTimeMs);
      console.log("PlayScreen: updateTime callback - elapsedTimeMs:", elapsedTimeMs); // ADDED LOG
    };
    controller.onElapsedTimeUpdate(updateTime);
    console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - callback set"); // ADDED LOG


    // Start the timer when the screen loads (FR-PLAY-3)
    controller.startTimer();
    setIsRunning(controller.isRunning());
    console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - timer started, isRunning:", isRunning); // ADDED LOG


    // Cleanup on unmount: clear time update callback and pause timer
    return () => {
      controller.clearElapsedTimeUpdateCallback();
      controller.pauseTimer();
      setIsRunning(controller.isRunning());
      console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - cleanup - callback cleared, timer paused, isRunning:", isRunning); // ADDED LOG
    };
  }, [controller]); // Dependency on controller ensures effect re-runs if controller instance changes (unlikely in this setup)

  useEffect(() => {
    setIsRunning(controller.isRunning());
    console.log("PlayScreen: useEffect (isRunning update) - isRunning:", isRunning); // ADDED LOG
  }, [controller.isRunning()]);


  // --- Event Handlers ---
  const handleIncrementClick = () => {
    console.log("PlayScreen: handleIncrementClick() called"); // ADDED LOG
    controller.incrementClicks();
    const updatedClicks = controller.getClicks();
    setClicks(updatedClicks); // Update local clicks state to reflect changes
    console.log("PlayScreen: handleIncrementClick() - clicks updated to:", updatedClicks); // ADDED LOG
  };

  const handleStartPause = () => {
    console.log("PlayScreen: handleStartPause() called - isRunning before toggle:", isRunning); // ADDED LOG
    if (controller.isRunning()) {
      controller.pauseTimer();
    } else {
      controller.startTimer();
    }
    const updatedIsRunning = controller.isRunning();
    setIsRunning(updatedIsRunning); // Update local isRunning state to reflect changes
    console.log("PlayScreen: handleStartPause() - isRunning after toggle:", updatedIsRunning); // ADDED LOG
  };

  const handleReset = () => {
    console.log("PlayScreen: handleReset() called"); // ADDED LOG
    controller.resetSession();
    setIsRunning(controller.isRunning()); // Update local isRunning state
    setElapsedTime(0); // Explicitly set elapsed time to 0 on reset
    setClicks(0); // Explicitly set clicks to 0 on reset
    console.log("PlayScreen: handleReset() - session reset, isRunning:", isRunning, "elapsedTime:", 0, "clicks:", 0); // ADDED LOG
  };

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Top Module: Performance Metrics Display */}
      <View style={styles.topModuleContainer}>
        <View style={styles.metricContainer}>
          <ThemedText style={styles.metricValue} type="title">
            {clicks} {/* Total Units */}
          </ThemedText>
          <ThemedText style={styles.metricLabel}>Total Units</ThemedText>
        </View>

        <View style={styles.metricContainer}>
          <ThemedText style={styles.metricValue} type="title">
            {formatTime(elapsedTime)} {/* Stopwatch */}
          </ThemedText>
          <ThemedText style={styles.metricLabel}>Stopwatch</ThemedText>
        </View>

        <View style={styles.metricContainer}>
          <ThemedText style={styles.metricValue} type="title">
            {(clicks / (elapsedTime / 60000)).toFixed(2)} {/* UPM */}
          </ThemedText>
          <ThemedText style={styles.metricLabel}>UPM</ThemedText>
        </View>
      </View>

      {/* Middle Module: Work Unit Input */}
      <TouchableOpacity
        style={styles.clickButton}
        onPress={handleIncrementClick}
        accessibilityLabel="Click to increment work units"
      >
        <Text style={styles.clickButtonText}>Click!</Text> {/* FR-PLAY-4: Click Button */}
      </TouchableOpacity>

      {/* Bottom Module: Timer Control */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleStartPause}
          accessibilityLabel={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          <Text style={styles.actionButtonText}>
            {isRunning ? 'Pause' : 'Start'} {/* FR-PLAY-7: Play/Pause Button */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          accessibilityLabel="Reset Session"
        >
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around', // Changed to space-around for better vertical distribution - IMPORTANT
  },
  topModuleContainer: {
    flexDirection: 'row', // Arrange metrics horizontally
    justifyContent: 'space-around', // Distribute space evenly between metrics
    marginBottom: 60, // Increased marginBottom to push buttons down - IMPORTANT
    marginTop: 20, // Added marginTop to give space from top edge - IMPORTANT
  },
  metricContainer: {
    alignItems: 'center', // Center content within each metric container
  },
  metricValue: {
    fontSize: 40, // Slightly smaller title font for metrics
    fontWeight: 'bold',
    lineHeight: 40,
    textAlign: 'center', // Center align the metric value
  },
  metricLabel: {
    fontSize: 16,
    textAlign: 'center', // Center align the metric label
    color: '#687076', // Example label color
  },
  timerContainer: { // Removed - no longer directly used
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: { // Removed - no longer directly used
    fontSize: 64,
    fontWeight: 'bold',
  },
  unitsPerMinuteText: { // Removed - no longer directly used
    fontSize: 20,
    marginTop: 8,
  },
  clickButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 40, // Further increased vertical padding for click button
    paddingHorizontal: 80, // Further increased horizontal padding for click button
    borderRadius: 20, // Further increased borderRadius for click button
    marginBottom: 30, // Reduced marginBottom slightly
    alignSelf: 'center', // Center the click button horizontally
  },
  clickButtonText: {
    color: '#fff',
    fontSize: 36, // Further increased font size for click button
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text in the click button
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute space evenly between control buttons
    marginBottom: 20,
    marginTop: 30, // Added marginTop to separate from click button - IMPORTANT
  },
  actionButton: {
    backgroundColor: '#687076',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    flex: 1, // Allow buttons to take equal width
    marginHorizontal: 5, // Add a little horizontal margin between buttons
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text in action buttons
  },
  resetButton: {
    backgroundColor: '#cc3333',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    flex: 1, // Allow buttons to take equal width
    marginHorizontal: 5, // Add a little horizontal margin between buttons
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text in reset button
  },
});
