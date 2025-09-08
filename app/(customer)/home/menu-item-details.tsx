import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, Plus, Minus, Heart } from 'lucide-react-native';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useCartStore } from '@/store/cartStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Toast from 'react-native-toast-message';

export default function MenuItemDetailsScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { menuItems } = useRestaurantStore();
  const { addItem } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const menuItem = menuItems.find(item => item.id === itemId);

  console.log(menuItem)

  if (!menuItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.title}>Menu Item</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Item not found</Text>
          <Text style={styles.emptySubtitle}>This menu item doesn't exist</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      ...menuItem,
      quantity,
      restaurantName: menuItem.restaurant.name
    };
    
    addItem(cartItem);
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${quantity}x ${menuItem.name} added to your cart`
    });
  };

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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} bounces={false} overScrollMode={"never"}>
        {/* Hero Image */}
        <View style={{position: "relative"}}>
          <Image source={{ uri: menuItem.image_url }} style={styles.heroImage} />
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#333333" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              style={styles.favoriteButton}
            >
              <Heart
                size={24}
                color={isFavorite ? "#FF6B35" : "#666666"}
                fill={isFavorite ? "#FF6B35" : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.restaurantContainer}>
          <Image source={require("./../../../assets/images/restaurantIcon.png")} />
          <Text style={{fontSize: 14, fontWeight: "bold", }}>{menuItem.restaurant.name}</Text>
        </View>

        {/* Basic Info */}
        <Card style={styles.section}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{menuItem.name}</Text>
            <View style={[
              styles.availabilityBadge,
              menuItem.is_available ? styles.availableBadge : styles.soldOutBadge
            ]}>
              <Text style={[
                styles.availabilityText,
                menuItem.is_available ? styles.availableText : styles.soldOutText
              ]}>
                {menuItem.is_available ? 'Available' : 'Sold Out'}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{menuItem.description}</Text>

          <View style={styles.detailsRow}>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(Math.round(menuItem.avgRating || 0))}
              </View>
              <Text style={styles.ratingText}>
                {menuItem.avgRating?.toFixed(1)} ({menuItem.ratingCount} reviews)
              </Text>
            </View>

            <View style={styles.prepTimeContainer}>
              <Clock size={16} color="#666666" />
              <Text style={styles.prepTimeText}>{menuItem.est_prep_time} min prep</Text>
            </View>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Category:</Text>
            <Text style={styles.categoryName}>{menuItem.category?.name}</Text>
          </View>
        </Card>

        {/* Quantity and Price */}
        <Card style={styles.section}>
          <View style={styles.quantitySection}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} color={quantity <= 1 ? "#CCCCCC" : "#FF6B35"} />
                </TouchableOpacity>
                
                <Text style={styles.quantityValue}>{quantity}</Text>
                
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Plus size={16} color="#FF6B35" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.totalPrice}><Text style={{ fontSize: 12 }}>FCFA </Text>{(menuItem.price * quantity)}</Text>
            </View>
          </View>
        </Card>

        {/* Reviews Preview */}
        {menuItem.ratings && menuItem.ratings.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.reviewTitle}>Recent Reviews</Text>
            {menuItem.ratings.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>
                    {review.customer.first_name} {review.customer.last_name}
                  </Text>
                  <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                  </View>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))}
            
            {menuItem.ratings.length > 3 && (
              <TouchableOpacity style={styles.viewAllReviews}>
                <Text style={styles.viewAllReviewsText}>
                  View all {menuItem.ratings.length} reviews
                </Text>
              </TouchableOpacity>
            )}
          </Card>
        )}
      </ScrollView>

      {/* Add to Cart Footer */}
      <View style={styles.footer}>
        <Button
          title={`Add to Cart - FCFA ${(menuItem.price * quantity)}`}
          onPress={handleAddToCart}
          disabled={!menuItem.is_available}
          variant="primary"
          size="lg"
          style={styles.addToCartButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%'
  },
  backButton: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: "white",
    borderRadius: 20
  },
  content: {
    flex: 1,
  },
  restaurantContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 10,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity:  0.16,
    shadowRadius: 1.51,
    elevation: 2
  },
  heroImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  section: {
    margin: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availableBadge: {
    backgroundColor: '#E8F5E8',
  },
  soldOutBadge: {
    backgroundColor: '#FFF0F0',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#4CAF50',
  },
  soldOutText: {
    color: '#F44336',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666666',
  },
  prepTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepTimeText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flex: 1,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#FFF0EB',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginHorizontal: 20,
  },

  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B35',
  },
  reviewItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  reviewComment: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  viewAllReviews: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllReviewsText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 20,
  },
  addToCartButton: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});