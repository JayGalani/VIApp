import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';

import { STRINGS } from '../../common/strings';
import { COLORS } from '../../common/colors';
import { IMAGES } from '../../common/images';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={IMAGES.LOGO}
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>{STRINGS.APP_NAME}</Text>
      <Text style={styles.loadingText}>{STRINGS.SPLASH.LOADING}</Text>
      <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  logoContainer: {
    width: 140,
    height: 140,
    marginBottom: 30,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  loader: {
    marginTop: 30
  }
});

export default SplashScreen;
