import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { SessionHistory } from '@/components/SessionHistory';
import { useSessionService } from '@/infrastructure/contexts/SessionContext';
import { Stack } from 'expo-router';

export default function SessionHistoryScreen() {
  const { getAllSessions } = useSessionService();

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
      <SessionHistory sessions={getAllSessions()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
