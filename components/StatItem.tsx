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

const styles = StyleSheet.create({
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

export { StatItem };
