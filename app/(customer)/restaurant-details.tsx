import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Clock, MapPin, Search, Heart } from 'lucide-react-native';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useCartStore } from '@/store/cartStore';
import { DishCard } from '@/components/DishCard';
import { Card } from '@/components/ui/Card';
import { MenuItem } from '@/types';

export default function RestaurantDetailsScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { restaurants, menuItems, fetchRestaurantMenuItems } = useRestaurantStore();
  const { addItem } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFavorite, setIsFavorite] = useState(false);

  const restaurant = restaurants.find(r => r.restaurant_id === restaurantId);
  
  useEffect(() => {
    if (restaurantId) {
      fetchRestaurantMenuItems(restaurantId);
    }
  }, [restaurantId]);

  const restaurantMenuItems = menuItems.filter(item => 
    item.restaurant.restaurant_id === restaurantId
  );

  const categories = ['All', ...Array.from(new Set(restaurantMenuItems.map(item => item.category?.name)))];

  const filteredItems = restaurantMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (dish: MenuItem) => {
    addItem({
      ...dish,
      quantity: 1,
      restaurantName: restaurant?.name || 'Unknown Restaurant'
    });
  };

  const handleDishPress = (dish: MenuItem) => {
    router.push(`/(customer)/menu-item-details?itemId=${dish.id}`);
  };

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.title}>Restaurant</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Restaurant not found</Text>
          <Text style={styles.emptySubtitle}>This restaurant doesn't exist</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Restaurant</Text>
        <TouchableOpacity 
          onPress={() => setIsFavorite(!isFavorite)} 
          style={styles.favoriteButton}
        >
          <Heart 
            size={24} 
            color={isFavorite ? "#FF6B35" : "#FFFFFF"} 
            fill={isFavorite ? "#FF6B35" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: restaurant.banner_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800' }} 
            style={styles.bannerImage} 
          />
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: restaurant.logo_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200' }} 
              style={styles.logoImage} 
            />
          </View>
        </View>

        {/* Restaurant Info */}
        <Card style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
              
              <View style={styles.restaurantMeta}>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>4.8 (127 reviews)</Text>
                </View>
                
                <View style={styles.deliveryInfo}>
                  <Clock size={16} color="#666666" />
                  <Text style={styles.deliveryText}>25-35 min</Text>
                </View>
                
                <View style={styles.locationInfo}>
                  <MapPin size={16} color="#666666" />
                  <Text style={styles.locationText}>2.1 km away</Text>
                </View>
              </View>
            </View>
            
            <View style={[styles.statusBadge, restaurant.is_active ? styles.openBadge : styles.closedBadge]}>
              <Text style={[styles.statusText, restaurant.is_active ? styles.openText : styles.closedText]}>
                {restaurant.is_active ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Search and Categories */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#999999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search menu..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999999"
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
            contentContainerStyle={styles.categoryContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {filteredItems.length > 0 ? (
            <View style={styles.menuGrid}>
              {filteredItems.map((item) => (
                <View key={item.id} style={styles.menuItemContainer}>
                  <DishCard
                    dish={item}
                    onAddToCart={handleAddToCart}
                    onPress={handleDishPress}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyMenuContainer}>
              <Text style={styles.emptyMenuTitle}>No items found</Text>
              <Text style={styles.emptyMenuSubtitle}>
                {searchQuery ? 'Try adjusting your search' : 'No menu items available'}
              </Text>
            </View>
          )}
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    position: 'relative',
    height: 200,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logoContainer: {
    position: 'absolute',
    bottom: -30,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    padding: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  restaurantInfo: {
    marginTop: 40,
    marginHorizontal: 16,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  restaurantDetails: {
    flex: 1,
    marginRight: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  restaurantDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
    marginBottom: 16,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 4,
    fontWeight: '500',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  categoryContainer: {
    flexGrow: 0,
  },
  categoryContent: {
    paddingRight: 20,
  },
  categoryChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedCategory: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  menuSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItemContainer: {
    width: '48%',
    marginBottom: 16,
  },
  emptyMenuContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMenuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptyMenuSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
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