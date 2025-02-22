import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MetricsDisplay } from '@/components/MetricsDisplay';
import { useSession } from '@/contexts/SessionContext';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { formatTime } from '@/utils/timeUtils';

export default function SessionDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getAllSessions } = useSession();
  
  const session = getAllSessions().find(s => s.getId() === id);
  
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
              {session.getStartTime().toLocaleDateString()}
            </ThemedText>
          </View>
          <ThemedText style={styles.time}>
            {session.getStartTime().toLocaleTimeString()}
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
              <IconSymbol name="doc.text.fill" size={20} color="#687076" />
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
});
