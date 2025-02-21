import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

interface StatItemProps {
  label: string;
  value: string | number;
  icon: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => {
  return (
    <View style={styles.statItemContainer}>
      <ThemedText style={styles.statItemLabel}>{label}</ThemedText>
      <ThemedText style={styles.statItemValue}>{value}</ThemedText>
    </View>
  );
};

interface RPGStatsPanelProps {
  children: React.ReactNode;
}

const RPGStatsPanel: React.FC<RPGStatsPanelProps> = ({ children }) => {
  return (
    <View style={styles.panelContainer}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    padding: 16,
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    marginVertical: 8,
  },
  statItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItemLabel: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  statItemValue: {
    fontSize: 16,
    color: '#ecf0f1',
  },
});

export { RPGStatsPanel, StatItem };
