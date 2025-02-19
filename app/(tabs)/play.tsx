import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native'; // Import TextInput, FlatList

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PlayScreenController } from '@/presentation/controllers/PlayScreenController';
import { formatTime } from '@/utils/timeUtils';
import { WorkSession } from '@/domain/entities/WorkSession';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { TimerControls } from '@/components/TimerControls';
import { useWorkSession } from '@/contexts/WorkSessionContext';

/**
 * Presentation Layer - UI (React Component)
 * PlayScreen: Implements the main screen of the Non-Idle Clicker app.
 * ... (rest of the component description)
 */
export default function PlayScreen() {
  // --- UI State ---
  const [elapsedTime, setElapsedTime] = useState(0); // Milliseconds elapsed - updates frequently
  // const [displayTime, setDisplayTime] = useState("00:00"); // REMOVE displayTime state from PlayScreen
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [upm, setUpm] = useState(0);
  const [noteText, setNoteText] = useState(''); // State for note input
  const [notes, setNotes] = useState<Array<{ timestamp: string, text: string }>>([]); // State for notes array


  // --- Styling ---
  const timerColor = useThemeColor({}, 'tint');

  // --- Domain Entity Instance ---
  const workSession = useWorkSession();

  // --- Controller ---
  const [controller] = useState(() => new PlayScreenController(workSession));

  // --- Effects ---
  useEffect(() => {
    // Initialize state from controller on component mount
    const initialIsRunning = controller.isRunning();
    const initialClicks = controller.getClicks();
    const initialElapsedTime = controller.getElapsedTimeMs();

    setIsRunning(initialIsRunning);
    setClicks(initialClicks);
    setElapsedTime(initialElapsedTime);
    // setDisplayTime(formatTime(initialElapsedTime)); // REMOVE displayTime initialization from PlayScreen

    console.log("PlayScreen: useEffect (initial state) - isRunning:", initialIsRunning, "clicks:", initialClicks, "elapsedTime:", initialElapsedTime, "upm:", upm);
  }, [controller]);

  useEffect(() => {
    // Subscribe to time updates from controller
    const updateTime = (elapsedTimeMs: number) => {
      setElapsedTime(elapsedTimeMs);
      console.log("PlayScreen: updateTime callback - elapsedTimeMs:", elapsedTimeMs);
    };
    controller.onElapsedTimeUpdate(updateTime);
    console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - callback set");

    // Subscribe to UPM updates from controller
    const updateUPM = (currentUPM: number) => {
      setUpm(currentUPM);
      console.log("PlayScreen: updateUPM callback - upm:", currentUPM);
    };
    controller.onUPMUpdate(updateUPM);
    console.log("PlayScreen: useEffect (onUPMUpdate) - UPM callback set");


    // Cleanup on unmount
    return () => {
      controller.clearElapsedTimeUpdateCallback();
      controller.clearUPMUpdateCallback();
      controller.pauseTimer();
      setIsRunning(controller.isRunning());
      console.log("PlayScreen: useEffect (onElapsedTimeUpdate) - cleanup - callbacks cleared, timer paused, isRunning:", isRunning);
    };
  }, [controller]);

  // REMOVE useEffect for displayTime from PlayScreen
  // useEffect(() => {
  //   // Update displayTime every second
  //   const intervalId = setInterval(() => {
  //     setDisplayTime(formatTime(elapsedTime));
  //     console.log("PlayScreen: displayTime interval - updating displayTime - Elapsed Time:", elapsedTime); // ADDED LOG - ELAPSED TIME
  //   }, 1000); // Update every 1 second - ENSURING 1000ms INTERVAL

  //   return () => {
  //     clearInterval(intervalId);
  //     console.log("PlayScreen: displayTime interval - cleared"); // ADDED LOG
  //   };
  // }, [elapsedTime]);


  // --- Event Handlers ---
  const handleIncrementClick = () => {
    console.log("PlayScreen: handleIncrementClick() called - START"); // ADDED LOG - START
    controller.incrementClicks((updatedClicks) => {
      setClicks(updatedClicks);
      console.log("PlayScreen: handleIncrementClick() - clicks updated to:", updatedClicks);
    });
    console.log("PlayScreen: handleIncrementClick() called - END"); // ADDED LOG - END
  };

  const handleStartPause = () => {
    console.log("PlayScreen: handleStartPause() called - isRunning before toggle:", isRunning);
    let updatedIsRunning: boolean;
    if (isRunning) {
      console.log("PlayScreen: handleStartPause() - isRunning is true, pausing timer"); // ADDED LOG
      updatedIsRunning = controller.pauseTimer(); // Use controller to pause and get isRunning status
      console.log("PlayScreen: handleStartPause() - controller.pauseTimer() returned:", updatedIsRunning); // ADDED LOG
    } else {
      console.log("PlayScreen: handleStartPause() - isRunning is false, starting timer"); // ADDED LOG
      updatedIsRunning = controller.startTimer(); // Use controller to start and get isRunning status
      console.log("PlayScreen: handleStartPause() - controller.startTimer() returned:", updatedIsRunning); // ADDED LOG
    }
    setIsRunning(updatedIsRunning); // Update local isRunning state based on controller status - NOW USING RETURNED VALUE
    console.log("PlayScreen: handleStartPause() - isRunning after toggle:", isRunning); // LOGGING isRunning AFTER state update
  };

  const handleReset = () => {
    console.log("PlayScreen: handleReset() called");
    const updatedIsRunning = controller.resetSession();
    setIsRunning(updatedIsRunning);
    setElapsedTime(0);
    // setDisplayTime("00:00"); // REMOVE displayTime reset from PlayScreen
    setClicks(0);
    setUpm(0);
    setNotes([]); // Clear notes on reset
    console.log("PlayScreen: handleReset() - session reset, isRunning:", isRunning, "elapsedTime:", 0, "clicks:", 0, "upm:", 0, "notes cleared");
  };

  const handleAddNote = () => {
    if (noteText.trim() !== '') {
      const timestamp = formatTime(elapsedTime);
      const newNote = { timestamp, text: noteText };
      setNotes([...notes, newNote]);
      setNoteText(''); // Clear input after adding note
      console.log("PlayScreen: handleAddNote() - note added:", newNote);
    }
  };


  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Top Module: Performance Metrics Display */}
      <MetricsDisplay clicks={clicks} elapsedTimeMs={elapsedTime} upm={upm} /> {/* Pass elapsedTimeMs */}

      {/* Middle Module: Work Unit Input */}
      <TouchableOpacity
        style={styles.clickButton}
        onPress={handleIncrementClick}
        accessibilityLabel="Click to increment work units"
      >
        <Text style={styles.clickButtonText}>Click!</Text>
      </TouchableOpacity>

      {/* Bottom Module: Timer Control and Notes */}
      <View style={styles.bottomModuleContainer}>
        <TimerControls
          isRunning={isRunning}
          onStartPause={handleStartPause}
          onReset={handleReset}
        />

        {/* Note Input */}
        <View style={styles.noteInputContainer}>
          <TextInput
            style={styles.noteTextInput}
            placeholder="Enter note"
            value={noteText}
            onChangeText={setNoteText}
            editable={!isRunning} // Disable input when timer is running
            multiline // Allow multiline notes
          />
          <TouchableOpacity
            style={[styles.addButton, isRunning ? styles.addButtonDisabled : {}]} // Disable when running
            onPress={handleAddNote}
            disabled={isRunning} // Disable button when timer is running
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
  },
  clickButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
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
