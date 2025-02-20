import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { Session } from '@/domain/entities/Session';
import { formatTime } from '@/utils/timeUtils';
import { IconSymbol } from './ui/IconSymbol';

interface SessionHistoryProps {
  sessions: Session[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.emptyText}>No sessions yet. Start a new session to begin tracking!</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {sessions.map((session) => (
        <View 
          key={session.getId()} 
          style={styles.sessionCard}
          accessible={true}
          accessibilityLabel={`Session from ${session.getStartTime().toLocaleDateString()}`}
        >
          <View style={styles.sessionHeader}>
            <ThemedText style={styles.dateText} accessibilityLabel={`Session date ${session.getStartTime().toLocaleDateString()}`}>
              {session.getStartTime().toLocaleDateString()}
            </ThemedText>
            <ThemedText style={styles.timeText} accessibilityLabel={`Session time ${session.getStartTime().toLocaleTimeString()}`}>
              {session.getStartTime().toLocaleTimeString()}
            </ThemedText>
          </View>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metric}>
              <ThemedText style={styles.metricLabel}>Duration</ThemedText>
              <ThemedText style={styles.metricValue} accessibilityLabel={`Duration ${formatTime(session.getDuration())}`}>
                {formatTime(session.getDuration())}
              </ThemedText>
            </View>
            
            <View style={styles.metric}>
              <ThemedText style={styles.metricLabel}>Total Units</ThemedText>
              <ThemedText style={styles.metricValue} accessibilityLabel={`Total units ${session.getTotalClicks()}`}>
                {session.getTotalClicks()}
              </ThemedText>
            </View>
            
            <View style={styles.metric}>
              <ThemedText style={styles.metricLabel}>Final UPM</ThemedText>
              <ThemedText style={styles.metricValue} accessibilityLabel={`Final UPM ${session.getFinalUPM().toFixed(2)}`}>
                {session.getFinalUPM().toFixed(2)}
              </ThemedText>
            </View>
          </View>

          {session.getNotes().length > 0 && (
            <View style={styles.notesContainer}>
              <ThemedText style={styles.notesHeader}>Notes:</ThemedText>
              {session.getNotes().map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <View style={styles.noteHeader}>
                    <IconSymbol name="clock" size={14} color="#888" />
                    <ThemedText style={styles.noteTime}>
                      {formatTime(note.timestamp)}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.noteText}>
                    {note.text}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    color: '#666',
  },
  sessionCard: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    color: '#888',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 10,
  },
  notesHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  noteTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  noteText: {
    fontSize: 14,
    flex: 1,
  },
});