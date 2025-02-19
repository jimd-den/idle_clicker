import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <HelloWave />
      <ThemedText type="title">Welcome!</ThemedText>
      <ThemedView
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
        }}>
        <HomeLink href="/explore">Explore</HomeLink>
        <HomeLink href="/play">Play</HomeLink>
      </ThemedView>
    </ThemedView>
  );
}


function HomeLink({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255, 0.1)',
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'none',
      }}>
      {children}
    </Link>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
