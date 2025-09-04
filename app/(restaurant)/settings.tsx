import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Store,
  Clock,
  MapPin,
  Users,
  ChartBar as BarChart3,
  CircleHelp as HelpCircle,
  LogOut
} from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';
import Toast from 'react-native-toast-message';
import { supabase } from '@/utils/supabase';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}

function SettingsItem({ icon, title, subtitle, onPress, showChevron = true }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.settingsItemText}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight size={20} color="#CCCCCC" />}
    </TouchableOpacity>
  );
}

export default function RestaurantSettingsScreen() {
  const restaurantProfile = useAuthStore(state => state.restaurantProfile);
  const signOut = useAuthStore(state => state.signOut);

  const handleLogout = (scope: 'global' | 'local' | 'others' = 'local') => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: signOut
        }
      ]
    );
  };

  const restaurantSettings = [
    {
      icon: <Store size={24} color="#2196F3" />,
      title: 'Restaurant Profile',
      subtitle: 'Name, description, and photos',
      onPress: () => console.log('Restaurant profile pressed')
    },
    {
      icon: <Clock size={24} color="#2196F3" />,
      title: 'Operating Hours',
      subtitle: 'Set your opening and closing times',
      onPress: () => console.log('Operating hours pressed')
    },
    {
      icon: <MapPin size={24} color="#2196F3" />,
      title: 'Location & Delivery',
      subtitle: 'Address and delivery settings',
      onPress: () => console.log('Location pressed')
    },
    {
      icon: <Users size={24} color="#2196F3" />,
      title: 'Staff Management',
      subtitle: 'Manage restaurant staff access',
      onPress: () => console.log('Staff management pressed')
    }
  ];7

  const businessSettings = [
    {
      icon: <BarChart3 size={24} color="#2196F3" />,
      title: 'Analytics & Reports',
      subtitle: 'Sales reports and insights',
      onPress: () => console.log('Analytics pressed')
    },
    {
      icon: <HelpCircle size={24} color="#2196F3" />,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => console.log('Help pressed')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Profile */}
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: restaurantProfile?.logo_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{restaurantProfile?.name}</Text>
              <Text style={styles.profileEmail}>{restaurantProfile?.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Restaurant Owner</Text>
              </View>
            </View>
          </View>

          <View style={styles.restaurantStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Open</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        </Card>

        {/* Restaurant Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Restaurant Settings</Text>
          {restaurantSettings.map((item, index) => (
            <View key={item.title}>
              <SettingsItem {...item} />
              {index < restaurantSettings.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </Card>

        {/* Business Settings */}
        <Card style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Business</Text>
          {businessSettings.map((item, index) => (
            <View key={item.title}>
              <SettingsItem {...item} />
              {index < businessSettings.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </Card>

        {/* Logout */}
        <Card style={styles.logoutCard}>
          <SettingsItem
            icon={<LogOut size={24} color="#F44336" />}
            title="Logout"
            onPress={handleLogout}
            showChevron={false}
          />
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>FoodieExpress Business v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 FoodieExpress. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333'
  },
  content: {
    flex: 1,
    padding: 20
  },
  profileCard: {
    marginBottom: 20
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16
  },
  profileText: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8
  },
  roleBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3'
  },
  restaurantStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16
  },
  statItem: {
    alignItems: 'center'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#666666'
  },
  settingsCard: {
    marginBottom: 20,
    paddingVertical: 8
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
    paddingHorizontal: 8
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  settingsItemText: {
    flex: 1
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2
  },
  settingsItemSubtitle: {
    fontSize: 12,
    color: '#999999'
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60
  },
  logoutCard: {
    marginBottom: 20
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20
  },
  appVersion: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4
  },
  appCopyright: {
    fontSize: 12,
    color: '#CCCCCC'
  }
});