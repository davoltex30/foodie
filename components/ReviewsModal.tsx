import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Star } from 'lucide-react-native';
import {format} from "date-fns";

interface Review {
  id: string,
  rating: number,
  comment?: string,
  customer: {
    first_name: string,
    last_name: string,
    avatar_url?: string,
  },
  created_at: string,
}

interface ReviewsModalProps {
  visible: boolean;
  onClose: () => void;
  menuItemName: string;
  reviews: Review[];
  averageRating: number;
}

export function ReviewsModal({ 
  visible, 
  onClose, 
  menuItemName, 
  reviews, 
  averageRating 
}: ReviewsModalProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        fill={index < rating ? "#FFD700" : "#E0E0E0"}
      />
    ));
  };

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
            <Text style={styles.title}>Reviews for {menuItemName}</Text>
            <View style={styles.averageRating}>
              <View style={styles.starsContainer}>
                {renderStars(Math.round(averageRating))}
              </View>
              <Text style={styles.averageText}>
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.customerInfo}>
                    <Image
                      source={{ 
                        uri: review.customer.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
                      }}
                      style={styles.avatar}
                    />
                    <View>
                      <Text style={styles.customerName}>{review.customer.first_name} {review.customer.last_name}</Text>
                      <Text style={styles.reviewDate}>
                        {format(review.created_at, 'dd/MM/yyyy HH:mm')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                  </View>
                </View>
                <Text style={styles.comment}>{review.comment}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No reviews yet</Text>
              <Text style={styles.emptySubtitle}>
                This item hasn't received any reviews yet.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
  averageRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  averageText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#333333',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999999',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  comment: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
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
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});