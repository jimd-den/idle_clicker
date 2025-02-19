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
  }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    // Subscribe to time updates from the controller
    const updateTime = (elapsedTimeMs: number) => {
      setElapsedTime(elapsedTimeMs);
    };
    controller.onElapsedTimeUpdate(updateTime);

    // Start the timer when the screen loads (FR-PLAY-3)
    controller.startTimer();
    setIsRunning(controller.isRunning());

    // Cleanup on unmount: clear time update callback and pause timer
    return () => {
      controller.clearElapsedTimeUpdateCallback();
      controller.pauseTimer();
      setIsRunning(controller.isRunning());
    };
  }, [controller]); // Dependency on controller ensures effect re-runs if controller instance changes (unlikely in this setup)

  useEffect(() => {
    setIsRunning(controller.isRunning());
  }, [controller.isRunning()]);


  // --- Event Handlers ---
  const handleIncrementClick = () => {
    controller.incrementClicks();
    setClicks(controller.getClicks()); // Update local clicks state to reflect changes
  };

  const handleStartPause = () => {
    if (controller.isRunning()) {
      controller.pauseTimer();
    } else {
      controller.startTimer();
    }
    setIsRunning(controller.isRunning()); // Update local isRunning state to reflect changes
  };

  const handleReset = () => {
    controller.resetSession();
    setIsRunning(controller.isRunning()); // Update local isRunning state
    setElapsedTime(controller.getElapsedTimeMs()); // Update local elapsed time state
    setClicks(controller.getClicks()); // Update local clicks state
  };

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Top Module: Performance Metrics Display */}
      <View style={styles.timerContainer}>
        <ThemedText style={[styles.timerText, { color: timerColor }]} type="title">
          {formatTime(elapsedTime)} {/* FR-PLAY-2: Stopwatch Display */}
        </ThemedText>
        <ThemedText>
          Units per minute:{' '}
          {(clicks / (elapsedTime / 60000)).toFixed(2)} {/* FR-PLAY-1: CPM Display */}
        </ThemedText>
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
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  clickButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  clickButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#687076',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#cc3333',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
