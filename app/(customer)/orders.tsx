import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, RotateCcw, FileText } from 'lucide-react-native';
import { Order } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    restaurantId: '1',
    restaurantName: 'Bella Italia',
    items: [],
    status: 'preparing',
    totalAmount: 28.97,
    deliveryFee: 2.99,
    createdAt: new Date('2024-01-15T12:30:00'),
    estimatedDelivery: new Date('2024-01-15T13:15:00'),
    deliveryAddress: '123 Main St, San Francisco, CA'
  },
  {
    id: '2',
    customerId: '1',
    restaurantId: '2',
    restaurantName: 'Sushi Zen',
    items: [],
    status: 'completed',
    totalAmount: 45.99,
    deliveryFee: 3.99,
    createdAt: new Date('2024-01-14T19:45:00'),
    deliveryAddress: '123 Main St, San Francisco, CA'
  },
  {
    id: '3',
    customerId: '1',
    restaurantId: '3',
    restaurantName: 'Burger Palace',
    items: [],
    status: 'cancelled',
    totalAmount: 18.99,
    deliveryFee: 1.99,
    createdAt: new Date('2024-01-13T18:20:00'),
    deliveryAddress: '123 Main St, San Francisco, CA'
  }
];

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'preparing':
      return <Clock size={20} color="#FF9800" />;
    case 'completed':
      return <CheckCircle size={20} color="#4CAF50" />;
    case 'cancelled':
      return <XCircle size={20} color="#F44336" />;
    default:
      return <Clock size={20} color="#999999" />;
  }
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'preparing':
      return '#FF9800';
    case 'completed':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    default:
      return '#999999';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'Order Placed';
    case 'accepted':
      return 'Order Accepted';
    case 'preparing':
      return 'Preparing';
    case 'ready':
      return 'Ready for Pickup';
    case 'completed':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export default function CustomerOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    // Simulate API call
    setOrders(mockOrders);
  }, []);

  const activeOrders = orders.filter(order => 
    order.status === 'pending' || order.status === 'accepted' || order.status === 'preparing' || order.status === 'ready'
  );
  
  const historyOrders = orders.filter(order => 
    order.status === 'completed' || order.status === 'cancelled'
  );

  const handleReorder = (order: Order) => {
    console.log('Reorder:', order.id);
    // Here you would add items back to cart
  };

  const handleReview = (order: Order) => {
    console.log('Review order:', order.id);
    // Here you would navigate to review screen
  };

  const renderOrder = (order: Order) => (
    <Card key={order.id} style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{order.restaurantName}</Text>
          <Text style={styles.orderDate}>
            {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          {getStatusIcon(order.status)}
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.orderAmount}>
        Total: ${order.totalAmount.toFixed(2)}
      </Text>

      {order.estimatedDelivery && order.status === 'preparing' && (
        <Text style={styles.estimatedTime}>
          Estimated delivery: {order.estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}

      <View style={styles.orderActions}>
        {order.status === 'completed' && (
          <>
            <Button
              title="Reorder"
              onPress={() => handleReorder(order)}
              variant="outline"
              size="sm"
              style={styles.actionButton}
            />
            <Button
              title="Review"
              onPress={() => handleReview(order)}
              variant="primary"
              size="sm"
              style={styles.actionButton}
            />
          </>
        )}
        
        {(order.status === 'preparing' || order.status === 'ready') && (
          <Button
            title="Track Order"
            onPress={() => console.log('Track order:', order.id)}
            variant="primary"
            size="sm"
            style={styles.actionButton}
          />
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active ({activeOrders.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History ({historyOrders.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'active' ? (
          activeOrders.length > 0 ? (
            activeOrders.map(renderOrder)
          ) : (
            <View style={styles.emptyContainer}>
              <FileText size={60} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>No active orders</Text>
              <Text style={styles.emptySubtitle}>Your current orders will appear here</Text>
            </View>
          )
        ) : (
          historyOrders.length > 0 ? (
            historyOrders.map(renderOrder)
          ) : (
            <View style={styles.emptyContainer}>
              <FileText size={60} color="#CCCCCC" />
              <Text style={styles.emptyTitle}>No order history</Text>
              <Text style={styles.emptySubtitle}>Your past orders will appear here</Text>
            </View>
          )
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
  },
  activeTabText: {
    color: '#FF6B35',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#999999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
    marginBottom: 12,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});