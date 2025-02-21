import React from 'react';
import { FlatList } from 'react-native';
import { SessionCard } from '@/components/SessionCard';
import { WorkSession } from '@/domain/entities/WorkSession';

interface SessionHistoryScreenProps {
  sessions: WorkSession[];
}

export function SessionHistoryScreen({ sessions }: SessionHistoryScreenProps) {
  return (
    <FlatList
      data={sessions}
      renderItem={({ item: session }) => (
        <SessionCard
          beforeImage={session.beforeImage}
          afterImage={session.afterImage}
          metrics={{
            smoothnessIndex: session.sessionMetrics.smoothnessIndex,
            totalUnits: session.sessionMetrics.totalUnits,
            totalStops: session.sessionMetrics.totalStops
          }}
          timwoods={session.units
            .filter(unit => unit.andonNote)
            .map(unit => unit.andonNote)}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}
