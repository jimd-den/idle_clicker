import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PlayScreenController } from '@/presentation/controllers/PlayScreenController';
import { formatTime } from '@/utils/timeUtils'; // Import formatTime
import { WorkSession } from '@/domain/entities/WorkSession'; // Import WorkSession
import { MetricsDisplay } from '@/components/MetricsDisplay'; // Import MetricsDisplay
import { TimerControls } from '@/components/TimerControls';   // Import TimerControls
import { useWorkSession } from '@/contexts/WorkSessionContext'; // Import useWorkSession Hook


/**
 * Presentation Layer - UI (React Component)
 *
 * PlayScreen: Implements the main screen of the Non-Idle Clicker app.
 * It creates and manages the WorkSession and PlayScreenController instances,
 * ensuring their persistence across re-renders.
 */
export default function PlayScreen() {
  // --- UI State ---
  const [elapsedTime, setElapsedTime] = useState(0); // Milliseconds elapsed - updates frequently
  const [displayTime, setDisplayTime] = useState("00:00"); // Formatted time for display - updates every second
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [upm, setUpm] = useState(0); // State for UPM

  // --- Styling ---
  const timerColor = useThemeColor({}, 'tint');

  // --- Domain Entity Instance ---
  // Get WorkSession instance from context
  const workSession = useWorkSession();

  // --- Controller ---
  // Create PlayScreenController only once using useState initializer function, passing persistent workSession instance
  const [controller] = useState(() => new PlayScreenController(workSession)); // Pass workSession to controller

  // --- Effects ---
  useEffect(() => {
    // Initialize state from controller on component mount
    const initialIsRunning = controller.isRunning();
    const initialClicks = controller.getClicks();
    const initialElapsedTime = controller.getElapsedTimeMs();

    setIsRunning(initialIsRunning);
    setClicks(initialClicks);
    setElapsedTime(initialElapsedTime);
    setDisplayTime(formatTime(initialElapsedTime)); // Format initial elapsed time


    console.log("PlayScreen: useEffect (initial state) - isRunning:", initialIsRunning, "clicks:", initialClicks, "elapsedTime:", initialElapsedTime, "upm:", upm);
  }, [controller]); // Dependency on controller (stable instance)


  useEffect(() => {
    // Subscribe to time updates from the controller (millisecond updates)
    const updateTime = (elapsedTimeMs: number) => {
      setElapsedTime(elapsedTimeMs);
      // UPM is updated via separate callback now, only elapsedTime is updated here
      console.log("PlayScreen: updateTime callback - elapsedTimeMs:", elapsedTimeMs);
    };
    controller.onElapsedTimeUpdate(updateTime);
    console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - callback set");

    // Subscribe to UPM updates from the controller (millisecond updates - as fast as possible)
    const updateUPM = (currentUPM: number) => {
      setUpm(currentUPM); // Update UPM state from controller callback
      console.log("PlayScreen: updateUPM callback - upm:", currentUPM);
    };
    controller.onUPMUpdate(updateUPM);
    console.log("PlayScreen: useEffect (onUPMUpdate) - UPM callback set");


    // Cleanup on unmount: clear time update callbacks and pause timer
    return () => {
      controller.clearElapsedTimeUpdateCallback();
      controller.clearUPMUpdateCallback(); // Clear UPM callback as well
      controller.pauseTimer();
      setIsRunning(controller.isRunning());
      console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - cleanup - callback cleared, timer paused, isRunning:", isRunning);
    };
  }, [controller]); // Dependency on controller (stable instance)

  useEffect(() => {
    // Update displayTime every second based on elapsedTime
    const intervalId = setInterval(() => {
      setDisplayTime(formatTime(elapsedTime)); // Format and set displayTime (second updates)
    }, 1000); // Update every 1 second - CORRECT INTERVAL

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [elapsedTime]); // Update displayTime when elapsedTime changes


  // --- Event Handlers ---
  const handleIncrementClick = () => {
    console.log("PlayScreen: handleIncrementClick() called");
    controller.incrementClicks((updatedClicks) => { // Pass callback to controller
      setClicks(updatedClicks); // Update clicks state using callback
      console.log("PlayScreen: handleIncrementClick() - clicks updated to:", updatedClicks);
    });
  };

  const handleStartPause = () => {
    console.log("PlayScreen: handleStartPause() called - isRunning before toggle:", isRunning);
    let updatedIsRunning: boolean;
    if (isRunning) {
      updatedIsRunning = controller.pauseTimer(); // Use controller to pause and get isRunning status
    } else {
      updatedIsRunning = controller.startTimer(); // Use controller to start and get isRunning status
    }
    setIsRunning(updatedIsRunning); // Update local isRunning state based on controller status
    console.log("PlayScreen: handleStartPause() - isRunning after toggle:", updatedIsRunning);
  };


  const handleReset = () => {
    console.log("PlayScreen: handleReset() called");
    const updatedIsRunning = controller.resetSession(); // Get updatedIsRunning from resetSession
    setIsRunning(updatedIsRunning); // Update local isRunning state
    setElapsedTime(0); // Explicitly set elapsed time to 0 on reset
    setDisplayTime("00:00"); // Reset displayTime to 00:00 on reset
    setClicks(0); // Explicitly set clicks to 0 on reset
    setUpm(0); // Reset UPM to 0 on reset
    console.log("PlayScreen: handleReset() - session reset, isRunning:", isRunning, "elapsedTime:", 0, "clicks:", 0, "upm:", 0);
  };

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Top Module: Performance Metrics Display */}
      <MetricsDisplay clicks={clicks} elapsedTime={displayTime} upm={upm} /> {/* Use displayTime for Stopwatch */}

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
