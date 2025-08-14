import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, CircleCheck as CheckCircle, Circle as XCircle, Bell, ChevronDown, MapPin } from 'lucide-react-native';
import { Order } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
      case 'preparing':
        return <Clock size={20} color="#2196F3" />;
      case 'ready':
        return <CheckCircle size={20} color="#4CAF50" />;
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
      case 'pending':
        return '#FF9800';
      case 'preparing':
        return '#2196F3';
      case 'ready':
        return '#4CAF50';
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
        return 'New Order';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderTime}>
            {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            {order.deliveryAddress}
          </Text>
        </View>

        <Text style={styles.subTotal}>Sub-Total: ${order.totalAmount.toFixed(2)}</Text>
        <Text style={styles.deliveryFee}>Delivery fee: ${order.deliveryFee.toFixed(2)}</Text>
        <Text style={styles.orderAmount}>Total: ${(order.totalAmount + order.deliveryFee).toFixed(2)}</Text>

        {order.estimatedDelivery && (order.status === 'preparing' || order.status === 'ready') && (
          <Text style={styles.estimatedTime}>
            Est. delivery: {order.estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
        {(onTrackOrder && (order.status === 'preparing' || order.status === 'ready')) && (
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

        {onComplete && order.status === 'ready' && (
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