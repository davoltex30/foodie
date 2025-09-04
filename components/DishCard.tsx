import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Plus } from 'lucide-react-native';
import { MenuItem } from '@/types';
import { Card } from './ui/Card';

interface DishCardProps {
  dish: MenuItem;
  onAddToCart: (dish: MenuItem) => void;
  onPress?: (dish: MenuItem) => void;
}

export function DishCard({ dish, onAddToCart, onPress }: DishCardProps) {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => onPress?.(dish)} activeOpacity={0.8} style={styles.cardContent}>
        <Image source={{ uri: dish.image_url }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{dish.name}</Text>
          <Text style={styles.description} numberOfLines={2}>{dish.description}</Text>
          
          <View style={styles.ratingRow}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{dish.avgRating}</Text>
            <Text style={styles.reviewCount}>({dish.ratingCount})</Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.price}>${dish.price.toFixed(2)}</Text>
            <TouchableOpacity
              style={[styles.addButton, !dish.is_available && styles.disabledButton]}
              onPress={() => dish.is_available && onAddToCart(dish)}
              disabled={!dish.is_available}
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {!dish.is_available && (
            <Text style={styles.unavailable}>Currently unavailable</Text>
          )}
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
  cardContent: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  unavailable: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});