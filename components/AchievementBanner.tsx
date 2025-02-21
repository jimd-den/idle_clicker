import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AchievementBannerProps {
  visible: boolean;
  text: string;
}

export const AchievementBanner: React.FC<AchievementBannerProps> = ({ visible, text }) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
