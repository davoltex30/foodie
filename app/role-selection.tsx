import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Users, Store } from 'lucide-react-native';
import { UserRole } from '@/types';

export default function RoleSelectionScreen() {
  const handleRoleSelect = (role: UserRole) => {
    router.navigate(`/login?role=${role}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' }}
          style={styles.logo}
        />
        <Text style={styles.title}>FoodieExpress</Text>
        <Text style={styles.subtitle}>Choose how you'd like to continue</Text>
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={[styles.roleCard, styles.customerCard]}
          onPress={() => handleRoleSelect('customer')}
          activeOpacity={0.8}
        >
          <View style={styles.roleIcon}>
            <Users size={40} color="#FF6B35" />
          </View>
          <Text style={styles.roleTitle}>I'm a Customer</Text>
          <Text style={styles.roleDescription}>
            Browse restaurants, order food, and track deliveries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleCard, styles.restaurantCard]}
          onPress={() => handleRoleSelect('restaurant')}
          activeOpacity={0.8}
        >
          <View style={styles.roleIcon}>
            <Store size={40} color="#2196F3" />
          </View>
          <Text style={styles.roleTitle}>I'm a Restaurant</Text>
          <Text style={styles.roleDescription}>
            Manage menu, process orders, and grow your business
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  rolesContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  customerCard: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  restaurantCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  roleIcon: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
});