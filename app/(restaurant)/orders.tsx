import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order } from '@/types';
import { RestaurantOderCard } from '@/components/RestaurantOrderCard';

const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    items: [],
    status: 'pending',
    totalAmount: 28.97,
    deliveryFee: 2.99,
    createdAt: new Date('2024-01-15T12:30:00'),
    estimatedDelivery: new Date('2024-01-15T13:15:00'),
    deliveryAddress: '123 Main St, San Francisco, CA'
  },
  {
    id: '2',
    customerId: '2',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    items: [],
    status: 'preparing',
    totalAmount: 45.99,
    deliveryFee: 3.99,
    createdAt: new Date('2024-01-15T12:15:00'),
    estimatedDelivery: new Date('2024-01-15T13:00:00'),
    deliveryAddress: '456 Oak Ave, San Francisco, CA'
  },
  {
    id: '3',
    customerId: '3',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    items: [],
    status: 'ready',
    totalAmount: 52.50,
    deliveryFee: 2.99,
    createdAt: new Date('2024-01-15T11:45:00'),
    deliveryAddress: '789 Pine St, San Francisco, CA'
  },
  {
    id: '4',
    customerId: '4',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    items: [],
    status: 'pending',
    totalAmount: 80.97,
    deliveryFee: 2.99,
    createdAt: new Date('2024-01-15T12:30:00'),
    estimatedDelivery: new Date('2024-01-15T13:15:00'),
    deliveryAddress: '123 Main St, San Francisco, CA'
  },
];

export default function RestaurantOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'preparing' |  'ready' | 'completed'>('new');

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const newOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order =>
    order.status === 'accepted' || order.status === 'preparing'
  );
  const readyForPickupOrders = orders.filter(order => order.status === 'ready');
  const completedOrders = orders.filter(order =>
    order.status === 'completed' || order.status === 'cancelled'
  );

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'preparing' as const } : order
      )
    );
    Alert.alert('Order Accepted', 'Order has been accepted and is now being prepared.');
  };

  const handleRejectOrder = (orderId: string) => {
    Alert.alert(
      'Reject Order',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setOrders(prevOrders =>
              prevOrders.map(order =>
                order.id === orderId ? { ...order, status: 'cancelled' as const } : order
              )
            );
          }
        }
      ]
    );
  };

  const handleMarkReady = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'ready' as const } : order
      )
    );
    Alert.alert('Order Ready', 'Order has been marked as ready for pickup.');
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'completed' as const } : order
      )
    );
    Alert.alert('Order Completed', 'Order has been marked as completed.');
  };

  const getTabOrders = () => {
    switch (activeTab) {
      case 'new':
        return newOrders;
      case 'preparing':
        return preparingOrders;
      case 'ready':
        return readyForPickupOrders;
      case 'completed':
        return completedOrders;
      default:
        return [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <View style={styles.orderStats}>
          <Text style={styles.statsText}>
            {newOrders.length} new • {preparingOrders.length} preparing
          </Text>
        </View>
      </View>
      <View>
        <ScrollView horizontal style={styles.tabContainer} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'new' && styles.activeTab]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
              New ({newOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'preparing' && styles.activeTab]}
            onPress={() => setActiveTab('preparing')}
          >
            <Text style={[styles.tabText, activeTab === 'preparing' && styles.activeTabText]}>
              Preparing ({preparingOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'ready' && styles.activeTab]}
            onPress={() => setActiveTab('ready')}
          >
            <Text style={[styles.tabText, activeTab === 'ready' && styles.activeTabText]}>
              Ready for pickup({readyForPickupOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed ({completedOrders.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {getTabOrders().length > 0 ? (
          getTabOrders().map((order) => (
            <RestaurantOderCard
              key={order.id}
              order={order}
              onAccept={() => handleAcceptOrder(order.id)}
              onReject={() => handleRejectOrder(order.id)}
              onMarkReady={() => handleMarkReady(order.id)}
              onComplete={() => handleCompleteOrder(order.id)}
              onShowItems={() => handleShowItems(order.id)}
              onTrackOrder={() => handleTrackOrder(order.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No orders</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'new' && 'New orders will appear here'}
              {activeTab === 'preparing' && 'Orders being prepared will appear here'}
              {activeTab === 'ready' && 'Orders ready for pickup will appear here'}
              {activeTab === 'completed' && 'Completed orders will appear here'}
            </Text>
          </View>
        )}
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
    color: '#333333',
    marginBottom: 4
  },
  orderStats: {
    marginTop: 4
  },
  statsText: {
    fontSize: 14,
    color: '#666666'
  },
  tabContainer: {
    // flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  tab: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    padding: 15
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3'
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999'
  },
  activeTabText: {
    color: '#2196F3'
  },
  content: {
    flex: 1,
    padding: 20
  },


  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center'
  }
});