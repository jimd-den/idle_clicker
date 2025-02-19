import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TimerControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, onStartPause, onReset }: TimerControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={onStartPause}
        accessibilityLabel={isRunning ? 'Pause Timer' : 'Start Timer'}
      >
        <Text style={styles.actionButtonText}>
          {isRunning ? 'Pause' : 'Start'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.resetButton}
        onPress={onReset}
        accessibilityLabel="Reset Session"
      >
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 30,
  },
  actionButton: {
    backgroundColor: '#687076',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#cc3333',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
