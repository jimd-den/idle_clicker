import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SessionHistory } from '@/components/SessionHistory';
import { useSessionService } from '@/infrastructure/contexts/SessionContext';
import { Stack, useFocusEffect } from 'expo-router';
import { Session } from '@/domain/entities/Session';

export default function SessionHistoryScreen() {
  const { getAllSessions } = useSessionService();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const loadedSessions = await getAllSessions();
      setSessions(loadedSessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadSessions();
  }, []);

  // Refresh on focus
  useFocusEffect(
    React.useCallback(() => {
      loadSessions();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Session History',
          headerStyle: {
            backgroundColor: '#1c1c1e',
          },
          headerTintColor: '#fff',
        }} 
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Loading sessions...</ThemedText>
        </View>
      ) : (
        <SessionHistory sessions={sessions} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});
