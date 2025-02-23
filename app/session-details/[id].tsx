import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { useSessionService } from '@/infrastructure/contexts/SessionContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatTime } from '@/utils/timeUtils';
import { Session } from '@/domain/entities/Session';

export default function SessionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getAllSessions } = useSessionService();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true);
        const sessions = await getAllSessions();
        const foundSession = sessions.find(s => s.getId() === id);
        setSession(foundSession || null);
      } catch (error) {
        console.error('Failed to load session:', error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, [id]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <ThemedText style={styles.loadingText}>Loading session...</ThemedText>
        </View>
      </ThemedView>
    );
  }
  
  if (!session) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Session not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <IconSymbol name="clock.fill" size={20} color="#687076" />
            <ThemedText style={styles.date}>
              {new Date(session.getStartTime()).toLocaleDateString()}
            </ThemedText>
          </View>
          <ThemedText style={styles.time}>
            {new Date(session.getStartTime()).toLocaleTimeString()}
          </ThemedText>
        </View>

        <View style={styles.metricsCard}>
          <MetricsDisplay
            clicks={session.getTotalClicks()}
            elapsedTimeMs={session.getDuration()}
            upm={session.getFinalUPM()}
            smoothnessMetrics={session.getSmoothnessMetrics()}
            rewards={{
              experience: 0,
              achievementPoints: 0,
              flowBonus: 0,
              streakMultiplier: 0
            }}
          />
        </View>

        {session.getNotes().length > 0 && (
          <View style={styles.notesSection}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="info.circle" size={20} color="#687076" />
              <ThemedText style={styles.sectionTitle}>Session Notes</ThemedText>
            </View>
            {session.getNotes().map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <View style={styles.noteHeader}>
                  <IconSymbol name="clock" size={14} color="#888" />
                  <ThemedText style={styles.noteTime}>
                    {formatTime(note.timestamp)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.noteText}>{note.text}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
  },
  time: {
    fontSize: 16,
    color: '#687076',
  },
  metricsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  notesSection: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  noteItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  noteText: {
    fontSize: 14,
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
