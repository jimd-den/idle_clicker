import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { MetricsUpdate } from '@/application/services/WorkTimerService'; // Import MetricsUpdate

interface TimerControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => MetricsUpdate; // Modified onReset to return MetricsUpdate
}

export function TimerControls({ isRunning, onStartPause, onReset }: TimerControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.controlButton} onPress={onReset} accessibilityLabel="Reset Timer">
        <IconSymbol name="reset" size={24} color="#fff" />
        <ThemedText style={styles.controlButtonText}>Reset</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.controlButton} onPress={onStartPause} accessibilityLabel={isRunning ? "Pause Timer" : "Start Timer"}>
        <IconSymbol name={isRunning ? "pause" : "play"} size={24} color="#fff" />
        <ThemedText style={styles.controlButtonText}>{isRunning ? 'Pause' : 'Start'}</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    marginLeft: 8,
  },
});
