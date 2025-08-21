import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { supabase } from '@/utils/supabase';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role: UserRole }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string, general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchRestaurantProfile = useAuthStore(state => state.fetchRestaurantProfile);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) {
        setErrors(prev => ({
          ...prev,
          general: error.message
        }));
        Toast.show({
          position: 'bottom',
          type: 'error',
          text1: 'Login Failed',
          text2: error.message
        });
      }

      // Store session data in auth store
      useAuthStore.setState({
        isAuthenticated: true,
        session: session,
      });

      if (session &&  session.user.user_metadata.role === 'customer') {
        router.replace('/(customer)');
      } else {
        router.replace('/(restaurant)');
      }

      // Fetch restaurant profile if user is a restaurant
      if (session?.user.user_metadata.role === 'restaurant') {
        await fetchRestaurantProfile(session.user.id)
      }

    } catch (error) {
      Toast.show({
        position: 'bottom',
        type: 'error',
        text1: "Login Failed",
        text2: "Please check your credentials and try again."
      })
    } finally {
      setIsLoading(false);
    }
  };

  const roleTitle = role === 'customer' ? 'Customer Login' : 'Restaurant Login';
  const roleColor = role === 'customer' ? '#FF6B35' : '#2196F3';

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Button
          title=""
          onPress={() => router.back()}
          style={[styles.backButton, { borderColor: roleColor }]}
          variant="outline"
        />
        <Text style={[styles.title, { color: roleColor }]}>{roleTitle}</Text>
        <Text style={styles.subtitle}>
          {role === 'customer'
            ? 'Sign in to order delicious food'
            : 'Sign in to manage your restaurant'
          }
        </Text>
      </View>
      {errors.general &&
        <View style={{
          backgroundColor: '#F4433620',
          padding: 10,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
          marginBottom: 10
        }}>
          <Text style={styles.error}>{errors.general}</Text>
        </View>
      }
      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          // secureTextEntry
          error={errors.password}
        />

        <Button
          title={isLoading ? 'Signing in...' : 'Sign In'}
          onPress={handleLogin}
          disabled={isLoading}
          variant={role === 'customer' ? 'primary' : 'secondary'}
          size="lg"
          style={styles.loginButton}
        />
        <TouchableOpacity onPress={() => router.push('/sign-up')}>
          <Text>Sign-Up</Text>
        </TouchableOpacity>
        <Text style={styles.demoNote}>
          Demo: Use any email and password (6+ characters)
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 24
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 48
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center'
  },
  form: {
    flex: 1
  },
  loginButton: {
    marginTop: 24
  },
  demoNote: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic'
  },
  error: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4
  }
});