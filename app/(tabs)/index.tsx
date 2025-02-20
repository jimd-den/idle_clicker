import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SessionHistory } from '@/components/SessionHistory';
import { useSession } from '@/contexts/SessionContext';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();
  const { getAllSessions, startNewSession, isLoading, error: contextError } = useSession();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartNewSession = async () => {
    try {
      setError(null);
      setIsStarting(true);
      await startNewSession();
      router.push('/play');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <HelloWave />
      <ThemedText type="title" style={styles.title}>Non-Idle Clicker</ThemedText>
      
      {(error || contextError) && (
        <View style={styles.errorContainer}>
          <IconSymbol name="xmark.circle" size={20} color="#e74c3c" />
          <ThemedText style={styles.errorText}>{error || contextError}</ThemedText>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Loading sessions...</ThemedText>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            style={[styles.newSessionButton, isStarting && styles.newSessionButtonDisabled]} 
            onPress={handleStartNewSession}
            disabled={isStarting}
          >
            <View style={styles.buttonContent}>
              {isStarting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <IconSymbol name="play.circle.fill" size={24} color="#fff" />
              )}
              <ThemedText style={styles.buttonText}>
                {isStarting ? 'Starting...' : 'Start New Session'}
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.historyContainer}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="clock.fill" size={20} color="#687076" />
              <ThemedText style={styles.sectionTitle}>Session History</ThemedText>
            </View>
            <SessionHistory sessions={getAllSessions()} />
          </View>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#687076',
  },
  newSessionButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
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
  newSessionButtonDisabled: {
    opacity: 0.7,
  },
});
