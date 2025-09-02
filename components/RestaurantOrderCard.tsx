import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Truck,
  Package,
  Home,
  Undo2,
  ChefHat, MapPin
} from 'lucide-react-native';import { Order } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface RestaurantOderCardProps {
  order: Order;
  onAccept?: () => void;
  onReject?: () => void;
  onMarkReady?: () => void;
  onComplete?: () => void;
  onShowItems: () => void;
  onTrackOrder?: () => void;
}

export const RestaurantOderCard = ({
                                     order,
                                     onAccept,
                                     onReject,
                                     onMarkReady,
                                     onComplete,
                                     onShowItems,
                                     onTrackOrder
                                   }: RestaurantOderCardProps) => {

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Bell size={20} color="#FF9800" />;
      case 'confirmed':
        return <UserCheck size={20} color="#2196F3" />;
      case 'preparing':
        return <ChefHat size={20} color="#FF5722" />;
      case 'ready_for_pickup':
        return <Package size={20} color="#4CAF50" />;
      case 'picked_up':
        return <Truck size={20} color="#9C27B0" />;
      case 'on_the_way':
        return <Truck size={20} color="#673AB7" />;
      case 'arrived':
        return <Home size={20} color="#E91E63" />;
      case 'delivered':
        return <CheckCircle size={20} color="#4CAF50" />;
      case 'cancelled':
        return <XCircle size={20} color="#F44336" />;
      case 'refunded':
        return <Undo2 size={20} color="#795548" />;
      default:
        return <Clock size={20} color="#999999" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#FF9800'; // Orange - waiting
      case 'confirmed':
        return '#2196F3'; // Blue - accepted
      case 'preparing':
        return '#FF5722'; // Deep Orange - cooking
      case 'ready_for_pickup':
        return '#4CAF50'; // Green - ready
      case 'picked_up':
        return '#9C27B0'; // Purple - picked up
      case 'on_the_way':
        return '#673AB7'; // Deep Purple - en route
      case 'arrived':
        return '#E91E63'; // Pink - arrived at location
      case 'delivered':
        return '#4CAF50'; // Green - completed
      case 'cancelled':
        return '#F44336'; // Red - cancelled
      case 'refunded':
        return '#795548'; // Brown - refunded
      default:
        return '#999999'; // Gray - unknown
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing Food';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'picked_up':
        return 'Picked Up';
      case 'on_the_way':
        return 'On the Way';
      case 'arrived':
        return 'Arrived at Location';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  // Optional: Get a more detailed description for each status
  const getStatusDescription = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Your order has been received and is waiting for restaurant confirmation';
      case 'confirmed':
        return 'The restaurant has accepted your order and will start preparing soon';
      case 'preparing':
        return 'The kitchen is preparing your delicious food';
      case 'ready_for_pickup':
        return 'Your order is ready and waiting for a courier to pick it up';
      case 'picked_up':
        return 'A courier has picked up your order and is on the way';
      case 'on_the_way':
        return 'Your food is being delivered to your location';
      case 'arrived':
        return 'The courier has arrived at your delivery location';
      case 'delivered':
        return 'Your order has been successfully delivered. Enjoy!';
      case 'cancelled':
        return 'This order has been cancelled';
      case 'refunded':
        return 'This order has been refunded';
      default:
        return 'Order status information';
    }
  };

  return (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderTime}>
            {format(order.created_at, "dd-mm-yy")}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
          {getStatusIcon(order.status)}
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.expandedContent}>
        <View style={styles.deliveryInfo}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.deliveryAddress}>
            {/*{order.deliveryAddress}*/}
          </Text>
        </View>

        <Text style={styles.subTotal}>Sub-Total: ${order.total_amount.toFixed(2)}</Text>
        <Text style={styles.deliveryFee}>Delivery fee: ${order.deliveryFee.toFixed(2)}</Text>
        <Text style={styles.orderAmount}>Total: ${(order.total_amount + order.deliveryFee).toFixed(2)}</Text>

        {order.est_delivery_time && (order.status === 'preparing' || order.status === 'ready_for_pickup') && (
          <Text style={styles.estimatedTime}>
            Est. delivery: {order.est_delivery_time} mins
          </Text>
        )}
      </View>


      <View style={styles.orderActions}>
        <Button
          title="View Items"
          onPress={onShowItems}
          variant="outline"
          size="sm"
          style={styles.actionButton}
        />
        {(onTrackOrder && (order.status === 'preparing' || order.status === 'ready_for_pickup')) && (
          <Button
            title="Track Order"
            onPress={onTrackOrder}
            variant="outline"
            size="sm"
            style={styles.actionButton}
          />
        )}
        {onReject && onAccept && (order.status === 'pending') && (
          <>
            <Button
              title="Reject"
              onPress={onReject}
              variant="danger"
              size="sm"
              style={styles.actionButton}
            />
            <Button
              title="Accept"
              onPress={onAccept}
              variant="secondary"
              size="sm"
              style={styles.actionButton}
            />
          </>
        )}

        {onMarkReady && order.status === 'preparing' && (
          <Button
            title="Mark Ready"
            onPress={onMarkReady}
            variant="secondary"
            size="sm"
            style={styles.actionButton}
          />
        )}

        {onComplete && order.status === 'ready_for_pickup' && (
          <Button
            title="Complete"
            onPress={onComplete}
            variant="secondary"
            size="sm"
            style={styles.actionButton}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    marginBottom: 16
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  orderInfo: {
    flex: 1
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2
  },
  orderTime: {
    fontSize: 12,
    color: '#999999'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  expandButtonText: {
    color: '#2196F3',
    fontSize: 14,
    marginRight: 4
  },
  chevron: {
    transform: [{ rotate: '0deg' }]
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }]
  },
  expandedContent: {
    marginBottom: 12
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
    flex: 1
  },
  deliveryFee: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5
  },
  subTotal: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8
  },
  estimatedTime: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
    marginBottom: 12
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 12
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 16
  }
});