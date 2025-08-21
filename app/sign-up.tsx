import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { supabase } from '@/utils/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/components/ui/Input';
import { Dropdown } from 'react-native-element-dropdown';
import { PhoneInput, PhoneInputRef } from 'rn-phone-input-field';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');``
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState('customer');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    phoneNumber?: string,
    role?: string,
    name?: string,
    firstName?: string,
    lastName?: string,
    address?: string,
  }>({});
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const phoneInputRef = useRef<PhoneInputRef>(null);

  const dropdownRole = [
    { label: 'Customer', value: 'customer' },
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Courier', value: 'courier' }
  ];

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
      phoneNumber?: string;
      role?: string;
      name?: string;
      firstName?: string;
      lastName?: string;
      address?: string;
    } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone Number validation
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (phoneInputRef.current?.isValidNumber(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number ';
    }

    // Role validation
    if (!role) {
      newErrors.role = 'Role is required';
    }

    if(role === "restaurant"){
      // Name validation
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      } else if (name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

    }

    if(role === "customer" || role === "courier"){
      // first name validation
      if (!firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }

      // last name validation
      if (!lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (lastName.length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      }

      // Address validation
      if (!address.trim()) {
        newErrors.address = 'Address is required';
      } else if (address.length < 5) {
        newErrors.address = 'Address must be at least 5 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {

    if (!validateForm()) return;

    setLoading(true);

    try {
      // First, sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options:{
          data: {
            role: role,
            name: name,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            address: address,
          }
        },
      })

      if (authError) {
        throw authError;
      }

      Alert.alert('Success', 'Account created successfully! Please check your email for verification.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Account type</Text>
              <Dropdown
                style={[styles.input, errors.role && styles.inputError, isDropdownFocus && { borderColor: 'blue' }]}
                placeholderStyle={{ color: '#999999' }}
                data={dropdownRole}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isDropdownFocus ? 'Select user role' : '...'}
                searchPlaceholder="Search..."
                value={role}
                onFocus={() => setIsDropdownFocus(true)}
                onBlur={() => setIsDropdownFocus(false)}
                onChange={(item: { value: React.SetStateAction<string>; }) => {
                  setRole(item.value);
                  setIsDropdownFocus(false);
                }}
              />
              {errors.role && <Text style={styles.error}>{errors.role}</Text>}
            </View>

            {(role === "restaurant") && (
              <Input
                label="Restaurant Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your Restaurant name"
                keyboardType="default"
                error={errors.name}
              />
            )}

            {(role === "customer" || role === "courier") && (
              <>
                <Input
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter your First Name"
                  keyboardType="default"
                  error={errors.firstName}
                />

                <Input
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter your Last Name"
                  keyboardType="default"
                  error={errors.lastName}
                />
                <Input
                  label="Address"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
                  keyboardType="default"
                  error={errors.address}
                />
              </>
            )}

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

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              // secureTextEntry
              error={errors.confirmPassword}
            />

            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Phone Number</Text>
              <PhoneInput
                ref={phoneInputRef}
                placeholder="xxxxxxxxx"
                defaultCountry="CM"
                onChangeText={setPhoneNumber}
                onSelectCountryCode={(country: any) => {
                  console.log('Selected country:', country);
                }}
                containerStyle={[errors.phoneNumber &&{ borderColor: "red"},{ borderColor: "#E0E0E0", backgroundColor: "#fff"}]}
              />
              {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
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
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

