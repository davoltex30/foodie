import React from 'react';
import { Text, View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

interface OrderItem {
  id: string,
  menu_item: {
    id: string,
    name: string,
    image_url: string,
  },
  quantity: number,
  price: number,
  created_at: string,
}

interface OrderItemsModalProps {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  orderItems: OrderItem[];
}

const OrderItemsModal: React.FC<OrderItemsModalProps> = ({ visible, onClose, orderId, orderItems }) => {
  // Calculate total price
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const totalPrice = calculateTotal();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Order #{orderId}</Text>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.itemsContainer}>
          {orderItems.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.menu_item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)} × {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default OrderItemsModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginRight: 4,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E86DE',
  },
  closeButton: {
    padding: 8,
  },
  itemsContainer: {
    flex: 1,
    padding: 20,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});