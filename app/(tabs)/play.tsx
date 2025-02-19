import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PlayScreenController } from '@/presentation/controllers/PlayScreenController';
import { WorkSession } from '@/domain/entities/WorkSession'; // Import WorkSession
import { MetricsDisplay } from '@/components/MetricsDisplay'; // Import MetricsDisplay
import { TimerControls } from '@/components/TimerControls';   // Import TimerControls


/**
 * Presentation Layer - UI (React Component)
 *
 * PlayScreen: Implements the main screen of the Non-Idle Clicker app.
 * It creates and manages the WorkSession and PlayScreenController instances,
 * ensuring their persistence across re-renders.
 */
export default function PlayScreen() {
  // --- UI State ---
  const [elapsedTime, setElapsedTime] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [upm, setUpm] = useState(0); // State for UPM

  // --- Styling ---
  const timerColor = useThemeColor({}, 'tint');

  // --- Domain Entity Instance ---
  // Create WorkSession instance using useRef to ensure persistence across re-renders
  const workSessionRef = useRef<WorkSession | null>(null);
  if (!workSessionRef.current) {
    workSessionRef.current = new WorkSession();
  }
  const workSession = workSessionRef.current; // Access current WorkSession instance

  // --- Controller ---
  // Create PlayScreenController only once using useState initializer function, passing persistent workSession instance
  const [controller] = useState(() => new PlayScreenController(workSession)); // Pass workSession to controller

  // --- Effects ---
  useEffect(() => {
    // Initialize state from controller on component mount
    setIsRunning(controller.isRunning());
    setClicks(controller.getClicks());
    setElapsedTime(controller.getElapsedTimeMs());
    console.log("PlayScreen: useEffect (initial state) - isRunning:", isRunning, "clicks:", clicks, "elapsedTime:", elapsedTime);
  }, [controller]); // Dependency on controller (stable instance)

  useEffect(() => {
    // Subscribe to time updates from the controller
    const updateTime = (elapsedTimeMs: number) => {
      setElapsedTime(elapsedTimeMs);
      // Recalculate UPM and set state directly in updateTime callback
      if (elapsedTimeMs > 0) {
        setUpm(clicks / (elapsedTimeMs / 60000));
      } else {
        setUpm(0);
      }
      console.log("PlayScreen: updateTime callback - elapsedTimeMs:", elapsedTimeMs);
    };
    controller.onElapsedTimeUpdate(updateTime);
    console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - callback set");

    // Start the timer when the screen loads (FR-PLAY-3)
    controller.startTimer();
    setIsRunning(controller.isRunning());
    console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - timer started, isRunning:", isRunning);

    // Cleanup on unmount: clear time update callback and pause timer
    return () => {
      controller.clearElapsedTimeUpdateCallback();
      controller.pauseTimer();
      setIsRunning(controller.isRunning());
      console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - cleanup - callback cleared, timer paused, isRunning:", isRunning);
    };
  }, [controller]); // Dependency on controller (stable instance)


  // --- Event Handlers ---
  const handleIncrementClick = () => {
    console.log("PlayScreen: handleIncrementClick() called");
    controller.incrementClicks((updatedClicks) => { // Pass callback to controller
      setClicks(updatedClicks); // Update clicks state using callback
      // Recalculate UPM and set state directly after click update
      if (elapsedTime > 0) {
        setUpm(updatedClicks / (elapsedTime / 60000));
      } else {
        setUpm(0);
      }
      console.log("PlayScreen: handleIncrementClick() - clicks updated to:", updatedClicks);
    });
  };

  const handleStartPause = () => {
    console.log("PlayScreen: handleStartPause() called - isRunning before toggle:", isRunning);
    let updatedIsRunning: boolean;
    if (controller.isRunning()) {
      updatedIsRunning = controller.pauseTimer(); // Get updatedIsRunning from pauseTimer
    } else {
      updatedIsRunning = controller.startTimer(); // Get updatedIsRunning from startTimer
    }
    setIsRunning(updatedIsRunning); // Update local isRunning state to reflect changes
    console.log("PlayScreen: handleStartPause() - isRunning after toggle:", updatedIsRunning);
  };

  const handleReset = () => {
    console.log("PlayScreen: handleReset() called");
    const updatedIsRunning = controller.resetSession(); // Get updatedIsRunning from resetSession
    setIsRunning(updatedIsRunning); // Update local isRunning state
    setElapsedTime(0); // Explicitly set elapsed time to 0 on reset
    setClicks(0); // Explicitly set clicks to 0 on reset
    setUpm(0); // Reset UPM to 0 on reset
    console.log("PlayScreen: handleReset() - session reset, isRunning:", isRunning, "elapsedTime:", 0, "clicks:", 0, "upm:", 0);
  };

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Top Module: Performance Metrics Display */}
      <MetricsDisplay clicks={clicks} elapsedTime={elapsedTime} upm={upm} />

      {/* Middle Module: Work Unit Input */}
      <TouchableOpacity
        style={styles.clickButton}
        onPress={handleIncrementClick}
        accessibilityLabel="Click to increment work units"
      >
        <Text style={styles.clickButtonText}>Click!</Text> {/* FR-PLAY-4: Click Button */}
      </TouchableOpacity>

      {/* Bottom Module: Timer Control */}
      <TimerControls
        isRunning={isRunning}
        onStartPause={handleStartPause}
        onReset={handleReset}
      />
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
});
