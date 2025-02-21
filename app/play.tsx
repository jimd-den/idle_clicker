import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PlayScreenController } from '@/presentation/controllers/PlayScreenController';
import { formatTime } from '@/utils/timeUtils';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { TimerControls } from '@/components/TimerControls';
import { useWorkSession } from '@/contexts/WorkSessionContext';
import { useWorkTimerService } from '@/contexts/WorkSessionContext';
import { useSession } from '@/contexts/SessionContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface MetricsUpdate {
  elapsedTimeMs: number;
  upm: number;
  isRunning: boolean;
  clicks: number;
  smoothnessMetrics: {
    consistency: number;
    rhythm: number;
    flowState: number;
    criticalSuccess: number;
    criticalFailure: number;
  };
  rewards: {
    experience: number;
    achievementPoints: number;
    flowBonus: number;
    streakMultiplier: number;
  };
}

export default function PlayScreen() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<MetricsUpdate>({
    elapsedTimeMs: 0,
    upm: 0,
    isRunning: false,
    clicks: 0,
    smoothnessMetrics: {
      consistency: 0,
      rhythm: 0,
      flowState: 0,
      criticalSuccess: 0,
      criticalFailure: 0
    },
    rewards: {
      experience: 0,
      achievementPoints: 0,
      flowBonus: 0,
      streakMultiplier: 0
    }
  });
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Array<{ timestamp: string, text: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  
  const workSession = useWorkSession();
  const workTimerService = useWorkTimerService();
  const { endCurrentSession, addNote } = useSession();

  const controllerRef = useRef<PlayScreenController | null>(null);

  // Initialize controller once
  useEffect(() => {
    controllerRef.current = new PlayScreenController(workSession, workTimerService);
    
    // Initialize metrics and reset session
    const resetMetrics = controllerRef.current.resetSession() as MetricsUpdate;
    setMetrics(resetMetrics);
    setNotes([]);

    // Set up metrics update subscription
    const currentController = controllerRef.current;
    currentController.onMetricsUpdate((updatedMetrics) => {
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        ...updatedMetrics,
        smoothnessMetrics: {
          ...prevMetrics.smoothnessMetrics,
          ...updatedMetrics.smoothnessMetrics
        },
        rewards: {
          ...prevMetrics.rewards,
          ...updatedMetrics.rewards
        }
      }));
    });

    // Cleanup
    return () => {
      if (currentController) {
        currentController.clearMetricsUpdateCallback();
        currentController.pauseTimer();
      }
    };
  }, [workSession, workTimerService]); // Only recreate when core dependencies change

  const handleEndSession = useCallback(async () => {
    if (controllerRef.current) {
      try {
        setError(null);
        // First pause the timer if it's running
        if (metrics.isRunning) {
          controllerRef.current.pauseTimer();
        }
        // End the current session with final metrics
        await endCurrentSession(metrics.clicks, metrics.upm);
        // Navigate back to history screen
        router.replace('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to end session');
      }
    }
  }, [metrics, endCurrentSession, router]);

  // --- Event Handlers ---
  const handleIncrementClick = useCallback(() => {
    if (controllerRef.current && metrics.isRunning) {
      controllerRef.current.incrementClicks((clicks) => 
        setMetrics(prev => ({ ...prev, clicks }))
      );
    }
  }, [metrics.isRunning]);

  const handleStartPause = useCallback(() => {
    if (controllerRef.current) {
      const isRunning = metrics.isRunning;
      const updatedIsRunning = isRunning ? 
        controllerRef.current.pauseTimer() : 
        controllerRef.current.startTimer();
      setMetrics(prev => ({ ...prev, isRunning: updatedIsRunning }));
    }
  }, [metrics.isRunning]);

  const handleReset = useCallback(() => {
    if (controllerRef.current) {
      const resetMetrics = controllerRef.current.resetSession();
      setMetrics(resetMetrics);
      setNotes([]);
    }
  }, []);

  const handleAddNote = useCallback(async () => {
    if (noteText.trim()) {
      try {
        setError(null);
        const timestamp = formatTime(metrics.elapsedTimeMs);
        await addNote({ 
          timestamp: metrics.elapsedTimeMs,
          text: noteText.trim() 
        });
        setNotes(prev => [...prev, { timestamp, text: noteText.trim() }]);
        setNoteText('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add note');
      }
    }
  }, [noteText, metrics.elapsedTimeMs, addNote]);

  // --- Render ---
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {error && (
          <View style={styles.errorContainer}>
            <IconSymbol name="xmark.circle" size={20} color="#e74c3c" />
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        )}

        <View style={styles.metricsContainer}>
          <MetricsDisplay 
            clicks={metrics.clicks} 
            elapsedTimeMs={metrics.elapsedTimeMs} 
            upm={metrics.upm} 
            smoothnessMetrics={metrics.smoothnessMetrics}
            rewards={metrics.rewards}
          />
        </View>

        <View style={styles.mainContent}>
          <TouchableOpacity
            style={[styles.clickButton, !metrics.isRunning && styles.clickButtonDisabled]}
            onPress={handleIncrementClick}
            accessibilityLabel="Click to increment work units"
            disabled={!metrics.isRunning}
          >
            <IconSymbol name="plus.circle" size={48} color="#fff" />
          </TouchableOpacity>

          <TimerControls
            isRunning={metrics.isRunning}
            onStartPause={handleStartPause}
            onReset={handleReset}
          />
        </View>

        <View style={styles.bottomSection}>
          {!metrics.isRunning && (
            <>
              <View style={styles.noteInputContainer}>
                <TextInput
                  style={styles.noteTextInput}
                  placeholder="Add note..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={noteText}
                  onChangeText={setNoteText}
                  multiline
                  numberOfLines={2}
                  maxLength={200}
                />
                <TouchableOpacity
                  style={[styles.addButton, !noteText.trim() && styles.addButtonDisabled]}
                  onPress={handleAddNote}
                  disabled={!noteText.trim()}
                  accessibilityLabel="Add Note"
                >
                  <IconSymbol name="plus" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={notes}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.noteItem}>
                    <View style={styles.noteHeader}>
                      <IconSymbol name="clock" size={14} color="#888" />
                      <ThemedText style={styles.noteTimestamp}>{item.timestamp}</ThemedText>
                    </View>
                    <ThemedText style={styles.noteText}>{item.text}</ThemedText>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyNotesContainer}>
                    <IconSymbol name="info.circle" size={24} color="#777" />
                    <ThemedText style={styles.emptyNotes}>Pause timer to add notes</ThemedText>
                  </View>
                )}
                style={styles.notesList}
              />
            </>
          )}

          <TouchableOpacity 
            style={[styles.endSessionButton, metrics.isRunning && styles.endSessionButtonDisabled]} 
            onPress={handleEndSession}
            disabled={metrics.isRunning}
            accessibilityLabel="End Session"
          >
            <View style={styles.buttonContent}>
              <IconSymbol name="stop.circle" size={24} color="#fff" />
              <ThemedText style={styles.endSessionButtonText}>End Session</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  metricsContainer: {
    paddingTop: Platform.OS === 'ios' ? '2%' : '1%',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  clickButton: {
    backgroundColor: '#3498db',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  clickButtonDisabled: {
    backgroundColor: 'rgba(102,102,102,0.5)',
  },
  bottomSection: {
    flex: 1,
    maxHeight: '40%',
    marginTop: 16,
  },
  noteInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  noteTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addButtonDisabled: {
    backgroundColor: 'rgba(102,102,102,0.5)',
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyNotesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyNotes: {
    fontSize: 14,
    color: '#777',
    marginLeft: 8,
  },
  endSessionButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  endSessionButtonDisabled: {
    backgroundColor: '#666',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  endSessionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    flex: 1,
  },
});
