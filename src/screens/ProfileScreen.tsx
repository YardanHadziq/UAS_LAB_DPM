import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { getAuthToken, removeAuthToken } from '../utils/auth';
import { fetchUserProfile } from '../services/api';
import {RootStackParamList, User} from '../types';
import LoadingSpinner from "../components/LoadingSpinner";

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = await getAuthToken();
      if (token) {
        try {
          const profileData = await fetchUserProfile() as User;
          setUser(profileData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
      setLoading(false);
    };

    loadUserProfile().then(r => r);
  }, []);

  const handleLogout = async () => {
    await removeAuthToken();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading) {
    return (
        <View style={styles.container}>
            <LoadingSpinner />
        </View>
    );
  }

  if (!user) {
    return (
        <View style={styles.container}>
          <Text style={styles.errorMessage}>No user data available.</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Image source={require('../../assets/banner.jpg')} style={styles.banner} />
        <Image source={require('../../assets/profile.jpg')} style={styles.profilePicture} />
        <Text style={styles.title}>{user.username}</Text>
        <Text style={styles.bio}>{user.bio || "Teknik Informatika | Angkatan 2022."}</Text>
        <View style={styles.profileContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background for dark theme
  },
  banner: {
    width: '115%',
    height: 150,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#BB86FC', // Modern purple accent color
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Clean white text
  },
  bio: {
    fontSize: 16,
    color: '#E0E0E0', // Light gray for bio text
    textAlign: 'center',
    marginVertical: 10,
  },
  profileContainer: {
    width: '90%',
    backgroundColor: '#1E1E1E', // Slightly lighter dark background
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF', // White for labels
  },
  value: {
    fontSize: 14,
    color: '#E0E0E0', // Light gray for values
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000', // Black text for contrast
  },
  errorMessage: {
    fontSize: 16,
    color: '#CF6679', // Modern red for error messages
    textAlign: 'center',
  },
});

export default ProfileScreen;
