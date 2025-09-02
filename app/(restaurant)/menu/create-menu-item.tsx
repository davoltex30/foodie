import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator, Platform,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Save } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRestaurantStore } from '@/store/restaurantStore';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';
import { decode } from 'base64-arraybuffer';
import { ImageData } from '@/types';
import { Dropdown } from 'react-native-element-dropdown';
import { useAuthStore } from '@/store/authStore';

export default function CreateMenuItemScreen() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImageData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    prepTime: '',
    isAvailable: true
  });
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    prepTime?: string;
    imageUrl?: string;
  }>({});
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const categories = useRestaurantStore(state => state.categories);
  const restaurantProfile = useAuthStore(state => state.restaurantProfile);
  const fetchCategories = useRestaurantStore(state => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, []);


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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];

      // Extract file extension from URI
      const uri = asset.uri;
      const base64 = asset.base64 || null;
      const fileExtension = asset.uri.split('.').pop();

      if (!fileExtension) throw new Error('Could not determine file extension');

      setImage({
        uri,
        fileExtension,
        base64
      });
    }
  };

  const uploadImage = async (fileExtension: string, base64: string) => {
    try {
      // Create unique filename based on current timestamp
      const fileName = `menu-item-${Date.now()}.${fileExtension}`;

      // Upload to Supabase storage
      const { data, error } = await supabase
        .storage
        .from('menu_item_images')
        .upload(fileName, decode(base64!), {
          contentType: `image/${fileExtension}`,
          upsert: true
        });

      if (error) {
        error('Error uploading image:', error);
        throw error;
      }

      // Get the public URL for the uploaded image
      const { data: imageUrlData, error: urlError } = await supabase
        .storage
        .from('menu_item_images')
        .createSignedUrl(fileName, 3600); // URL valid for 1 hour

      if (urlError) {
        console.error('Error getting image URL:', urlError);
        throw urlError;
      }

      return imageUrlData?.signedUrl; // Return the URL for external use
    } catch (err) {
      console.error('Failed to upload image:', err);
      throw err;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true)
    try {
      const imageUrl = await uploadImage(image?.fileExtension || '', image?.base64 || '');
      await createMenuItem({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        est_prep_time: Number(formData.prepTime),
        image_url: imageUrl,
        restaurant: restaurantProfile?.restaurant_id || '',
        is_available: formData.isAvailable,
        category: formData.category
      });
    } catch (e){
      console.log(e)
    } finally {
      setLoading(false)
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Menu Item</Text>
          <View style={{ width: 30, aspectRatio: 1 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Button title="Select an image" onPress={pickImage} style={{ flexGrow: 1, marginBottom: 10 }}
                    variant={'outline'} />
            {image && <Image source={{ uri: image.uri }} style={styles.image} />}
          </View>
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

          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={{ fontSize: 16, fontWeight: "semibold", color: 'white' }}>
              {loading ? 'Creating Item...' : 'Create Menu Item'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  createButton: {
    marginTop: 24
  },
  image: {
    width: 75,
    aspectRatio: 1
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
  },
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
  }
});