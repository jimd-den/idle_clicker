import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native'; // Import TextInput, FlatList

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PlayScreenController } from '@/presentation/controllers/PlayScreenController';
import { formatTime } from '@/utils/timeUtils';
import { WorkSession } from '@/domain/entities/WorkSession';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { TimerControls } from '@/components/TimerControls';
import { useWorkSession } from '@/contexts/WorkSessionContext';
import { useWorkTimerService } from '@/contexts/WorkSessionContext'; // Import useWorkTimerService
import { MetricsUpdate } from '@/application/services/WorkTimerService'; // Import MetricsUpdate interface


/**
 * Presentation Layer - UI (React Component)
 * PlayScreen: Implements the main screen of the Non-Idle Clicker app.
 * ... (rest of the component description)
 */
export default function PlayScreen() {
  // --- UI State ---
  // REMOVE individual state variables - using metrics state now
  // const [elapsedTime, setElapsedTime] = useState(0);
  // const [clicks, setClicks] = useState(0);
  // const [isRunning, setIsRunning] = useState(false);
  // const [upm, setUpm] = useState(0);
  const [metrics, setMetrics] = useState<MetricsUpdate>({ // ADD metrics state
    elapsedTimeMs: 0,
    upm: 0,
    isRunning: false,
    clicks: 0
  });
  const [noteText, setNoteText] = useState(''); // State for note input
  const [notes, setNotes] = useState<Array<{ timestamp: string, text: string }>>([]); // State for notes array


  // --- Styling ---
  const timerColor = useThemeColor({}, 'tint');

  // --- Domain Entity Instance ---
  const workSession = useWorkSession();
  const workTimerService = useWorkTimerService(); // Get WorkTimerService from context

  // --- Controller ---
  // Changed to useCallback to ensure controller is recreated when dependencies change (workSession, workTimerService)
  const controller = useCallback(() => {
    return new PlayScreenController(workSession, workTimerService);
  }, [workSession, workTimerService]);

  // useRef to hold the controller instance, now updated on each render if controller factory changes
  const controllerRef = useRef<PlayScreenController | null>(null);


  // --- Effects ---
  useEffect(() => {
    // Re-create controller instance on each render if the factory function changes
    controllerRef.current = controller();
  }, [controller]);


  useEffect(() => {
    // Initialize state from controller on component mount and when controller instance changes
    if (controllerRef.current) { // Check if controller is defined
      const currentController = controllerRef.current;
      const initialIsRunning = currentController.isRunning();
      const initialClicks = currentController.getClicks();
      const initialElapsedTime = currentController.getElapsedTimeMs();
      const initialUpm = 0; // UPM is calculated, initialize to 0

      setMetrics({ // Initialize metrics state
        isRunning: initialIsRunning,
        clicks: initialClicks,
        elapsedTimeMs: initialElapsedTime,
        upm: initialUpm
      });

      console.log("PlayScreen: useEffect (initial state) - metrics:", metrics);
    } else {
      console.log("PlayScreen: useEffect (initial state) - controller is undefined!");
    }
  }, [controllerRef, controller]); // Depend on controller and controllerRef


  useEffect(() => {
    // Subscribe to metrics updates from controller
    if (controllerRef.current) { // Check if controller is defined
      const currentController = controllerRef.current;
      const updateMetrics = (updatedMetrics: MetricsUpdate) => { // Update callback to handle MetricsUpdate
        setMetrics(updatedMetrics); // Update metrics state directly
        console.log("PlayScreen: updateMetrics callback - metrics:", updatedMetrics);
      };
      currentController.onMetricsUpdate(updateMetrics); // Subscribe to combined metrics update
      console.log("PlayScreen: useEffect (onMetricsUpdate) - callback set");


      // Cleanup on unmount
      return () => {
        if (controllerRef.current) { // Check if controller is defined before cleanup
          const currentController = controllerRef.current;
          currentController.clearMetricsUpdateCallback();
          currentController.pauseTimer(); // Pause timer on unmount as well for consistency
          setMetrics(prevMetrics => ({ ...prevMetrics, isRunning: currentController.isRunning() })); // Update isRunning state on unmount
          console.log("PlayScreen: useEffect (onMetricsUpdate) - cleanup - callbacks cleared, timer paused, isRunning updated");
        } else {
          console.log("PlayScreen: useEffect (onMetricsUpdate) - cleanup - controller is undefined, no cleanup needed.");
        }
      };
    } else {
      console.log("PlayScreen: useEffect (onMetricsUpdate) - controller is undefined, skipping effect.");
    }
  }, [controllerRef]); // Depend on controllerRef


  // --- Event Handlers ---
  const handleIncrementClick = useCallback(() => { // ADD useCallback
    console.log("PlayScreen: handleIncrementClick() called - START"); // ADDED LOG - START
    if (controllerRef.current) {
      const currentController = controllerRef.current;
      currentController.incrementClicks((updatedClicks) => {
        setMetrics(prevMetrics => ({ ...prevMetrics, clicks: updatedClicks })); // Update clicks in metrics state
        console.log("PlayScreen: handleIncrementClick() - clicks updated to:", updatedClicks);
      });
    } else {
      console.log("PlayScreen: handleIncrementClick() - controller is undefined, click increment ignored.");
    }
    console.log("PlayScreen: handleIncrementClick() called - END"); // ADDED LOG - END
  }, [controllerRef]); // ADD controllerRef as dependency

  const handleStartPause = useCallback(() => { // ADD useCallback
    console.log("PlayScreen: handleStartPause() called - isRunning before toggle:", metrics.isRunning); // LOG 1: Before function logic
    let updatedIsRunning: boolean;
    if (metrics.isRunning) {
      console.log("PlayScreen: handleStartPause() - isRunning is true, pausing timer"); // LOG 2: isRunning is true (Pause case)
      updatedIsRunning = controllerRef.current?.pauseTimer() ?? false; // Use optional chaining and nullish fallback
    } else {
      console.log("PlayScreen: handleStartPause() - isRunning is false, starting timer"); // LOG 3: isRunning is false (Start case)
      updatedIsRunning = controllerRef.current?.startTimer() ?? false; // Use optional chaining and nullish fallback
    }
    console.log("PlayScreen: handleStartPause() - controller method returned:", updatedIsRunning); // LOG 4: Value returned from controller
    setMetrics(prevMetrics => ({ ...prevMetrics, isRunning: updatedIsRunning })); // Update isRunning in metrics state
    console.log("PlayScreen: handleStartPause() - isRunning after setIsRunning:", metrics.isRunning); // LOG 5: isRunning after state update
  }, [metrics.isRunning, controllerRef]); // ADD isRunning and controllerRef as dependencies

  const handleReset = useCallback(() => { // ADD useCallback
    console.log("PlayScreen: handleReset() called");
    const resetMetrics = controllerRef.current?.resetSession(); // Get reset metrics from controller
    if (resetMetrics) {
      setMetrics(resetMetrics); // Update metrics state with reset values
      console.log("PlayScreen: handleReset() - metrics state updated with reset values:", resetMetrics);
    } else {
      console.log("PlayScreen: handleReset() - resetMetrics is undefined, reset failed in controller?");
    }
    setNotes([]); // Clear notes on reset
    console.log("PlayScreen: handleReset() - notes cleared");
  }, [controllerRef]); // ADD controllerRef as dependency

  const handleAddNote = useCallback(() => { // ADD useCallback
    if (noteText.trim() !== '') {
      const timestamp = formatTime(metrics.elapsedTimeMs); // Use elapsedTime from metrics state
      const newNote = { timestamp, text: noteText };
      setNotes([...notes, newNote]);
      setNoteText(''); // Clear input after adding note
      console.log("PlayScreen: handleAddNote() - note added:", newNote);
    }
  }, [noteText, metrics.elapsedTimeMs, setNotes]); // ADD dependencies


  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Top Module: Performance Metrics Display */}
      <MetricsDisplay clicks={metrics.clicks} elapsedTimeMs={metrics.elapsedTimeMs} upm={metrics.upm} /> {/* Pass metrics from state */}

      {/* Middle Module: Work Unit Input */}
      <TouchableOpacity
        style={[styles.clickButton, !metrics.isRunning ? styles.clickButtonDisabled : {}]} // Use isRunning from metrics state
        onPress={handleIncrementClick}
        accessibilityLabel="Click to increment work units"
        disabled={!metrics.isRunning} // Disable button when not running - use isRunning from metrics state
      >
        {/* Re-wrap "Click!" in ThemedText just to be sure */}
        <ThemedText style={styles.clickButtonText}>Click!</ThemedText>
      </TouchableOpacity>

      {/* Bottom Module: Timer Control and Notes */}
      <View style={styles.bottomModuleContainer}>
        <TimerControls
          isRunning={metrics.isRunning} // Use isRunning from metrics state
          onStartPause={handleStartPause}
          onReset={handleReset} // Pass handleReset - which now updates metrics state
        />

        {/* Note Input */}
        <View style={styles.noteInputContainer}>
          <TextInput
            style={styles.noteTextInput}
            placeholder="Enter note"
            value={noteText}
            onChangeText={setNoteText}
            editable={!metrics.isRunning} // Disable input when timer is running - use isRunning from metrics state
            multiline // Allow multiline notes
          />
          <TouchableOpacity
            style={[styles.addButton, metrics.isRunning ? styles.addButtonDisabled : {}]} // Disable when running - use isRunning from metrics state
            onPress={handleAddNote}
            disabled={metrics.isRunning} // Disable button when timer is running - use isRunning from metrics state
            accessibilityLabel="Add Note"
          >
            <Text style={styles.addButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>

        {/* Notes List */}
        <FlatList
          data={notes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <ThemedText style={styles.noteTimestamp}>{item.timestamp}</ThemedText>
              <ThemedText style={styles.noteText}>{item.text}</ThemedText>
            </View>
          )}
          ListEmptyComponent={() => (
            <ThemedText style={styles.emptyNotes}>No notes yet. Pause timer to add notes.</ThemedText>
          )}
        />
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-around',
  },
  clickButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 40,
    paddingHorizontal: 80,
    borderRadius: 20,
    marginBottom: 30,
    alignSelf: 'center',
    paddingVertical: 35, // Reduced paddingVertical slightly
  },
  clickButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clickButtonDisabled: {
    backgroundColor: 'gray', // Style for disabled button
  },
  bottomModuleContainer: {
    marginBottom: 20,
  },
  noteInputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center', // Align items vertically in the center
  },
  noteTextInput: {
    flex: 1, // Take up most of the width
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10, // Space between input and button
    backgroundColor: '#fff', // Ensure background color for input
    color: '#000', // Ensure text color for input
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonDisabled: {
    backgroundColor: 'gray', // Style for disabled button
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 16,
  },
  emptyNotes: {
    textAlign: 'center',
    color: '#777',
    paddingVertical: 10,
  },

});
