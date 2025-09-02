import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Order } from '@/types';
import { RestaurantOderCard } from '@/components/RestaurantOrderCard';
import OrderItemsModal from '@/components/OrderItemsModal';
import Toast from 'react-native-toast-message';

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    customer: 'customer-1',
    restaurant: 'restaurant-1',
    courier: 'courier-1',
    order_items: [
      {
        id: 'item-1',
        menu_item: {
          id: 'menu-item-1',
          name: 'Margherita Pizza',
          image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop'
        },
        quantity: 2,
        price: 12.99,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 'item-2',
        menu_item: {
          id: 'menu-item-2',
          name: 'Garlic Bread',
          image_url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 4.99,
        created_at: '2024-01-15T10:30:00Z'
      }
    ],
    status: 'delivered',
    total_amount: 30.97,
    deliveryFee: 5.00,
    est_delivery_time: 35,
    delivery_longitude: -74.0060,
    delivery_latitude: 40.7128,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T11:15:00Z',
    accepted_at: '2024-01-15T10:32:00Z',
    prepared_at: '2024-01-15T10:45:00Z',
    picked_up_at: '2024-01-15T10:50:00Z',
    delivered_at: '2024-01-15T11:05:00Z'
  },
  {
    id: 'order-2',
    customer: 'customer-2',
    restaurant: 'restaurant-2',
    courier: 'courier-2',
    order_items: [
      {
        id: 'item-3',
        menu_item: {
          id: 'menu-item-3',
          name: 'Chicken Burger',
          image_url: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 14.99,
        created_at: '2024-01-15T12:15:00Z'
      },
      {
        id: 'item-4',
        menu_item: {
          id: 'menu-item-4',
          name: 'French Fries',
          image_url: 'https://images.unsplash.com/photo-1634034379073-f689b460a3fc?w=300&h=300&fit=crop'
        },
        quantity: 2,
        price: 3.99,
        created_at: '2024-01-15T12:15:00Z'
      },
      {
        id: 'item-5',
        menu_item: {
          id: 'menu-item-5',
          name: 'Coca-Cola',
          image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 2.99,
        created_at: '2024-01-15T12:15:00Z'
      }
    ],
    status: 'on_the_way',
    total_amount: 28.96,
    deliveryFee: 4.00,
    est_delivery_time: 25,
    delivery_longitude: -73.9857,
    delivery_latitude: 40.7484,
    created_at: '2024-01-15T12:15:00Z',
    updated_at: '2024-01-15T12:40:00Z',
    accepted_at: '2024-01-15T12:17:00Z',
    prepared_at: '2024-01-15T12:30:00Z',
    picked_up_at: '2024-01-15T12:35:00Z'
  },
  {
    id: 'order-3',
    customer: 'customer-3',
    restaurant: 'restaurant-3',
    order_items: [
      {
        id: 'item-6',
        menu_item: {
          id: 'menu-item-6',
          name: 'Sushi Platter',
          image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 24.99,
        created_at: '2024-01-15T13:45:00Z'
      },
      {
        id: 'item-7',
        menu_item: {
          id: 'menu-item-7',
          name: 'Miso Soup',
          image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop'
        },
        quantity: 2,
        price: 3.50,
        created_at: '2024-01-15T13:45:00Z'
      }
    ],
    status: 'preparing',
    total_amount: 35.49,
    deliveryFee: 6.00,
    est_delivery_time: 40,
    delivery_longitude: -73.9667,
    delivery_latitude: 40.7812,
    created_at: '2024-01-15T13:45:00Z',
    updated_at: '2024-01-15T13:50:00Z',
    accepted_at: '2024-01-15T13:47:00Z'
  },
  {
    id: 'order-4',
    customer: 'customer-4',
    restaurant: 'restaurant-1',
    order_items: [
      {
        id: 'item-8',
        menu_item: {
          id: 'menu-item-8',
          name: 'Pepperoni Pizza',
          image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 15.99,
        created_at: '2024-01-15T14:20:00Z'
      },
      {
        id: 'item-9',
        menu_item: {
          id: 'menu-item-9',
          name: 'Caesar Salad',
          image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 8.99,
        created_at: '2024-01-15T14:20:00Z'
      }
    ],
    status: 'confirmed',
    total_amount: 29.98,
    deliveryFee: 5.00,
    est_delivery_time: 30,
    delivery_longitude: -73.9925,
    delivery_latitude: 40.7589,
    created_at: '2024-01-15T14:20:00Z',
    updated_at: '2024-01-15T14:22:00Z',
    accepted_at: '2024-01-15T14:21:00Z'
  },
  {
    id: 'order-5',
    customer: 'customer-5',
    restaurant: 'restaurant-4',
    order_items: [
      {
        id: 'item-10',
        menu_item: {
          id: 'menu-item-10',
          name: 'Chicken Tikka Masala',
          image_url: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=300&h=300&fit=crop'
        },
        quantity: 2,
        price: 16.99,
        created_at: '2024-01-15T15:10:00Z'
      },
      {
        id: 'item-11',
        menu_item: {
          id: 'menu-item-11',
          name: 'Naan Bread',
          image_url: 'https://images.unsplash.com/photo-1643071289602-6c4db37cfb59?w=300&h=300&fit=crop'
        },
        quantity: 3,
        price: 3.50,
        created_at: '2024-01-15T15:10:00Z'
      },
      {
        id: 'item-12',
        menu_item: {
          id: 'menu-item-12',
          name: 'Basmati Rice',
          image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 4.99,
        created_at: '2024-01-15T15:10:00Z'
      }
    ],
    status: 'pending',
    total_amount: 52.96,
    deliveryFee: 7.00,
    est_delivery_time: 45,
    delivery_longitude: -73.9772,
    delivery_latitude: 40.7614,
    created_at: '2024-01-15T15:10:00Z',
    updated_at: '2024-01-15T15:10:00Z'
  },
  {
    id: 'order-6',
    customer: 'customer-6',
    restaurant: 'restaurant-5',
    courier: 'courier-3',
    order_items: [
      {
        id: 'item-13',
        menu_item: {
          id: 'menu-item-13',
          name: 'Beef Pho',
          image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 12.99,
        created_at: '2024-01-15T16:30:00Z'
      },
      {
        id: 'item-14',
        menu_item: {
          id: 'menu-item-14',
          name: 'Spring Rolls',
          image_url: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 6.99,
        created_at: '2024-01-15T16:30:00Z'
      }
    ],
    status: 'ready_for_pickup',
    total_amount: 24.98,
    deliveryFee: 5.00,
    est_delivery_time: 20,
    delivery_longitude: -73.9893,
    delivery_latitude: 40.7505,
    created_at: '2024-01-15T16:30:00Z',
    updated_at: '2024-01-15T16:45:00Z',
    accepted_at: '2024-01-15T16:32:00Z',
    prepared_at: '2024-01-15T16:40:00Z'
  },
  {
    id: 'order-7',
    customer: 'customer-7',
    restaurant: 'restaurant-2',
    courier: 'courier-4',
    order_items: [
      {
        id: 'item-15',
        menu_item: {
          id: 'menu-item-15',
          name: 'Veggie Wrap',
          image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 9.99,
        created_at: '2024-01-15T17:15:00Z'
      },
      {
        id: 'item-16',
        menu_item: {
          id: 'menu-item-16',
          name: 'Fresh Juice',
          image_url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 5.99,
        created_at: '2024-01-15T17:15:00Z'
      }
    ],
    status: 'arrived',
    total_amount: 20.98,
    deliveryFee: 5.00,
    est_delivery_time: 15,
    delivery_longitude: -73.9814,
    delivery_latitude: 40.7690,
    created_at: '2024-01-15T17:15:00Z',
    updated_at: '2024-01-15T17:35:00Z',
    accepted_at: '2024-01-15T17:17:00Z',
    prepared_at: '2024-01-15T17:25:00Z',
    picked_up_at: '2024-01-15T17:30:00Z'
  },
  {
    id: 'order-8',
    customer: 'customer-8',
    restaurant: 'restaurant-6',
    order_items: [
      {
        id: 'item-17',
        menu_item: {
          id: 'menu-item-17',
          name: 'Chocolate Cake',
          image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 8.99,
        created_at: '2024-01-15T18:00:00Z'
      }
    ],
    status: 'cancelled',
    total_amount: 13.99,
    deliveryFee: 5.00,
    est_delivery_time: 25,
    delivery_longitude: -73.9742,
    delivery_latitude: 40.7648,
    created_at: '2024-01-15T18:00:00Z',
    updated_at: '2024-01-15T18:05:00Z'
  },
  {
    id: 'order-9',
    customer: 'customer-9',
    restaurant: 'restaurant-3',
    courier: 'courier-5',
    order_items: [
      {
        id: 'item-18',
        menu_item: {
          id: 'menu-item-18',
          name: 'Ramen Bowl',
          image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 14.99,
        created_at: '2024-01-15T19:20:00Z'
      },
      {
        id: 'item-19',
        menu_item: {
          id: 'menu-item-19',
          name: 'Gyoza',
          image_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 7.99,
        created_at: '2024-01-15T19:20:00Z'
      }
    ],
    status: 'picked_up',
    total_amount: 32.98,
    deliveryFee: 10.00,
    est_delivery_time: 18,
    delivery_longitude: -73.9661,
    delivery_latitude: 40.7557,
    created_at: '2024-01-15T19:20:00Z',
    updated_at: '2024-01-15T19:40:00Z',
    accepted_at: '2024-01-15T19:22:00Z',
    prepared_at: '2024-01-15T19:30:00Z',
    picked_up_at: '2024-01-15T19:35:00Z'
  },
  {
    id: 'order-10',
    customer: 'customer-10',
    restaurant: 'restaurant-4',
    order_items: [
      {
        id: 'item-20',
        menu_item: {
          id: 'menu-item-20',
          name: 'Butter Chicken',
          image_url: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=300&h=300&fit=crop'
        },
        quantity: 1,
        price: 15.99,
        created_at: '2024-01-15T20:45:00Z'
      },
      {
        id: 'item-21',
        menu_item: {
          id: 'menu-item-21',
          name: 'Samosa',
          image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop'
        },
        quantity: 2,
        price: 4.99,
        created_at: '2024-01-15T20:45:00Z'
      }
    ],
    status: 'refunded',
    total_amount: 30.97,
    deliveryFee: 5.00,
    est_delivery_time: 35,
    delivery_longitude: -73.9826,
    delivery_latitude: 40.7684,
    created_at: '2024-01-15T20:45:00Z',
    updated_at: '2024-01-15T21:30:00Z',
    accepted_at: '2024-01-15T20:47:00Z',
    prepared_at: '2024-01-15T20:55:00Z',
    delivered_at: '2024-01-15T21:20:00Z'
  }
];

export default function RestaurantOrdersScreen() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'completed'| 'confirmed'>('pending');
  const [showOrderItemsModal, setShowOrderItemsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>();

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const newOrders = orders.filter(order => order.status === 'pending');

  const confirmedOrders = orders.filter(order => order.status === 'confirmed');

  const preparingOrders = orders.filter(order => order.status === 'preparing');

  const readyForPickupOrders = orders.filter(order => order.status === 'ready_for_pickup');

  const completedOrders = orders.filter(order =>
    order.status === 'delivered' || order.status === 'cancelled' || order.status === 'picked_up' || order.status === 'refunded'
  );

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'preparing' as const } : order
      )
    );
    Toast.show({text1: "Order Accepted", text2: 'Order has been accepted and is now being prepared.'})
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
        order.id === orderId ? { ...order, status: 'ready_for_pickup' as const } : order
      )
    );
    Toast.show({text1: "Order Ready", text2: "Order has been marked as ready for pickup.",})
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'delivered' as const } : order
      )
    );

    Alert.alert('Order Completed', 'Order has been marked as completed.');
  };

  const handleShowItems = (item: Order) => {
    setSelectedOrder(item);
    setShowOrderItemsModal(true);
  };

  const handleTrackOrder = (orderId: string) => {
    console.log("handle track order")
  };

  const getTabOrders = () => {
    switch (activeTab) {
      case 'pending':
        return newOrders;
      case 'confirmed':
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
            style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
            onPress={() => setActiveTab('pending')}
          >
            <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
              New ({newOrders.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'confirmed' && styles.activeTab]}
            onPress={() => setActiveTab('confirmed')}
          >
            <Text style={[styles.tabText, activeTab === 'confirmed' && styles.activeTabText]}>
              confirmed ({confirmedOrders.length})
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
              onShowItems={() => handleShowItems(order)}
              onTrackOrder={() => handleTrackOrder(order.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No orders</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'pending' && 'New orders will appear here'}
              {activeTab === 'preparing' && 'Orders being prepared will appear here'}
              {activeTab === 'ready' && 'Orders ready for pickup will appear here'}
              {activeTab === 'completed' && 'Completed orders will appear here'}
            </Text>
          </View>
        )}
      </ScrollView>
      <OrderItemsModal
        visible={showOrderItemsModal}
        onClose={() => setShowOrderItemsModal(false)}
        orderId={selectedOrder?.id || ''}
        orderItems={selectedOrder?.order_items || []}
      />
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