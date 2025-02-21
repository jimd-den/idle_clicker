import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayScreen } from '@/components/PlayScreen';

export default function PlayScreenWrapper() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <PlayScreen />
    </SafeAreaView>
  );
}
