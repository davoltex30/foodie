import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, DollarSign, Clock, Star, Bell, FileText } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/ui/Card';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
}

function StatsCard({ icon, title, value, change, changeType }: StatsCardProps) {
  return (
    <Card style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <View style={styles.statsIcon}>
          {icon}
        </View>
        {change && (
          <View style={[styles.changeContainer, changeType === 'positive' ? styles.positiveChange : styles.negativeChange]}>
            <Text style={[styles.changeText, changeType === 'positive' ? styles.positiveText : styles.negativeText]}>
              {change}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </Card>
  );
}

const notifications = [
  { id: '1', type: 'order', message: 'New order from John Doe', time: '2 min ago' },
  { id: '2', type: 'review', message: 'New 5-star review received', time: '15 min ago' },
  { id: '3', type: 'order', message: 'Order #1234 ready for pickup', time: '30 min ago' },
];

const popularDishes = [
  { name: 'Margherita Pizza', orders: 24, revenue: '$407.76' },
  { name: 'Caesar Salad', orders: 18, revenue: '$234.00' },
  { name: 'Pasta Carbonara', orders: 15, revenue: '$285.00' },
];

export default function RestaurantDashboardScreen() {
  const restaurantProfile = useAuthStore(state => state.restaurantProfile)
  const [todayStats, setTodayStats] = useState({
    orders: 32,
    revenue: 847.50,
    avgOrderTime: 18,
    rating: 4.8
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back, {restaurantProfile?.name}!</Text>
          <Text style={styles.subGreeting}>Here's your restaurant overview</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#2196F3" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon={<FileText size={24} color="#2196F3" />}
            title="Today's Orders"
            value={todayStats.orders.toString()}
            change="+12%"
            changeType="positive"
          />
          <StatsCard
            icon={<DollarSign size={24} color="#4CAF50" />}
            title="Today's Revenue"
            value={`$${todayStats.revenue.toFixed(2)}`}
            change="+8%"
            changeType="positive"
          />
          <StatsCard
            icon={<Clock size={24} color="#FF9800" />}
            title="Avg. Prep Time"
            value={`${todayStats.avgOrderTime} min`}
            change="-2 min"
            changeType="positive"
          />
          <StatsCard
            icon={<Star size={24} color="#FFD700" />}
            title="Rating"
            value={todayStats.rating.toFixed(1)}
            change="+0.2"
            changeType="positive"
          />
        </View>

        {/* Recent Notifications */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {notifications.map((notification, index) => (
            <View key={notification.id} style={styles.notificationItem}>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {index < notifications.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </Card>

        {/* Popular Dishes */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Dishes Today</Text>
          {popularDishes.map((dish, index) => (
            <View key={dish.name} style={styles.dishItem}>
              <View style={styles.dishInfo}>
                <Text style={styles.dishName}>{dish.name}</Text>
                <Text style={styles.dishOrders}>{dish.orders} orders</Text>
              </View>
              <Text style={styles.dishRevenue}>{dish.revenue}</Text>
              {index < popularDishes.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction]}>
            <Text style={styles.actionButtonText}>View All Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
            <Text style={styles.secondaryActionText}>Update Menu</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: '#F44336',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: '48%',
    marginBottom: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveChange: {
    backgroundColor: '#E8F5E8',
  },
  negativeChange: {
    backgroundColor: '#FFF0F0',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  positiveText: {
    color: '#4CAF50',
  },
  negativeText: {
    color: '#F44336',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  notificationItem: {
    marginBottom: 12,
  },
  notificationContent: {
    paddingVertical: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999999',
  },
  dishItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  dishOrders: {
    fontSize: 12,
    color: '#666666',
  },
  dishRevenue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2196F3',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
  quickActions: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: '#2196F3',
  },
  secondaryAction: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
});