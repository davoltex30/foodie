import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Clock, DollarSign } from 'lucide-react-native';
import { Restaurant } from '@/types';
import { Card } from './ui/Card';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: (restaurant: Restaurant) => void;
}

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => onPress(restaurant)} activeOpacity={0.8}>
        <Image source={{ uri: restaurant.banner_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800' }} style={styles.image} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{restaurant.name}</Text>
            <View style={[styles.statusBadge, restaurant.is_active ? styles.openBadge : styles.closedBadge]}>
              <Text style={[styles.statusText, restaurant.is_active ? styles.openText : styles.closedText]}>
                {restaurant.is_active ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>{restaurant.description}</Text>
          <Text style={styles.cuisineType}>Restaurant</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.infoText}>4.8</Text>
              <Text style={styles.reviewCount}>(127)</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={14} color="#666666" />
              <Text style={styles.infoText}>25-35 min</Text>
            </View>
            
            <View style={styles.infoItem}>
              <DollarSign size={14} color="#666666" />
              <Text style={styles.infoText}>$5.99</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadge: {
    backgroundColor: '#E8F5E8',
  },
  closedBadge: {
    backgroundColor: '#FFF0F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  openText: {
    color: '#4CAF50',
  },
  closedText: {
    color: '#F44336',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    lineHeight: 20,
  },
  cuisineType: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 2,
  },
});