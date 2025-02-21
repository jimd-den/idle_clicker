import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';
import { commonStyles } from '@/styles/commonStyles';

interface TimerControlsProps {
  isRunning: boolean;
  onStartPause: () => void;
  onReset: () => void;
}

export function TimerControls({ isRunning, onStartPause, onReset }: TimerControlsProps) {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity 
        style={[commonStyles.controlButton, isRunning && commonStyles.controlButtonDisabled]} 
        onPress={onReset} 
        accessibilityRole="button"
        accessibilityLabel="Reset Timer"
        accessibilityState={{ disabled: isRunning }}
        disabled={isRunning}
      >
        <IconSymbol name="arrow.counterclockwise" size={28} color={isRunning ? "#666" : "#fff"} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[commonStyles.controlButton, commonStyles.playPauseButton]} 
        onPress={onStartPause}
        accessibilityRole="button"
        accessibilityLabel={isRunning ? "Pause Timer" : "Start Timer"}
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
});
