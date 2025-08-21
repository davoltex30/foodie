import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search } from 'lucide-react-native';
import { router } from 'expo-router';
import { useRestaurantStore } from '@/store/restaurantStore';
import { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/MenuItemCard';
import { ReviewsModal } from '@/components/ReviewsModal';
import { useAuthStore } from '@/store/authStore';

// Mock reviews data - replace with actual data from your backend
const mockReviews = [
  {
    id: '1',
    customerName: 'John Doe',
    customerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Absolutely delicious! The flavors were amazing and the portion size was perfect.',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 4,
    comment: 'Really good food, but took a bit longer than expected to prepare.',
    createdAt: new Date('2024-01-08'),
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    rating: 5,
    comment: 'Best dish I\'ve had in a long time! Will definitely order again.',
    createdAt: new Date('2024-01-05'),
  },
];
export default function RestaurantMenuScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const restaurantProfile = useAuthStore(state => state.restaurantProfile)
  const menuItems = useRestaurantStore(state => state.menuItems)
  const loading = useRestaurantStore(state => state.loading)
  const fetchMenuItemsWithRatings = useRestaurantStore(state => state.fetchMenuItemsWithRatings)

  useEffect(() => {
    fetchMenuItemsWithRatings(restaurantProfile?.restaurant_id)
  }, [restaurantProfile?.restaurant_id]);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category?.name)))];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (dish: MenuItem) => {
    Alert.alert(
      'Delete Dish',
      `Are you sure you want to delete "${dish.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log("delete menu item")
            // setMenuItems(items => items.filter(item => item.id !== dish.id));
          }
        }
      ]
    );
  };

  const handleRatingPress = (dish: MenuItem) => {
    setSelectedMenuItem(dish);
    setShowReviewsModal(true);
  };

  if(loading){
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text>Loading menu...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            router.push('/(restaurant)/create-menu-item');
          }}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#999999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search dishes..."
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
          {categories?.map((category) => (
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{gap: 10}}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <MenuItemCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onRatingPress={handleRatingPress}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first dish to get started'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Reviews Modal */}
      <ReviewsModal
        visible={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        menuItemName={selectedMenuItem?.name || ''}
        reviews={mockReviews}
        averageRating={selectedMenuItem?.avgRating || 0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333'
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16
  },
  searchIcon: {
    marginRight: 12
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333'
  },
  categoryContainer: {
    flexGrow: 0
  },
  categoryContent: {
    paddingRight: 20
  },
  categoryChip: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12
  },
  selectedCategory: {
    backgroundColor: '#2196F3'
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666'
  },
  selectedCategoryText: {
    color: '#FFFFFF'
  },
  content: {
    flex: 1,
    padding: 20
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center'
  }
});