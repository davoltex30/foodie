import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRestaurantStore } from '@/store/restaurantStore';
import Toast from 'react-native-toast-message';

export default function CreateMenuItemScreen() {
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    prepTime: '',
    imageUrl: '',
    isAvailable: true,
  });
  
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    prepTime?: string;
    imageUrl?: string;
  }>({});

  const { createMenuItem } = useRestaurantStore();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Dish name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.prepTime.trim()) {
      newErrors.prepTime = 'Preparation time is required';
    } else if (isNaN(Number(formData.prepTime)) || Number(formData.prepTime) <= 0) {
      newErrors.prepTime = 'Please enter a valid preparation time';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const newItem = await createMenuItem({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        prep_time: Number(formData.prepTime),
        image_url: formData.imageUrl || null,
        is_available: formData.isAvailable,
      });

      if (newItem) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Menu item created successfully!',
        });
        router.back();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create menu item',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Menu Item</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <Save size={24} color="#2196F3" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Input
          label="Dish Name"
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Enter dish name"
          error={errors.name}
        />

        <Input
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Enter description"
          multiline
          numberOfLines={3}
          error={errors.description}
        />

        <Input
          label="Price ($)"
          value={formData.price}
          onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
          placeholder="0.00"
          keyboardType="numeric"
          error={errors.price}
        />

        <Input
          label="Category"
          value={formData.category}
          onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
          placeholder="e.g., Pizza, Pasta, Salad"
          error={errors.category}
        />

        <Input
          label="Preparation Time (minutes)"
          value={formData.prepTime}
          onChangeText={(text) => setFormData(prev => ({ ...prev, prepTime: text }))}
          placeholder="15"
          keyboardType="numeric"
          error={errors.prepTime}
        />

        <Input
          label="Image URL (optional)"
          value={formData.imageUrl}
          onChangeText={(text) => setFormData(prev => ({ ...prev, imageUrl: text }))}
          placeholder="https://..."
          error={errors.imageUrl}
        />

        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>Availability</Text>
          <View style={styles.availabilityButtons}>
            <TouchableOpacity
              style={[
                styles.availabilityButton,
                formData.isAvailable && styles.availabilityButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, isAvailable: true }))}
            >
              <Text style={[
                styles.availabilityButtonText,
                formData.isAvailable && styles.availabilityButtonTextActive
              ]}>
                Available
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.availabilityButton,
                !formData.isAvailable && styles.availabilityButtonActive
              ]}
              onPress={() => setFormData(prev => ({ ...prev, isAvailable: false }))}
            >
              <Text style={[
                styles.availabilityButtonText,
                !formData.isAvailable && styles.availabilityButtonTextActive
              ]}>
                Unavailable
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Create Menu Item"
          onPress={handleSave}
          disabled={saving}
          variant="secondary"
          style={styles.createButton}
        />
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  availabilityContainer: {
    marginBottom: 24,
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  availabilityButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  availabilityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  availabilityButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  availabilityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  availabilityButtonTextActive: {
    color: '#2196F3',
  },
  createButton: {
    marginTop: 24,
  },
});