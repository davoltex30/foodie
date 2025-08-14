import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, User, CreditCard, Bell, MapPin, CircleHelp as HelpCircle, LogOut, Shield } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';
import { Card } from '@/components/ui/Card';

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

export default function CustomerSettingsScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/role-selection');
          }
        }
      ]
    );
  };

  const settingsItems = [
    {
      icon: <User size={24} color="#FF6B35" />,
      title: 'Profile',
      subtitle: 'Edit your personal information',
      onPress: () => console.log('Profile pressed')
    },
    {
      icon: <MapPin size={24} color="#FF6B35" />,
      title: 'Addresses',
      subtitle: 'Manage delivery addresses',
      onPress: () => console.log('Addresses pressed')
    },
    {
      icon: <CreditCard size={24} color="#FF6B35" />,
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment options',
      onPress: () => console.log('Payment methods pressed')
    },
    {
      icon: <Bell size={24} color="#FF6B35" />,
      title: 'Notifications',
      subtitle: 'Order updates and promotions',
      onPress: () => console.log('Notifications pressed')
    },
    {
      icon: <Shield size={24} color="#FF6B35" />,
      title: 'Privacy & Security',
      subtitle: 'Account security settings',
      onPress: () => console.log('Privacy pressed')
    },
    {
      icon: <HelpCircle size={24} color="#FF6B35" />,
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
        {/* Profile Section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>Customer</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Settings Items */}
        <Card style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <View key={item.title}>
              <SettingsItem {...item} />
              {index < settingsItems.length - 1 && <View style={styles.separator} />}
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
          <Text style={styles.appVersion}>FoodieExpress v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 FoodieExpress. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#FFF0EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  settingsCard: {
    marginBottom: 20,
    paddingVertical: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF0EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 12,
    color: '#999999',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
  logoutCard: {
    marginBottom: 20,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    color: '#CCCCCC',
  },
});