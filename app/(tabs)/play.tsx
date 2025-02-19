import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { PlayScreenController } from '@/presentation/controllers/PlayScreenController';
import { formatTime } from '@/utils/timeUtils'; // Assuming formatTime is still useful

export default function PlayScreen() {
  // Presentation Layer - UI (React Component)

  const [elapsedTime, setElapsedTime] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // Track running state in UI

  const timerColor = useThemeColor({}, 'tint');
  const controller = new PlayScreenController(); // Instantiate the controller

  useEffect(() => {
    const updateTime = (elapsedTimeMs: number) => {
      setElapsedTime(elapsedTimeMs);
    };

    controller.onElapsedTimeUpdate(updateTime); // Set up callback for time updates

    return () => {
      controller.clearElapsedTimeUpdateCallback(); // Cleanup on unmount
    };
  }, [controller]);

  useEffect(() => {
    setIsRunning(controller.isRunning()); // Initialize isRunning from controller
    setClicks(controller.getClicks()); // Initialize clicks from controller
    setElapsedTime(controller.getElapsedTimeMs()); // Initialize elapsed time from controller
  }, []);


  const handleStartPause = () => {
    if (controller.isRunning()) {
      controller.pauseTimer();
    } else {
      controller.startTimer();
    }
    setIsRunning(controller.isRunning()); // Update local isRunning state
  };

  const handleIncrementClick = () => {
    controller.incrementClicks();
    setClicks(controller.getClicks()); // Update local clicks state
  };

  const handleReset = () => {
    controller.resetSession();
    setIsRunning(controller.isRunning()); // Update local isRunning state
    setElapsedTime(controller.getElapsedTimeMs()); // Update local elapsed time state
    setClicks(controller.getClicks()); // Update local clicks state
  };


  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <ThemedText style={[styles.timerText, { color: timerColor }]} type="title">
          {formatTime(elapsedTime)}
        </ThemedText>
        <ThemedText>Units per minute: {(clicks / (elapsedTime / 60000)).toFixed(2)}</ThemedText>
      </View>

      <TouchableOpacity style={styles.clickButton} onPress={handleIncrementClick}>
        <Text style={styles.clickButtonText}>Click!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleStartPause}>
        <Text style={styles.actionButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  timerContainer: {
    alignItems: 'center',
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
    backgroundColor: '#cc3333', // Example reset button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
