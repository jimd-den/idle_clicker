import { Link } from 'expo-router';
import React from 'react';
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
  const { getAllSessions, startNewSession, isLoading } = useSession();
  const sessions = getAllSessions(); // Get sessions explicitly

  const handleStartNewSession = () => {
    startNewSession();
    router.push('/play');
  };

  const handleSessionHistoryPress = () => {
    router.push('./session-history');  // Changed to relative path
  };

  return (
    <ThemedView style={styles.container}>
      <HelloWave />
      <ThemedText type="title" style={styles.title}>Non-Idle Clicker</ThemedText>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Loading sessions...</ThemedText>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            style={styles.newSessionButton} 
            onPress={handleStartNewSession}
          >
            <View style={styles.buttonContent}>
              <IconSymbol name="play.circle.fill" size={24} color="#fff" />
              <ThemedText style={styles.buttonText}>Start New Session</ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.historyContainer}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="clock.fill" size={20} color="#687076" />
              <ThemedText style={styles.sectionTitle}>Session History</ThemedText>
            </View>
            {sessions && sessions.length > 0 ? (
              // Remove the TouchableOpacity wrapper, just render SessionHistory directly
              <View style={styles.historyList}>
                <SessionHistory sessions={sessions} />
              </View>
            ) : (
              <ThemedText style={styles.emptyText}>
                No sessions yet. Start a new session to begin tracking!
              </ThemedText>
            )}
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
  historyList: {
    flex: 1,  // Add this to ensure the list takes up available space
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
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#687076',
  },
});
