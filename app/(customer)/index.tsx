import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useRestaurantStore } from '@/store/restaurantStore';
import { useCartStore } from '@/store/cartStore';
import { RestaurantCard } from '@/components/RestaurantCard';
import { DishCard } from '@/components/DishCard';
import { Dish, Restaurant } from '@/types';

const promoData = [
  {
    id: '1',
    title: '50% OFF',
    subtitle: 'On your first order',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#FF6B35'
  },
  {
    id: '2',
    title: 'Free Delivery',
    subtitle: 'Orders above $25',
    image: 'https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#4CAF50'
  },
];

export default function CustomerHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { customerProfile } = useAuthStore();
  const { restaurants, menuItems, fetchRestaurants, fetchAllMenuItems } = useRestaurantStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchRestaurants();
    fetchAllMenuItems();
  }, []);

  const handleAddToCart = (dish: Dish) => {
    const restaurant = restaurants.find(r => r.restaurant_id === dish.restaurantId);
    addItem({
      ...dish,
      quantity: 1,
      restaurantName: restaurant?.name || 'Unknown Restaurant'
    });
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push(`/(customer)/restaurant-details?restaurantId=${restaurant.restaurant_id}`);
  };

  const filteredDishes = menuItems.filter(dish =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log(menuItems)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {customerProfile?.first_name} {customerProfile?.first_name}!</Text>
            <Text style={styles.subGreeting}>What would you like to eat today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants or dishes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999999"
          />
        </View>

        {/* Promo Banners */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.promoSection}
          contentContainerStyle={styles.promoContent}
        >
          {promoData.map((promo) => (
            <TouchableOpacity key={promo.id} style={[styles.promoCard, { backgroundColor: promo.color }]}>
              <View style={styles.promoText}>
                <Text style={styles.promoTitle}>{promo.title}</Text>
                <Text style={styles.promoSubtitle}>{promo.subtitle}</Text>
              </View>
              <Image source={{ uri: promo.image }} style={styles.promoImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Dishes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Dishes</Text>
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onAddToCart={handleAddToCart}
            />
          ))}
        </View>

        {/* Nearby Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.restaurant_id}
              restaurant={restaurant}
              onPress={handleRestaurantPress}
            />
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333333',
  },
  promoSection: {
    marginBottom: 24,
  },
  promoContent: {
    paddingHorizontal: 20,
  },
  promoCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 280,
    alignItems: 'center',
  },
  promoText: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  promoSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    opacity: 0.9,
  },
  promoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 16,
  },
});