import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface TimerControlsProps {
  isRunning: boolean;
  disabled?: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, onStartPause, onReset, disabled }: TimerControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity 
        style={[styles.controlButton, disabled && styles.controlButtonDisabled]} 
        onPress={onReset} 
        accessibilityRole="button"
        accessibilityLabel="Reset Timer"
        accessibilityState={{ disabled: isRunning }}
        disabled={disabled}
      >
        <IconSymbol name="arrow.counterclockwise" size={28} color={isRunning ? "#666" : "#fff"} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.controlButton, styles.playPauseButton, disabled && styles.controlButtonDisabled]} 
        onPress={onStartPause}
        accessibilityRole="button"
        accessibilityLabel={isRunning ? "Pause Timer" : "Start Timer"}
        disabled={disabled}
      >
        <IconSymbol 
          name={isRunning ? "pause.circle.fill" : "play.circle.fill"} 
          size={48} 
          color="#fff" 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 24,
  },
  controlButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    backgroundColor: '#2c3e50',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
});
