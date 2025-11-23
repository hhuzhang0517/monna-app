import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/styles/commonStyles';
import { UserMenu } from './UserMenu';

interface TopNavigationBarProps {
  showUserButton?: boolean;
  onOpenLoginModal?: () => void;
}

export function TopNavigationBar({ showUserButton = true, onOpenLoginModal }: TopNavigationBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogoPress = () => {
    router.push('/(tabs)/image-generation');
  };

  const handlePricingPress = () => {
    // TODO: Navigate to pricing page when implemented
    console.log('Pricing pressed');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 30 }]}>
      {/* Logo */}
      <TouchableOpacity onPress={handleLogoPress} style={styles.logoContainer}>
        <Text style={styles.logoText}>Monna AI</Text>
      </TouchableOpacity>

      {/* Right buttons */}
      <View style={styles.rightButtons}>
        {/* Pricing button */}
        <TouchableOpacity onPress={handlePricingPress} style={styles.pricingButton}>
          <Ionicons name="pricetag-outline" size={16} color={colors.text} />
          <Text style={styles.pricingButtonText}>定价</Text>
        </TouchableOpacity>

        {/* User Menu */}
        {showUserButton && <UserMenu onOpenLoginModal={onOpenLoginModal} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.orange,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pricingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pricingButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
});
