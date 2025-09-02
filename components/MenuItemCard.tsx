// MenuItemCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { CreditCard as Edit3, Trash2, Star, Clock } from 'lucide-react-native';
import { MenuItem } from '@/types';
import { router } from 'expo-router';

interface MenuItemCardProps {
  item: MenuItem;
  onDelete: (dish: MenuItem) => void;
  onRatingPress?: (dish: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onDelete, onRatingPress }) => (
  <View style={styles.menuCard}>
    <View style={{overflow: "hidden", borderRadius: 16, position: 'relative',}}>
      <Image source={{ uri: item.image_url? item.image_url : "https://picsum.photos/200/300" }} style={styles.menuImage} />
    </View>


    <View style={styles.menuContent}>
      <View style={styles.menuHeader}>
        <View style={styles.menuInfo}>
          <Text style={styles.menuName}>{item.name}</Text>
          <View style={styles.categoryRow}>
            <Text style={styles.menuCategory}>{item.category?.name}</Text>
            <View style={[
              styles.availabilityBadge,
              item.is_available ? styles.availableBadge : styles.soldOutBadge
            ]}>
              <Text style={[
                styles.availabilityText,
                item.is_available ? styles.availableText : styles.soldOutText
              ]}>
                {item.is_available ? 'Available' : 'Sold Out'}
              </Text>
            </View>
          </View>

          {item.description && (
            <Text style={styles.menuDescription}>{item.description}</Text>
          )}
        </View>

        <View style={styles.menuActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/(restaurant)/menu/edit-menu-item?itemId=${item.id}`)}
          >
            <Edit3 size={18} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(item)}
          >
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuDetails}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
        </View>

        <View style={styles.detailsRow}>
          <TouchableOpacity 
            style={styles.ratingContainer}
            onPress={() => onRatingPress?.(item)}
          >
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{item.avgRating}</Text>
          </TouchableOpacity>

          <View style={styles.timeContainer}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.time}>{item.est_prep_time} min</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity:  0.17,
    shadowRadius: 3.05,
    elevation: 4,
    // overflow: 'hidden',
  },
  menuImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  menuContent: {
    padding: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  menuInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  menuCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F97316',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  menuDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  menuActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  menuDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#DCFCE7',
  },
  soldOutBadge: {
    backgroundColor: '#FEE2E2',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#16A34A',
  },
  soldOutText: {
    color: '#DC2626',
  },
});