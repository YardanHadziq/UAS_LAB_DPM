import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/switter.png')} style={styles.logo} />
      <Text style={styles.title}>You&apos;re in Home Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212', // Dark theme background
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white', // Attractive purple for title text
    textAlign: 'center',
    fontFamily: 'Cochin', // Custom font for a unique style
  },
});

export default HomeScreen;
