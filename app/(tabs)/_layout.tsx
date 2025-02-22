import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { WorkTimerProvider } from '@/infrastructure/contexts/WorkTimerContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <WorkTimerProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="clock.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="play"
          options={{
            title: 'Play',
            tabBarIcon: ({ color }) => <IconSymbol size={32} name="play.fill" color={color} />,
            tabBarIconStyle: {
              transform: [{ scale: 1.2 }],
            },
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '600',
            },
          }}
        />
      </Tabs>
    </WorkTimerProvider>
  );
}
