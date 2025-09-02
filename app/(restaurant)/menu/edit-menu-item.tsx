import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRestaurantStore } from '@/store/restaurantStore';
import Toast from 'react-native-toast-message';
import { Dropdown } from 'react-native-element-dropdown';

export default function EditMenuItemScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  // const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    prepTime: '',
    imageUrl: '',
    isAvailable: true
  });
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const categories = useRestaurantStore(state => state.categories);
  const fetchCategories = useRestaurantStore(state => state.fetchCategories);

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    prepTime?: string;
    imageUrl?: string;
  }>({});

  const { menuItems, updateMenuItem } = useRestaurantStore();
  const menuItem = menuItems.find(item => item.id === itemId);

  useEffect(() => {
    fetchCategories();
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        description: menuItem.description || '',
        price: menuItem.price.toString(),
        category: menuItem.category?.id || '',
        prepTime: menuItem.est_prep_time.toString(),
        imageUrl: menuItem.image_url || '',
        isAvailable: menuItem.is_available
      });
    }
  }, [menuItem]);

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
    if (!validateForm() || !menuItem) return;

    setSaving(true);
    try {
      const updatedItem = await updateMenuItem(menuItem.id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        prep_time: Number(formData.prepTime),
        image_url: formData.imageUrl || null,
        is_available: formData.isAvailable
      });

      if (updatedItem) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Menu item updated successfully!'
        });
        router.back();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update menu item'
      });
    } finally {
      setSaving(false);
    }
  };

  if (!menuItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading menu item...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Menu Item</Text>
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

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={[styles.input, errors.category && styles.inputError, isDropdownFocus && { borderColor: 'blue' }]}
            placeholderStyle={{ color: '#999999' }}
            data={categories.map(item => ({
              label: item.name,
              value: item.id
            }))}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isDropdownFocus ? 'Select category' : '...'}
            searchPlaceholder="Search..."
            value={formData.category}
            onFocus={() => setIsDropdownFocus(true)}
            onBlur={() => setIsDropdownFocus(false)}
            onChange={(item) => {
              setFormData(prev => ({ ...prev, category: item.value }));
              setIsDropdownFocus(false);
            }}
          />
          {errors.category && <Text style={styles.error}>{errors.category}</Text>}
        </View>

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
          title="Save Changes"
          onPress={handleSave}
          disabled={saving}
          variant="secondary"
          style={styles.saveButtonFull}
        />
      </ScrollView>
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
  backButton: {
    padding: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333'
  },
  saveButton: {
    padding: 8
  },
  content: {
    flex: 1,
    padding: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666'
  },
  availabilityContainer: {
    marginBottom: 24
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8
  },
  availabilityButtons: {
    flexDirection: 'row',
    gap: 12
  },
  availabilityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center'
  },
  availabilityButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD'
  },
  availabilityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666'
  },
  availabilityButtonTextActive: {
    color: '#2196F3'
  },
  saveButtonFull: {
    width: '100%'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF'
  },
  inputError: {
    borderColor: '#F44336'
  },
  error: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4
  }
});