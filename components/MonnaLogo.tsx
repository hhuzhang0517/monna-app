
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MonnaLogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function MonnaLogo({ size = 'medium', color = '#FF5722' }: MonnaLogoProps) {
  const fontSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  
  return (
    <View style={styles.container}>
      <Text style={[styles.logoText, { fontSize, color }]}>Monna AI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
