import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { Navigation, MapPin } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useRestaurantStore } from '@/store/restaurantStore';
import { Restaurant } from '@/types';
import { Button } from '@/components/ui/Button';

export default function CustomerMapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  const { restaurants, fetchRestaurants, fetchNearbyRestaurants } = useRestaurantStore();

  useEffect(() => {
    fetchRestaurants();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      // For web, we'll use a mock location
      setLocation({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your location on the map.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleMarkerPress = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleDirections = (restaurant: Restaurant) => {
    const { latitude, longitude } = restaurant.location;
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`,
      web: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
    });

    if (url) {
      if (Platform.OS === 'web') {
        window.open(url, '_blank');
      } else {
        // For native platforms, you would use Linking.openURL(url)
        Alert.alert('Directions', `Navigate to ${restaurant.name}`);
      }
    }
  };

  const findNearestRestaurant = () => {
    if (!location) {
      Alert.alert('Location not available', 'Please enable location services to find nearby restaurants.');
      return;
    }
    
    fetchNearbyRestaurants(location.coords.latitude, location.coords.longitude);
    Alert.alert('Success', 'Restaurants sorted by distance!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Restaurants</Text>
        <TouchableOpacity onPress={findNearestRestaurant} style={styles.locationButton}>
          <MapPin size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={Platform.OS !== 'web'}
        showsMyLocationButton={Platform.OS !== 'web'}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.location.latitude,
              longitude: restaurant.location.longitude,
            }}
            title={restaurant.name}
            description={restaurant.description}
            onPress={() => handleMarkerPress(restaurant)}
          />
        ))}
      </MapView>

      {selectedRestaurant && (
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{selectedRestaurant.name}</Text>
              <Text style={styles.restaurantAddress}>{selectedRestaurant.location.address}</Text>
              <Text style={styles.restaurantHours}>
                {selectedRestaurant.operatingHours.open} - {selectedRestaurant.operatingHours.close}
              </Text>
            </View>
            <View style={[styles.statusBadge, selectedRestaurant.isOpen ? styles.openBadge : styles.closedBadge]}>
              <Text style={[styles.statusText, selectedRestaurant.isOpen ? styles.openText : styles.closedText]}>
                {selectedRestaurant.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          
          <Button
            title="Get Directions"
            onPress={() => handleDirections(selectedRestaurant)}
            style={styles.directionsButton}
            variant="primary"
          />
        </View>
      )}
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  locationButton: {
    padding: 8,
  },
  map: {
    flex: 1,
  },
  restaurantInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  restaurantHours: {
    fontSize: 12,
    color: '#999999',
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
  directionsButton: {
    marginTop: 8,
  },
});